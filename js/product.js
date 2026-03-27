/**
 * ============================================================
 * product.js — Logique de la page produit
 * ============================================================
 * Responsabilités :
 * 1. Lire l'id du produit depuis l'URL (paramètre ?id=)
 * 2. Récupérer les données du produit via l'API
 * 3. Afficher les détails (image, titre, prix, description)
 * 4. Peupler le menu déroulant des couleurs
 * 5. Valider les choix (couleur + quantité)
 * 6. Ajouter le produit au panier via le service cart.js
 * ============================================================
 */

/**
 * Initialise la page produit au chargement du DOM.
 */
function initProductPage() {
  updateCartBadge();
  updateFooterYear();

  // Récupérer l'id depuis l'URL
  const productId = getProductIdFromUrl();

  if (!productId) {
    displayProductError('Aucun produit sélectionné. Identifiant manquant dans l\'URL.');
    return;
  }

  loadProduct(productId);
}

/**
 * Lit l'identifiant produit depuis les paramètres de l'URL.
 * @returns {string|null} L'id du produit ou null si absent
 */
function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

/**
 * Charge le produit depuis l'API et l'affiche.
 * @param {string} productId
 */
function loadProduct(productId) {
  // getProductById est définie dans api.js
  getProductById(productId)
    .then(function (product) {
      // Marquer la page comme chargée
      const page = document.getElementById('product-page');
      if (page) page.removeAttribute('aria-busy');

      // Mettre à jour l'annonce lecteur d'écran
      const statusEl = document.getElementById('product-status');
      if (statusEl) statusEl.textContent = `Produit chargé : ${product.name}`;

      // Afficher toutes les informations
      displayProductImage(product);
      displayProductInfo(product);
      populateColorSelect(product.colors);
      updatePageSeo(product);

      // Attacher le gestionnaire du formulaire
      bindAddToCartForm(product);
    })
    .catch(function (error) {
      console.error('Erreur chargement produit :', error);
      displayProductError(
        'Impossible de charger ce produit. Vérifiez que le serveur API est démarré.'
      );
    });
}

/**
 * Affiche l'image du produit.
 * @param {Object} product
 */
function displayProductImage(product) {
  const container = document.getElementById('product-image-container');
  if (!container) return;

  container.innerHTML = '';

  const img = document.createElement('img');
  img.src = product.imageUrl || '';
  // RGAA 1.1 : attribut alt descriptif
  img.alt = product.altTxt || `Photo du canapé ${product.name}`;
  img.width = 600;
  img.height = 450;

  img.onerror = function () {
    this.alt = `Image non disponible pour ${product.name}`;
  };

  container.appendChild(img);
}

/**
 * Affiche le titre, le prix et la description du produit.
 * @param {Object} product
 */
function displayProductInfo(product) {
  // Titre — h1 de la page
  const titleEl = document.getElementById('product-title');
  if (titleEl) titleEl.textContent = product.name || 'Produit sans nom';

  // Prix avec formatage accessible
  const priceEl = document.getElementById('product-price');
  if (priceEl && product.price !== undefined) {
    const formatted = formatPrice(product.price);
    priceEl.textContent = formatted;
    priceEl.setAttribute('aria-label', `Prix : ${formatted}`);
  }

  // Description
  const descEl = document.getElementById('product-description');
  if (descEl) {
    descEl.textContent = product.description || 'Aucune description disponible.';
  }

  // Fil d'Ariane — mettre à jour le nom du produit
  const breadcrumbName = document.getElementById('breadcrumb-product-name');
  if (breadcrumbName) breadcrumbName.textContent = product.name || 'Produit';
}

/**
 * Peuple le menu déroulant avec les couleurs disponibles.
 * @param {Array<string>} colors - Tableau des couleurs disponibles
 */
function populateColorSelect(colors) {
  const select = document.getElementById('product-colors');
  if (!select) return;

  // Garder l'option vide initiale
  select.innerHTML = '<option value="">-- Choisissez une couleur --</option>';

  if (!Array.isArray(colors) || colors.length === 0) {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = 'Aucune couleur disponible';
    option.disabled = true;
    select.appendChild(option);
    return;
  }

  colors.forEach(function (color) {
    const option = document.createElement('option');
    option.value = color;
    option.textContent = color;
    select.appendChild(option);
  });
}

/**
 * Attache l'écouteur de soumission du formulaire d'ajout au panier.
 * @param {Object} product - Données du produit (pour récupérer l'id)
 */
function bindAddToCartForm(product) {
  const form = document.getElementById('product-form');
  if (!form) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    handleAddToCart(product);
  });
}

/**
 * Gère l'ajout au panier : validation + stockage.
 * @param {Object} product
 */
function handleAddToCart(product) {
  const colorSelect = document.getElementById('product-colors');
  const quantityInput = document.getElementById('product-quantity');
  const colorError = document.getElementById('color-error');
  const quantityError = document.getElementById('quantity-error');
  const successMsg = document.getElementById('add-to-cart-success');

  // Masquer les messages précédents
  if (successMsg) successMsg.setAttribute('hidden', '');

  let isValid = true;

  // --- Validation de la couleur ---
  const selectedColor = colorSelect ? colorSelect.value : '';

  if (!selectedColor) {
    // Afficher l'erreur
    if (colorSelect) colorSelect.setAttribute('aria-invalid', 'true');
    if (colorError) {
      colorError.textContent = 'Veuillez sélectionner une couleur.';
      colorError.removeAttribute('hidden');
    }
    isValid = false;
  } else {
    if (colorSelect) colorSelect.removeAttribute('aria-invalid');
    if (colorError) {
      colorError.textContent = '';
      colorError.setAttribute('hidden', '');
    }
  }

  // --- Validation de la quantité (définie dans validation.js) ---
  const quantity = quantityInput ? parseInt(quantityInput.value, 10) : 0;
  const isQtyValid = validateQuantity(quantity);

  if (!isQtyValid) {
    if (quantityInput) quantityInput.setAttribute('aria-invalid', 'true');
    if (quantityError) {
      quantityError.textContent = 'La quantité doit être un nombre entier entre 1 et 100.';
      quantityError.removeAttribute('hidden');
    }
    isValid = false;
  } else {
    if (quantityInput) quantityInput.removeAttribute('aria-invalid');
    if (quantityError) {
      quantityError.textContent = '';
      quantityError.setAttribute('hidden', '');
    }
  }

  // Si validation échouée, on s'arrête
  if (!isValid) {
    // Mettre le focus sur le premier champ en erreur — RGAA
    if (!selectedColor && colorSelect) {
      colorSelect.focus();
    } else if (!isQtyValid && quantityInput) {
      quantityInput.focus();
    }
    return;
  }

  // --- Ajout au panier (addToCart définie dans cart.js) ---
  addToCart(product._id, selectedColor, quantity);

  // Mettre à jour le badge
  updateCartBadge();

  // Afficher le message de succès — RGAA 7.3 : changement d'état annoncé
  if (successMsg) {
    successMsg.textContent = `✓ ${quantity} canapé${quantity > 1 ? 's' : ''} "${product.name}" — ${selectedColor} ajouté${quantity > 1 ? 's' : ''} à votre panier.`;
    successMsg.removeAttribute('hidden');

    // Masquer automatiquement après 5 secondes
    setTimeout(function () {
      successMsg.setAttribute('hidden', '');
    }, 5000);
  }

  // Annoncer aux lecteurs d'écran
  announceToScreenReader(`Produit ajouté au panier : ${product.name}, couleur ${selectedColor}, quantité ${quantity}.`);

  // Réinitialiser le formulaire
  if (colorSelect) colorSelect.value = '';
  if (quantityInput) quantityInput.value = '1';
}

/**
 * Met à jour le titre de la page et les méta SEO avec les infos du produit.
 * @param {Object} product
 */
function updatePageSeo(product) {
  if (!product) return;

  document.title = `Kanap — ${product.name || 'Produit'}`;

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && product.description) {
    metaDesc.content = product.description.substring(0, 160);
  }
}

/**
 * Affiche un message d'erreur général sur la page produit.
 * @param {string} message
 */
function displayProductError(message) {
  const page = document.getElementById('product-page');
  if (!page) return;

  page.removeAttribute('aria-busy');
  page.innerHTML = `
    <div class="alert alert-error" role="alert" style="grid-column: 1 / -1;">
      <strong>Erreur :</strong> ${escapeHtml(message)}
      <br><br>
      <a href="./index.html" class="btn btn-primary">Retour au catalogue</a>
    </div>
  `;

  const statusEl = document.getElementById('product-status');
  if (statusEl) statusEl.textContent = 'Erreur lors du chargement du produit.';
}

/**
 * Formate un prix en euros.
 * @param {number} price
 * @returns {string}
 */
function formatPrice(price) {
  if (price === undefined || price === null) return 'Prix non disponible';
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
 * Met à jour l'année dans le footer.
 */
function updateFooterYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// Lancement au chargement du DOM
document.addEventListener('DOMContentLoaded', initProductPage);
