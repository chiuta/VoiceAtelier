# VoiceAtelier

Catalog și ghid de voci neurale gratuite pentru audiobook, într-un singur fișier HTML.

**Live:** https://chiuta.github.io/VoiceAtelier/

![Captura de ecran](screenshot.png)

## Ce este

VoiceAtelier este o aplicație dintr-un singur fișier `index.html` care prezintă voci de sinteză vocală utilizabile gratuit pentru narațiune de audiobook. Aplicația anunță în interfață 427 de voci neurale în 141 de limbi, organizate pe niveluri (Starter, Storyteller, Toate limbile, Studio Pro), și include un ghid de flux de lucru pentru narațiune de lungă durată.

## Funcții

- Șase secțiuni (tab-uri): **Starter**, **Storyteller**, **Toate limbile**, **Studio Pro**, **Ghid**, **Legal & GDPR**.
- Redare de probă a vocilor disponibile în browser prin Web Speech API (`speechSynthesis`).
- Text mostră selectabil dintr-o listă (fragmente din Moby Dick, Pride & Prejudice, A Tale of Two Cities, The Time Machine, Anna Karenina, Mrs Dalloway, *Printre inteligențe*), cu comenzi pentru viteză și ton și buton „Oprește tot”.
- Tab-ul „Toate limbile”: grilă de limbi cu căutare, buton de probă și buton de copiere a comenzii `edge-tts` pentru fiecare limbă.
- Studio Pro: fișe de prezentare pentru ElevenLabs, Microsoft Edge TTS, Kokoro TTS, Bark, Google Cloud TTS, Coqui TTS și Amazon Polly (limite, limbi, formate, link).
- Ghid: explicarea celor trei niveluri, criterii de alegere a vocii, flux de lucru cu `edge-tts`, Audacity și ffmpeg (`loudnorm`), cerințe ACX/Audible.
- Interfață în 15 limbi: en, ro, fr, de, es, pt, it, nl, pl, ru, ar, zh, ja, ko, tr.
- Temă automată/luminoasă/întunecată.
- Ferestre informative (GDPR, cookies, impresum, accesibilitate, takedown, ș.a.).

## Manual de utilizare

1. Deschide pagina. Limba interfeței este detectată automat; o poți schimba din lista „Language” din antet.
2. Comută tema cu butonul din antet (ciclează între automat, luminos, întunecat).
3. Alege un text din „Text mostră”; ajustează „Viteză” și „Ton”.
4. În **Starter** și **Storyteller**, apasă ▶ pe cardul unei voci pentru a o auzi. Cu Enter sau Spațiu pe un card se pornește redarea.
5. În **Toate limbile**, caută o limbă, apoi apasă butonul de probă sau butonul de copiere a comenzii `edge-tts`.
6. Apasă „⏹ Oprește tot” pentru a opri redarea.
7. Consultă **Studio Pro** pentru instrumente externe și **Ghid** pentru fluxul de lucru.
8. Escape închide ferestrele modale.

## Confidențialitate și rețea

- **Stocare locală:** `localStorage`, chei `va_lang` (limba) și `va_theme` (tema). Opțional, cheia `va_endpoint` dacă setezi manual un alt releu TTS.
- **Rețea:** vocile din tab-urile Starter și Storyteller rulează local prin Web Speech API (aplicația notează că, dacă browserul trimite intern textul unui server, responsabilitatea aparține furnizorului browserului).
- La redarea unei voci din tab-ul „Toate limbile”, textul mostră și numele vocii sunt trimise prin HTTPS (`fetch`) la releul **https://alexio.tf/tts**, care returnează audio MP3. Conform notei din aplicație, releul nu păstrează textul după cerere.
- **Atenție:** releul generează audio cu `edge-tts`, un client neoficial pentru serviciul online Microsoft Edge/Azure TTS; este deci probabil ca textul mostră să fie retransmis și către Microsoft. Politica CSP din pagină permite `connect-src https:` (necesar pentru un releu personalizat setat în `va_endpoint`), deci nu limitează destinațiile cererilor.
- Linkurile către alte site-uri (ElevenLabs, GitHub, Hugging Face, Patreon, Buy Me a Coffee etc.) sunt simple hiperlegături, deschise doar la click.
- Aplicația nu conține analytics sau formulare de înregistrare.

## Rulare locală / offline

Descarcă `index.html` și deschide-l în browser. Fonturile sunt incluse în fișier. Tab-urile Starter și Storyteller funcționează fără internet, în limita vocilor instalate în sistem/browser. Redarea din „Toate limbile” necesită internet și acces la `alexio.tf`.

## Licență

CC0 1.0 Universal (domeniu public) — vezi fișierul LICENSE

## Audit

2026-10-10: verificat numărul de voci (427) și de limbi (141) din pagină; singura cerere externă este `POST https://alexio.tf/tts` la acțiunea utilizatorului; corectate contrastul și un element ascuns focusabil. Pagina nu oferă per-character casting sau SSML.

## Autor

Alexio — Alexandru-Ionuț Chiuță, contact: alexio@trom.tf

## English summary

VoiceAtelier is a single-file HTML catalog and guide to free neural voices for audiobook narration, with a 15-language interface. Starter/Storyteller voices play locally via the Web Speech API; the "All languages" tab sends the sample text and voice name to the relay alexio.tf/tts to get MP3 audio. Settings (language, theme) are kept in localStorage. CC0 1.0.
