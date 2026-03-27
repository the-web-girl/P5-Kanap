/**
 * ============================================================
 * confirmation.js — Logique de la page de confirmation
 * ============================================================
 * Responsabilités :
 * 1. Lire l'orderId depuis l'URL (paramètre ?orderId=)
 * 2. L'afficher sur la page
 *
 * SÉCURITÉ (spec Kanap) :
 * - L'orderId ne doit PAS être stocké (ni localStorage ni sessionStorage)
 * - Il est lu directement depuis l'URL et affiché, c'est tout
 * ============================================================
 */

/**
 * Initialise la page de confirmation.
 */
function initConfirmationPage() {
  updateCartBadge();
  updateFooterYear();

  // Lire l'orderId depuis les paramètres de l'URL
  const orderId = getOrderIdFromUrl();

  // Afficher l'identifiant de commande
  displayOrderId(orderId);
}

/**
 * Récupère l'orderId depuis les paramètres de l'URL.
 * @returns {string|null} L'identifiant de commande ou null si absent
 */
function getOrderIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('orderId');
}

/**
 * Affiche l'identifiant de commande sur la page.
 * @param {string|null} orderId
 */
function displayOrderId(orderId) {
  const displayEl = document.getElementById('order-id-display');
  const titleEl = document.getElementById('confirmation-title');

  if (!orderId) {
    // Cas où l'orderId est absent (accès direct à la page)
    if (displayEl) {
      displayEl.textContent = 'Identifiant non disponible';
      displayEl.style.fontStyle = 'italic';
      displayEl.style.color = 'var(--color-text-muted)';
    }
    if (titleEl) {
      titleEl.textContent = 'Commande traitée';
    }
  } else {
    // Afficher l'orderId reçu
    if (displayEl) {
      displayEl.textContent = orderId;
    }
  }

  // Annoncer aux lecteurs d'écran — RGAA 7.3
  const message = orderId
    ? `Votre commande a été confirmée. Numéro de commande : ${orderId}`
    : 'Votre commande a été traitée.';

  announceToScreenReader(message);
}

/**
 * Envoie un message aux lecteurs d'écran via une zone live ARIA.
 * @param {string} message
 */
function announceToScreenReader(message) {
  let liveRegion = document.getElementById('sr-announcer');
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'sr-announcer';
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);
  }
  liveRegion.textContent = '';
  setTimeout(function () {
    liveRegion.textContent = message;
  }, 200);
}

/**
 * Met à jour l'année dans le footer.
 */
function updateFooterYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// Lancement au chargement du DOM
document.addEventListener('DOMContentLoaded', initConfirmationPage);
