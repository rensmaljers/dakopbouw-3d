# Controleverslag — 24 september 2026

Eindversie: wijzigingen geïntegreerd in de oorspronkelijke GitHub-pagina,
met behoud van vormgeving, renderer, woning, kaart, zon en materiaalbediening.
Getest voorafgaand aan publicatie, op basis van oorspronkelijke commit b36becd.

## Geslaagd

- `node tests/geometry.cjs`: maatkettingen, drie kamers, positieve vlakken,
  wasruimtedieptes 1,200 / 1,921 / 2,200 / 2,800 m, constante overloopdiepte,
  meeschuivende trap/dwarswand, bereikbare deuren zonder wanddoorsnijding,
  dakraamgrenzen binnen de dakvlakken.
- `node tests/browser.cjs`: oorspronkelijke titel en zeven materiaalkeuzes,
  vier camerastanden, alle laagknoppen, kaart, zonnestand/tijd, materiaalmarkering,
  wasruimtevarianten, deur verwijderen/herstellen, bovenaanzicht, meubels,
  constructieschema en mobiele weergave. Geen JavaScript-fouten.
- Geen ongeldige geometrie; herhaald vergroten/verkleinen geeft geen groei
  van het aantal geladen geometrieën.
- Chrome/Playwright: 1440×1000 en 390×844. De lokale Codex-preview is ververst
  en toont de oorspronkelijke GitHub-vormgeving met de nieuwe maatgegevens.
- Visuele controle van buitenaanzicht en interieur. Schermafbeeldingen:
  `test-results/original-outside.png`, `original-inside.png`,
  `original-plan.png` en `original-mobile.png`.
- JavaScript-syntaxcontrole en `git diff --check` geslaagd.

Dit verifieert de gekozen broninterpretatie. Tegenstrijdige tekeningmaten
zijn niet daarmee opgelost; zie MAATVOERING.md. Geen constructieberekening,
NEN 2580-meting of trapuitvoeringstoets. Safari/fysieke mobiele toestellen
zijn niet afzonderlijk getest. Bestaande eerste verdieping, omgeving,
lichtplan en zonnepanelen blijven oorspronkelijke indicatieve onderdelen.
