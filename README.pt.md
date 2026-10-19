# VoiceAtelier

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · **Português** · [Deutsch](README.de.md) · [Magyar](README.hu.md)

**Versão:** 1.3.0 · **Última atualização:** 2026-10-19

Idiomas da interface: **Română, English, Français, Italiano, Español, Português (PT), Deutsch, Magyar** + mais 8

Catálogo e guia de vozes neurais gratuitas para audiolivros, num único ficheiro HTML.

**Online:** https://chiuta.github.io/VoiceAtelier/

![Captura de ecrã](screenshot.png)

## O que é

O VoiceAtelier é uma aplicação num único ficheiro `index.html` que apresenta vozes de síntese de voz utilizáveis gratuitamente para a narração de audiolivros. A interface anuncia 427 vozes neurais em 141 idiomas, organizadas por níveis (Starter, Storyteller, Todos os idiomas, Studio Pro), e inclui um guia de fluxo de trabalho para narração de longa duração.

## Funcionalidades

- Seis secções (separadores): **Starter**, **Storyteller**, **Todos os idiomas**, **Studio Pro**, **Guia**, **Legal e RGPD**.
- Reprodução de teste das vozes disponíveis no navegador através da Web Speech API (`speechSynthesis`).
- Texto de amostra selecionável numa lista (excertos de Moby Dick, Pride & Prejudice, A Tale of Two Cities, The Time Machine, Anna Karenina, Mrs Dalloway, *Printre inteligențe*, *Nota Zero*), com controlos de velocidade e tom e um botão «Parar tudo».
- O separador «Todos os idiomas»: uma grelha de idiomas com pesquisa, um botão de teste e um botão para copiar o comando `edge-tts` de cada idioma.
- Studio Pro: fichas de apresentação do ElevenLabs, Microsoft Edge TTS, Kokoro TTS, Bark, Google Cloud TTS, Coqui TTS e Amazon Polly (limites, idiomas, formatos, ligação).
- Guia: explicação dos três níveis, critérios de escolha da voz, fluxo de trabalho com `edge-tts`, Audacity e ffmpeg (`loudnorm`), requisitos ACX/Audible.
- Interface em 16 idiomas: en, ro, fr, de, es, pt, it, nl, pl, ru, ar, zh, ja, ko, tr, hu.
- Tema automático/claro/escuro.
- Janelas informativas (RGPD, cookies, ficha legal, acessibilidade, remoção de conteúdo, etc.).

## Manual de utilização

1. Abra a página. O idioma da interface é detetado automaticamente; pode alterá-lo na lista «Language» do cabeçalho.
2. Mude o tema com o botão do cabeçalho (alterna entre automático, claro e escuro).
3. Escolha um texto em «Texto de amostra»; ajuste a «Velocidade» e o «Tom».
4. Em **Starter** e **Storyteller**, prima ▶ no cartão de uma voz para a ouvir (pelo teclado: Tab até ao botão ▶, depois Enter ou Espaço). O distintivo «On-device» assinala as vozes locais; as fornecidas pela rede através do navegador/sistema têm o distintivo «Voz online».
5. Em **Todos os idiomas**, pesquise um idioma e prima o botão de teste ou o botão de copiar o comando `edge-tts`.
6. Prima «⏹ Parar tudo» para interromper a reprodução.
7. Consulte **Studio Pro** para as ferramentas externas e **Guia** para o fluxo de trabalho.
8. Escape fecha as janelas modais.

## Privacidade e rede

- **Armazenamento local:** `localStorage`, chaves `va_lang` (idioma) e `va_theme` (tema). Opcionalmente, a chave `va_endpoint` se definir manualmente outro relay TTS.
- **Rede:** as vozes dos separadores Starter e Storyteller correm localmente através da Web Speech API (a aplicação refere que, se o navegador enviar internamente o texto para um servidor, a responsabilidade pertence ao fornecedor do navegador).
- **Opt-in explícito:** no separador «Todos os idiomas» (aberto por predefinição) um aviso visível explica o que é enviado, e as vozes online só são reproduzidas **depois de assinalar** o consentimento («Compreendo e concordo…»). Sem a seleção, nada é enviado (verificado: 0 pedidos ao carregar e ao clicar sem a seleção). A seleção é retida em `localStorage` (`va_relay_ok`).
- Ao reproduzir uma voz do separador «Todos os idiomas», o texto de amostra, o nome da voz, a velocidade e o tom são enviados por HTTPS (`fetch`) para o relay **https://alexio.tf/tts**, que gera áudio MP3 com `edge-tts` e o devolve. **O `edge-tts` é uma biblioteca não oficial que utiliza o serviço online Microsoft Edge TTS: o texto é, portanto, retransmitido à Microsoft**, que o processa segundo as suas próprias condições (não oficial, sem garantia de disponibilidade; o «gratuito» depende deste serviço). De acordo com a nota da aplicação, o relay não guarda o texto após o pedido (a afirmação diz respeito ao servidor do autor e não pode ser verificada a partir deste repositório).
- CSP: `connect-src 'self' https://alexio.tf`. A chave `va_endpoint` (relay alternativo definido manualmente em `localStorage`) funciona apenas para endereços em `alexio.tf`; para outro relay é necessário alargar a CSP em `index.html`.
- **Atenção:** o relay gera áudio com `edge-tts`, um cliente não oficial do serviço online Microsoft Edge/Azure TTS; é, portanto, provável que o texto de amostra seja também retransmitido à Microsoft.
- As ligações para outros sítios (ElevenLabs, GitHub, Hugging Face, Buy Me a Coffee, etc.) são simples hiperligações, abertas apenas ao clicar.
- A aplicação não contém analítica nem formulários de registo.

## Execução local / offline

Descarregue `index.html` e abra-o no navegador. Os tipos de letra estão incluídos no ficheiro. Os separadores Starter e Storyteller funcionam sem internet, dentro do limite das vozes instaladas no sistema/navegador. A reprodução a partir de «Todos os idiomas» requer internet e acesso a `alexio.tf`.

## Histórico / Changelog

- 1.2.0 — 2026-10-18: nova amostra na lista: *Nota Zero* (duas frases do vol. I).
- 1.1.0 — 2026-10-14: cópia de segurança e etiquetagem de dados (fff-kit).

- 1.0.0 — 2026-10-12: a versão e a data da última atualização são apresentadas na aplicação
- Ronda 7: removida a afirmação sem fundamento de que as ferramentas do Studio Pro produzem áudio «indistinguishable from professional narration» (e «qualidade broadcast») nos 15 idiomas — o texto diz agora que a naturalidade difere de voz para voz e recomenda ouvir as amostras; o estado vazio de Starter/Storyteller (sem vozes locais) tem agora um botão «→ Todos os idiomas» que leva diretamente às vozes online.
- As vozes do navegador que não são locais (`localService = false`) recebem o distintivo «Voz online» (traduzido para os 15 idiomas), para que fique claro quando o texto pode seguir para o fornecedor do navegador; o cartão de voz deixou de ser `role="button"` com um botão ▶ no interior (violação axe «nested-interactive», visível apenas quando existem vozes), e o botão ▶ é o controlo focável; CSP: `script-src` por hash SHA-256 (2 scripts), sem `'unsafe-inline'`.
- Removidos todos os 44 manipuladores inline (`onclick`/`oninput`/`onchange`); as ações usam agora atributos `data-click`/`data-input`/`data-change`/`data-overlay` e ouvintes delegados.
- Se não existir nenhuma voz local (nem após 5 s), as páginas Starter/Storyteller mostram agora um estado vazio explícito, nos 15 idiomas, com remissão para o separador «Todos os idiomas», em vez de «Loading voices…».
- Textos de marketing moderados: «The gold standard» → «A leading commercial service», «Unlimited (unofficial)» → «No published limit (unofficial)».
- O widget de apoio é um marco `complementary`; axe-core: 0 violações a 1280 e 360 px. A secção de rede do README foi corrigida (CSP atual: `connect-src 'self' https://alexio.tf`).

## Licença

MIT — ver o ficheiro LICENSE

## Auditoria

2026-10-10: verificado o número de vozes (427) e de idiomas (141) na página; o único pedido externo é `POST https://alexio.tf/tts` por ação do utilizador; corrigidos o contraste e um elemento oculto focável. A página não oferece atribuição de vozes por personagem nem SSML.

## Autor

Alexio — Alexandru-Ionuț Chiuță, contacto: alexio@trom.tf
