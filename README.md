# KANAP — Documentation technique et guide de démarrage

## Table des matières
1. [Présentation du projet](#présentation-du-projet)
2. [Architecture du projet](#architecture-du-projet)
3. [Installation et démarrage](#installation-et-démarrage)
4. [Pages du site](#pages-du-site)
5. [Fonctionnalités principales](#fonctionnalités-principales)
6. [Accessibilité RGAA](#accessibilité-rgaa)
7. [SEO](#seo)
8. [Sécurité](#sécurité)
9. [API](#api)
10. [Plan de tests](#plan-de-tests)

---

## Présentation du projet

**Kanap** est un site e-commerce de vente de canapés sur-mesure, développé en HTML, CSS et JavaScript pur (aucun framework). Le site est composé de 4 pages dynamiques communiquant avec une API REST locale.

### Technologies utilisées
- **HTML5** sémantique
- **CSS3** avec variables CSS (pas de preprocesseur)
- **JavaScript ES6+** pur (Fetch API, Promises, URLSearchParams, Intl…)
- **Aucun framework, aucune bibliothèque externe**

### Conformité
- ✅ RGAA 4.1 (Référentiel Général d'Amélioration de l'Accessibilité)
- ✅ Responsive dès **320px**
- ✅ SEO optimisé (balises sémantiques, meta, structure)
- ✅ Sécurité : prix jamais stockés côté client

---

## Architecture du projet

```
kanap/
│
├── index.html              # Page d'accueil — catalogue produits
├── product.html            # Page produit — détail + ajout panier
├── cart.html               # Page panier — résumé + formulaire commande
├── confirmation.html       # Page confirmation — n° de commande
│
├── css/
│   └── style.css           # Feuille de styles unique (variables, reset, composants)
│
├── js/
│   ├── api.js              # Service d'appels API (fetch + Promises)
│   ├── cart.js             # Gestion du panier (localStorage)
│   ├── validation.js       # Validation des formulaires
│   ├── index.js            # Logique page d'accueil
│   ├── product.js          # Logique page produit
│   ├── cartPage.js         # Logique page panier
│   └── confirmation.js     # Logique page confirmation
│
├── PLAN_TESTS.md           # Plan de tests d'acceptation (42 tests)
└── README.md               # Ce fichier
```

### Principe de chargement des scripts
Chaque page charge uniquement les scripts dont elle a besoin, dans cet ordre :
1. `api.js` (en premier — fournit les fonctions API)
2. `cart.js` (en second — fournit les fonctions panier)
3. `validation.js` (si formulaire présent)
4. Script de la page (en dernier — utilise les précédents)

---

## Installation et démarrage

### Prérequis
- **Node.js** (version 12 ou supérieure) — [télécharger ici](https://nodejs.org)
- Le dépôt de l'API Kanap : [GitHub OpenClassrooms](https://github.com/OpenClassrooms-Student-Center/P5-Dev-Web-Kanap)

### Étape 1 — Démarrer le serveur API

```bash
# Cloner le dépôt API
git clone https://github.com/OpenClassrooms-Student-Center/P5-Dev-Web-Kanap.git

# Aller dans le dossier back
cd P5-Dev-Web-Kanap/back

# Installer les dépendances
npm install

# Démarrer le serveur
npm start
```

Le serveur démarre sur **http://localhost:3000**. Vérifier en ouvrant :
`http://localhost:3000/api/products` dans un navigateur.

### Étape 2 — Ouvrir le site

**Option A — Serveur local simple (recommandé)**

```bash
# Si vous avez Python 3 :
cd kanap/
python3 -m http.server 8080
# Puis ouvrir http://localhost:8080

# Si vous avez Node.js et npx :
npx serve .
```

**Option B — Extension VS Code**
Installer l'extension **Live Server** dans VS Code, puis cliquer droit sur `index.html` → "Open with Live Server".

**Option C — Ouvrir directement (déconseillé)**
Certaines fonctionnalités peuvent ne pas fonctionner avec `file://` à cause de la politique CORS des navigateurs. Préférez un serveur local.

> ⚠️ **Important** : Le serveur API doit être démarré AVANT d'ouvrir le site. Sans l'API, les produits ne peuvent pas se charger.

---

## Pages du site

### 1. Accueil (`index.html`)
- Affiche dynamiquement **tous les produits** retournés par l'API
- Chaque carte affiche : image, nom du canapé, extrait de description, prix
- Cliquer sur un produit redirige vers `product.html?id=<id_produit>`

### 2. Produit (`product.html`)
- Récupère l'`id` du produit depuis l'URL (`?id=...`)
- Affiche : image, nom (h1), prix, description complète
- Formulaire de personnalisation :
  - **Menu déroulant** : couleurs disponibles (depuis l'API)
  - **Champ quantité** : entre 1 et 100
  - **Bouton "Ajouter au panier"** : validation + stockage

### 3. Panier (`cart.html`)
- Affiche tous les articles du panier
- Pour chaque article : image, nom, couleur, prix unitaire, quantité modifiable
- **Modification de quantité** : le total se recalcule automatiquement
- **Suppression** : l'article disparaît de la page
- **Total** : calculé à partir des prix de l'API (jamais du localStorage)
- **Formulaire de commande** : 5 champs avec validation

### 4. Confirmation (`confirmation.html`)
- Affiche le numéro de commande retourné par l'API
- Le numéro est lu depuis l'URL (`?orderId=...`), jamais stocké

---

## Fonctionnalités principales

### Gestion du panier
Le panier utilise **localStorage** avec la clé `kanap_cart`.

Format stocké :
```json
[
  { "id": "abc123", "color": "Rouge", "quantity": 2 },
  { "id": "abc123", "color": "Bleu", "quantity": 1 }
]
```

> ⚠️ **Le prix n'est jamais stocké** (conformité spec sécurité Kanap).

**Règle métier** :
- Même produit + même couleur → quantité cumulée (1 seule ligne)
- Même produit + couleur différente → 2 lignes distinctes

### Validation des formulaires

| Champ | Règle |
|---|---|
| Prénom | Lettres uniquement (accents, tirets, apostrophes OK), 2–50 caractères |
| Nom | Idem prénom |
| Adresse | Minimum 5 caractères |
| Ville | Lettres uniquement, 2–100 caractères |
| Email | Format valide avec `@` et domaine |
| Quantité | Entier entre 1 et 100 |
| Couleur | Doit être sélectionnée (non vide) |

En cas d'erreur :
- Message d'erreur affiché sous le champ concerné
- Champ marqué `aria-invalid="true"`
- Focus placé sur le premier champ invalide
- Annonce aux lecteurs d'écran via zone `aria-live`

---

## Accessibilité RGAA

Le site est développé selon le **RGAA 4.1** (Référentiel Général d'Amélioration de l'Accessibilité — France).

### Critères respectés

| Critère RGAA | Implémentation |
|---|---|
| **1.1** — Images avec alternatives | Tous les `<img>` ont un `alt` descriptif |
| **1.2** — Images décoratives | `aria-hidden="true"` sur les SVG décoratifs |
| **3.2** — Contraste texte | Ratio ≥ 4.5:1 pour tout le texte normal |
| **6.1** — Intitulé des liens | Tous les liens ont un texte ou `aria-label` explicite |
| **7.3** — Changements de contexte | Changements annoncés via `aria-live` |
| **8.5** — Titre de page pertinent | `<title>` unique et descriptif sur chaque page |
| **8.7** — Langue déclarée | `lang="fr"` sur chaque `<html>` |
| **10.7** — Focus visible | Anneau de focus visible sur tout élément interactif |
| **11.1** — Labels de formulaires | Chaque champ a un `<label>` associé par `for` |
| **11.10** — Champs obligatoires | Indication visuelle + SR-only + `aria-required` |
| **11.11** — Messages d'erreur | Liés aux champs via `aria-describedby` + `aria-invalid` |
| **12.1** — Blocs de navigation | `<nav>` avec `aria-label` distincts |
| **12.6** — Plan de navigation | Fil d'Ariane présent sur la page produit |
| **12.7** — Lien d'évitement | "Aller au contenu principal" en premier lien de chaque page |
| **13.8** — Mouvement réduit | `@media (prefers-reduced-motion)` implémenté |

### Navigation au clavier
- **Tab** : navigation dans l'ordre logique
- **Shift+Tab** : navigation à rebours
- **Entrée** : activation des liens et boutons
- **Espace** : activation des boutons
- **Flèches** : navigation dans les menus `select`

---

## SEO

### Bonnes pratiques appliquées

| Élément | Implémentation |
|---|---|
| `<title>` | Unique, descriptif, ≤ 60 caractères |
| `<meta description>` | Unique par page, 70–160 caractères |
| Structure des titres | H1 unique, hiérarchie H1 > H2 > H3 |
| HTML sémantique | `<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`, `<article>` |
| `<link rel="canonical">` | Sur la page d'accueil |
| Images | `alt` descriptif, `width` et `height` définis, `loading="lazy"` |
| `lang` | Déclaré sur `<html>` |
| Responsive | `<meta viewport>` correctement configuré |
| Fil d'Ariane | Présent sur la page produit |

---

## Sécurité

### Règle critique — Prix non stockés côté client
Conformément aux spécifications Kanap :
> *"Attention à ne pas stocker le prix des articles en local. Les données stockées en local ne sont pas sécurisées et l'utilisateur pourrait alors modifier le prix lui-même."*

**Implémentation** :
- Le `localStorage` ne stocke que `{id, color, quantity}` — jamais le prix
- Sur la page panier, les prix sont **toujours récupérés depuis l'API** via `getProductById()`
- Le total est calculé côté client en multipliant prix_API × quantité_panier

### Règle critique — OrderId non stocké
Conformément aux spécifications :
> *"Il faudra veiller à ce que ce numéro ne soit stocké nulle part."*

**Implémentation** :
- L'orderId est transmis de `cart.html` vers `confirmation.html` **via l'URL uniquement**
- Il n'est jamais écrit dans `localStorage`, `sessionStorage` ou un cookie

### Protection XSS
- Toutes les données de l'API sont insérées via `textContent` (jamais `innerHTML`) quand c'est du texte
- Fonction `escapeHtml()` disponible pour les cas où HTML est nécessaire

---

## API

### Endpoints utilisés

| Verbe | URL | Description | Réponse |
|---|---|---|---|
| `GET` | `/api/products` | Tous les produits | Tableau de produits |
| `GET` | `/api/products/:id` | Un produit par id | Objet produit |
| `POST` | `/api/products/order` | Passer une commande | `{contact, products, orderId}` |

### Structure d'un produit

```json
{
  "_id": "string",
  "name": "string",
  "price": 1200,
  "description": "string",
  "imageUrl": "https://...",
  "altTxt": "string",
  "colors": ["Rouge", "Bleu", "Gris"]
}
```

### Corps de la requête POST /order

```json
{
  "contact": {
    "firstName": "Jean",
    "lastName": "Dupont",
    "address": "12 rue des Lilas",
    "city": "Paris",
    "email": "jean.dupont@email.fr"
  },
  "products": ["id1", "id2", "id2"]
}
```

> Note : L'API v1 ne prend pas en compte la quantité ni la couleur dans la commande POST. Ces informations sont gérées côté client uniquement.

---

## Plan de tests

Le fichier `PLAN_TESTS.md` contient **42 tests d'acceptation** couvrant :
- Les 4 pages du site
- Toutes les règles métier (panier, commande, validation)
- L'accessibilité RGAA
- Le SEO
- La qualité du code

---

## Débogage courant

| Symptôme | Cause probable | Solution |
|---|---|---|
| Grille de produits vide | API non démarrée | Lancer `npm start` dans le dossier `back` |
| Erreur CORS | Ouverture directe via `file://` | Utiliser un serveur local (`python3 -m http.server`) |
| Prix affiché à 0 | Produit non chargé depuis l'API | Vérifier la connexion à `localhost:3000` |
| localStorage vide | Mode navigation privée | Utiliser une fenêtre normale |

---

*Documentation rédigée pour le projet Kanap — OpenClassrooms Développeur Web P5*
