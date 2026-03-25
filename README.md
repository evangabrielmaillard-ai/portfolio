# portfolio-as-a-conversation

> Un portfolio qui répond à la place d'un CV.

**[→ Voir le site en live](https://www.evangabrielmaillard.com)** · [English version below](#english)

---

## Ce que c'est

La plupart des portfolios sont des pages statiques. Celui-ci est une conversation.

Au lieu de lire un CV, le visiteur pose des questions. Le chatbot répond comme un consultant — en reformulant le problème, en identifiant les vrais leviers, en s'appuyant sur des réalisations réelles avec des chiffres.

Construit en **une soirée + une matinée**. Zéro ligne de code écrite manuellement.

---

## Stack

```
index.html      → site complet (HTML + CSS + JS vanilla, fichier unique)
api/chat.js     → Vercel Serverless Function (proxy API Anthropic)
vercel.json     → config déploiement
```

| Composant | Technologie |
|-----------|------------|
| Frontend | HTML / CSS / JS vanilla — aucun framework |
| IA | API Anthropic (Claude Haiku) |
| Déploiement | GitHub → Vercel (CI/CD automatique) |
| Coût mensuel | ~0–5€ selon le trafic |

---

## Fonctionnalités

**Chatbot dual-mode**
- Mode CV : répond sur le parcours, les projets, les compétences
- Mode consultant : reformule le problème → identifie la cause réelle → 2-3 leviers → ancrage terrain chiffré → limite honnête → question utile

**Panneaux dépliables** déclenchés par le chat
- Prospection B2B (chiffres réels Lemlist 2025 — barres animées)
- Pipeline de devis automatisé Make + GPT-4
- Scripts Python métier (19 outils), Automatisations Make (5 scénarios)
- Générateur d'images IA (gpt-image-1, 176 refs, 21h économisées)
- Carnetto SaaS, parcours pro, vue synthétique, plan 90 jours

**UX progressive**
- Questions dynamiques sous chaque réponse (jamais les mêmes)
- Menu persistant qui s'enrichit au fil des panneaux consultés
- Mode sombre / clair, bilingue FR / EN
- Reconnaissance vocale (Web Speech API)
- Mode recruteur : détecte si le visiteur recrute et adapte le discours
- CTA LinkedIn après 4 échanges

**Sécurité**
- Clé API et system prompt côté serveur uniquement (variables Vercel)
- Rate limiting 20 messages/heure par IP — implémenté côté serveur dans `api/chat.js`
- Validation stricte du payload (taille, type, longueur de chaque message)
- Timeout explicite sur l'appel Anthropic (15s)
- Messages d'erreur neutres côté client, détails en logs serveur uniquement
- Anti-injection prompt dans le system prompt

---

## Déployer votre propre version

### 1. Cloner le repo

```bash
git clone https://github.com/evangabrielmaillard-ai/portfolio-as-a-conversation.git
cd portfolio-as-a-conversation
```

### 2. Déployer sur Vercel

Connecter le repo GitHub à [vercel.com](https://vercel.com) — déploiement automatique en 3 clics.

### 3. Ajouter les variables d'environnement

Dans Vercel → Settings → Environment Variables :

```
ANTHROPIC_API_KEY = sk-ant-...
SYSTEM_PROMPT = (votre system prompt complet)
```

Voir `.env.example` pour le format attendu. Redéployer après ajout.

---

## Personnaliser

Tout le contenu est dans `index.html` :

| Élément | Où le modifier |
|---------|--------------|
| Panneaux de contenu | `buildProjects()`, `buildCareer()`, etc. |
| Suggestions d'accueil | `<button class="chip">` tags dans le HTML |
| Punchlines | `const TAGLINES` array |
| Questions de relance | `FOLLOWUP_POOLS` object |

Le system prompt (persona, réalisations, triggers de panneaux) est géré via la variable d'environnement `SYSTEM_PROMPT` sur Vercel — pas dans le code source.

---

## Choix techniques & limites connues

**Pourquoi vanilla JS / fichier unique**
Choix délibéré pour un projet personnel déployé seul. Pas de build step, pas de dépendances, déploiement immédiat. La contrepartie : le fichier grossit avec le contenu (~80KB). Au-delà, il faudrait séparer CSS et JS.

**Pourquoi Vercel Serverless**
Zéro infrastructure à gérer. La fonction `/api/chat` est le seul composant serveur — elle gère le rate limit, la validation et le proxy Anthropic. Limite connue : le rate limit est en mémoire par instance, pas partagé entre plusieurs instances (acceptable pour un portfolio).

**Pourquoi le system prompt en variable d'environnement**
Le system prompt contient les réalisations, la méthode, les triggers de panneaux — c'est le "cerveau" du portfolio. Le sortir du code source évite qu'il soit visible dans le repo public.

**Ce qui n'a pas été industrialisé volontairement**
- Pas de base de données (inutile pour ce cas d'usage)
- Pas de tests automatisés
- Pas de monitoring avancé (Vercel Analytics suffit)
- Le bilingue FR/EN est une UX feature, pas une architecture éditoriale distincte

**Ce que je ferais en V2**
- Séparer CSS et JS en fichiers dédiés quand le projet grossit encore
- Ajouter un vrai store de rate limit (Redis/KV) si le trafic augmente
- Streaming des réponses pour une UX plus fluide

---

## Licence

MIT — libre de réutiliser, adapter, forker.

---
---

<a name="english"></a>

# portfolio-as-a-conversation

> A portfolio that answers instead of a CV.

**[→ See the live site](https://www.evangabrielmaillard.com)**

---

## What it is

Most portfolios are static pages. This one is a conversation.

Instead of reading a CV, the visitor asks questions. The chatbot responds like a consultant — reformulating the problem, identifying real levers, grounding every answer in actual results with numbers.

Built in **one evening + one morning**. Zero lines of code written manually.

---

## Stack

```
index.html      → full site (HTML + CSS + vanilla JS, single file)
api/chat.js     → Vercel Serverless Function (Anthropic API proxy)
vercel.json     → deployment config
```

| Component | Technology |
|-----------|-----------|
| Frontend | HTML / CSS / vanilla JS — no framework |
| AI | Anthropic API (Claude Haiku) |
| Deployment | GitHub → Vercel (automatic CI/CD) |
| Monthly cost | ~€0–5 depending on traffic |

---

## Features

**Dual-mode chatbot**
- CV mode: answers about career, projects, skills
- Consultant mode: reformulates the problem → identifies the real cause → 2-3 levers → grounded in real data → honest limitation → useful follow-up question

**Expandable panels** triggered by chat
- B2B prospecting (real 2025 Lemlist data — animated bars)
- Automated quote pipeline Make + GPT-4
- Python business tools (19 scripts), Make automations (5 scenarios)
- AI image generator (gpt-image-1, 176 refs, 21h saved)
- Carnetto SaaS, career path, quick summary, 90-day plan

**Progressive UX**
- Dynamic follow-up questions under each response (never the same)
- Persistent nav that grows as panels are explored
- Dark / light mode, bilingual FR / EN
- Voice input (Web Speech API)
- Recruiter mode: detects if the visitor is hiring and adapts the pitch
- LinkedIn CTA after 4 exchanges

**Security**
- API key and system prompt server-side only (Vercel env variables)
- Rate limiting: 20 messages/hour per IP — implemented server-side in `api/chat.js`
- Strict payload validation (size, type, length per message)
- Explicit timeout on Anthropic call (15s)
- Neutral error messages client-side, details in server logs only
- Prompt injection defense in system prompt

---

## Deploy your own version

### 1. Clone the repo

```bash
git clone https://github.com/evangabrielmaillard-ai/portfolio-as-a-conversation.git
cd portfolio-as-a-conversation
```

### 2. Deploy on Vercel

Connect the GitHub repo to [vercel.com](https://vercel.com) — automatic deployment in 3 clicks.

### 3. Add environment variables

In Vercel → Settings → Environment Variables:

```
ANTHROPIC_API_KEY = sk-ant-...
SYSTEM_PROMPT = (your full system prompt)
```

See `.env.example` for the expected format. Redeploy after adding.

---

## Technical trade-offs & known limitations

**Why vanilla JS / single file**
Deliberate choice for a solo personal project. No build step, no dependencies, immediate deployment. Trade-off: the file grows with content (~80KB). Beyond that, separating CSS and JS would make sense.

**Why Vercel Serverless**
Zero infrastructure management. The `/api/chat` function is the only server component — it handles rate limiting, validation and the Anthropic proxy. Known limitation: rate limiting is in-memory per instance, not shared across instances (acceptable for a portfolio).

**Why system prompt as environment variable**
The system prompt contains achievements, method, and panel triggers — it's the portfolio's "brain". Keeping it out of source code prevents it from being visible in the public repo.

**What was intentionally not industrialized**
- No database (unnecessary for this use case)
- No automated tests
- No advanced monitoring (Vercel Analytics is sufficient)
- FR/EN bilingual is a UX feature, not a distinct editorial architecture

**What I'd do in V2**
- Separate CSS and JS into dedicated files as the project grows further
- Add a proper rate limit store (Redis/KV) if traffic increases
- Stream responses for smoother UX

---

## License

MIT — free to reuse, adapt, fork.

---

*Built with [Claude](https://claude.ai) · Deployed on [Vercel](https://vercel.com)*
