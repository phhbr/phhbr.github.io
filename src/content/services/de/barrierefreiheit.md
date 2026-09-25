---
key: accessibility
title: Barrierefreiheit (BITV & WCAG)
summary: Barrierefreie Komponenten und Anwendungen, gebaut und getestet nach BITV 2.0 und WCAG, inklusive Tests mit Screenreader und Kontrastmodus.
description: "Barrierefreiheit nach BITV 2.0, WCAG und BFSG: barrierefreie Komponenten und Anwendungen, Tests mit Screenreader und Kontrastmodus, Begleitung der BITV-Abnahme."
order: 2
skills:
  - Umsetzung nach BITV 2.0 und WCAG 2.1 (Stufe AA), für neue Projekte WCAG 2.2
  - Tests mit Screenreadern (JAWS) und im Windows-Kontrastmodus
  - Automatisierte Prüfungen mit axe-core in Unit-Tests, End-to-End-Tests und CI
  - Begleitung formaler BITV-Abnahmetests
  - Barrierefreie Komponenten im Designsystem, damit jede Anwendung darauf barrierefrei startet
---

## Warum es jetzt zählt

Websites und Anwendungen öffentlicher Stellen in Deutschland müssen seit Jahren die BITV 2.0 erfüllen. Seit Juni 2025 weitet das Barrierefreiheitsstärkungsgesetz (BFSG) die Anforderungen auf viele Unternehmen aus, die Produkte und Dienstleistungen online für Verbraucherinnen und Verbraucher anbieten.

Barrierefreiheit am Ende eines Projekts nachzurüsten ist langsam und teuer. Von Anfang an in Komponenten, Tests und Pipelines eingebaut, wird sie Teil der normalen Entwicklungsarbeit.

## Wie ich arbeite

- **Bei den Bausteinen anfangen.** Barrierefreie Komponenten (Fokus-Management, Tastaturbedienung, Rollen und Namen, Kontrast) lösen Probleme einmal statt in jeder Anwendung neu.
- **So testen, wie Menschen die Anwendung wirklich nutzen:** nur mit der Tastatur, mit einem Screenreader wie JAWS und im Windows-Kontrastmodus, nicht nur mit automatisierten Tools.
- **Automatisieren, was sich automatisieren lässt.** axe-core läuft in Unit-Tests, End-to-End-Tests und in der CI-Pipeline, sodass Regressionen den Build scheitern lassen. Diese Website prüft bei jeder Änderung jede Seite in beiden Farbschemata gegen WCAG 2.2 AA.
- **Die formale Abnahme begleiten.** Die Vorbereitung auf einen BITV-Test, das Beheben der Befunde und der erneute Test gehören dazu.

## Wo ich das gemacht habe

Für das Designsystem einer großen deutschen Organisation des öffentlichen Sektors habe ich barrierefreie Web Components gebaut, von 2020 bis 2022 und wieder seit 2025, getestet mit JAWS und im Windows-Kontrastmodus und durch die BITV-Abnahme gebracht. Dazwischen habe ich dieselben Standards in ein unternehmensweites Designsystem eingebracht, das in Angular-, React- und Vue-Anwendungen genutzt wird.
