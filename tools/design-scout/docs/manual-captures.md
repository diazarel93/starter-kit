# Captures manuelles — sites bloqués

Sites impossibles à capturer automatiquement (Cloudflare Turnstile / bot detection).

**Procédure :** ouvrir le site dans un vrai navigateur → screenshot 1440×900 → sauvegarder en `captures/visual-analysis/<slug>/00-main-hero.jpg`

---

## Cloudflare Turnstile (captcha humain)

- [ ] openai.com → `openai-com/`
- [ ] letterboxd.com → `letterboxd-com/`
- [ ] aesop.com → `aesop-com/`
- [ ] blinkist.com → `blinkist-com/`
- [ ] crunchyroll.com → `crunchyroll-com/`
- [ ] midjourney.com → `midjourney-com/`
- [ ] morningbrew.com → `morningbrew-com/`
- [ ] arts.ac.uk/csm → `arts-ac-uk-colleges-central-saint-martins/`

## Bot detection / accès restreint

- [ ] bluebottlecoffee.com → `bluebottlecoffee-com/` (Cloudflare bloqué)
- [ ] drjart.com → `drjart-com/` (Access Denied)
- [ ] squaremilelondon.com → `squaremilelondon-com/` (Access Denied, mauvaise URL)
- [ ] sulwhasoo.com → `sulwhasoo-com/` (403 Forbidden)
- [ ] anthropologie.com → `anthropologie-com/`
- [ ] cartier.com → `cartier-com/`
- [ ] chrome-hearts.com → `chrome-hearts-com/`
- [ ] fuckingawesome.com → `fuckingawesome-com/`
- [ ] gucci.com → `gucci-com/`
- [ ] helveticafilm.com → `helveticafilm-com/`
- [ ] hermès.com → `hermes-com/`
- [ ] loropiana.com → `loropiana-com/`
- [ ] mclaren.com → `mclaren-com/`
- [ ] muji.com → `muji-com/`
- [ ] neon.games → `neon-games/`
- [ ] ra.co → `ra-co/`
- [ ] rickowens.eu → `rickowens-com/`
- [ ] roughtrade.com → `roughtrade-com/`
- [ ] sixsenses.com → `sixsenses-com/`
- [ ] supremenewyork.com → `supremenewyork-com/`
- [ ] tesla.com → `tesla-com/`

## Popup non tué (recapturer — `node scripts/visual-analyzer.mjs <url>`)

- [x] shiseido.com → `shiseido-com/` ✅ corrigé
- [x] innisfree.com → `innisfree-com/` ✅ corrigé
- [ ] bangbangforever.com → `bangbangforever-com/` (age gate)
- [ ] rivian.com → `rivian-com/` (cookie banner)
- [ ] tatcha.com → `tatcha-com/` (newsletter + cookie) — recapture interrompue
- [ ] character.ai → `character-ai/` (GDPR consent) — recapture interrompue
- [ ] finalist.nl → `finalist-nl/` (cookie banner) — recapture interrompue
- [ ] laneige.com → `us-laneige-com/` (side panel promo) — recapture interrompue
- [ ] timwendelboe.no → `timwendelboe-no/` (cookie consent Shopify) — recapture interrompue
- [ ] harrys.com → `gb-harrys-com-en/` (Cookiebot) — recapture interrompue
- [ ] freehandhotels.com → `freehandhotels-com/` (promo modal) — recapture interrompue
- [ ] fentybeauty.com → `fentybeauty-com/` (newsletter 15% off) — recapture interrompue
- [ ] dezeen.com → `dezeen-com/` — recapture interrompue
- [ ] glossier.com → `glossier-com/` — recapture interrompue
- [ ] lemonde.fr → `lemonde-fr/` — recapture interrompue
- [ ] mk2.com → `mk2-com/` — recapture interrompue
- [ ] pitchfork.com → `pitchfork-com/` — recapture interrompue
- [ ] narscosmetics.com → `narscosmetics-com/` — recapture interrompue
- [ ] spiegel.de → `spiegel-de/` — recapture interrompue
- [ ] theatlantic.com → `theatlantic-com/` — recapture interrompue
- [ ] welovegreen.fr → `welovegreen-fr/` — recapture interrompue
- [ ] pichon-baron.com → `pichonbaron-com/` — recapture interrompue
- [ ] patagonia.com → `patagonia-com/` (server error) — recapture interrompue
- [ ] glastonburyfestivals.co.uk → `glastonbury-uk/` (mauvaise URL corrigée) — recapture interrompue

## Mauvaise page / erreur serveur

- [ ] walesbonner.com → `walesbonner-com/` (atterri sur page vide, recapturer homepage)
- [ ] thenomadhotel.com → `thenomadhotel-com/` (page erreur Hilton, recapturer)
- [ ] proudmarycoffee.com → `proudmarycoffee-com/` (atterri sur page subscriptions)
- [ ] charlottetilbury.com → `charlottetilbury-com/` (atterri sur page promo, pas homepage)
- [ ] 104.fr/kourtrajme → `104-fr-artiste-l-ecole-kourtrajme-biographie-html/` (atterri sur sous-page biographie)

## Vides (capture plantée)

- [ ] superhuman.com → `superhuman-com/`
- [ ] berlinale.de → `www-berlinale-de/`

## Vidéo hero (frame noire — juste le hero à refaire)

- [ ] imaginaryforces.com → `imaginaryforces-com/` ← reste des captures OK
