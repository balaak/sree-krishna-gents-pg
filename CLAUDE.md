# Sree Krishna Gents PG — Project CLAUDE.md

## 1. What This Is

AI-powered lead machine for Sree Krishna Gents PG, Vyttila, Ernakulam. CRO-first landing page + AI chatbot designed to fill PG rooms and optimise Google Ads conversion. Built by 91pixels. First case study for the "PG Lead Machine" productized service.

---

## 2. Live URLs

| Environment | URL |
|---|---|
| **Production** | https://balaak.github.io/sree-krishna-gents-pg/ |
| **GitHub Repo** | https://github.com/balaak/sree-krishna-gents-pg |
| **Google Maps** | https://maps.google.com/?q=Sree+krishna+gents+pg+vyttila |

---

## 3. Stack

- **Frontend:** Plain HTML / CSS / JS — no framework
- **Hosting:** GitHub Pages (auto-deploy via GitHub Actions on push to `main`)
- **Chatbot (Phase 1):** Rule-based JS widget, no backend
- **Chatbot (Phase 3):** Claude Haiku API via Cloudflare Worker proxy
- **Payments (Phase 4):** Razorpay
- **Analytics (Phase 5):** Google Analytics 4

---

## 4. Source Code

- **Local path:** `/Users/balak/Documents/dev/Sree Krishna Gents PG/`
- **GitHub repo:** https://github.com/balaak/sree-krishna-gents-pg
- **Branch:** main

---

## 5. Deploy Command

Push to main — GitHub Actions deploys automatically.

```bash
git add .
git commit -m "your message"
git push
```

No manual deploy step needed. GitHub Actions workflow: `.github/workflows/deploy.yml`

---

## 6. Local Preview

```bash
cd "/Users/balak/Documents/dev/Sree Krishna Gents PG"
python3 -m http.server 8080
```
→ http://localhost:8080

---

## 7. Client Contact

- **Business:** Sree Krishna Gents PG
- **Phone:** 094471 05351
- **WhatsApp:** Same number (client to set up WhatsApp Business — it's free)
- **Address:** VRWA 41, 52/2761, Om Muruga, Lane no.9, Maplachery Rd, Vyttila, Ernakulam 682019

---

## 8. Brand

| Token | Value |
|---|---|
| Primary (saffron) | `#F59E0B` |
| Dark background | `#0B1629` |
| Teal accent | `#0D9488` |
| Call CTA green | `#10B981` |
| WhatsApp green | `#25D366` |
| Text primary | `#1A2332` |
| Font | Inter (variable) |
| Tone | Warm, trustworthy, transparent |

---

## 9. GitHub Issues — Phase Structure

| Phase | Milestone | Focus |
|---|---|---|
| 0 | Foundation | Photos, favicon, CLAUDE.md |
| 1 | Core Website | Gallery, self-hosted fonts, reviews CTA, Lighthouse 90+ |
| 2 | Lead Capture | Form validation, email backup, confirmation screen |
| 3 | AI Chatbot | Claude Haiku via CF Worker, lead storage in Airtable |
| 4 | Booking & Payments | Razorpay deposit, availability calendar |
| 5 | Analytics & Ads | GA4, Google Ads wiring, SEO schema, review velocity |
| 6 | Product Template | Abstract into reusable PG Lead Machine for 91pixels |

Track all tasks: https://github.com/balaak/sree-krishna-gents-pg/issues

---

## 10. Key Business Context (from Phase 1 Diagnostic)

- Monthly rent: ₹6,500 · Daily: ₹400 · Deposit: ₹7,500
- Google rating: 4.6★ (49 reviews) — highest locally, low volume
- #1 negative signal: strict rule enforcement / owner attitude (Vignesh Ganesan review, 16 helpful)
- Primary USP: Peaceful atmosphere (17 review mentions)
- Key competitor: Sopanam Gents PG — 246 reviews (5× volume gap)
- Review target: 100 reviews to close Maps visibility gap

---

## 11. Claude's Rules (Self-Enforced)

- Never push or deploy without Bala's explicit approval (exception: this repo auto-deploys on push — Bala to confirm push before it happens)
- Blueprint before build — show plan, get approval, execute
- Ben reviews any security-sensitive code (Razorpay, API keys, CF Worker)
- All secrets in environment variables — never in code or CLAUDE.md
- Phase 6 abstraction: do not over-engineer Phase 1–5 for reusability — build for SKGPG first, abstract after it works

---

## 12. Pending — Bala's Action Items

- [ ] Upload client photos to `assets/images/` (rename: room-main.jpg, room-2.jpg, building.jpg)
- [ ] Client to set up WhatsApp Business (free) and confirm number
- [ ] Client to confirm Google Ads account access for 91pixels
- [ ] Client to decide on custom domain (sreekrishnapg.com or .in ~₹700–1,500/year)
- [ ] Add website URL to Google Business Profile once live URL confirmed

---

## 13. Remaining Roadmap

See GitHub Issues: https://github.com/balaak/sree-krishna-gents-pg/issues

Current status: Phase 0 in progress, Phase 1 deployed at GitHub Pages.
