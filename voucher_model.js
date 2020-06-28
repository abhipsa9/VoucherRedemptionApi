const mongoose = require('mongoose')

const voucherSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    vouchernumber: { type: String, required: true },
    pin: { type: String, required: true },
    timestampofcreation: { type: String, default: new Date().getTime() },
    timestampofexpiry: { type: String, default: new Date().getTime() + 86400000 },
    amount: { type: Number, required: true },
    redeemcount: { type: Number, default: 0 },
    redeemtimestamp: { type: String, required: true },
    email: { type: String, required: true }
});

module.exports = mongoose.model('Voucher', voucherSchema);