# Dashboard /home — Refonte UI/UX (rapport avant/après)

Date : 2026-06-25 · Méthode : audit multi-agents (3 agents parallèles : recherche IA sales, craft visuel, audit cohérence code) → synthèse → implémentation → vérification visuelle.

## Score

| | Avant | Après |
|---|---|---|
| Note globale (verdict agents) | **6/10** | **~8.5/10** |
| Problème n°1 | 4 châssis de cartes incohérents | 1 châssis unique `cg-card` |
| Problème n°2 | métriques dupliquées, Recent Calls enterré | dédup + IA réordonnée |

## Ce qui a changé

### 1. Système de design unifié (cohérence — la demande centrale)
- **Un seul châssis de carte** : toutes les cartes claires utilisent `cg-card` (hairline + ombre étagée premium). Avant : 4 systèmes coexistaient (`cg-card`, `Card w-full` HeroUI plat, `KPI` nu, héros bespoke).
- **Échelle typographique unique** : titres de carte tous en `text-sm font-semibold tracking-[-0.01em]` (avant : moitié en `text-sm`, moitié en `text-base`). Descriptions toutes en `text-xs` (avant : `text-xs` ↔ `text-[13px]`). Micro-labels tous en `text-[11px] tracking-[0.06em]` (avant : 10px/11px/12px mélangés, tracking 0.05/0.07/0.08em).
- **Hauteurs de charts alignées** : constante `CHART_H = 200` partout (avant : 180/200/220 → bas de cartes décalés).
- **Tokens couleur** : rampe verte complète (`green1..green7`) + `textStrong` ajoutés à la palette `C`. Tous les verts hardcodés hors-palette (`#4ade80`, `#86efac`, `#bbf7d0`, `#d1fae5`) éliminés des composants. Séparateurs via `--cg-border` / `--cg-border-dark`. Radius via `--cg-radius`.
- **Animation robuste** : remplacé ~40 délais absolus en ms (2 timelines manuelles désynchronisables) par un système `--cg-base` (par section, positionnel) + `--cg-i` (par élément, local) calculés en CSS. Réordonner une section ne casse plus la cascade. Cadence unique : `--cg-step` 70ms entre sections, `--cg-stagger` 45ms entre éléments (avant : stagger 22/28/35/70ms selon la liste).

### 2. Architecture d'information (valeur)
- **Recent Calls remonté** sous les KPI (job quotidien du closer) — était tout en bas.
- **Closed revenue en pleine largeur** — la pente de tendance est enfin lisible. Était écrasé en 1/3.
- **Paire Objections** (bar + radar) regroupée comme couche diagnostic.
- **Déduplication** : cellule « At stake €4,800 » retirée du héros (doublon exact du KPI « Money at stake »). Le héros garde Target / Team avg / Top closer / Progress comme contexte du score.

### Nouvel ordre de lecture (newspaper IA)
1. Filtres + welcome → 2. Héros (verdict/score) → 3. KPI → 4. Recent Calls (triage) → 5. AI Insights + Leaderboard → 6. Revenue (pleine largeur) → 7. Paire Objections.

## Vérification de cohérence (automatisée)
- `grep animationDelay` dans les composants dashboard → **0 résultat** (migration animation complète).
- `grep` hex verts hors-palette dans les composants → seuls subsistent : la palette source, un composant hors-dashboard, et les accents intentionnels du héros dark.
- Compilation dev : 200 OK, aucun nouvel warning. Erreurs console préexistantes uniquement (hydration GooeyInput, WebGL PixelBlast, shorthand borderLeft du leaderboard).

## Suggestions restantes (non faites — demandent données ou décision produit)
- **Décomposer le Closium Score** en 1-2 sous-scores (ex : Objection handling 5.5) — demande des données de sous-scores.
- **AI Insights cliquables** vers les appels concernés (deep-link) — demande du routing/logique.
- **Leaderboard : afficher la dimension faible** de chaque closer (coaching) — demande des données par dimension.
- **Redondance bar/radar** : les deux montrent le taux de résolution d'objection. Envisager d'en fusionner un.
- **KPI cards** : chrome natif HeroUI Pro `KPI`, visuellement proche de `cg-card` mais pas formellement wrappé.
