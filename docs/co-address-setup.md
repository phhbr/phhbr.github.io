# Setting up a c/o business address for the Impressum

Goal: get `Greifswalder Straße 4, 90425 Nürnberg` — a private residence — out of a publicly indexed Impressum, without creating an Abmahnung risk.

> **Not legal advice.** The research below is from eRecht24 (reviewed by RA Sören Siebert, last updated 2025-12-15 / 2025-02-27) and cites BGH and OLG rulings. Have a Rechtsanwalt or the IHK Nürnberg für Mittelfranken confirm before you publish.

---

## Correction to the earlier recommendation

The migration plan originally suggested *"a virtual business address (~10–20 €/month, standard practice for German freelancers)."* **That advice was wrong and would have created legal risk.** The research says the opposite:

> "Virtuelle Büros sind hingegen **nicht ladungsfähig**, da dort nicht die Möglichkeit besteht, Sie tatsächlich anzutreffen. Dies ist jedoch Voraussetzung einer ladungsfähigen Adresse (BGH Urteil v. 07.07.2023 – V ZR 210/22)."

The cheap mail-forwarding offers marketed to German freelancers as "Impressum-sichere Geschäftsadresse" are exactly the `Briefkastenadressen` that fail the test. Renting one and publishing it would swap a privacy problem for an Abmahnung problem — plus a Bußgeld of up to €50,000 for a defective Impressum.

**The option that actually works is a coworking space.**

---

## What the law requires

§ 5 Abs. 1 DDG (Digitale-Dienste-Gesetz, formerly TMG) requires *"den Namen und die Anschrift, unter der sie niedergelassen sind"* — and that address must be **ladungsfähig**: legal documents must be servable there, and **you must actually be findable at it**.

For a self-employed natural person, the ZPO default is your **Wohnort**. Anything else has to independently satisfy the ladungsfähig test.

## What qualifies, and what doesn't

| Option | Ladungsfähig? | Why |
|---|---|---|
| Home address | ✅ Yes | The ZPO default for a natural person. What you have today |
| **Coworking space** (room, desk, or even just a flex desk) | ✅ **Yes** | *"Co-Working-Spaces erfüllen ebenfalls die Voraussetzungen … da Sie dort tatsächlich angetroffen werden können. Es kommt dabei nicht darauf an, ob Sie einen Raum, eine Fläche oder nur einen Schreibtisch … anmieten."* |
| Rented office | ✅ Yes | Needs a real Mietvertrag, must serve as your Geschäftsstelle, and your name must be at the main entrance |
| Virtual office / mail forwarding | ❌ **No** | BGH V ZR 210/22. You aren't there. Staff accepting or forwarding post is explicitly *not* enough |
| Briefkastenadresse | ❌ No | Same reasoning — no business activity, nobody to be found |
| Postfach (PO box) | ❌ No | Delivery is only indirect and delayed |
| Employer's / client's office | ⚠️ Conditional | Needs post acceptance, genuine reachability, **and the employer's consent** |

### The one narrow exception

BGH V ZR 210/22 does permit an **Empfangsvollmacht** — an explicitly granted power of attorney authorising a named person to accept *rechtsverbindliche Erklärungen* on your behalf. This is how a law firm's address works as a c/o.

This is a real option but a heavier one: it means a lawyer (or comparable professional) formally acting as your Zustellungsbevollmächtigter, not a €15/month mailbox service dressed up as one. If a provider offers you an "Empfangsvollmacht" as an add-on, read the contract extremely carefully — it must grant authority to receive legally binding declarations, not just to sign for parcels.

### On the `c/o` prefix itself

A `c/o` addition is permitted (OLG Hamm, 07.05.2015, Az. 27 W 51/15) **as long as it aids findability rather than obscuring it**: *"Wichtig ist, dass der c/o-Zusatz nicht die Zustellungsmöglichkeiten verschleiert oder vortäuscht."*

So `c/o` is not itself the solution — it's just formatting. The question is always whether the underlying address is ladungsfähig. A `c/o` on a coworking space is fine; a `c/o` on a mailbox service is still a mailbox service.

---

## Recommended path: coworking membership in Nürnberg

This is the only option that is simultaneously legally solid, privacy-improving, and genuinely useful to you as a freelancer. A flex-desk or part-time membership is sufficient — you do not need a private office.

It also carries a side benefit worth more than the address: coworking spaces in a city like Nürnberg are where local agencies and startups are, which is a reasonable inbound channel now that you've deleted LinkedIn.

### Step 1 — Shortlist spaces

Search for `coworking nürnberg`, and cross-check against the **IHK Nürnberg für Mittelfranken** (they maintain founder resources and usually know the local spaces). Filter for ones that explicitly advertise a *Geschäftsadresse* / *Firmenadresse* option — not every space offers it, and some that do offer only the non-compliant mail-forwarding variant.

Check the realistic commute from Greifswalder Straße. You need to be able to genuinely turn up there, which is both the legal requirement and the practical point.

### Step 2 — Vet each provider

Ask these directly, and get the answers **in writing**:

1. Do I get a **Vertrag** (Mietvertrag or membership agreement) naming me personally, with the address on it?
2. Am I permitted to use this address as my **Geschäftsadresse im Impressum** and on **invoices**?
3. Will my name appear **at the building entrance / on the letterbox / on a directory**? (Required for the address to be ladungsfähig.)
4. Can **Zustellungen** — including court documents and Einschreiben — be delivered and accepted here?
5. Do I have **actual access** to the space, and can I be found there during business hours?
6. Can I register this address with the **Finanzamt** as my Betriebsstätte?
7. What happens to the address if I pause or cancel the membership?

🚩 **Red flags:** the address is offered without any desk or access; they describe it as "virtuell"; the entire service is post scanning and forwarding; your name goes nowhere physical; the price is suspiciously low (€10–30/month for an address alone is the mail-forwarding model).

### Step 3 — Sign up and verify physically

Before publishing the address anywhere, go there and confirm your name is actually visible at the entrance or letterbox. Then send yourself an **Einschreiben mit Rückschein** to the new address and confirm it arrives and is signed for. That is your evidence that delivery works.

### Step 4 — Register with the Finanzamt

As a software engineer you're likely a **Freiberufler** under § 18 EStG (no Gewerbeanmeldung needed), so this is a notification to your Finanzamt rather than a trade registration. Confirm with your Steuerberater — they should also tell you whether the membership is fully deductible as a Betriebsausgabe, which it normally is.

### Step 5 — Roll the address out

Update in this order, so nothing points at a half-migrated state:

- [ ] Impressum (`/legal`) — this migration
- [ ] Invoice template and any contract templates
- [ ] Finanzamt / Steuerberater
- [ ] Business bank account
- [ ] Domain registrar contact data for `bruchner.dev` and `phhbr.de` (check whether WHOIS privacy is active — if not, your home address may be exposed there too)
- [ ] Any freelancer platform profiles
- [ ] GitHub profile location, if it shows anything specific

### Step 6 — Consider the phone number separately

The address fix doesn't solve the phone number. `+49 (0) 911 47 88 56 70` appears in both `legal.md` and the `leaving-linkedin` post.

A telephone number **is** required in the Impressum, so it has to stay there. But it does not need to be your private line — a VoIP business number (Sipgate, Placetel, or similar) forwards to your mobile and is separable from your private identity. And it should be removed from the blog post regardless; there's no reason for a contact detail to be duplicated into archived content.

---

## Impressum formatting once you have it

```
Philipp Bruchner
c/o <Name des Coworking Space>
<Straße> <Hausnummer>
<PLZ> Nürnberg

Telefon: +49 ...
E-Mail: hello@bruchner.dev
```

Your name goes **first**, then `c/o`, then the host. Keep `/legal` and `/privacy` as two separate pages — mixing Impressum and Datenschutzerklärung is itself a flagged mistake.

### Two other Impressum findings from this research

Both affect the current site and are now folded into the migration:

1. **The e-mail address must appear in plain text.** *"Die E-Mail-Adresse muss im Klartext geschrieben werden. Ein Mailto-Link ist nicht ausreichend."* So on `/legal`, `hello@bruchner.dev` must be rendered as readable text — a bare `mailto:` link does not satisfy § 5 DDG. (Elsewhere on the site a `mailto:` link is fine.) This means the address will be scrapeable no matter what; plan for good spam filtering rather than obfuscation.

2. **A telephone number is a mandatory Impressum field**, alongside the e-mail address.

---

## Cost and decision summary

| Option | Rough cost | Legal risk | Privacy gain | Verdict |
|---|---|---|---|---|
| Keep home address | €0 | None | None | Status quo |
| Virtual office / mailbox | €10–30/mo | **High** — fails BGH test | High | ❌ Don't |
| **Coworking flex membership** | Market rate, varies | **None** | High | ✅ **Recommended** |
| Empfangsvollmacht via a lawyer | Higher | Low, if properly drafted | High | Viable, heavier |
| Dedicated rented office | Highest | None | High | Overkill for one person |

---

## Open questions for you

1. Do you already use, or want to use, a coworking space in Nürnberg? If yes, the address may be a cheap add-on to something you're paying for anyway.
2. Is `+49 (0) 911 47 88 56 70` a private line or already a business number?
3. Are you registered as a **Freiberufler** or did you do a **Gewerbeanmeldung**? It changes who needs notifying in step 4.
4. Do you have a Steuerberater? They'll have opinions on step 4 and on deductibility.

Until the new address is live, `/legal` keeps the current address — an incorrect Impressum is a worse problem than a private one.
