# portfolio-as-a-conversation

> Un portfolio qui répond à la place d'un CV.

**[→ Voir le site en live](https://portfolio-evangabrielmaillard-ais-projects.vercel.app)** · [English version below](#english)

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
- Pipeline de devis automatisé Make + GPT
- Carnetto, Feedcasse, parcours pro, vue synthétique
- "Comment ce site a été fait"

**UX progressive**
- Questions dynamiques sous chaque réponse (jamais les mêmes)
- Menu persistant qui s'enrichit au fil des panneaux consultés
- Mode sombre / clair
- Reconnaissance vocale (Web Speech API)
- Mode recruteur : détecte si le visiteur recrute et adapte le discours
- CTA LinkedIn après 4 échanges
- Bilingue FR / EN

**Sécurité**
- Clé API Anthropic côté serveur uniquement (Vercel Function)
- Rate limiting 20 messages/heure par IP
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

### 3. Ajouter la clé API

Dans Vercel → Settings → Environment Variables :

```
ANTHROPIC_API_KEY = sk-ant-...
```

Redéployer. C'est tout.

---

## Personnaliser

Tout le contenu est dans `index.html` :

| Élément | Où le modifier |
|---------|---------------|
| Profil & réalisations | `const SYSTEM` (ligne ~400) |
| Panneaux de contenu | Fonctions `buildProjects()`, `buildCareer()`, etc. |
| Suggestions d'accueil | Balises `<button class="chip">` dans le HTML |
| Punchlines | Tableau `const TAGLINES` |
| Questions de relance | Objet `FOLLOWUP_POOLS` |

---

## Ce que ce projet démontre

Qu'on n'a pas besoin de savoir coder pour construire quelque chose qui tourne en production.

Il faut être méthodique, itérer, et ne jamais rien lâcher.

La compétence, c'est pas le code. C'est savoir quoi demander, comment le cadrer, et quand pousser.

---

## Licence

MIT — libre de réutiliser, adapter, forker.

---
---

<a name="english"></a>

# portfolio-as-a-conversation

> A portfolio that answers instead of a CV.

**[→ See the live site](https://portfolio-evangabrielmaillard-ais-projects.vercel.app)**

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
- Automated quote pipeline Make + GPT
- Carnetto, Feedcasse, career path, quick summary
- "How this site was built"

**Progressive UX**
- Dynamic follow-up questions under each response (never the same)
- Persistent nav that grows as panels are explored
- Dark / light mode toggle
- Voice input (Web Speech API)
- Recruiter mode: detects if the visitor is hiring and adapts the pitch
- LinkedIn CTA after 4 exchanges
- Bilingual FR / EN

**Security**
- Anthropic API key server-side only (Vercel Function)
- Rate limiting: 20 messages/hour per IP
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

### 3. Add your API key

In Vercel → Settings → Environment Variables:

```
ANTHROPIC_API_KEY = sk-ant-...
```

Redeploy. That's it.

---

## Customizing

Everything is in `index.html`:

| Element | Where to edit |
|---------|--------------|
| Profile & achievements | `const SYSTEM` (~line 400) |
| Content panels | `buildProjects()`, `buildCareer()`, etc. |
| Landing suggestions | `<button class="chip">` tags in HTML |
| Punchlines | `const TAGLINES` array |
| Follow-up questions | `FOLLOWUP_POOLS` object |

---

## What this project demonstrates

You don't need to know how to code to build something that runs in production.

You need to be methodical, iterate, and never give up.

The skill isn't the code. It's knowing what to ask, how to frame it, and when to push.

---

## License

MIT — free to reuse, adapt, fork.

---

*Built with [Claude](https://claude.ai) · Deployed on [Vercel](https://vercel.com)*
