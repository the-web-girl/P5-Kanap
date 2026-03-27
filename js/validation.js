/**
 * ============================================================
 * validation.js — Validation des formulaires
 * ============================================================
 * Spec Kanap : Les données doivent être correctement formatées
 * avant envoi à l'API.
 * RGAA 11.11 : Chaque message d'erreur est lié au champ
 * concerné via aria-describedby.
 * ============================================================
 */

/**
 * Règles de validation par champ.
 * Chaque règle contient :
 * - validate(value) → true si valide
 * - message → texte affiché en cas d'erreur
 */
const VALIDATION_RULES = {
  firstName: {
    validate: function (value) {
      // Pas de chiffres, minimum 2 caractères, lettres + tirets + apostrophes
      return /^[A-Za-zÀ-ÿ\-' ]{2,50}$/.test(value.trim());
    },
    message: 'Le prénom ne doit contenir que des lettres (min. 2 caractères, pas de chiffres).'
  },
  lastName: {
    validate: function (value) {
      return /^[A-Za-zÀ-ÿ\-' ]{2,50}$/.test(value.trim());
    },
    message: 'Le nom ne doit contenir que des lettres (min. 2 caractères, pas de chiffres).'
  },
  address: {
    validate: function (value) {
      // Adresse : min 5 caractères, lettres + chiffres + caractères courants
      return value.trim().length >= 5 && value.trim().length <= 200;
    },
    message: "L'adresse doit comporter au moins 5 caractères."
  },
  city: {
    validate: function (value) {
      return /^[A-Za-zÀ-ÿ\-' ]{2,100}$/.test(value.trim());
    },
    message: 'La ville ne doit contenir que des lettres (min. 2 caractères).'
  },
  email: {
    validate: function (value) {
      // Validation email : doit contenir @ et un domaine valide
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
    },
    message: "L'adresse email n'est pas valide (exemple : prenom@domaine.fr)."
  }
};

/**
 * Valide un champ individuel et affiche/masque le message d'erreur.
 * @param {HTMLInputElement} input - Le champ à valider
 * @param {string} fieldName - Nom de la règle à appliquer
 * @returns {boolean} true si valide
 */
function validateField(input, fieldName) {
  const rule = VALIDATION_RULES[fieldName];
  if (!rule) return true; // Pas de règle définie = valide

  const value = input.value;
  const isValid = rule.validate(value);

  // Récupérer l'élément d'erreur lié (via aria-describedby)
  const errorElementId = input.getAttribute('aria-describedby');
  const errorElement = errorElementId
    ? document.getElementById(errorElementId)
    : null;

  if (isValid) {
    // Champ valide : retirer les indications d'erreur
    input.setAttribute('aria-invalid', 'false');
    input.removeAttribute('aria-invalid');
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.setAttribute('hidden', '');
    }
  } else {
    // Champ invalide : afficher l'erreur
    input.setAttribute('aria-invalid', 'true');
    if (errorElement) {
      errorElement.textContent = rule.message;
      errorElement.removeAttribute('hidden');
    }
  }

  return isValid;
}

/**
 * Valide l'ensemble du formulaire de commande.
 * @param {HTMLFormElement} form - Le formulaire à valider
 * @returns {boolean} true si tous les champs sont valides
 * @returns {Object|null} Les données du formulaire si valide, null sinon
 */
function validateOrderForm(form) {
  let isFormValid = true;
  const fields = ['firstName', 'lastName', 'address', 'city', 'email'];
  const data = {};

  fields.forEach(function (fieldName) {
    const input = form.querySelector(`#order-${fieldName}`);
    if (!input) return;

    const fieldValid = validateField(input, fieldName);
    if (!fieldValid) {
      isFormValid = false;
    } else {
      data[fieldName] = input.value.trim();
    }
  });

  // Si invalide, mettre le focus sur le premier champ en erreur
  if (!isFormValid) {
    const firstError = form.querySelector('[aria-invalid="true"]');
    if (firstError) {
      firstError.focus();
      // Annoncer aux lecteurs d'écran — RGAA 11.11
      announceToScreenReader('Formulaire incomplet. Veuillez corriger les erreurs signalées.');
    }
    return null;
  }

  return data;
}

/**
 * Valide la quantité choisie (page produit).
 * @param {number} quantity - Quantité saisie
 * @returns {boolean} true si valide (1–100)
 */
function validateQuantity(quantity) {
  const num = parseInt(quantity, 10);
  return !isNaN(num) && num >= 1 && num <= 100;
}

/**
 * Envoie un message aux lecteurs d'écran via une zone live ARIA.
 * RGAA 7.3 : Les changements de contexte sont annoncés.
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
  // Reset puis mise à jour pour forcer l'annonce
  liveRegion.textContent = '';
  setTimeout(function () {
    liveRegion.textContent = message;
  }, 50);
}
