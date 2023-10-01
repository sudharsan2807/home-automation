const mongoose = require('mongoose');

const stock = new mongoose.Schema({
    code: String,
    date: String,
    name: String,
    pure: String,
    pieces: Number,
    weight: Number,
    gram: Number,
    seller: String,
    balance: Number
})

const stockshema = new mongoose.Schema({
    bill: Number,
    product: [stock],
    createdAt: { type: Date, default: Date.now }
})

mongoose.model("Stock", stockshema)