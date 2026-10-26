// Studio de script (v2.0): parsare, distribuție, redare cu sintetizator fals, pronunție, stiluri, export/import, script edge-tts.
// Rulează din directorul aplicației: node tests/script-studio.test.mjs (rețea blocată; nicio voce reală).
import {launch, check, summary, hOverflow, axeRun, AXE} from "./_lib.mjs";
import fs from "fs";
import os from "os";
import path from "path";
import {spawnSync} from "child_process";

const LT = ms => Math.round(ms * Math.min(6, Math.max(1, os.loadavg()[0] / os.cpus().length)));
const until = async (page, fn, arg, timeout = 20000) => { for (let k = 0; ; k++){ try { return await page.waitForFunction(fn, arg, {timeout: LT(timeout)}); } catch (e){ if (k < 2 && /context was destroyed/i.test(e.message)){ await page.waitForTimeout(300); continue; } throw e; } } };
const ck = (page, sel) => page.evaluate(s => { const e = document.querySelector(s); if (!e) throw new Error("lipsește " + s); e.click(); }, sel);
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "va-sc-"));

// sintetizator fals: înregistrează fiecare enunț cu timp; nu produce sunet
const FAKE = () => {
  window.__spoken = []; window.__cancels = 0;
  class U { constructor(t){ this.text = t; this.rate = 1; this.pitch = 1; this.volume = 1; this.voice = null; this.lang = ""; } }
  window.SpeechSynthesisUtterance = U;
  const voices = [
    {name: "Fake Ana", lang: "ro-RO", voiceURI: "fake-ana", localService: true, default: true},
    {name: "Fake Bob", lang: "en-US", voiceURI: "fake-bob", localService: true, default: false},
  ];
  let cur = null, timer = 0;
  Object.defineProperty(window, "speechSynthesis", {configurable: true, value: {
    onvoiceschanged: null,
    getVoices(){ return voices; },
    speak(u){ cur = u; window.__spoken.push({text: u.text, rate: u.rate, pitch: u.pitch, volume: u.volume, voice: u.voice && u.voice.voiceURI, at: performance.now()}); timer = setTimeout(() => { const f = u.onend; cur = null; f && f({}); }, window.__utt || 20); },
    cancel(){ window.__cancels++; clearTimeout(timer); const u = cur; cur = null; if (u && u.onerror) setTimeout(() => u.onerror({error: "interrupted"}), 0); },
    pause(){}, resume(){}, speaking: false, pending: false, paused: false,
  }});
};
const open = async (opts = {}) => {
  const L = await launch({w: opts.w || 1100, h: 900, init: FAKE, bypassCSP: !!opts.axe});
  if (opts.seed){ await L.page.evaluate(s => { for (const k in s) localStorage.setItem(k, s[k]); }, opts.seed); await L.page.reload(); }
  await L.page.waitForSelector("#scText", {state: "attached"});
  return L;
};
const tab = async page => { await ck(page, '[data-click="switchTab:script"]'); await until(page, () => document.querySelector("#sec-script.active")); };
const setText = async (page, txt) => { await page.fill("#scText", txt); await until(page, () => document.querySelectorAll("#scLines li").length >= 0); await page.waitForTimeout(350); };
const done = page => until(page, () => !VAScript.state.playing && document.getElementById("scStatus").dataset.k === "scDone", null, 30000);

console.log("1. fila nouă și parsarea");
{
  const {browser, page, st} = await open();
  const tabs = await page.evaluate(() => [...document.querySelectorAll(".tab-btn")].map(b => b.getAttribute("aria-controls")));
  check("7 file, Script între Toate limbile și Studio", tabs.length === 7 && tabs.indexOf("sec-script") === tabs.indexOf("sec-languages") + 1 && tabs[4] === "sec-studio", tabs);
  let ok = true;
  for (let i = 0; i < tabs.length; i++){
    await page.evaluate(i => document.querySelectorAll(".tab-btn")[i].click(), i);
    const act = await page.evaluate(() => document.querySelector(".section.active")?.id);
    if (act !== tabs[i].replace("sec-", "sec-")) ok = false;
  }
  check("fiecare filă activează secțiunea ei (indexare nealterată)", ok);
  const P = await page.evaluate(() => {
    const p = VAScript.parse("Ana: Salut, *lume*! [pauză 1.5s] Ce faci?\nBob: [pause 500ms]\n# comentariu\n\nNarator liber fără nume\nhttps://exemplu.ro/x\nconstructor: nu strică nimic\nAna: [pauza 99s] gata [pause 0,25]");
    return {chars: p.chars, lines: p.lines.map(l => ({who: l.who, key: l.key, gap: !!l.gap, items: l.items}))};
  });
  check("personaje în ordinea apariției, cu naratorul pentru rândurile fără nume", JSON.stringify(P.chars.map(c => c.key)) === JSON.stringify(["ana", "", "constructor"]), P.chars);
  check("accentul separă segmentul, pauzele în s/ms/virgulă, plafon 10 s", JSON.stringify(P.lines[0].items) === JSON.stringify([{k: "say", t: "Salut, ", em: false}, {k: "say", t: "lume", em: true}, {k: "say", t: "! ", em: false}, {k: "pause", ms: 1500}, {k: "say", t: " Ce faci?", em: false}]) && P.lines.at(-1).items.some(i => i.ms === 10000) && P.lines.at(-1).items.some(i => i.ms === 250), P.lines);
  check("rândul doar cu pauză nu face personaj; comentariul dispare; rândul gol = pauză scurtă", !P.chars.some(c => c.key === "bob") && P.lines.some(l => l.gap) && !P.lines.some(l => /comentariu/.test(JSON.stringify(l))));
  check("o adresă https:// nu e luată drept nume de personaj", P.lines.some(l => l.key === "" && l.items.some(i => /https:\/\/exemplu/.test(i.t || ""))));
  const lim = await page.evaluate(() => {
    const many = Array.from({length: 30}, (_, i) => "Pers" + String.fromCharCode(97 + (i % 26)) + i + ": rând " + i).join("\n");
    const a = VAScript.parse(many);
    const b = VAScript.parse(Array.from({length: 1200}, (_, i) => "Ana: r" + i).join("\n"));
    const c = VAScript.parse("x".repeat(60000));
    return {chars: a.chars.length, tr: a.truncated, lines: b.lines.length, trb: b.truncated, trc: c.truncated};
  });
  check("limite: 24 de personaje, 1000 de rânduri, 50 000 de semne", lim.chars === 24 && lim.tr && lim.lines === 1000 && lim.trb && lim.trc, lim);
  check("fără erori și fără cereri de rețea", st.errs.length === 0 && st.net.length === 0, [st.errs, st.net]);
  await browser.close();
}

console.log("2. interfață: distribuție, redare, accent, pauze, oprire");
{
  const {browser, page, st} = await open();
  await tab(page);
  check("începe gol, cu indiciu pentru distribuție", await page.locator("#scCast .sc-row").count() === 0 && (await page.textContent("#scCast")).length > 5);
  await ck(page, "#scEx"); await page.waitForTimeout(400);
  check("exemplul încarcă 3 personaje și 5 rânduri de replică", await page.locator("#scCast .sc-row").count() === 3 && await page.locator("#scLines li").count() === 5, await page.locator("#scLines li").count());
  check("statistica indică rânduri, personaje și durata estimată", /5/.test(await page.textContent("#scStats")) && /3/.test(await page.textContent("#scStats")) && /\d:\d\d/.test(await page.textContent("#scStats")));
  const rows = page.locator("#scCast .sc-row");
  const anaIdx = await page.evaluate(() => [...document.querySelectorAll("#scCast .sc-name")].findIndex(e => e.textContent === "Ana"));
  await rows.nth(anaIdx).locator("[data-sc=voice]").selectOption("local:fake-ana");
  await page.evaluate(i => { const r = document.querySelectorAll("#scCast .sc-row")[i].querySelector("[data-sc=rate]"); r.value = "1.5"; r.dispatchEvent(new Event("input", {bubbles: true})); }, anaIdx);
  const mihaiIdx = await page.evaluate(() => [...document.querySelectorAll("#scCast .sc-name")].findIndex(e => e.textContent === "Mihai"));
  await rows.nth(mihaiIdx).locator("[data-sc=voice]").selectOption("edge:en-GB|RyanNeural");
  check("setările se văd în eticheta cursorului", (await rows.nth(anaIdx).locator("output").first().textContent()) === "1.5");
  await page.evaluate(() => { window.__spoken.length = 0; });
  await ck(page, "#scPlay");
  await done(page);
  const sp = await page.evaluate(() => window.__spoken.map(s => ({...s})));
  const texts = sp.map(s => s.text);
  check("replicile se rostesc în ordine, fără marcajele de accent", texts.join("|") === "The lamp flickered twice and went out.|Did you |hear| that?|It was only the wind. |Probably.|Neither of them moved." || /Narator|lampa|Lampa/.test(texts[0]) && !texts.some(t => /\*/.test(t)), texts);
  const ana = sp.filter(s => s.voice === "fake-ana");
  check("Ana folosește vocea ei și viteza 1.5, cu accent separat mai lent și mai înalt", ana.length >= 3 && ana.some(s => Math.abs(s.rate - 1.5) < 0.01) && ana.some(s => Math.abs(s.rate - 1.35) < 0.01 && Math.abs(s.pitch - 1.15) < 0.01), ana);
  check("vocea din catalogul edge-tts cade pe o voce locală a aceleiași limbi (en → Bob)", sp.some(s => s.voice === "fake-bob" && /vântul|wind/.test(s.text)), sp.map(s => s.voice));
  const gaps = sp.slice(1).map((s, i) => s.at - sp[i].at);
  check("pauza de 1 s dintre replici se respectă (≥ 900 ms)", gaps.some(g => g >= 900), gaps);
  check("starea revine: butonul Redă activ, mesaj de final", await page.evaluate(() => !document.getElementById("scPlay").disabled && document.getElementById("scStatus").dataset.k === "scDone"));
  check("rândul curent nu rămâne marcat după final", await page.locator("#scLines li.on").count() === 0);
  // oprire
  await setText(page, "Ana: [pauză 8s] niciodată rostit\nAna: nici asta");
  await page.evaluate(() => { window.__spoken.length = 0; });
  await ck(page, "#scPlay");
  await until(page, () => VAScript.state.playing);
  check("în timpul redării butonul Redă e dezactivat", await page.evaluate(() => document.getElementById("scPlay").disabled));
  await ck(page, "#scStop");
  await until(page, () => !VAScript.state.playing);
  await page.waitForTimeout(600);
  check("oprirea întrerupe: nimic rostit după Stop", (await page.evaluate(() => window.__spoken.length)) === 0 && await page.evaluate(() => !document.getElementById("scPlay").disabled));
  // script gol
  await setText(page, "# doar comentariu");
  await ck(page, "#scPlay"); await page.waitForTimeout(150);
  check("script gol: mesaj, fără redare", await page.evaluate(() => document.getElementById("scStatus").dataset.k === "scEmpty" && window.__spoken.length === 0));
  check("fără erori", st.errs.length === 0 && st.net.length === 0 && (await page.evaluate(() => window.__csp.length)) === 0, [st.errs, st.net]);
  await browser.close();
}

console.log("3. ghid de pronunție, stiluri, persistență");
{
  const {browser, page, st} = await open();
  await tab(page);
  await page.evaluate(() => document.querySelector("#sec-script details").open = true);
  await page.fill("#scPron", "Nexus = nex-us\nC++ = si plus plus\na.b = punct\n# comentariu\nfără egal\n= gol");
  const r = await page.evaluate(() => [VAScript.pron("Nexus e bun, nexus! Nexuses rămân; Nexus."), VAScript.pron("Folosesc C++ azi"), VAScript.pron("axb și a.b"), VAScript.pron("ANexus")]);
  check("pronunția: întregul cuvânt, fără diferență de majuscule, nu și în interiorul altor cuvinte", r[0] === "nex-us e bun, nex-us! Nexuses rămân; nex-us." && r[3] === "ANexus", r);
  check("pronunția: caractere speciale tratate literal", r[1] === "Folosesc si plus plus azi" && r[2] === "axb și punct", r);
  await setText(page, "Ana: Nexus e aici.");
  await page.evaluate(() => { window.__spoken.length = 0; });
  await ck(page, "#scPlay"); await done(page);
  check("la redare se rostește forma din ghid", (await page.evaluate(() => window.__spoken.map(s => s.text))).join("|") === "nex-us e aici.");
  check("textul scris rămâne neschimbat în listă", /Nexus/.test(await page.textContent("#scLines")));
  // stiluri
  const row = page.locator("#scCast .sc-row").first();
  await page.evaluate(() => { const r = document.querySelector("#scCast [data-sc=rate]"); r.value = "0.7"; r.dispatchEvent(new Event("input", {bubbles: true})); const p = document.querySelector("#scCast [data-sc=pitch]"); p.value = "0.4"; p.dispatchEvent(new Event("input", {bubbles: true})); });
  await page.fill("#scCast [data-sc=stylename]", "Grav <b>");
  await ck(page, "#scCast [data-sc=savestyle]"); await page.waitForTimeout(250);
  check("stil salvat și oferit în listă (nume escapat)", await page.evaluate(() => VAScript.state.styles.length === 1 && VAScript.state.styles[0].rate === 0.7 && VAScript.state.styles[0].pitch === 0.4) && (await page.locator("#scCast [data-sc=style] option").nth(1).innerHTML()).includes("&lt;b&gt;"));
  await page.evaluate(() => { const r = document.querySelector("#scCast [data-sc=rate]"); r.value = "1.9"; r.dispatchEvent(new Event("input", {bubbles: true})); });
  await page.locator("#scCast [data-sc=style]").selectOption("0");
  check("aplicarea stilului resetează cursoarele", await page.evaluate(() => document.querySelector("#scCast [data-sc=rate]").value === "0.7" && VAScript.state.cast["k:ana"].rate === 0.7));
  await page.reload(); await page.waitForSelector("#scText", {state: "attached"}); await tab(page);
  check("totul supraviețuiește reîncărcării (text, pronunție, distribuție, stiluri)", await page.evaluate(() => document.getElementById("scText").value === "Ana: Nexus e aici." && document.getElementById("scPron").value.startsWith("Nexus") && VAScript.state.styles.length === 1 && VAScript.state.cast["k:ana"].pitch === 0.4));
  await page.locator("#scCast [data-sc=style]").selectOption("0");
  await ck(page, "#scCast [data-sc=delstyle]"); await page.waitForTimeout(250);
  check("ștergerea stilului", await page.evaluate(() => VAScript.state.styles.length === 0));
  check("fără erori", st.errs.length === 0 && st.net.length === 0, [st.errs, st.net]);
  await browser.close();
}

console.log("4. export/import proiect și date ostile");
{
  const {browser, page, st} = await open();
  await tab(page);
  await setText(page, "Ana: salut\nBob: hei");
  const [dl] = await Promise.all([page.waitForEvent("download"), ck(page, "#scExpJson")]);
  const exp = JSON.parse(fs.readFileSync(await dl.path(), "utf8"));
  check("export JSON: antet, text, distribuție", exp.app === "voiceatelier" && exp.kind === "script" && exp.text === "Ana: salut\nBob: hei" && dl.suggestedFilename() === "voiceatelier-script.json", exp);
  const putFile = async (name, buf) => { await page.setInputFiles("#scFile", {name, mimeType: "application/json", buffer: Buffer.from(buf)}); };
  await putFile("bad.json", "{nu e json");
  await page.waitForTimeout(300);
  check("fișier invalid respins, scriptul rămâne", await page.evaluate(() => document.getElementById("scText").value === "Ana: salut\nBob: hei" && document.getElementById("scStatus").dataset.k === "scImpBad"));
  await putFile("other.json", JSON.stringify({app: "altceva", kind: "script", text: "x"}));
  await page.waitForTimeout(300);
  check("fișier de la altă aplicație respins", await page.evaluate(() => document.getElementById("scText").value === "Ana: salut\nBob: hei"));
  const hostile = {app: "voiceatelier", kind: "script", text: "Eva: <img src=x onerror=window.__x=1> ok", cast: {"k:eva": {voice: "local:\"><script>1</script>", rate: 99, pitch: -5, vol: "foarte"}, "__proto__": {rate: 3}, "k:ok": {voice: "edge:ro-RO|AlinaNeural", rate: 0.2, pitch: 1.234, vol: 0.5}}, styles: [{name: "<i>x</i>", rate: 1.3}, {name: "<i>x</i>"}, {name: ""}, ...Array.from({length: 40}, (_, i) => ({name: "S" + i}))], pron: "x".repeat(20000)};
  const hj = JSON.stringify(hostile).replace('"cast":{', '"cast":{"__proto__":{"rate":3},"k:' + "z".repeat(60) + '":{"rate":1},');
  await putFile("h.json", hj);
  await page.waitForSelector("dialog[open]");
  await page.evaluate(() => { const b = [...document.querySelectorAll("dialog[open] button")]; b[b.length - 1].click(); });
  await until(page, () => document.getElementById("scText").value.startsWith("Eva:"));
  const S = await page.evaluate(() => JSON.parse(JSON.stringify(VAScript.state)));
  check("import ostil: numere în limite, voce invalidă eliminată, chei străine ignorate", S.cast["k:eva"].rate === 2 && S.cast["k:eva"].pitch === 0 && S.cast["k:eva"].vol === 1 && Object.keys(S.cast).every(k => k.startsWith("k:")) && !S.cast["k:" + "z".repeat(60)] && ({}).rate === undefined && S.cast["k:ok"].rate === 0.5 && S.cast["k:ok"].voice === "edge:ro-RO|AlinaNeural", S.cast);
  check("import ostil: stiluri deduplicate și plafonate la 20, pronunție tăiată", S.styles.length === 20 && S.pron.length === 12000, [S.styles.length, S.pron.length]);
  check("import ostil: nu execută cod (img/script rămân text)", await page.evaluate(() => window.__x === undefined && document.querySelectorAll("#scLines img, #scCast script, #scLines script, #scCast img").length === 0) && (await page.locator("#scLines li").first().innerHTML()).includes("&lt;img"));
  // refuz la confirmare
  await putFile("exp.json", JSON.stringify(exp));
  await page.waitForSelector("dialog[open]");
  await page.evaluate(() => { const b = [...document.querySelectorAll("dialog[open] button")]; b[0].click(); });
  await page.waitForTimeout(300);
  check("anularea confirmării păstrează scriptul curent", await page.evaluate(() => document.getElementById("scText").value.startsWith("Eva:")));
  // storage corupt
  await page.evaluate(() => localStorage.setItem("va_script", "{{nu e json"));
  await page.reload(); await page.waitForSelector("#scText", {state: "attached"});
  check("date corupte în localStorage: pornește gol, fără erori", await page.evaluate(() => document.getElementById("scText").value === "") && st.errs.length === 0, st.errs);
  check("fără rețea", st.net.length === 0, st.net);
  await browser.close();
}

console.log("5. scriptul edge-tts rulat cu un edge-tts fals");
{
  const {browser, page, st} = await open();
  await tab(page);
  const nasty = "Ana: O replică cu 'ghilimele', \"duble\", $(touch PWN), `touch PWN2` și \\ backslash\nBob: [pause 400ms] *Accent* aici\nNarator liber: text";
  await setText(page, nasty);
  const dlSh = async () => { const [d] = await Promise.all([page.waitForEvent("download"), ck(page, "#scExpSh")]); return fs.readFileSync(await d.path(), "utf8"); };
  const sh0 = await dlSh();
  const dir = fs.mkdtempSync(path.join(TMP, "run-"));
  const bin = path.join(dir, "bin"); fs.mkdirSync(bin);
  fs.writeFileSync(path.join(bin, "edge-tts"), `#!/usr/bin/env bash
out=""; while [ $# -gt 0 ]; do case "$1" in --write-media) out="$2"; shift;; *) echo "$1" >> "${dir}/args.log";; esac; shift; done
ffmpeg -loglevel error -y -f lavfi -i "sine=frequency=440:duration=0.5" -ar 24000 -ac 1 -c:a libmp3lame -b:a 48k "$out"
`, {mode: 0o755});
  const env = {...process.env, PATH: bin + ":" + process.env.PATH};
  fs.writeFileSync(path.join(dir, "run.sh"), sh0, {mode: 0o755});
  const syn = spawnSync("bash", ["-n", path.join(dir, "run.sh")]);
  check("scriptul exportat are sintaxă bash validă", syn.status === 0, String(syn.stderr));
  const r0 = spawnSync("bash", [path.join(dir, "run.sh")], {env, cwd: dir, encoding: "utf8"});
  check("fără voci alese, scriptul se oprește cu mesaj clar (nu rulează la nimereală)", r0.status === 1 && /Set VOICE_/.test(r0.stderr) && !fs.existsSync(path.join(dir, "clips")), [r0.status, r0.stderr]);
  // alege voci edge pentru toate cele 3 personaje
  const n = await page.locator("#scCast .sc-row").count();
  for (let i = 0; i < n; i++) await page.locator("#scCast .sc-row").nth(i).locator("[data-sc=voice]").selectOption(i === 0 ? "edge:ro-RO|AlinaNeural" : "edge:en-US|GuyNeural");
  await page.evaluate(() => { const r = document.querySelectorAll("#scCast [data-sc=rate]")[0]; r.value = "1.2"; r.dispatchEvent(new Event("input", {bubbles: true})); const v = document.querySelectorAll("#scCast [data-sc=vol]")[0]; v.value = "0.6"; v.dispatchEvent(new Event("input", {bubbles: true})); });
  const sh = await dlSh();
  check("vocile alese apar în VOICE_*", /VOICE_0='ro-RO-AlinaNeural'/.test(sh) && /VOICE_1='en-US-GuyNeural'/.test(sh), sh.split("\n").slice(6, 12));
  fs.writeFileSync(path.join(dir, "run.sh"), sh, {mode: 0o755});
  // ffmpeg/ffprobe pot lipsi pe mașina de CI: execuția completă a scriptului se rulează doar când există (altfel e omisă explicit, nu falsificată)
  const haveFf = spawnSync("ffmpeg", ["-version"]).status === 0 && spawnSync("ffprobe", ["-version"]).status === 0;
  if (!haveFf) console.log("  --  ffmpeg/ffprobe lipsesc pe această mașină: execuția completă a scriptului este omisă");
  else {
    const r1 = spawnSync("bash", [path.join(dir, "run.sh")], {env, cwd: dir, encoding: "utf8", timeout: 120000});
    check("scriptul rulează până la capăt", r1.status === 0 && /OK:/.test(r1.stdout), [r1.status, r1.stderr.slice(0, 300)]);
    check("text ostil: nimic executat (fără fișiere PWN)", !fs.existsSync(path.join(dir, "PWN")) && !fs.existsSync(path.join(dir, "PWN2")));
    const args = fs.readFileSync(path.join(dir, "args.log"), "utf8");
    check("textul ajunge întreg la edge-tts (ghilimele, $(), backtick, backslash)", args.includes("--text=O replică cu 'ghilimele', \"duble\", $(touch PWN), `touch PWN2` și \\ backslash"), args.slice(0, 400));
    check("viteza/ton/volum în formatul edge-tts (+20%, +0Hz, -40%) și accent separat (-8%/+7Hz)", args.includes("--rate=+20%") && args.includes("--volume=-40%") && args.includes("--pitch=+0Hz") && /--rate=-10%/.test(args) && /--pitch=\+8Hz|--pitch=\+7Hz/.test(args), args.split("\n").filter(l => /^--(rate|pitch|volume)/.test(l)).slice(0, 12));
    const dur = f => parseFloat(spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path.join(dir, f)], {encoding: "utf8"}).stdout);
    const tr = fs.readdirSync(path.join(dir, "tracks")).sort();
    check("câte o pistă pe personaj și scenariul unit", tr.join() === "c0.mp3,c1.mp3,c2.mp3" && fs.existsSync(path.join(dir, "scenariu.mp3")), tr);
    const d = tr.map(f => dur("tracks/" + f)), all = dur("scenariu.mp3");
    check("pistele sunt aliniate: aceeași durată între ele și cu scenariul (±0,3 s)", d.every(x => Math.abs(x - all) < 0.3), [d, all]);
    check("durata scenariului ≈ clipuri + pauza de 0,4 s", all > 2.2 && all < 3.2, all);
  }
  check("fără erori de pagină", st.errs.length === 0 && st.net.length === 0, [st.errs, st.net]);
  await browser.close();
}

console.log("6. limbi, accesibilitate, ecran îngust");
{
  const {browser, page, st} = await open({axe: true});
  await tab(page);
  await ck(page, "#scEx"); await page.waitForTimeout(400);
  let bad = [];
  for (const lg of ["ro", "en", "fr", "de", "es", "pt", "it", "hu"]){
    await page.selectOption("#langSel", lg);
    await page.waitForTimeout(150);
    const info = await page.evaluate(() => ({h2: document.querySelector("#sec-script h2").textContent, tab: document.querySelector('[data-click="switchTab:script"]').textContent, ph: document.getElementById("scText").placeholder, raw: [...document.querySelectorAll("#sec-script *, [data-click='switchTab:script']")].some(e => e.children.length === 0 && /^(sc|tab)[A-Z][A-Za-z]+$/.test(e.textContent.trim())), ex: !!document.querySelector("#scCast .sc-name")}));
    if (!info.h2 || !info.tab || !info.ph || info.raw || !info.ex) bad.push([lg, info]);
  }
  check("toate cele 8 limbi au titlu, filă, indiciu și distribuție, fără chei brute", bad.length === 0, bad);
  await page.selectOption("#langSel", "en"); await page.waitForTimeout(150);
  await page.evaluate(() => { const ta = document.getElementById("scText"); ta.value = "Fără nume aici.\nAna: salut"; ta.dispatchEvent(new Event("input", {bubbles: true})); });
  await page.waitForTimeout(400);
  const castEn = await page.textContent("#scCast");
  await page.selectOption("#langSel", "ro"); await page.waitForTimeout(150);
  check("distribuția se redesenează în limba aleasă (Narrator → Narator)", /Narrator/.test(castEn) && /Narator/.test(await page.textContent("#scCast")), castEn.slice(0, 80));
  await page.selectOption("#langSel", "en"); await page.waitForTimeout(150);
  const ax = await axeRun(page);
  check("axe: fără încălcări în fila Script", ax !== null && ax.filter(v => !/^region:|^landmark/.test(v)).length === 0, ax);
  await page.setViewportSize({width: 375, height: 800});
  await page.waitForTimeout(200);
  check("375 px: fără defilare orizontală", (await hOverflow(page)) <= 1, await hOverflow(page));
  check("fără erori", st.errs.length === 0, st.errs);
  await browser.close();
}
fs.rmSync(TMP, {recursive: true, force: true});
summary();
