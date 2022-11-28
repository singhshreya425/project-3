const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId
const userSchema = new mongoose.Schema({

    title: {
        type: string,
        required: true,
        enum: ['Mr', 'Mrs', 'Miss'],
        trim: true
    },
    name: { type: string },
    phone: {
        type: string,
        unique: true
    },
    email: {
        type: string,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: string,
        length: { minLen: 8, maxLen: 15 }
    },
    address: {
        street: { string },
        city: { string },
        pincode: { string }
    },


}, { timestamps: true })
module.exports = mongoose.model('user', userSchema)