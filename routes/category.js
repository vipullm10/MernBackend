const express = require('express');
const router = express.Router();

const {getCategory,getAllCategories,getCategoryById,createCategory,updateCategory,removeCategory} = require('../controllers/category');
const {isSignedIn,isAdmin,isAuthenticated} = require('../controllers/auth');
const {getUserById} = require('../controllers/user');


//param routes
router.param('userId',getUserById);
router.param('categoryId',getCategoryById);


//actual routes
router.post(
    '/category/create/:userId',
    isSignedIn,
    isAuthenticated,
    isAdmin,
    createCategory
);
router.get('/category/:categoryId',getCategory);
router.get('/categories',getAllCategories);
router.put(
    '/category/:categoryId',
    isSignedIn,
    isAuthenticated,
    isAdmin,
    updateCategory
);
router.delete(
    '/category/":categoryId/:userId',
    isSignedIn,
    isAuthenticated,
    isAdmin,
    removeCategory
);

module.exports = router;