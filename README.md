# Dakopbouw Van Kleffenslaan 187 — 3D-model

Het oorspronkelijke GitHub-project, met de opbouw aangepast aan BE-1 t/m BE-4.
De bestaande vormgeving, volledige woning, kaart, camerastanden, zonnestand,
materialen, zonnepanelen, lichtplan en weergave van de eerste verdieping blijven
behouden. Alleen de opbouwgeometrie en bijbehorende maat-/ruimtegegevens zijn
vervangen; de wasruimte heeft een extra instelling gekregen.

## Openen

Open `index.html`, of start `npm start` en ga naar http://localhost:4173.
Geen build of externe CDN nodig. GitHub Pages gebruikt dezelfde bestanden.
De publicatie op GitHub Pages volgt de wijzigingen op de hoofdbranch.

## Gewijzigd

- Drie afgesloten kamers, wasruimte en overloop volgens de gekozen BE-1-ketting.
- Draaiende trap in plaats van de eerdere spiltrap; trapdetail blijft schematisch.
- Hoogtes en dakhelling volgens BE-2, vier Velux GPL SK06 met echte dakopeningen.
- Dakribben volgens BE-3/4 als optioneel principebeeld.
- Centrale maten en bronnotities in `src/config.js`.
- `src/permit-model.js` voegt de vergunningsgeometrie toe aan de bestaande scene,
  renderer, materialen en bediening. De bestaande Three.js-bundel blijft in index.html.

**Binnenkijken** toont de nieuwe indeling. Verder naar beneden in het bestaande
paneel staan **Bovenaanzicht**, de ruimtematen en **Wasruimte aanpassen**.
De schuifregelaar verplaatst overloop, trap en rechter dwarswand mee, zodat de
kamers bereikbaar blijven. Dit is een ontwerpvariant, geen constructief
beoordeelde wijziging. **Tekening herstellen** herstelt diepte en deurblad.

Alle bouwmaten staan in meter in de configuratie. De wasruimtediepte is
`plan.laundryDepth`. x loopt van buurzijde naar vrije zijgevel; z van voorgevel
naar achtergevel. De integratie zet deze assen om naar het oorspronkelijke model.

## Onzekerheden

BE-1 heeft tegenstrijdige breedtekettingen; BE-2 heeft niet-aansluitende
hoogtematen. De gekozen interpretaties en geschatte raam-/deurposities zijn
zichtbaar met ≈ en beschreven in `docs/MAATVOERING.md`.
De oude globale woonoppervlakteclaims zijn vervangen door vloervlakken en de
aparte originele BE-1-labels; dit is geen NEN 2580-meting.

Bestaande woning, eerste verdieping, omgeving, zonnepanelen en lichtplan blijven
indicatief zoals in de oorspronkelijke versie. De panelen zijn passend binnen
het afgeleide vlakke dak geplaatst; BE-1 geeft geen nieuwe paneelindeling.

## Controle

`npm test` voert de maat- en indelingstests zonder extra dependencies uit.
De browsercontrole staat in `tests/browser.cjs` en gebruikt Playwright.
Installeer desgewenst met `npm install --no-save playwright` en
`npx playwright install chromium`, start de preview en voer
`node tests/browser.cjs` uit. `PLAYWRIGHT_MODULE` en `BROWSER_EXECUTABLE` kunnen
naar bestaande lokale installaties wijzen. Resultaten: `docs/TESTRESULTATEN.md`.

Kaart © OpenStreetMap-bijdragers, ODbL. Three.js: MIT, licentie in de bestaande
bundel. Aan dit ruimtelijke model kunnen geen uitvoeringsmaten worden ontleend
zonder bevestiging van de gemarkeerde interpretaties.
