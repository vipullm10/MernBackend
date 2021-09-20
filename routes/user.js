const express = require('express');
const router = express.Router();

const {getUserById,getUser,updateUser} = require('../controllers/user');
const {isSignedIn,isAuthenticated,isAdmin} = require('../controllers/auth');


router.param('userid',getUserById);
router.get('/user/:userid',isSignedIn,isAuthenticated,getUser);
router.put('/user/:userid',isSignedIn,isAuthenticated,updateUser);



module.exports = router;