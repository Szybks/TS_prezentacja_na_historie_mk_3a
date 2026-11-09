# Nowe nurty polityczne

**Partie polityczne na ziemiach polskich, 1890–1918**

Jednostronicowa prezentacja historyczna w HTML, CSS i JavaScript. Zawiera autoscroll, animacje budujące się przy przewijaniu, kalendarium, dossier czterech partii, planszę porównawczą i źródła.

**Wersja online:** [szybks.github.io/TS_prezentacja_na_historie_mk_3a](https://szybks.github.io/TS_prezentacja_na_historie_mk_3a/)

**Repozytorium:** [github.com/Szybks/TS_prezentacja_na_historie_mk_3a](https://github.com/Szybks/TS_prezentacja_na_historie_mk_3a)

**Tryb respektujący systemowe ograniczenie animacji:** [szybks.github.io/TS_prezentacja_na_historie_mk_3a/?anim=0](https://szybks.github.io/TS_prezentacja_na_historie_mk_3a/?anim=0)

---

## Jak otworzyć

### Online

Otwórz:

```text
https://szybks.github.io/TS_prezentacja_na_historie_mk_3a/
```

### Najprościej lokalnie

Kliknij dwukrotnie **`index.html`**.

Wszystkie obrazy, fonty i style są zapisane lokalnie, więc prezentacja działa bez internetu. Internet potrzebny jest tylko do otwarcia linków w źródłach.

### Przez lokalny serwer (zalecane)

Na Windowsie kliknij dwukrotnie **`uruchom.cmd`** — uruchomi serwer i otworzy prezentację w przeglądarce (w trybie z wymuszonymi animacjami, `?anim=1`).

Ręcznie:

```powershell
py -m http.server 8000
```

Następnie otwórz `http://localhost:8000/`.

> Prezentacja była testowana również bezpośrednio z pliku `file://` — działa, ale serwer jest wygodniejszy, jeśli chcesz mieć pewność, że przeglądarka nie blokuje lokalnych fontów.

---

## Sterowanie

| Element | Działanie |
|---|---|
| **Autoscroll** | włącza / zatrzymuje automatyczne przewijanie |
| **1×** | zmienia prędkość: 0,5× → 1× → 1,5× → 2× |
| **Pełny ekran** | tryb prezentacji |
| **A** | autoscroll włącz / wyłącz |
| **F** | pełny ekran |
| **Esc** | stop autoscrolla |
| **Kółko / touch** | zatrzymuje autoscroll przy ręcznym przewijaniu |
| **Nawigacja po prawej** | skok do wybranej sekcji |

Autoscroll przewija stronę ze stałą prędkością. Po dojściu do końca zatrzymuje się; przycisk **„Autoscroll od nowa”** w finale wraca na początek i uruchamia go ponownie.

---

## Co jest w środku

- **15 sekcji**: wstęp, kontekst trzech zaborów, cztery nurty, geografia polityczna, kalendarium, cztery dossier partyjne, spory, rok 1905, ugrupowania poza głównym nurtem, bilans, 1918 i finał.
- **Cztery portrety partii**: PPS, endecja/SND, SDKPiL, PSL.
- **Interaktywne animacje** uruchamiane przez `IntersectionObserver`: nagłówki rozbijane na słowa, karty, portrety, kalendarium i tabela.
- **Autorski system wizualny**: typografia Cormorant Garamond / Manrope / IBM Plex Mono, papierowa tekstura, mapa z epoki i barwy partii.
- **Responsywność**: układ dwukolumnowy na komputerze, uproszczony na tablecie i telefonie.

---

## Publikacja na GitHub Pages

Repozytorium jest już opublikowane i podłączone do GitHub Pages:

- **Repo:** https://github.com/Szybks/TS_prezentacja_na_historie_mk_3a
- **Strona:** https://szybks.github.io/TS_prezentacja_na_historie_mk_3a/
- **Animacje:** domyślnie włączone na stronie głównej
- **Tryb ograniczony:** https://szybks.github.io/TS_prezentacja_na_historie_mk_3a/?anim=0
- **Gałąź:** `main`, folder `/ (root)`

### Aktualizacja strony

Po każdej zmianie wystarczy:

```powershell
git add -A
git commit -m "Aktualizacja prezentacji"
git push origin main
```

GitHub Pages przebuduje stronę automatycznie (zwykle kilkanaście–kilkadziesiąt sekund).

Prezentacja jest w pełni statyczna — GitHub Pages nie potrzebuje Pythona ani `uruchom.cmd`. Wystarczy `index.html` i pliki obok.

> **`uruchom.cmd` nie przeszkadza na GitHubie.** To tylko lokalny skrót do serwera na Twoim komputerze. GitHub Pages publikuje `index.html` i pliki statyczne; plik `.cmd` nie jest tam uruchamiany i nie wpływa na działanie strony.

Plik `.nojekyll` jest dodany, więc GitHub Pages nie przetwarza projektu przez Jekyll. Strona ma też `robots.txt` i `noindex`, więc nie powinna pojawiać się w wynikach wyszukiwania.

---

## Personalizacja

### Imię i nazwisko

**Tadeusz Stagraczyński, klasa 3a** (stopka i finał)

```html
Opracowanie: Tadeusz Stagraczyński · klasa 3a
```

oraz w finale:

```html
<p class="final__thanks reveal">Tadeusz Stagraczyński<span>klasa 3a</span></p>
```

### Prędkość autoscrolla

W `js/app.js`:

```js
const auto = {
  active: false,
  speed: 40, // px / sekundę przy 1×
  ...
};
```

Zmień `speed` na np. `50` lub `32`.

### Kolory

W `css/style.css` w bloku `:root` znajdują się główne kolory. Barwy poszczególnych partii ustawiają klasy:

```css
.party--pps  { --accent: var(--red); }
.party--nd   { --accent: var(--blue); }
.party--sdkpil { --accent: #c23a42; }
.party--psl  { --accent: var(--green); }
```

### Animacje a ustawienia systemowe

Animacje są **domyślnie włączone**, także na GitHub Pages i nawet jeśli system ma włączone „ogranicz animacje”. To celowe: prezentacja ma być animowana.

Jeśli chcesz uszanować systemowe ograniczenie animacji, otwórz:

```text
index.html?anim=0
```

lub, przez serwer:

```text
http://localhost:8000/?anim=0
```

Parametr `?anim=0` wyłącza klasę `force-motion`, a strona wraca do standardowego zachowania `prefers-reduced-motion`. Autoscroll działa niezależnie od tego ustawienia.

---

## Struktura

```text
prezentacja-nowe-nurty/
├── index.html
├── README.md
├── uruchom.cmd
├── robots.txt
├── .nojekyll
├── .gitignore
├── .gitattributes
├── css/
│   ├── style.css
│   └── fonts.css
├── js/
│   └── app.js
└── assets/
    ├── fonts/
    └── img/
        ├── mapa-rozbiory.svg
        ├── warszawa-1900.jpg
        ├── skoczylas-1905.jpg
        ├── pilsudski.jpg
        ├── dmowski.jpg
        ├── luksemburg.jpg
        ├── witos.jpg
        ├── daszynski.jpg
        └── stapinski.jpg
```

---

## Źródła i licencje

- **Tekst**: opracowanie własne na podstawie literatury i haseł Wikipedii (PPS, SND, SDKPiL, PSL, PPSD, Stronnictwo Chrześcijańsko-Ludowe, Stronnictwo Polityki Realnej, Bund, rewolucja 1905).
- **Portrety**: Wikimedia Commons, domena publiczna.
- **Mapa**: Halibutt / ElCet, *Rzeczpospolita Rozbiory*, Wikimedia Commons, GFDL / CC BY-SA.
- **Obraz**: Władysław Skoczylas, *Demonstracja uliczna 1905*, Muzeum Narodowe w Warszawie, domena publiczna (via Wikimedia Commons).
- **Warszawa ok. 1900**: Photochrom, Library of Congress / Wikimedia Commons, domena publiczna.
- **Fonty**: Cormorant Garamond, Manrope, IBM Plex Mono — SIL Open Font License.

> Prezentacja ma charakter edukacyjny. Daty i programy partii podano w uproszczeniu; partie zmieniały stanowiska, a granice między nurtami były płynne.

---

## Informacje techniczne

- Brak frameworka i brak etapu budowania — czysty HTML/CSS/JS. Dzięki temu wystarczy otworzyć plik.
- Animacje wejścia: `IntersectionObserver` + CSS transitions.
- Animacja portretów i zdjęcia: `clip-path` na wewnętrznej ramce (celowo, żeby obserwator nie widział elementu o zerowej powierzchni).
- Autoscroll: `requestAnimationFrame` + akumulator pikseli, prędkość w px/s.
- Testowane w Chrome/Edge (Chromium). Powinno działać w aktualnych wersjach Firefoksa i Safari.
