/**
 * ============================================================
 * cart.js — Gestion du panier (localStorage)
 * ============================================================
 * IMPORTANT SÉCURITÉ (spec Kanap) :
 * - Les PRIX ne sont jamais stockés en localStorage.
 *   Seuls l'id, la couleur et la quantité sont sauvegardés.
 * - Le prix est toujours récupéré depuis l'API au moment
 *   de l'affichage du panier (et non depuis le stockage local).
 *
 * Règle métier (spec) :
 * - Un produit avec la même couleur = 1 seule ligne, quantité cumulée
 * - Même produit, couleur différente = 2 lignes distinctes
 * ============================================================
 */

const CART_STORAGE_KEY = 'kanap_cart';

/**
 * Récupère le panier depuis localStorage.
 * @returns {Array<{id: string, color: string, quantity: number}>}
 */
function getCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Vérification que c'est bien un tableau
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Erreur lecture du panier :', error);
    return [];
  }
}

/**
 * Sauvegarde le panier dans localStorage.
 * @param {Array} cart - Le panier à sauvegarder
 */
function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Erreur sauvegarde du panier :', error);
  }
}

/**
 * Ajoute un produit au panier ou cumule la quantité si
 * le même produit+couleur existe déjà.
 * @param {string} productId - L'id du produit
 * @param {string} color - La couleur choisie
 * @param {number} quantity - La quantité à ajouter
 */
function addToCart(productId, color, quantity) {
  const cart = getCart();

  // Chercher si ce produit+couleur existe déjà
  const existingIndex = findCartItemIndex(cart, productId, color);

  if (existingIndex !== -1) {
    // Cumuler la quantité
    cart[existingIndex].quantity += quantity;
  } else {
    // Ajouter une nouvelle entrée (sans le prix — spec sécurité)
    cart.push({
      id: productId,
      color: color,
      quantity: quantity
    });
  }

  saveCart(cart);
}

/**
 * Met à jour la quantité d'un article spécifique dans le panier.
 * @param {string} productId
 * @param {string} color
 * @param {number} newQuantity
 */
function updateCartItemQuantity(productId, color, newQuantity) {
  const cart = getCart();
  const index = findCartItemIndex(cart, productId, color);

  if (index === -1) return;

  if (newQuantity <= 0) {
    // Supprimer si quantité atteint 0
    cart.splice(index, 1);
  } else {
    cart[index].quantity = newQuantity;
  }

  saveCart(cart);
}

/**
 * Supprime un article du panier (par productId + couleur).
 * @param {string} productId
 * @param {string} color
 */
function removeFromCart(productId, color) {
  let cart = getCart();
  cart = cart.filter(function (item) {
    return !(item.id === productId && item.color === color);
  });
  saveCart(cart);
}

/**
 * Vide complètement le panier.
 * Utilisé après la confirmation de commande.
 */
function clearCart() {
  localStorage.removeItem(CART_STORAGE_KEY);
}

/**
 * Retourne le nombre total d'articles dans le panier.
 * @returns {number}
 */
function getCartItemCount() {
  const cart = getCart();
  return cart.reduce(function (total, item) {
    return total + item.quantity;
  }, 0);
}

/**
 * Trouve l'index d'un article dans le panier par productId + couleur.
 * @param {Array} cart
 * @param {string} productId
 * @param {string} color
 * @returns {number} Index ou -1 si non trouvé
 */
function findCartItemIndex(cart, productId, color) {
  return cart.findIndex(function (item) {
    return item.id === productId && item.color === color;
  });
}

/**
 * Met à jour le badge du nombre d'articles dans le header.
 * Appelée sur chaque page pour maintenir la cohérence.
 */
function updateCartBadge() {
  const badge = document.getElementById('cart-count-badge');
  if (!badge) return;

  const count = getCartItemCount();
  badge.textContent = count;

  // Accessibilité : mettre à jour le aria-label du lien panier
  const cartLink = document.querySelector('.cart-nav-link');
  if (cartLink) {
    cartLink.setAttribute('aria-label',
      count > 0
        ? `Panier — ${count} article${count > 1 ? 's' : ''}`
        : 'Panier — vide'
    );
  }

  // Masquer/afficher le badge si vide
  badge.style.display = count > 0 ? 'inline-flex' : 'none';
}
