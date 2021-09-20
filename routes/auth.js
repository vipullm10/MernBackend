const express = require("express");
const router = express.Router();
const {check} = require('express-validator');
const {signout,signup,signin,isSignedIn} = require('../controllers/auth');

//sign out route
router.get('/signout',signout);

//sign up route
router.post('/signup',[
    check("name","name should be at least 3 char").isLength({min:3}),
    check("email","please enter a valid email").isEmail(),
    check("password","password should be at least 3 char").isLength({min:3})
],signup);

//sign in route
router.post('/signin',[
    check("email","please enter a valid email").isEmail(),
    check("password","please provide the password").isLength({min:1})
],signin);


module.exports = router;