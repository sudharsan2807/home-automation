const mongoose = require('mongoose');

const customer = new mongoose.Schema({
    code: String,
    name: String,
    date: String,
    city: String,
    purchase: Number,
    pure: Number,
    collected: Number,
    balance: Number
})

const custschema = new mongoose.Schema({
    bill: Number,
    customer: [customer],
    createdAt: { type: Date, default: Date.now }
});

mongoose.model("Customer", custschema)