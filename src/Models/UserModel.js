const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId
const userSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        enum: ['Mr', 'Mrs', 'Miss'],
        trim: true
    },
    name: {
        type: String,
        required: true 
    },
    phone: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required:true,
        // length: { minLen: 8, maxLen: 15 }
    },
    address: {
        street: { type:String },
        city: {  type:String },
        pincode: {  type:String }
    }
}, { timestamps: true })
module.exports = mongoose.model('Puser', userSchema)
