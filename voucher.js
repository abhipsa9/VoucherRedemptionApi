const express = require('express');
const checkAuth = require('../authchecker/check-auth');
const router = express.Router()
const mongoose = require('mongoose')
const Voucher = require('../models/voucher')
const bcrypt = require('bcrypt')
const { json } = require('body-parser')

const jwt = require('jsonwebtoken');
const User = require('../models/user');

router.post('/generatevoucher', checkAuth, function(req, res, next) {
    const voucherdetail = new Voucher({
        _id: new mongoose.Types.ObjectId(),
        vouchernumber: "VCD" + Math.floor(1000000000 + Math.random() * 9000000000),
        pin: Math.floor(100000 + Math.random() * 900000),
        timestampofcreation: new Date().getTime(),
        timestampofexpiry: new Date().getTime() + 86400000,
        amount: req.body.amount,
        redeemtimestamp: '0',
        email: req.userData.email
    })
    voucherdetail.save()
        .then(res.status(200).json({
            message: "Your Voucher generated successfully",
            VoucherDetails: voucherdetail
        }))

})



router.get('/', function(req, res, next) {
    res.status(200).json({
        message: "Welcome to Voucher Home Page"
    });
});
router.get('/allvouchers', checkAuth, function(req, res, next) {
    if (req.userData.email === 'admin@admin.com') {
        Voucher.find()
            .exec()
            .then(voucherlist => {
                res.status(200).json({
                    VoucherCount: voucherlist.length,
                    VoucherList: voucherlist
                });
            }).catch(err => {
                res.status(404).json({
                    error: err
                })
            })

    } else {
        res.status(404).json({
            message: "Sorry you don't have privilege to view. Please login through Admin credentials"
        })
    }

});
router.get('/myvoucherlist', checkAuth, function(req, res, next) {

    Voucher.find({ email: req.userData.email })
        .exec()
        .then(voucherlistforuser => {
            res.status(200).json({
                VoucherCount: voucherlistforuser.length,
                Your_VoucherList: voucherlistforuser
            })
        })

    // res.status(200).json({
    //     message: "Welcome to Voucher List Page for user"
    // });
});

router.get('/getvoucherdetail/:vouchernumber', checkAuth, function(req, res, next) {
    if (req.userData.email === 'admin@admin.com') {
        Voucher.find({ vouchernumber: req.params.vouchernumber })
            .exec()
            .then(voucherlist => {
                res.status(200).json({
                    VoucherCount: voucherlist.length,
                    VoucherList: voucherlist
                });
            }).catch(err => {
                res.status(404).json({
                    error: err
                })
            })

    } else {
        res.status(404).json({
            message: "Sorry you don't have privilege to view. Please login through Admin credentials"
        })
    }
});

// router.post('/', function(req, res, next) {
//     const voucher = {
//         id: req.body.id,
//         pin: req.body.pin,
//         amount: req.body.amount
//     }
//     res.status(200).json({
//         message: "Welcome to Voucher Redeem Page",
//         voucherDetail: voucher
//     });
// });



router.post('/redeemmyvoucher', checkAuth, function(req, res, next) {

    const voucher_redeem_details = {
        amount: req.body.amount,
        vouchernumber: req.body.vouchernumber,
        pin: req.body.pin,
        timestamp: new Date().getTime()
    }
    console.log(voucher_redeem_details)
    Voucher.find({ vouchernumber: req.body.vouchernumber })
        .exec()
        .then(voucherlistarray => {
            if (voucherlistarray.length < 1) {
                return res.status(404).json({
                    message: "Hey no such Voucher is visible in our account"
                })
            } else {
                if (voucherlistarray[0].pin === req.body.pin) {
                    const currenttime1 = new Date().getTime()
                    if (voucherlistarray[0].timestampofexpiry <= currenttime1) {
                        return res.status(200).json({
                            message: "Sorry your voucher got expired. Generate a Voucher again"
                        });
                    } else {
                        const currenttime2 = new Date().getTime()
                        if (currenttime2 - voucherlistarray[0].redeemtimestamp < 600000) {
                            return res.status(200).json({
                                message: "Please try after some time. Buffer time between consecutive redeems is 10 mins"
                            });
                        } else {
                            if (voucherlistarray[0].redeemcount === 5) {
                                return res.status(200).json({
                                    message: "Sorry you have already redeemed 5 times. Please generate another voucher"
                                });
                            } else {
                                if (voucherlistarray[0].amount >= req.body.amount) {
                                    const newamount = voucherlistarray[0].amount - req.body.amount;
                                    const newtimestampatredeem = new Date().getTime();
                                    const newcount = voucherlistarray[0].redeemcount + 1;

                                    Voucher.find({ vouchernumber: req.body.vouchernumber })
                                        .exec()
                                        .then(voucherdetail => {
                                            Voucher.update({ _id: voucherdetail[0]._id }, { $set: { redeemtimestamp: newtimestampatredeem, redeemcount: newcount, amount: newamount } })
                                                .exec().then(result => {
                                                    res.status(200).json({
                                                        message: "You have successfully redeemed the amount"
                                                    })
                                                })
                                                .catch(err => {
                                                    res.status(404).json({
                                                        error: err
                                                    })
                                                })
                                        })
                                } else {
                                    return res.status(200).json({
                                        message: "Your balance is out of limit to be redeemed"
                                    })
                                }
                            }
                        }

                    }
                } else {
                    return res.status(404).json({
                        message: "Hey you entered wrnong pin. Please try again."
                    })
                }
            }
        })
        .catch(err => {
            res.status(404).json({
                error: err
            })
        });
});

module.exports = router;