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
exports.showDatabase = extrasController.showDatabase;
exports.injectSQL = extrasController.injectSQL;