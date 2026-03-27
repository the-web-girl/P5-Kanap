/**
 * ============================================================
 * api.js — Service centralisé d'appels à l'API Kanap
 * ============================================================
 * Utilise fetch() qui retourne des Promises (pas de callbacks).
 * Spec : http://localhost:3000/api/products
 * ============================================================
 */

/** URL de base de l'API — à modifier pour la mise en production */
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Récupère l'ensemble des produits disponibles.
 * @returns {Promise<Array>} Tableau de tous les produits
 */
function getAllProducts() {
  return fetch(`${API_BASE_URL}/products`)
    .then(function (response) {
      // Vérifier que la réponse HTTP est correcte
      if (!response.ok) {
        throw new Error(`Erreur serveur : ${response.status} ${response.statusText}`);
      }
      return response.json();
    });
}

/**
 * Récupère un produit unique par son identifiant.
 * @param {string} productId - L'identifiant unique du produit
 * @returns {Promise<Object>} L'objet produit correspondant
 */
function getProductById(productId) {
  if (!productId) {
    return Promise.reject(new Error('Identifiant produit manquant'));
  }

  return fetch(`${API_BASE_URL}/products/${productId}`)
    .then(function (response) {
      if (!response.ok) {
        throw new Error(`Produit introuvable : ${response.status}`);
      }
      return response.json();
    });
}

/**
 * Envoie une commande au serveur.
 * @param {Object} contact - Informations client {firstName, lastName, address, city, email}
 * @param {Array<string>} productIds - Tableau des identifiants de produits commandés
 * @returns {Promise<Object>} Réponse API contenant contact, products et orderId
 */
function postOrder(contact, productIds) {
  // Validation préalable : s'assurer que les paramètres sont présents
  if (!contact || !productIds || !Array.isArray(productIds)) {
    return Promise.reject(new Error('Données de commande invalides'));
  }

  const orderPayload = {
    contact: contact,
    products: productIds
  };

  return fetch(`${API_BASE_URL}/products/order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderPayload)
  })
    .then(function (response) {
      if (!response.ok) {
        throw new Error(`Erreur lors de la commande : ${response.status}`);
      }
      return response.json();
    });
}
