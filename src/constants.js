export const API_URL = `${process.env.REACT_APP_SYMFONY_APP_URL}/api`;
export const API_AUTH_URL = `${process.env.REACT_APP_SYMFONY_APP_URL}/profile`;
export const API_CATEGORIE_PRODUIT_ENDPOINT = API_URL + '/categorie_produits';
export const API_LOGIN = API_URL + '/login_check';
export const API_PANIER = API_URL + '/panier';
export const API_INSCRIPTION = API_URL + '/inscription';
export const API_VALIDATION_CDE = API_AUTH_URL + '/validationPanier'
// TODO YC : Repasser la durée du token à 1h
export const TOKEN_TTL = 36000;
