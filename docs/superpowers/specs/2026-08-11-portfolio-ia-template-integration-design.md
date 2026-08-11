# Intégration du template Portfolio IA — Design

**Date :** 2026-08-11
**Statut :** approuvé pour planification

## Objectif

Appliquer l’identité visuelle du template Open Design « Portfolio IA » aux deux variantes du portfolio React existant, sans dupliquer les pages ni perdre les routes, données, analytics ou comportements déjà en production.

La source visuelle de référence est le fichier actif `index.html` du projet Open Design « Portfolio IA », modifié le 11 août 2026. Le runtime de production reste l’application React/Vite du dépôt.

## Variantes de route

| Route | Contenu partagé | Différence conservée |
| --- | --- | --- |
| `/` | Hero, projets, compétences, expérience, contact, navigation et nouvelle identité visuelle | Aucune section d’offres; le lien Offres mène vers `/freelance#services`; analytics classés `base` |
| `/freelance` | Même structure et même identité visuelle | Cinq offres, tarif adapté à la région détectée et délai; analytics classés `freelance` |
| `/cv` et `/count` | Header, footer, couleurs, typographie et contrôles cohérents | Le contenu métier et le comportement de chaque page restent inchangés |

## Architecture

`HomePage` reste l’unique page de portfolio. La prop existante `showServices` continue de déterminer la variante : `false` pour `/`, `true` pour `/freelance`. Aucun second arbre de composants ou copie de données n’est créé.

`Layout` conserve les routes TanStack et adopte le header/footer du template. Sur les deux pages portfolio, le header apparaît lorsque le hero quitte l’écran; sur `/cv` et `/count`, il reste immédiatement visible. Le menu mobile reste géré par React.

Le HTML statique Open Design n’est pas servi directement. Sa structure est transposée dans le JSX existant et ses styles sont adaptés dans la feuille globale afin de conserver le routeur, le rendu bilingue, les assets importés et l’analytics.

## Structure visuelle

Les deux variantes utilisent les mêmes éléments du template :

- toile claire violette/rose, grille discrète et tokens `oklch`;
- hero éditorial plein écran avec le grand mot `ALEXIS`, le portrait, le statut et la carte des domaines;
- grille de projets asymétrique avec un projet principal et deux projets compacts;
- compétences, expérience et contact dans les panneaux du template;
- section d’offres sous forme de lignes tarifées uniquement sur `/freelance`;
- responsive aux seuils desktop, tablette, mobile et petit mobile du template.

Les données viennent des objets déjà présents dans `src/main.tsx`. Les textes français codés en dur dans la maquette ne remplacent pas la source bilingue existante; les quelques libellés propres au nouveau hero sont ajoutés aux copies française et anglaise. Les liens, rôles, stacks, résultats, expériences et coordonnées restent pilotés par les données de production.

## Navigation et ancres

Les identifiants publics existants sont conservés : `#projects`, `#services`, `#skills`, `#experience` et `#contact`. Cela évite de casser les liens entrants et la navigation inter-route.

Sur `/`, le lien Offres cible `/freelance#services`. Sur `/freelance`, il cible `#services`. Les routes `/cv` et `/count` restent enregistrées et accessibles comme aujourd’hui.

## Interactions

Le comportement du template est reproduit avec les API natives déjà disponibles :

- `IntersectionObserver` affiche le header après le hero, avec repli sur l’événement `scroll`;
- `requestAnimationFrame` limite la parallaxe du portrait et de la carte de domaines;
- `prefers-reduced-motion` désactive parallaxe et animations d’entrée;
- le bouton Copier l’email utilise l’API Clipboard puis un repli compatible;
- le menu mobile maintient `aria-expanded`, ferme les liens après navigation et bloque le défilement lorsqu’il est ouvert.

Aucune dépendance n’est ajoutée.

## Données, analytics et erreurs

Le tracking actuel des vues `base`/`freelance` et des clics projets est conservé. L’API analytics et la page `/count` ne changent pas.

Sur `/freelance`, la détection géographique continue d’afficher un seul tarif correspondant au visiteur. En cas d’échec réseau, le repli local actuel reste utilisé. La maquette Open Design, qui montre les deux régions en même temps, n’est donc pas copiée littéralement sur ce point.

Les assets continuent d’être importés depuis le dépôt (`portrait-cutout.webp` et le CV PDF), plutôt que par les chemins relatifs propres au workspace Open Design.

## Accessibilité

Le lien d’évitement, les libellés de navigation, les états du menu, les textes alternatifs, les cibles tactiles de 44 px, les focus visibles et le mode mouvement réduit sont conservés ou adaptés au nouveau style. Le header masqué n’est pas focusable avant son apparition. Les routes sans hero gardent une navigation immédiatement accessible.

## Fichiers prévus

- Modifier `src/main.tsx` pour le JSX partagé, les nouveaux libellés bilingues et les interactions.
- Remplacer les styles du portfolio dans `src/styles.css` par la traduction fidèle du template, tout en gardant les styles utiles de `/cv` et `/count`.
- Adapter `src/hero-motion.ts` et `tests/hero-motion.test.ts` au calcul minimal de parallaxe, en supprimant le mouvement de hero par défilement devenu obsolète.
- Ne pas modifier `api/analytics.js`, `package.json` ou `package-lock.json`.

Les primitives existantes de `src/components/shadow-ui.tsx` sont réutilisées seulement lorsqu’elles réduisent le diff; aucune nouvelle couche de composants n’est créée.

## Vérification

Le changement suit un cycle test rouge/vert pour le calcul du mouvement du hero, puis exécute :

```bash
node --test tests/hero-motion.test.ts
node --test api/analytics.test.js
npm run build
git diff --check
```

La vérification visuelle couvre `/`, `/freelance`, `/cv` et `/count` en desktop et mobile. Elle confirme notamment que :

1. `/` ne contient aucune carte ou section d’offres.
2. `/freelance` contient exactement cinq offres et un tarif régional par offre.
3. Les deux pages ont la même identité visuelle et le même contenu partagé.
4. Le header, le menu mobile, la parallaxe, le mode mouvement réduit et la copie d’email fonctionnent.
5. Les liens projets continuent de déclencher le tracking existant.
6. Les liens CV, email, téléphone et GitHub restent valides.
7. Les modifications locales Neon de `package.json` et `package-lock.json` restent intactes.

## Hors périmètre

- Dupliquer les variantes dans deux composants indépendants.
- Servir directement le HTML statique Open Design.
- Modifier l’API analytics, les tarifs, les projets ou les expériences.
- Ajouter une bibliothèque d’animation, de composants ou de tests navigateur.
- Publier, pousser ou déployer le site dans cette phase.
