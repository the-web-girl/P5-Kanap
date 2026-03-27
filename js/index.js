/**
 * ============================================================
 * index.js — Logique de la page d'accueil
 * ============================================================
 * Responsabilités :
 * 1. Récupérer tous les produits via l'API
 * 2. Générer dynamiquement les cartes produit dans la grille
 * 3. Gérer les états (chargement, erreur, vide)
 * 4. Mettre à jour le badge du panier dans le header
 * ============================================================
 */

/**
 * Initialise la page d'accueil au chargement du DOM.
 * Point d'entrée principal de ce fichier.
 */
function initIndexPage() {
  // Mettre à jour le badge panier (défini dans cart.js)
  updateCartBadge();

  // Mettre à jour l'année dans le footer
  updateFooterYear();

  // Charger et afficher les produits
  loadAndDisplayProducts();
}

/**
 * Récupère les produits depuis l'API et les affiche dans la grille.
 * Gère les états de chargement et d'erreur.
 */
function loadAndDisplayProducts() {
  const grid = document.getElementById('products-grid');
  const loadingEl = document.getElementById('products-loading');
  const statusEl = document.getElementById('products-status');

  // Appel à l'API (getAllProducts définie dans api.js)
  getAllProducts()
    .then(function (products) {
      // Supprimer l'indicateur de chargement
      if (loadingEl) loadingEl.remove();

      // Marquer la grille comme chargée — RGAA aria-busy
      if (grid) grid.removeAttribute('aria-busy');

      // Mettre à jour l'annonce lecteur d'écran
      if (statusEl) {
        statusEl.textContent = products.length > 0
          ? `${products.length} canapé${products.length > 1 ? 's' : ''} disponible${products.length > 1 ? 's' : ''}.`
          : 'Aucun produit disponible pour le moment.';
      }

      if (products.length === 0) {
        displayEmptyState(grid);
        return;
      }

      // Créer une carte pour chaque produit
      products.forEach(function (product) {
        const card = createProductCard(product);
        if (card && grid) {
          grid.appendChild(card);
        }
      });
    })
    .catch(function (error) {
      console.error('Erreur chargement produits :', error);

      // Supprimer l'indicateur de chargement
      if (loadingEl) loadingEl.remove();
      if (grid) grid.removeAttribute('aria-busy');

      // Afficher un message d'erreur accessible
      displayErrorState(grid, error.message);

      if (statusEl) {
        statusEl.textContent = 'Erreur lors du chargement des produits. Veuillez réessayer.';
      }
    });
}

/**
 * Crée l'élément HTML d'une carte produit.
 * @param {Object} product - Données du produit (id, name, imageUrl, altTxt, description, price)
 * @returns {HTMLElement} L'élément <article> de la carte
 */
function createProductCard(product) {
  // Vérifications de sécurité sur les données reçues
  if (!product || !product._id || !product.name) {
    console.warn('Produit invalide ignoré :', product);
    return null;
  }

  // Créer le conteneur de la carte
  const article = document.createElement('article');
  article.className = 'product-card';
  article.setAttribute('role', 'listitem');

  // Lien vers la page produit avec l'id en paramètre URL
  const link = document.createElement('a');
  link.className = 'product-card-link';
  link.href = `./product.html?id=${encodeURIComponent(product._id)}`;
  // RGAA 6.1 : l'intitulé du lien doit être explicite
  link.setAttribute('aria-label', `Voir le canapé ${escapeHtml(product.name)}`);

  // Conteneur image
  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'product-card-image-wrapper';

  const img = document.createElement('img');
  img.src = product.imageUrl || '';
  // RGAA 1.1 : chaque image doit avoir un attribut alt pertinent
  img.alt = product.altTxt || `Photo du canapé ${product.name}`;
  img.loading = 'lazy'; // Performance : chargement différé
  img.width = 400;
  img.height = 300;

  // Gestion de l'erreur de chargement image
  img.onerror = function () {
    this.alt = `Image indisponible pour ${product.name}`;
    this.style.opacity = '0.4';
  };

  imageWrapper.appendChild(img);

  // Corps de la carte (nom, description, prix)
  const body = document.createElement('div');
  body.className = 'product-card-body';

  // Nom du produit — h3 car le titre de section est h2
  const name = document.createElement('h3');
  name.className = 'product-card-name';
  name.textContent = product.name;

  // Description (tronquée par CSS à 3 lignes)
  const desc = document.createElement('p');
  desc.className = 'product-card-desc';
  desc.textContent = product.description || 'Aucune description disponible.';

  // Prix — formatage monétaire accessible
  const price = document.createElement('p');
  price.className = 'product-card-price';
  // RGAA : utiliser aria-label pour le contexte sémantique du prix
  const formattedPrice = formatPrice(product.price);
  price.innerHTML = `<span aria-label="Prix : ${formattedPrice}">${formattedPrice}</span>`;

  // Assembler les éléments
  body.appendChild(name);
  body.appendChild(desc);
  body.appendChild(price);
  link.appendChild(imageWrapper);
  link.appendChild(body);
  article.appendChild(link);

  return article;
}

/**
 * Affiche un état vide (aucun produit disponible).
 * @param {HTMLElement} container - Le conteneur de la grille
 */
function displayEmptyState(container) {
  if (!container) return;

  const div = document.createElement('div');
  div.className = 'products-empty';
  div.setAttribute('role', 'status');
  div.innerHTML = `
    <p>Aucun canapé disponible pour le moment.</p>
    <p>Revenez bientôt pour découvrir notre collection.</p>
  `;
  container.appendChild(div);
}

/**
 * Affiche un message d'erreur accessible.
 * @param {HTMLElement} container - Le conteneur de la grille
 * @param {string} errorDetail - Détail technique de l'erreur
 */
function displayErrorState(container, errorDetail) {
  if (!container) return;

  const div = document.createElement('div');
  div.className = 'alert alert-error';
  div.setAttribute('role', 'alert');
  div.innerHTML = `
    <strong>Impossible de charger les produits.</strong><br>
    Vérifiez que le serveur API est démarré sur <code>localhost:3000</code>
    et rechargez la page.
    <br><small>Détail : ${escapeHtml(errorDetail)}</small>
  `;
  container.appendChild(div);
}

/**
 * Formate un prix en euros de façon lisible.
 * @param {number} price - Prix en centimes ou en euros
 * @returns {string} Prix formaté (ex: "1 299 €")
 */
function formatPrice(price) {
  if (price === undefined || price === null) return 'Prix non disponible';

  // L'API renvoie le prix en nombre : on affiche en euros
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

/**
 * Échappe les caractères HTML pour prévenir les injections XSS.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Met à jour l'année courante dans le footer.
 */
function updateFooterYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// ============================================================
// Lancement de la page au chargement du DOM
// ============================================================
document.addEventListener('DOMContentLoaded', initIndexPage);
