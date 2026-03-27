# Plan de tests d'acceptation — Kanap

## Informations générales

| Champ | Valeur |
|---|---|
| Projet | Kanap — MVP e-commerce canapés |
| Version testée | 1.0 |
| Technologies | HTML / CSS / JavaScript pur |
| API | http://localhost:3000/api/products |
| Prérequis | Serveur API démarré (`npm start` dans le dossier API) |

---

## MODULE 1 — Page d'accueil (index.html)

### TEST-001 — Affichage des produits
| | |
|---|---|
| **Objectif** | Vérifier que tous les produits de l'API s'affichent |
| **Préconditions** | Serveur API démarré, base de données non vide |
| **Étapes** | 1. Ouvrir `index.html` dans un navigateur |
| | 2. Attendre la fin du chargement |
| **Résultat attendu** | Toutes les cartes produits s'affichent dans la grille |
| **Résultat obtenu** | |
| **Statut** | ☐ Réussi / ☐ Échoué / ☐ Non testé |

### TEST-002 — Contenu de chaque carte produit
| | |
|---|---|
| **Objectif** | Vérifier que chaque carte affiche image, nom et début de description |
| **Préconditions** | Produits chargés (TEST-001 réussi) |
| **Étapes** | 1. Observer chaque carte produit |
| **Résultat attendu** | Image, nom du produit et extrait de description visibles |
| **Résultat obtenu** | |
| **Statut** | ☐ Réussi / ☐ Échoué / ☐ Non testé |

### TEST-003 — Redirection vers la page produit
| | |
|---|---|
| **Objectif** | Cliquer sur un produit redirige vers la page produit avec le bon id |
| **Préconditions** | Produits chargés |
| **Étapes** | 1. Cliquer sur un produit |
| | 2. Observer l'URL de la page produit |
| **Résultat attendu** | URL = `product.html?id=<id_du_produit>` |
| **Résultat obtenu** | |
| **Statut** | ☐ Réussi / ☐ Échoué / ☐ Non testé |

### TEST-004 — Gestion d'erreur API (serveur arrêté)
| | |
|---|---|
| **Objectif** | Un message d'erreur accessible s'affiche si l'API est indisponible |
| **Préconditions** | Serveur API ARRÊTÉ |
| **Étapes** | 1. Ouvrir `index.html` |
| **Résultat attendu** | Message d'erreur explicite affiché, annoncé aux lecteurs d'écran |
| **Résultat obtenu** | |
| **Statut** | ☐ Réussi / ☐ Échoué / ☐ Non testé |

### TEST-005 — Responsive 320px (accueil)
| | |
|---|---|
| **Objectif** | La page s'affiche correctement à 320px de large |
| **Étapes** | 1. Réduire la fenêtre à 320px ou utiliser les DevTools |
| **Résultat attendu** | Grille en 1 colonne, aucun débordement horizontal |
| **Résultat obtenu** | |
| **Statut** | ☐ Réussi / ☐ Échoué / ☐ Non testé |

---

## MODULE 2 — Page produit (product.html)

### TEST-006 — Affichage des informations produit
| | |
|---|---|
| **Objectif** | Vérifier que les détails du produit s'affichent correctement |
| **Étapes** | 1. Depuis l'accueil, cliquer sur un produit |
| **Résultat attendu** | Image, nom (h1), prix, description affichés |
| **Résultat obtenu** | |
| **Statut** | ☐ Réussi / ☐ Échoué / ☐ Non testé |

### TEST-007 — Menu déroulant des couleurs
| | |
|---|---|
| **Objectif** | Le select affiche toutes les couleurs du produit |
| **Étapes** | 1. Ouvrir le menu déroulant "Couleur" |
| **Résultat attendu** | Toutes les couleurs du produit listées, option vide par défaut |
| **Résultat obtenu** | |
| **Statut** | ☐ Réussi / ☐ Échoué / ☐ Non testé |

### TEST-008 — Ajout au panier sans couleur sélectionnée
| | |
|---|---|
| **Objectif** | Vérifier le message d'erreur si aucune couleur n'est choisie |
| **Étapes** | 1. Laisser le select couleur sur l'option vide |
| | 2. Saisir la quantité 1 |
| | 3. Cliquer sur "Ajouter au panier" |
| **Résultat attendu** | Message d'erreur "Veuillez sélectionner une couleur" affiché sous le select |
| **Résultat obtenu** | |
| **Statut** | ☐ Réussi / ☐ Échoué / ☐ Non testé |

### TEST-009 — Ajout au panier avec quantité invalide (0)
| | |
|---|---|
| **Objectif** | Vérifier le message d'erreur si quantité = 0 |
| **Étapes** | 1. Sélectionner une couleur |
| | 2. Saisir 0 dans le champ quantité |
| | 3. Cliquer sur "Ajouter au panier" |
| **Résultat attendu** | Message d'erreur affiché sous le champ quantité |
| **Résultat obtenu** | |
| **Statut** | ☐ Réussi / ☐ Échoué / ☐ Non testé |

### TEST-010 — Ajout au panier avec quantité invalide (101)
| | |
|---|---|
| **Objectif** | Vérifier le message d'erreur si quantité > 100 |
| **Étapes** | 1. Sélectionner une couleur |
| | 2. Saisir 101 dans le champ quantité |
| | 3. Cliquer sur "Ajouter au panier" |
| **Résultat attendu** | Message d'erreur affiché sous le champ quantité |
| **Résultat obtenu** | |
| **Statut** | ☐ Réussi / ☐ Échoué / ☐ Non testé |

### TEST-011 — Ajout au panier valide
| | |
|---|---|
| **Objectif** | Vérifier qu'un produit valide est bien ajouté au panier |
| **Étapes** | 1. Sélectionner une couleur (ex: "rouge") |
| | 2. Saisir la quantité 2 |
| | 3. Cliquer sur "Ajouter au panier" |
| **Résultat attendu** | Message de succès affiché, badge panier passe à 2 |
| **Résultat obtenu** | |
| **Statut** | ☐ Réussi / ☐ Échoué / ☐ Non testé |

### TEST-012 — Cumul de quantité (même produit, même couleur)
| | |
|---|---|
| **Objectif** | Même produit + même couleur ajouté 2 fois = 1 ligne, quantité cumulée |
| **Étapes** | 1. Ajouter produit A, couleur "rouge", quantité 1 |
| | 2. Ajouter produit A, couleur "rouge", quantité 2 |
| | 3. Vérifier le panier |
| **Résultat attendu** | 1 seule ligne en panier, quantité = 3 |
| **Résultat obtenu** | |
| **Statut** | ☐ Réussi / ☐ Échoué / ☐ Non testé |

### TEST-013 — Lignes distinctes (même produit, couleurs différentes)
| | |
|---|---|
| **Objectif** | Même produit avec 2 couleurs différentes = 2 lignes distinctes |
| **Étapes** | 1. Ajouter produit A, couleur "rouge", quantité 1 |
| | 2. Ajouter produit A, couleur "bleu", quantité 1 |
| | 3. Vérifier le panier |
| **Résultat attendu** | 2 lignes distinctes avec couleur indiquée sur chacune |
| **Résultat obtenu** | |
| **Statut** | ☐ Réussi / ☐ Échoué / ☐ Non testé |

### TEST-014 — Prix non stocké en localStorage
| | |
|---|---|
| **Objectif** | Vérifier que le prix n'est pas dans localStorage (sécurité) |
| **Étapes** | 1. Ajouter un produit au panier |
| | 2. Ouvrir les DevTools → Application → localStorage |
| | 3. Examiner la clé `kanap_cart` |
| **Résultat attendu** | Pas de champ "price" dans les objets du tableau JSON |
| **Résultat obtenu** | |
| **Statut** | ☐ Réussi / ☐ Échoué / ☐ Non testé |

---

## MODULE 3 — Page panier (cart.html)

### TEST-015 — Affichage du résumé panier
| | |
|---|---|
| **Objectif** | Les articles du panier s'affichent avec nom, couleur, prix et quantité |
| **Préconditions** | Avoir ajouté au moins 1 article au panier |
| **Étapes** | 1. Naviguer vers `cart.html` |
| **Résultat attendu** | Chaque article visible avec toutes ses informations |
| **Résultat obtenu** | |
| **Statut** | ☐ Réussi / ☐ Échoué / ☐ Non testé |

### TEST-016 — Calcul du total
| | |
|---|---|
| **Objectif** | Le total affiché est correct (prix API × quantité) |
| **Étapes** | 1. Ouvrir le panier avec des articles |
| | 2. Vérifier le total affiché |
| **Résultat attendu** | Total = somme de (prix_API × quantité) pour chaque article |
| **Résultat obtenu** | |
| **Statut** | ☐ Réussi / ☐ Échoué / ☐ Non testé |

### TEST-017 — Modification de quantité
| | |
|---|---|
| **Objectif** | Modifier la quantité d'un article met à jour le total |
| **Étapes** | 1. Dans le panier, changer la quantité d'un article (ex: 1 → 3) |
| **Résultat attendu** | Total recalculé automatiquement |
| **Résultat obtenu** | |
| **Statut** | ☐ Réussi / ☐ Échoué / ☐ Non testé |

### TEST-018 — Suppression d'un article
| | |
|---|---|
| **Objectif** | Supprimer un article le retire du DOM et du localStorage |
| **Étapes** | 1. Cliquer sur "Supprimer" sur un article |
| **Résultat attendu** | Article retiré de la liste, total mis à jour, article absent du localStorage |
| **Résultat obtenu** | |
| **Statut** | ☐ Réussi / ☐ Échoué / ☐ Non testé |

### TEST-019 — Panier vide
| | |
|---|---|
| **Objectif** | Si le panier est vide, un message adéquat s'affiche |
| **Préconditions** | Panier vide |
| **Étapes** | 1. Naviguer vers `cart.html` |
| **Résultat attendu** | Message "Panier vide" + lien vers le catalogue, formulaire masqué |
| **Résultat obtenu** | |
| **Statut** | ☐ Réussi / ☐ Échoué / ☐ Non testé |

---

## MODULE 4 — Formulaire de commande (dans cart.html)

### TEST-020 — Prénom avec chiffre (invalide)
| | |
|---|---|
| **Objectif** | Un prénom contenant un chiffre est refusé |
| **Étapes** | 1. Saisir "Je4n" dans le champ Prénom |
| | 2. Cliquer sur "Confirmer la commande" |
| **Résultat attendu** | Message d'erreur sous le champ Prénom |
| **Résultat obtenu** | |
| **Statut** | ☐ Réussi / ☐ Échoué / ☐ Non testé |

### TEST-021 — Email sans arobase (invalide)
| | |
|---|---|
| **Objectif** | Un email sans @ est refusé |
| **Étapes** | 1. Saisir "emailsanarobe.fr" dans Email |
| | 2. Soumettre |
| **Résultat attendu** | Message d'erreur sous le champ Email |
| **Résultat obtenu** | |
| **Statut** | ☐ Réussi / ☐ Échoué / ☐ Non testé |

### TEST-022 — Prénom valide avec accent (Marie-Hélène)
| | |
|---|---|
| **Objectif** | Les accents et tirets sont acceptés dans les prénoms |
| **Étapes** | 1. Saisir "Marie-Hélène" dans Prénom |
| **Résultat attendu** | Pas d'erreur affichée |
| **Résultat obtenu** | |
| **Statut** | ☐ Réussi / ☐ Échoué / ☐ Non testé |

### TEST-023 — Soumission du formulaire avec tous les champs vides
| | |
|---|---|
| **Objectif** | Tous les messages d'erreur s'affichent si le formulaire est vide |
| **Étapes** | 1. Ne rien saisir dans le formulaire |
| | 2. Cliquer sur "Confirmer" |
| **Résultat attendu** | Erreurs affichées sous chaque champ, focus sur le premier champ en erreur |
| **Résultat obtenu** | |
| **Statut** | ☐ Réussi / ☐ Échoué / ☐ Non testé |

### TEST-024 — Soumission formulaire valide → page confirmation
| | |
|---|---|
| **Objectif** | Une commande valide redirige vers la page de confirmation |
| **Étapes** | 1. Remplir correctement tous les champs |
| | 2. Cliquer sur "Confirmer la commande" |
| **Résultat attendu** | Redirection vers `confirmation.html?orderId=<id>` |
| **Résultat obtenu** | |
| **Statut** | ☐ Réussi / ☐ Échoué / ☐ Non testé |

### TEST-025 — Panier vidé après commande
| | |
|---|---|
| **Objectif** | Le localStorage du panier est vidé après commande réussie |
| **Étapes** | 1. Passer une commande (TEST-024) |
| | 2. Vérifier le localStorage dans les DevTools |
| **Résultat attendu** | Clé `kanap_cart` absente ou tableau vide |
| **Résultat obtenu** | |
| **Statut** | ☐ Réussi / ☐ Échoué / ☐ Non testé |

---

## MODULE 5 — Page de confirmation (confirmation.html)

### TEST-026 — Affichage du numéro de commande
| | |
|---|---|
| **Objectif** | L'orderId reçu de l'API s'affiche correctement |
| **Préconditions** | TEST-024 réussi |
| **Étapes** | 1. Observer la page de confirmation |
| **Résultat attendu** | Numéro de commande affiché dans le bloc prévu |
| **Résultat obtenu** | |
| **Statut** | ☐ Réussi / ☐ Échoué / ☐ Non testé |

### TEST-027 — OrderId non stocké
| | |
|---|---|
| **Objectif** | L'orderId ne doit pas être dans localStorage |
| **Étapes** | 1. Vérifier le localStorage après la confirmation |
| **Résultat attendu** | Aucune clé contenant l'orderId dans localStorage |
| **Résultat obtenu** | |
| **Statut** | ☐ Réussi / ☐ Échoué / ☐ Non testé |

### TEST-028 — Accès direct sans orderId
| | |
|---|---|
| **Objectif** | La page gère l'absence d'orderId en URL |
| **Étapes** | 1. Accéder directement à `confirmation.html` sans paramètre URL |
| **Résultat attendu** | Message approprié, pas d'erreur JS dans la console |
| **Résultat obtenu** | |
| **Statut** | ☐ Réussi / ☐ Échoué / ☐ Non testé |

---

## MODULE 6 — Accessibilité RGAA

### TEST-029 — Navigation au clavier
| | |
|---|---|
| **Objectif** | Toutes les fonctionnalités accessibles au clavier seul |
| **Étapes** | 1. Sur chaque page, naviguer uniquement avec Tab, Shift+Tab, Enter, Espace |
| **Résultat attendu** | Toutes les actions réalisables sans souris, ordre logique |
| **Résultat obtenu** | |
| **Statut** | ☐ Réussi / ☐ Échoué / ☐ Non testé |

### TEST-030 — Focus visible
| | |
|---|---|
| **Objectif** | L'indicateur de focus est toujours visible |
| **Étapes** | 1. Naviguer au clavier sur toutes les pages |
| **Résultat attendu** | Anneau de focus orange (#f4a261) visible sur chaque élément interactif |
| **Résultat obtenu** | |
| **Statut** | ☐ Réussi / ☐ Échoué / ☐ Non testé |

### TEST-031 — Lien d'évitement
| | |
|---|---|
| **Objectif** | Le lien "Aller au contenu principal" fonctionne |
| **Étapes** | 1. Sur chaque page, appuyer sur Tab |
| | 2. Observer si le lien d'évitement apparaît |
| | 3. Appuyer sur Entrée |
| **Résultat attendu** | Lien visible au premier Tab, focus placé sur le contenu principal |
| **Résultat obtenu** | |
| **Statut** | ☐ Réussi / ☐ Échoué / ☐ Non testé |

### TEST-032 — Attributs alt des images
| | |
|---|---|
| **Objectif** | Toutes les images ont un attribut alt pertinent (RGAA 1.1) |
| **Étapes** | 1. Inspecter le code source ou utiliser un outil comme WAVE |
| **Résultat attendu** | Aucune image sans alt, alts descriptifs et non vides (hors décoratifs) |
| **Résultat obtenu** | |
| **Statut** | ☐ Réussi / ☐ Échoué / ☐ Non testé |

### TEST-033 — Labels de formulaires associés
| | |
|---|---|
| **Objectif** | Chaque champ de formulaire est lié à son label (RGAA 11.1) |
| **Étapes** | 1. Vérifier dans le code que chaque `<label>` a un `for` correspondant |
| **Résultat attendu** | Association label/input correcte sur tous les champs |
| **Résultat obtenu** | |
| **Statut** | ☐ Réussi / ☐ Échoué / ☐ Non testé |

### TEST-034 — Contraste des couleurs (RGAA 3.2)
| | |
|---|---|
| **Objectif** | Ratio de contraste ≥ 4.5:1 pour le texte normal |
| **Étapes** | 1. Utiliser l'outil Contrast Checker (WebAIM) |
| | 2. Tester : texte principal (#1a1a2e sur #f9f9f9), liens, boutons |
| **Résultat attendu** | Ratio ≥ 4.5:1 pour tous les textes |
| **Résultat obtenu** | |
| **Statut** | ☐ Réussi / ☐ Échoué / ☐ Non testé |

### TEST-035 — Messages d'erreur associés aux champs (RGAA 11.11)
| | |
|---|---|
| **Objectif** | Les messages d'erreur sont liés aux champs via aria-describedby |
| **Étapes** | 1. Déclencher une erreur de formulaire |
| | 2. Inspecter l'attribut aria-describedby du champ en erreur |
| **Résultat attendu** | aria-describedby pointe vers l'id du message d'erreur |
| **Résultat obtenu** | |
| **Statut** | ☐ Réussi / ☐ Échoué / ☐ Non testé |

### TEST-036 — Annonces lecteur d'écran (ARIA live)
| | |
|---|---|
| **Objectif** | Les changements d'état sont annoncés aux lecteurs d'écran |
| **Étapes** | 1. Activer NVDA ou VoiceOver |
| | 2. Ajouter un article au panier, modifier une quantité, supprimer un article |
| **Résultat attendu** | Chaque action annoncée vocalement |
| **Résultat obtenu** | |
| **Statut** | ☐ Réussi / ☐ Échoué / ☐ Non testé |

---

## MODULE 7 — SEO

### TEST-037 — Balises title uniques
| | |
|---|---|
| **Objectif** | Chaque page a un titre `<title>` unique et descriptif |
| **Étapes** | 1. Vérifier le `<title>` de chaque page dans le source |
| **Résultat attendu** | Titres distincts et pertinents sur les 4 pages |
| **Résultat obtenu** | |
| **Statut** | ☐ Réussi / ☐ Échoué / ☐ Non testé |

### TEST-038 — Balises meta description
| | |
|---|---|
| **Objectif** | Chaque page a une meta description pertinente |
| **Étapes** | 1. Inspecter les `<meta name="description">` |
| **Résultat attendu** | Descriptions entre 70 et 160 caractères, pertinentes |
| **Résultat obtenu** | |
| **Statut** | ☐ Réussi / ☐ Échoué / ☐ Non testé |

### TEST-039 — Structure sémantique des titres
| | |
|---|---|
| **Objectif** | Une seule balise h1 par page, hiérarchie h1 > h2 > h3 respectée |
| **Étapes** | 1. Inspecter la structure des titres (outil HeadingsMap) |
| **Résultat attendu** | H1 unique, hiérarchie logique sur chaque page |
| **Résultat obtenu** | |
| **Statut** | ☐ Réussi / ☐ Échoué / ☐ Non testé |

---

## MODULE 8 — Qualité du code

### TEST-040 — Séparation des fonctions
| | |
|---|---|
| **Objectif** | Chaque fonction a un rôle unique et est commentée |
| **Étapes** | 1. Lire le code source des fichiers JS |
| **Résultat attendu** | Fonctions courtes, nommées, commentées en en-tête |
| **Résultat obtenu** | |
| **Statut** | ☐ Réussi / ☐ Échoué / ☐ Non testé |

### TEST-041 — Utilisation de Promises (pas de callbacks)
| | |
|---|---|
| **Objectif** | L'API est appelée via des Promises/fetch, pas des callbacks |
| **Étapes** | 1. Inspecter api.js et les usages |
| **Résultat attendu** | Utilisation de `.then()`, `.catch()` ou `async/await` |
| **Résultat obtenu** | |
| **Statut** | ☐ Réussi / ☐ Échoué / ☐ Non testé |

### TEST-042 — Aucune console error en navigation normale
| | |
|---|---|
| **Objectif** | Aucune erreur JS dans la console lors d'une navigation normale |
| **Étapes** | 1. Naviguer sur toutes les pages en ayant ouvert la console DevTools |
| **Résultat attendu** | Console propre (pas d'erreurs rouges) |
| **Résultat obtenu** | |
| **Statut** | ☐ Réussi / ☐ Échoué / ☐ Non testé |

---

## Récapitulatif

| Module | Tests | Réussis | Échoués | Non testés |
|---|---|---|---|---|
| 1 — Accueil | 5 | | | |
| 2 — Produit | 9 | | | |
| 3 — Panier | 5 | | | |
| 4 — Formulaire | 6 | | | |
| 5 — Confirmation | 3 | | | |
| 6 — Accessibilité RGAA | 8 | | | |
| 7 — SEO | 3 | | | |
| 8 — Qualité code | 3 | | | |
| **TOTAL** | **42** | | | |

---

*Plan de tests rédigé selon les spécifications fonctionnelles Kanap v1.0*
