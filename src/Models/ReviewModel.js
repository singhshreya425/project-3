const mongoose = require ("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const reviewSchema = new mongoose.Schema({
    bookId: {
        type:ObjectId, 
        ref:"Book",
        required:true
    },
    reviewedBy: {
        type:String,
        required:true,
        default: 'Guest', 
        value: "reviewer's name"
    },
    reviewedAt: {
        type:Date,
        required:true
    },
    rating: {
        type:Number
    },
    review: {
        type:String
    },
    isDeleted: {
        type:Boolean,
        default: false
    }
  },{timestamps:true})

  module.exports = mongoose.model("Review",reviewSchema)