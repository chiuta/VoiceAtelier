// Teste 2.1.0: nota despre catalog și eșantioane (catNote / samplesNote) în limbile cu dicționar complet (fr/de/es/pt/it/hu: traducere automată). Rețea blocată.
import {createRequire} from "module"; import {fileURLToPath} from "url"; import path from "path";
const require = createRequire(process.env.PW_ROOT || import.meta.url); const {chromium} = require("playwright");
const here = path.dirname(fileURLToPath(import.meta.url)); const URL_ = "file://" + path.resolve(here, "../index.html");
let fail = 0; const ok = (c, m, x) => { console.log((c ? "  ok  " : "FAIL  ") + m + (!c && x !== undefined ? "  -> " + JSON.stringify(x) : "")); if (!c) fail++; };
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || undefined, args: ["--no-sandbox"]});
const ctx = await browser.newContext({viewport: {width: 1200, height: 900}, locale: "en-US"}); const net = [], errs = [];
await ctx.route(/^https?:/, r => { net.push(r.request().url()); r.abort(); });
const p = await ctx.newPage(); p.on("pageerror", e => errs.push(e.message));
await p.goto(URL_); await p.waitForSelector("#langSel");
const T = {}; 
for (const l of ["en", "ro", "fr", "de", "es", "pt", "it", "hu"]) {
  await p.selectOption("#langSel", l); await p.waitForTimeout(150);
  T[l] = await p.evaluate(() => ({cat: document.querySelector("[data-i18n=catNote]").textContent, smp: document.querySelector("[data-i18n=samplesNote]").textContent}));
  ok(/427/.test(T[l].cat) && /141/.test(T[l].cat) && /77/.test(T[l].cat) && /2026-04-12/.test(T[l].cat), l + ": nota catalogului are cifrele și data (427 / 141 / 77 / 2026-04-12)", T[l].cat.slice(0, 80));
  ok(T[l].smp.length > 40 && !/catNote|samplesNote/.test(T[l].smp), l + ": nota despre eșantioane prezentă");
}
for (const l of ["fr", "de", "es", "pt", "it", "hu"]) ok(T[l].cat !== T.en.cat && T[l].smp !== T.en.smp, l + ": textele diferă de engleză (nu cad pe EN)");
ok(errs.length === 0, "fără erori JS", errs); ok(net.length === 0, "0 cereri de rețea", net);
await browser.close(); console.log(fail ? fail + " eșuate" : "toate trec"); process.exit(fail ? 1 : 0);
