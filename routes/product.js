const express = require('express');
const router = express.Router();

const {getProductById,createProduct,getProduct,photo,updateProduct,deleteProduct} = require('../controllers/product');
const {getUserById, getUser} = require('../controllers/user');
const {isAdmin,isAuthenticated,isSignedIn} = require('../controllers/auth');

//all of params
router.param('userId',getUserById);
router.param('productId',getProductById);

//all of actual routes
router.post('/product/create/:userId',isSignedIn,isAuthenticated,isAdmin,createProduct);
router.get('/product/:productId',getProduct);
router.get('/product/photo/:productId',photo);
router.delete('/product/:productId/:userId',isSignedIn,isAuthenticated,isAdmin,deleteProduct);
router.put('/product/:productId/:userId',isSignedIn,isAuthenticated,isAdmin,updateProduct);

module.exports = router;