# Jurnal de modificări

## 2.1.0 — 2026-10-27

### Adăugat
- Nota despre catalogul de voci (427 de voci, 141 de localizări, circa 77 de limbi de bază, ultima modificare în depozit 2026-04-12 din istoricul git, **nereverificată** față de edge-tts) și nota „eșantioane audio pre-înregistrate: de adăugat” sunt acum disponibile și în **fr, de, es, pt, it, hu** (traducere automată, neverificată de vorbitori nativi); înainte cădeau pe engleză. Limbile fără dicționar complet (nl, pl, ru, ar, zh, ja, ko, tr) rămân pe engleză.
- Test nou `tests/catalog-note.test.mjs` (24 de verificări): cifrele și data apar în fiecare limbă, textul diferă de engleză, 0 cereri de rețea.

### Neimplementat (rămâne „de adăugat” / „de verificat”)
- **Eșantioane audio pre-înregistrate** ale vocilor din catalog: ar cere generare prin relay (rețea) sau fișiere audio în depozit; nu se pot genera local, iar un eșantion făcut cu vocea browserului ar fi o voce diferită de cea din catalog (înșelător). Aplicația deja redă textul de probă cu vocea însăși.
- Reverificarea catalogului față de lista curentă edge-tts (fără acces la serviciu din mediul de lucru).

## 2.0.1 — 2026-10-27

Recenzie 2026-10-27. Doar text, fără funcții noi.

### Adăugat
- Notă în aplicație (RO/EN; celelalte limbi folosesc engleza) despre catalogul de voci: 427 de voci, 141 de localizări (circa 77 de limbi de bază), ultima modificare în depozit la 2026-04-12 (data din istoricul git, nedeclarată în cod), neverificat față de lista curentă edge-tts.
- Mențiune explicită: eșantioanele audio pre-înregistrate pe voce sunt „de adăugat”.
- Linii „Stare” și „Offline” în README.

### Neschimbat
- Nimic șters; fără dependențe noi.

Istoricul anterior (până la 2.0.0, 2026-10-26) este în secțiunea „Istoric / Changelog” din README.md.
