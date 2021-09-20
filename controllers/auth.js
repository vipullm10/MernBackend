const User = require('../models/user');
const {validationResult} = require("express-validator");
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');


//controllers for sign in , sign out , sign up
exports.signout = (req, res) => {
    res.clearCookie('token');
    res.json({
        message: "User signout successfull"
    });
};

exports.signup = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(402).json({
            "field": errors.array()[0].param,
            "errorMessage": errors.array()[0].msg
        })
    }
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                err: "Not able to save user"
            })
        }
        res.json({
            name: user.name,
            email: user.email,
            id: user._id
        });
    });
};

exports.signin = (req, res) => {
    const {email,password} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(402).json({
            "field": errors.array()[0].param,
            "errorMessage": errors.array()[0].msg
        })
    }
    User.findOne(
        {email}, 
        (err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    "error": "User not found"
                })
            }
            if (!user.authenticate(password)) {
                return res.status(400).json({
                    "error": "Email and password do not match"
                });
            }

            //create token
            const token = jwt.sign({
                _id: user._id
            }, process.env.SECRET);

            //put token in user's cookie
            res.cookie("token", token, {
                expire: new Date() + 9999
            });

            //send response to the frontend
            const {
                _id,
                name,
                email,
                role
            } = user;
            return res.status(200).json({
                token,
                user: {
                    _id,
                    email,
                    role,
                    name
                }
            });
        }
    );
};



//protected routes
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth"
});


//custom middleware

//check whether the user is authenticated before making an API Call
exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!checker) {
        return res.status(403).json({
            error: "Access denied"
        });
    }
    next();
}

//check whether the user is an admin user
exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: "Access DENIED"
        });
    }
    next();
}