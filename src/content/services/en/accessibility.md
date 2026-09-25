---
key: accessibility
title: Accessibility (BITV & WCAG)
summary: Accessible components and applications, built and tested to BITV 2.0 and WCAG, including screen reader and high-contrast testing.
description: "Accessibility engineering to BITV 2.0 and WCAG: accessible components and apps, screen reader and high-contrast testing, and support through BITV acceptance."
order: 2
skills:
  - Implementation to BITV 2.0 and WCAG 2.1 (level AA), and WCAG 2.2 for new work
  - Testing with screen readers (JAWS) and Windows high-contrast mode
  - Automated checks with axe-core in unit tests, end-to-end tests and CI
  - Support through formal BITV acceptance testing
  - Accessible design system components, so every application built on them starts accessible
---

## Why it matters now

Public-sector websites and applications in Germany have had to meet BITV 2.0 for years. Since June 2025, the Barrierefreiheitsstärkungsgesetz (BFSG) extends accessibility requirements to many businesses that offer products and services to consumers online.

Retrofitting accessibility at the end of a project is slow and expensive. Built into components, tests and pipelines from the start, it becomes part of normal engineering work.

## How I work

- **Start with the building blocks.** Accessible components (focus handling, keyboard interaction, roles and names, contrast) fix problems once instead of in every application.
- **Test the way people actually use it:** with the keyboard only, with a screen reader such as JAWS, and in Windows high-contrast mode, not just with automated tools.
- **Automate what can be automated.** axe-core runs in unit tests, end-to-end tests and the CI pipeline, so regressions fail the build. This site checks every page against WCAG 2.2 AA in both themes on every change.
- **Accompany the formal acceptance.** Preparing for a BITV test, fixing its findings and re-testing is part of the job.

## Where I've done this

I've built accessible web components for the design system of a large German public-sector organisation, from 2020 to 2022 and again since 2025, tested with JAWS and Windows high-contrast mode and taken through BITV acceptance. In between, I brought the same standards to an enterprise design system used across Angular, React and Vue applications.
