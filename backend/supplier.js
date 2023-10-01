const mongoose = require('mongoose');

const supplier = new mongoose.Schema({
    bill: Number,
    payback: Number,
    balance: Number
})

const suppliershema = new mongoose.Schema({
    name: String,
    balance: Number,
    supplier: [supplier],
    createdAt: { type: Date, default: Date.now }
})

mongoose.model("Supplier", suppliershema)