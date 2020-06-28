const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const User = require('../models/user')
const bcrypt = require('bcrypt')
const { json } = require('body-parser')

const jwt = require('jsonwebtoken')
const checkauth = require('../authchecker/check-auth')

router.get('/', (req, res, next) => {
    console.log("user data is sdfdsfdsf", req.userData)
    res.status(200).json({
        message: "Welcome to user Home Page"
    });
});

router.post('/login', function(req, res, next) {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(404).json({
                    message: "User doesn't exists"
                })
            }
            bcrypt.compare(req.body.password, user[0].password, function(err, result) {
                if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        password: user[0]._id
                    }, 'secrete', { expiresIn: "480h" })
                    return res.status(200).json({
                        message: "Congrats!! you are successfully logged in",
                        token: token
                    })
                }
                if (!result) {
                    return res.status(404).json({
                        message: "Authorization Failed"
                    })
                }
            })
        })
        .catch();
});

router.get('/alluser', checkauth, function(req, res, next) {
    if (req.userData.email === 'admin@admin.com') {
        User.find()
            .exec()
            .then(user => {
                res.status(200).json({
                    userlist: user
                })
            }).catch(err => {
                res.status(404).json({
                    error: err
                })
            });
    } else {
        res.status(404).json({
            message: "Sorry you don't have privilege to view. Please login through Admin credentials"
        })
    }

})


router.post('/signup', function(req, res, next) {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "Mail id already exists"
                })
            } else {
                bcrypt.hash(req.body.password, 10, function(err, hash) {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user
                            .save()
                            .then(result => {
                                console.log(result)
                                res.status(201).json({
                                    message: "User created",
                                    userdetail: {
                                        email: result.email
                                    }
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500), json({
                                    error: err
                                })
                            })
                    }
                });
            }
        })
        .catch();

})







module.exports = router;