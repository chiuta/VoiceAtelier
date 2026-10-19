# VoiceAtelier

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · **Magyar**

**Verzió:** 1.3.0 · **Utolsó frissítés:** 2026-10-19

A felület nyelvei: **Română, English, Français, Italiano, Español, Português (PT), Deutsch, Magyar** + további 8

Ingyenes neurális hangok katalógusa és útmutatója hangoskönyvekhez, egyetlen HTML-fájlban.

**Online:** https://chiuta.github.io/VoiceAtelier/

![Képernyőkép](screenshot.png)

## Mi ez

A VoiceAtelier egyetlen `index.html` fájlból álló alkalmazás, amely hangoskönyv-felolvasáshoz ingyenesen használható beszédszintézis-hangokat mutat be. A felület 427 neurális hangot hirdet 141 nyelven, szintekbe rendezve (Starter, Storyteller, Minden nyelv, Studio Pro), és munkafolyamat-útmutatót tartalmaz a hosszú felolvasásokhoz.

## Funkciók

- Hat szakasz (lap): **Starter**, **Storyteller**, **Minden nyelv**, **Studio Pro**, **Útmutató**, **Jogi tudnivalók és GDPR**.
- A böngészőben elérhető hangok próbalejátszása a Web Speech API-n (`speechSynthesis`) keresztül.
- Listából választható mintaszöveg (részletek a Moby Dickből, a Pride & Prejudice-ből, az A Tale of Two Citiesből, a The Time Machine-ből, az Anna Karenináből, a Mrs Dallowayből, a *Printre inteligențe* és a *Nota Zero* című műből), sebesség- és hangmagasság-szabályzóval, valamint „Minden leállítása” gombbal.
- A „Minden nyelv” lap: nyelvrács kereséssel, próbagombbal és az egyes nyelvekhez tartozó `edge-tts` parancs másolására szolgáló gombbal.
- Studio Pro: bemutatólapok az ElevenLabs, a Microsoft Edge TTS, a Kokoro TTS, a Bark, a Google Cloud TTS, a Coqui TTS és az Amazon Polly szolgáltatásokról (korlátok, nyelvek, formátumok, hivatkozás).
- Útmutató: a három szint magyarázata, a hangválasztás szempontjai, munkafolyamat az `edge-tts`, az Audacity és az ffmpeg (`loudnorm`) használatával, ACX/Audible-követelmények.
- 16 nyelvű felület: en, ro, fr, de, es, pt, it, nl, pl, ru, ar, zh, ja, ko, tr, hu.
- Automatikus/világos/sötét téma.
- Tájékoztató ablakok (GDPR, sütik, impresszum, akadálymentesség, tartalom eltávolítása stb.).

## Használati útmutató

1. Nyisd meg az oldalt. A felület nyelvét automatikusan felismeri; a fejlécben található „Language” listából módosíthatod.
2. Válts témát a fejléc gombjával (automatikus, világos és sötét között léptet).
3. Válassz szöveget a „Mintaszöveg” közül; állítsd be a „Sebességet” és a „Hangmagasságot”.
4. A **Starter** és a **Storyteller** lapon nyomd meg a ▶ gombot egy hangkártyán a meghallgatáshoz (billentyűzetről: Tab a ▶ gombig, majd Enter vagy Szóköz). Az „On-device” jelvény a helyi hangokat jelöli; a böngésző/rendszer által hálózaton keresztül biztosítottak az „Online hang” jelvényt viselik.
5. A **Minden nyelv** lapon keress rá egy nyelvre, majd nyomd meg a próbagombot vagy az `edge-tts` parancs másoló gombját.
6. A lejátszás leállításához nyomd meg a „⏹ Minden leállítása” gombot.
7. A külső eszközökről a **Studio Pro**, a munkafolyamatról az **Útmutató** lapon olvashatsz.
8. Az Escape bezárja a felugró ablakokat.

## Adatvédelem és hálózat

- **Helyi tárolás:** `localStorage`, kulcsok: `va_lang` (nyelv) és `va_theme` (téma). Opcionálisan a `va_endpoint` kulcs, ha kézzel másik TTS-átjátszót állítasz be.
- **Hálózat:** a Starter és a Storyteller lap hangjai helyben futnak a Web Speech API-n keresztül (az alkalmazás megjegyzi, hogy ha a böngésző belsőleg elküldi a szöveget egy szervernek, a felelősség a böngésző szolgáltatóját terheli).
- **Kifejezett opt-in:** a „Minden nyelv” lapon (alapértelmezetten nyitva) jól látható figyelmeztetés magyarázza, mi kerül elküldésre, és az online hangok **csak a hozzájárulás bejelölése után** játszódnak le („Megértettem és elfogadom…”). Jelölés nélkül semmi sem kerül elküldésre (ellenőrizve: 0 kérés betöltéskor és jelölés nélküli kattintáskor). A jelölést a `localStorage` őrzi meg (`va_relay_ok`).
- A „Minden nyelv” lap egy hangjának lejátszásakor a mintaszöveg, a hang neve, a sebesség és a hangmagasság HTTPS-en (`fetch`) keresztül a **https://alexio.tf/tts** átjátszóhoz kerül, amely az `edge-tts` segítségével MP3-hangot állít elő, és visszaküldi. **Az `edge-tts` egy nem hivatalos könyvtár, amely a Microsoft Edge TTS online szolgáltatást használja: a szöveg tehát továbbításra kerül a Microsofthoz**, amely saját feltételei szerint dolgozza fel (nem hivatalos, rendelkezésre állási garancia nélkül; az „ingyenes” ettől a szolgáltatástól függ). Az alkalmazásban olvasható megjegyzés szerint az átjátszó a kérés után nem őrzi meg a szöveget (az állítás a szerző szerverére vonatkozik, és ebből a tárolóból nem ellenőrizhető).
- CSP: `connect-src 'self' https://alexio.tf`. A `va_endpoint` kulcs (a `localStorage`-ban kézzel beállított alternatív átjátszó) csak az `alexio.tf` címein működik; másik átjátszóhoz bővíteni kell a CSP-t az `index.html` fájlban.
- **Figyelem:** az átjátszó az `edge-tts` segítségével állít elő hangot, amely a Microsoft Edge/Azure TTS online szolgáltatás nem hivatalos kliense; ezért valószínű, hogy a mintaszöveg a Microsofthoz is továbbítódik.
- A más oldalakra mutató hivatkozások (ElevenLabs, GitHub, Hugging Face, Buy Me a Coffee stb.) egyszerű hiperhivatkozások, amelyek csak kattintásra nyílnak meg.
- Az alkalmazás nem tartalmaz analitikát vagy regisztrációs űrlapot.

## Futtatás helyben / offline

Töltsd le az `index.html` fájlt, és nyisd meg a böngészőben. A betűtípusok a fájlban találhatók. A Starter és a Storyteller lap internet nélkül is működik, a rendszerben/böngészőben telepített hangok keretein belül. A „Minden nyelv” lapról történő lejátszáshoz internet és az `alexio.tf` elérése szükséges.

## Előzmények / Changelog

- 1.2.0 — 2026-10-18: Új minta a listában: *Nota Zero* (két mondat az I. kötetből).
- 1.1.0 — 2026-10-14: adatmentés és adatcímkézés (fff-kit).

- 1.0.0 — 2026-10-12: a verzió és az utolsó frissítés dátuma megjelenik az alkalmazásban
- 7. forduló: eltávolítva az alá nem támasztott állítás, hogy a Studio Pro eszközei mind a 15 nyelven „indistinguishable from professional narration” (és „adásminőségű”) hangot állítanak elő — a szöveg most azt mondja, hogy a természetesség hangonként eltér, és a minták meghallgatását ajánlja; a Starter/Storyteller üres állapotában (helyi hangok nélkül) most van egy „→ Minden nyelv” gomb, amely közvetlenül az online hangokhoz vezet.
- A nem helyi böngészőhangok (`localService = false`) „Online hang” jelvényt kapnak (a 15 nyelvre lefordítva), hogy egyértelmű legyen, mikor távozhat a szöveg a böngésző szolgáltatójához; a hangkártya már nem `role="button"` egy benne lévő ▶ gombbal (axe „nested-interactive” hiba, csak akkor látható, ha vannak hangok), és a ▶ gomb a fókuszálható vezérlő; CSP: `script-src` SHA-256 hash alapján (2 szkript), `'unsafe-inline'` nélkül.
- Eltávolítva mind a 44 beágyazott eseménykezelő (`onclick`/`oninput`/`onchange`); a műveletek mostantól `data-click`/`data-input`/`data-change`/`data-overlay` attribútumokat és delegált figyelőket használnak.
- Ha egyáltalán nincs helyi hang (5 másodperc után sem), a Starter/Storyteller oldalak mostantól mind a 15 nyelven egyértelmű üres állapotot mutatnak, a „Minden nyelv” lapra utalva, a „Loading voices…” helyett.
- Mérsékelt marketingszövegek: „The gold standard” → „A leading commercial service”, „Unlimited (unofficial)” → „No published limit (unofficial)”.
- A támogatási widget `complementary` landmark; axe-core: 0 hiba 1280 és 360 px szélességnél. A README hálózati szakasza javítva (jelenlegi CSP: `connect-src 'self' https://alexio.tf`).

## Licenc

MIT — lásd a LICENSE fájlt

## Audit

2026-10-10: ellenőrizve az oldalon szereplő hangok (427) és nyelvek (141) száma; az egyetlen külső kérés a `POST https://alexio.tf/tts` felhasználói művelet hatására; javítva a kontraszt és egy rejtett, fókuszálható elem. Az oldal nem kínál szereplőnkénti hangkiosztást vagy SSML-t.

## Szerző

Alexio — Alexandru-Ionuț Chiuță, kapcsolat: alexio@trom.tf
