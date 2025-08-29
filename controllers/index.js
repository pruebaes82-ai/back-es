const loginController = require('./login');
const productController = require('./product');
const purchaseController = require('./purchase');
const extrasController = require('./extras');


// Login
exports.register = loginController.register;
exports.login = loginController.login;
exports.isLogged = loginController.isLogged;

// Products
exports.createProduct = productController.createProduct;

// purchase
exports.purchase = purchaseController.purchase;

// extras
exports.getUsers = extrasController.getUsers;
exports.getProducts = extrasController.getProducts;
exports.getPurchases = extrasController.getPurchases;
exports.injectSQL = extrasController.injectSQL;
