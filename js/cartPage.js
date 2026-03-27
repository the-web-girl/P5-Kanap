/**
 * ============================================================
 * cartPage.js — Logique de la page panier (cart.html)
 * ============================================================
 * Responsabilités :
 * 1. Afficher les articles du panier (récupérer les prix depuis l'API)
 * 2. Permettre la modification de quantité avec mise à jour du total
 * 3. Permettre la suppression d'un article
 * 4. Valider et soumettre le formulaire de commande
 *
 * SÉCURITÉ IMPORTANTE (spec Kanap) :
 * - Les prix NE sont PAS stockés en localStorage
 * - Les prix sont TOUJOURS récupérés depuis l'API au moment de l'affichage
 * ============================================================
 */

/** Stockage des données produits chargées depuis l'API (pour éviter de recalculer) */
let loadedProducts = {};

/**
 * Initialise la page panier.
 */
function initCartPage() {
  updateCartBadge();
  updateFooterYear();

  const cart = getCart();

  if (cart.length === 0) {
    displayEmptyCart();
  } else {
    loadCartProductsFromApi(cart);
  }

  bindOrderForm();
}

/**
 * Charge les données produits depuis l'API pour chaque article du panier.
 * Les prix sont récupérés depuis l'API (pas depuis localStorage — sécurité).
 * @param {Array} cart - Articles du panier [{id, color, quantity}]
 */
function loadCartProductsFromApi(cart) {
  // Créer un tableau de Promises pour récupérer tous les produits en parallèle
  // On récupère les ids uniques pour éviter les doublons de requêtes
  const uniqueIds = [...new Set(cart.map(function (item) { return item.id; }))];

  const fetchPromises = uniqueIds.map(function (productId) {
    return getProductById(productId)
      .then(function (product) {
        // Stocker les données produits dans le cache local
        loadedProducts[productId] = product;
        return product;
      })
      .catch(function (err) {
        console.error(`Impossible de charger le produit ${productId} :`, err);
        return null; // On continue même si un produit est introuvable
      });
  });

  // Une fois TOUS les produits récupérés, on affiche le panier
  Promise.all(fetchPromises)
    .then(function () {
      renderCartItems(cart);
      renderCartTotal(cart);
    })
    .catch(function (err) {
      console.error('Erreur chargement panier :', err);
      displayCartError('Impossible de charger le panier. Vérifiez que le serveur est démarré.');
    });
}

/**
 * Affiche tous les articles du panier.
 * @param {Array} cart
 */
function renderCartItems(cart) {
  const container = document.getElementById('cart-items-container');
  if (!container) return;

  container.innerHTML = '';

  // Conteneur de la liste des articles
  const summaryDiv = document.createElement('div');
  summaryDiv.className = 'cart-summary';

  // En-tête
  const header = document.createElement('div');
  header.className = 'cart-summary-header';
  header.innerHTML = '<h2>Articles sélectionnés</h2>';
  summaryDiv.appendChild(header);

  // Créer une liste pour l'accessibilité — RGAA
  const list = document.createElement('ul');
  list.setAttribute('role', 'list');
  list.id = 'cart-items-list';
  list.setAttribute('aria-label', 'Articles dans votre panier');

  cart.forEach(function (item) {
    const product = loadedProducts[item.id];
    if (!product) {
      // Produit introuvable dans le cache : ligne d'erreur
      console.warn('Produit non trouvé pour id :', item.id);
      return;
    }

    const listItem = createCartItemElement(item, product);
    list.appendChild(listItem);
  });

  summaryDiv.appendChild(list);
  container.appendChild(summaryDiv);

  // Afficher la barre total
  const totalBar = document.getElementById('cart-total-bar');
  if (totalBar) totalBar.removeAttribute('hidden');
}

/**
 * Crée l'élément HTML d'un article du panier.
 * @param {Object} cartItem - {id, color, quantity}
 * @param {Object} product - Données produit depuis l'API
 * @returns {HTMLElement}
 */
function createCartItemElement(cartItem, product) {
  const li = document.createElement('li');
  li.className = 'cart-item';
  li.setAttribute('role', 'listitem');
  // Identifiant unique pour l'accessibilité
  const itemKey = `${product._id}-${cartItem.color}`;
  li.dataset.productId = product._id;
  li.dataset.color = cartItem.color;

  // Image
  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'cart-item-image-wrapper';
  const img = document.createElement('img');
  img.src = product.imageUrl || '';
  img.alt = product.altTxt || `Photo du canapé ${product.name}`;
  img.width = 100;
  img.height = 100;
  imageWrapper.appendChild(img);

  // Informations produit
  const info = document.createElement('div');
  info.className = 'cart-item-info';

  const name = document.createElement('h3');
  name.className = 'cart-item-name';
  name.textContent = product.name;

  const color = document.createElement('p');
  color.className = 'cart-item-color';
  // Point coloré pour indiquer la couleur visuellement
  const colorDot = document.createElement('span');
  colorDot.className = 'cart-item-color-dot';
  colorDot.style.backgroundColor = cartItem.color.toLowerCase();
  colorDot.setAttribute('aria-hidden', 'true');
  color.appendChild(colorDot);
  color.appendChild(document.createTextNode(`Couleur : ${cartItem.color}`));

  const priceEl = document.createElement('p');
  priceEl.className = 'cart-item-price';
  const unitPrice = formatPrice(product.price);
  priceEl.textContent = unitPrice;
  priceEl.setAttribute('aria-label', `Prix unitaire : ${unitPrice}`);

  info.appendChild(name);
  info.appendChild(color);
  info.appendChild(priceEl);

  // Actions (quantité + suppression)
  const actions = document.createElement('div');
  actions.className = 'cart-item-actions';

  // Groupe quantité
  const qtyGroup = document.createElement('div');
  qtyGroup.className = 'cart-item-qty';

  const qtyLabel = document.createElement('label');
  const qtyInputId = `qty-${itemKey}`;
  qtyLabel.setAttribute('for', qtyInputId);
  qtyLabel.textContent = 'Quantité :';

  const qtyInput = document.createElement('input');
  qtyInput.type = 'number';
  qtyInput.id = qtyInputId;
  qtyInput.name = `quantity-${itemKey}`;
  qtyInput.min = '1';
  qtyInput.max = '100';
  qtyInput.value = cartItem.quantity;
  qtyInput.className = 'cart-item-qty-input';
  qtyInput.setAttribute('aria-label', `Quantité pour ${product.name} - ${cartItem.color}`);

  // Mettre à jour la quantité à chaque changement
  qtyInput.addEventListener('change', function () {
    handleQuantityChange(product._id, cartItem.color, this.value);
  });

  qtyGroup.appendChild(qtyLabel);
  qtyGroup.appendChild(qtyInput);

  // Bouton suppression
  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'btn btn-danger';
  deleteBtn.textContent = 'Supprimer';
  // RGAA 6.1 : intitulé de bouton explicite
  deleteBtn.setAttribute('aria-label', `Supprimer ${product.name} - ${cartItem.color} du panier`);

  deleteBtn.addEventListener('click', function () {
    handleDeleteItem(product._id, cartItem.color, product.name);
  });

  actions.appendChild(qtyGroup);
  actions.appendChild(deleteBtn);

  // Assembler
  li.appendChild(imageWrapper);
  li.appendChild(info);
  li.appendChild(actions);

  return li;
}

/**
 * Gère le changement de quantité d'un article.
 * @param {string} productId
 * @param {string} color
 * @param {string|number} newValue - Nouvelle quantité saisie
 */
function handleQuantityChange(productId, color, newValue) {
  const newQty = parseInt(newValue, 10);

  // Validation de la quantité (définie dans validation.js)
  if (!validateQuantity(newQty)) {
    announceToScreenReader('Quantité invalide. Veuillez entrer un nombre entre 1 et 100.');
    // Rétablir la valeur précédente
    const cart = getCart();
    const item = cart.find(function (i) { return i.id === productId && i.color === color; });
    const input = document.querySelector(`[data-product-id="${productId}"][data-color="${color}"] .cart-item-qty-input`);
    if (input && item) input.value = item.quantity;
    return;
  }

  // Mettre à jour le panier (updateCartItemQuantity définie dans cart.js)
  updateCartItemQuantity(productId, color, newQty);
  updateCartBadge();

  // Recalculer et afficher le nouveau total
  const updatedCart = getCart();
  renderCartTotal(updatedCart);

  // Annonce lecteur d'écran
  announceToScreenReader(`Quantité mise à jour : ${newQty}`);
}

/**
 * Supprime un article du panier et met à jour l'affichage.
 * @param {string} productId
 * @param {string} color
 * @param {string} productName - Pour l'annonce accessible
 */
function handleDeleteItem(productId, color, productName) {
  // Supprimer du localStorage (défini dans cart.js)
  removeFromCart(productId, color);
  updateCartBadge();

  // Supprimer l'élément du DOM
  const listItem = document.querySelector(
    `.cart-item[data-product-id="${productId}"][data-color="${color}"]`
  );
  if (listItem) {
    listItem.remove();
  }

  // Vérifier si le panier est maintenant vide
  const updatedCart = getCart();
  if (updatedCart.length === 0) {
    displayEmptyCart();
    // Masquer la barre total
    const totalBar = document.getElementById('cart-total-bar');
    if (totalBar) totalBar.setAttribute('hidden', '');
  } else {
    renderCartTotal(updatedCart);
  }

  // Annonce lecteur d'écran — RGAA 7.3
  announceToScreenReader(`${productName} (${color}) a été retiré de votre panier.`);
}

/**
 * Calcule et affiche le total du panier.
 * Les prix sont récupérés depuis loadedProducts (données API — pas localStorage).
 * @param {Array} cart
 */
function renderCartTotal(cart) {
  const totalAmountEl = document.getElementById('cart-total-amount');
  const totalAnnounceEl = document.getElementById('cart-total-announce');

  let total = 0;

  cart.forEach(function (item) {
    const product = loadedProducts[item.id];
    if (product && product.price) {
      total += product.price * item.quantity;
    }
  });

  const formatted = formatPrice(total);
  if (totalAmountEl) {
    totalAmountEl.textContent = formatted;
    totalAmountEl.setAttribute('aria-label', `Total : ${formatted}`);
  }
  if (totalAnnounceEl) {
    totalAnnounceEl.textContent = `Total de votre commande : ${formatted}`;
  }
}

/**
 * Affiche l'état vide du panier.
 */
function displayEmptyCart() {
  const container = document.getElementById('cart-items-container');
  if (!container) return;

  container.innerHTML = `
    <div class="cart-empty-message" role="status">
      <p>Votre panier est vide.</p>
      <a href="./index.html" class="btn btn-primary">Découvrir nos canapés</a>
    </div>
  `;

  // Masquer la barre total et le formulaire
  const totalBar = document.getElementById('cart-total-bar');
  if (totalBar) totalBar.setAttribute('hidden', '');

  const orderSection = document.getElementById('order-section');
  if (orderSection) orderSection.setAttribute('hidden', '');
}

/**
 * Affiche un message d'erreur de chargement.
 * @param {string} message
 */
function displayCartError(message) {
  const container = document.getElementById('cart-items-container');
  if (!container) return;

  container.innerHTML = `
    <div class="alert alert-error" role="alert">
      <strong>Erreur :</strong> ${escapeHtml(message)}
    </div>
  `;
}

/**
 * Attache le gestionnaire de soumission du formulaire de commande.
 */
function bindOrderForm() {
  const form = document.getElementById('order-form');
  if (!form) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    handleOrderSubmit(form);
  });

  // Validation en temps réel sur chaque champ (à la sortie du champ — blur)
  const fields = ['firstName', 'lastName', 'address', 'city', 'email'];
  fields.forEach(function (fieldName) {
    const input = document.getElementById(`order-${fieldName}`);
    if (!input) return;

    input.addEventListener('blur', function () {
      validateField(input, fieldName); // Défini dans validation.js
    });
  });
}

/**
 * Gère la soumission du formulaire de commande.
 * Valide les données, récupère les ids produits, envoie à l'API.
 * @param {HTMLFormElement} form
 */
function handleOrderSubmit(form) {
  const cart = getCart();

  // Vérifier que le panier n'est pas vide
  if (cart.length === 0) {
    const globalError = document.getElementById('form-global-error');
    if (globalError) {
      globalError.textContent = 'Votre panier est vide. Ajoutez des produits avant de commander.';
      globalError.removeAttribute('hidden');
    }
    return;
  }

  // Valider le formulaire (validateOrderForm défini dans validation.js)
  const contactData = validateOrderForm(form);
  if (!contactData) {
    // La validation a échoué — les messages d'erreur sont déjà affichés
    return;
  }

  // Désactiver le bouton pendant la requête
  const submitBtn = document.getElementById('btn-order');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi en cours…';
  }

  // Préparer le tableau des ids produits (spec : array de strings product-ID)
  const productIds = cart.map(function (item) { return item.id; });

  // Masquer les erreurs globales précédentes
  const globalError = document.getElementById('form-global-error');
  if (globalError) globalError.setAttribute('hidden', '');

  // Envoyer la commande à l'API (postOrder défini dans api.js)
  postOrder(contactData, productIds)
    .then(function (response) {
      // Récupérer l'orderId depuis la réponse
      const orderId = response.orderId;

      if (!orderId) {
        throw new Error('Identifiant de commande manquant dans la réponse API.');
      }

      // Vider le panier APRÈS confirmation
      clearCart(); // Défini dans cart.js

      // Rediriger vers la page de confirmation avec l'orderId en URL
      // L'orderId ne doit PAS être stocké (spec), seulement transmis via URL
      window.location.href = `./confirmation.html?orderId=${encodeURIComponent(orderId)}`;
    })
    .catch(function (error) {
      console.error('Erreur lors de la commande :', error);

      // Réactiver le bouton
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Confirmer la commande';
      }

      // Afficher l'erreur
      if (globalError) {
        globalError.textContent = `Erreur lors de l'envoi de la commande : ${error.message}`;
        globalError.removeAttribute('hidden');
      }

      announceToScreenReader('Erreur lors de l\'envoi de la commande. Veuillez réessayer.');
    });
}

/**
 * Formate un prix en euros.
 * @param {number} price
 * @returns {string}
 */
function formatPrice(price) {
  if (price === undefined || price === null) return '—';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

/**
 * Échappe les caractères HTML.
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
document.addEventListener('DOMContentLoaded', initCartPage);
