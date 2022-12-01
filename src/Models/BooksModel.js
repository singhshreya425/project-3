const { default: mongoose } = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId

const bookSchema = new mongoose.Schema({

  title: { 
    type: String, 
    unique: true,
    required:true,
    trim:true
  },
  excerpt: { 
    type: String,
    required:true,
    trim:true
  },
  userId: {
    type:ObjectId,
    ref: "Puser",
    required:true
  },
  ISBN: { 
    type: String,
     unique: true,
     required:true
    },
  category: {
     type: String,
     required:true
    },
  subcategory:{
    type: [String],
    required:true
  },
  reviews: {
    type: Number,
    default:0,
  },

  deletedAt: { 
    type: Date
   },

  isDeleted: {
    type: Boolean,
    default: false
  },

  releasedAt: {
    type: Date,
    required:true
  }

},{ timestamps: true });

module.exports = mongoose.model("Pbook", bookSchema)