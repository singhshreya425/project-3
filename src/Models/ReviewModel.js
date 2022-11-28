const mongoose = require ("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const reviewSchema = new mongoose.Schema({
    bookId: {type:ObjectId, 
        ref:"book model"},
    reviewedBy: {type:string,
         default: 'Guest', 
         value: "reviewer's name"},
    reviewedAt: {Date:Date.now},
    rating: {number: "min 1",
              number:"max 5"},
    review: {type:string},
      
    isDeleted: {type:boolean,
                 default: false}
  },
  {timestamps:true})

  module.exports = mongoose.model("review",reviewSchema)