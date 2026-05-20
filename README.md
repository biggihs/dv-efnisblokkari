# DV Efnisblokkari

Firefox og Chrome viðbót til að fela óskylt efni á dv.is með litaðar blokka.

## Um þessa viðbót

> "Ég hef lengi verið þreyttur á að skoða fréttir á DV og smella óvart á 433 "íþróttafréttir" eða auglýsingar. Svo ég lét Claude búa til þetta plugin fyrir Chrome og Firefox sem felur það efni sem ég hef ekki áhuga á. Ég hef ekki lesið neitt af kóðanum, hvorki þessa síðu né plugginið sjálft. ... brave new world :)"
> 
> — Birgir Hrafn Sigurðsson

**⚠️ Mikilvæg athugasemd**: Þessi viðbót var að öllu leyti búin til af Claude AI (gervigreind). Höfundurinn hefur ekki skoðað eða staðfest kóðann. Notaðu á eigin ábyrgð og traust.

## Skjáskot

<img src="./Popup%20example.png" alt="Viðbótarstjórnborð með íslenskum texta" width="400">

*Popup viðmót með íslenskum texta og víxlum fyrir hvern efnisflokk*

<img src="./Screenshot%20Example.png" alt="DV síða með feldum efni" width="800">

*DV síða með feldum efni - litaðar blokka sýna hvað var falið*

## Hvað gerir þetta?

Þessi viðbót felur sjálfkrafa efni úr fjórum flokkum á dv.is:

- **⚽ 433 Íþróttir** - Skipt út fyrir græna blokka með "Íþróttefni falið"
- **🎭 Fókus** - Skipt út fyrir fjólubláa blokka með "Fókus efni falið"
- **🏝️ Eyjan** - Skipt út fyrir rauða blokka með "Eyjan efni falið"
- **📢 Kynningar** - Skipt út fyrir appelsínugula blokka með "Kynning efni falið"

## Eiginleikar

### 🎯 Snjall greining:
- Finnur efni eftir CSS flokkum (`.f_433`, `.f_fokus`, `.f_eyjan`, `.f_lifsstill`, `.kynning`)
- Virkar með efni sem hlaðið er seinna (MutationObserver)

### ⚙️ Auðveld stjórnun:
- Víxlar fyrir hvern efnisflokk fyrir sig
- "Fela allt efni" víxill fyrir allt í einu
- Stillingar vista sjálfkrafa í vafra
- Rauntíma uppfærsla án þess að endurnýja síðu

### 🎨 Sjónræn endurgjöf:
- Mismunandi litir fyrir hvern efnisflokk
- Táknmyndir og texti sýna hvað var falið
- Viðheldur upprunalegu stærð mynda

## Uppsetning

### Firefox (60+)
1. Sæktu [`dv-content-blocker-firefox.zip`](https://github.com/biggihs/dv-efnisblokkari/raw/main/build/dv-content-blocker-firefox.zip)
2. Farðu í `about:debugging`
3. Smelltu á "This Firefox"
4. Smelltu á "Load Temporary Add-on"
5. Veldu `manifest.json` úr ZIP skránni

### Chrome/Edge
1. Sæktu [`dv-content-blocker-chrome.zip`](https://github.com/biggihs/dv-efnisblokkari/raw/main/build/dv-content-blocker-chrome.zip)
2. Farðu í `chrome://extensions`
3. Kveiktu á "Developer mode"
4. Smelltu á "Load unpacked"
5. Veldu möppuna úr ZIP skránni

## Notkun

1. **Settu upp** viðbótina í vafranum þínum
2. **Farðu á** [www.dv.is](https://www.dv.is)
3. **Smelltu á** viðbótartáknið í tækjastikunni
4. **Veldu** hvaða efnisflokka þú vilt fela
5. **Njóttu** betri upplifunar án óskylts efnis!

## Tæknilegar upplýsingar

### Stuðningur við vafra:
- **Firefox 60+** - Manifest V2, `browser` API
- **Chrome/Edge** - Manifest V3, `chrome` API, service worker
- Cross-browser compatibility layer fyrir báða vafra

### Skrár:
- `manifest.json` / `manifest-chrome.json` - Viðbótarstillingar
- `content.js` - Aðalskript sem finnur og felur efni
- `styles.css` - CSS fyrir litaða blokka
- `popup.html` - Íslenskt viðmót með víxlum
- `popup.js` - Virkni fyrir popup stjórnborð
- `background.js` / `background-chrome.js` - Bakgrunnskript
- `build.sh` - Sjálfvirkt byggingarskript

### Þróun:
```bash
# Búa til pakka fyrir báða vafra
./build.sh

# Outputs:
# build/dv-content-blocker-firefox.zip (AMO tilbúið)
# build/dv-content-blocker-chrome.zip (Chrome Web Store tilbúið)
```

## Öryggi og persónuvernd

- ✅ **Engin gögn send** - Allt unnið í vafranum þínum
- ✅ **Aðeins dv.is** - Viðbótin hefur aðeins aðgang að www.dv.is
- ✅ **Opinn kóði** - Allur kóði aðgengilegur til skoðunar á GitHub
- ✅ **MIT leyfi** - Frjáls til notkunar og breytinga

## Stuðningur

- **🌐 Vefsíða**: [https://biggihs.github.io/dv-efnisblokkari/](https://biggihs.github.io/dv-efnisblokkari/)
- **🐛 Tilkynna villu**: [GitHub Issues](https://github.com/biggihs/dv-efnisblokkari/issues)
- **📄 Kóði**: [GitHub Repository](https://github.com/biggihs/dv-efnisblokkari)

## Leyfi

MIT License - Sjá [LICENSE](LICENSE) skrá fyrir nánari upplýsingar.

---

**🤖 Búið til að öllu leyti með [Claude Code](https://claude.ai/code)**

**⚠️ Ábyrgðaryfirlýsing**: Þessi viðbót var búin til af gervigreind. Höfundurinn hefur ekki skoðað kóðann og tekur enga ábyrgð á virkni eða öryggi. Notaðu á eigin áhættu og traust.