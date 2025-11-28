import * as loginController from './login.js';
import * as productController from './product.js';
import * as purchaseController from './purchase.js';
import * as extrasController from './extras.js';

// Login
export const register = loginController.register;
export const login = loginController.login;
export const isLogged = loginController.isLogged;

// Products
export const createProduct = productController.createProduct;

// Purchase
export const purchase = purchaseController.purchase;

// Extras
export const getUsers = extrasController.getUsers;
export const getProducts = extrasController.getProducts;
export const getPurchases = extrasController.getPurchases;
export const getProductById = extrasController.getProductById;
export const injectSQL = extrasController.injectSQL;
export const increaseBalance = extrasController.increaseBalance;
export const getBalance = extrasController.getBalance;