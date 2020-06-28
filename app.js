const express = require('express');
const app = express();
const bodyparser = require('body-parser')
const mongoose = require('mongoose')

const voucherroute = require('./api/voucher');
const userroute = require('./api/user')
const { urlencoded, json } = require('body-parser');

mongoose.connect('mongodb+srv://admin:admin@voucher-jx1mv.mongodb.net/<dbname>?retryWrites=true&w=majority')


app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())

app.use('/serverstatus', function(req, res, next) {
    res.status(200).json({
        message: "Server is running"
    });
});

app.use('/voucher', voucherroute)
app.use('/user', userroute)

module.exports = app;