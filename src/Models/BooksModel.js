const { default: mongoose } = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId

const bookSchema = new mongoose.Schema({

  title: { type: string, 
    unique: true },
  excerpt: { type: string },
  userId: {
    ObjectId,
    refs: "user model"
  },
  ISBN: { type: string, unique: true },
  category: { type: string },
  subcategory: [String],
  reviews: {
    type: number,
    default: 0,
    comment: reviews
  },

  deletedAt: { type: Date },

  isDeleted: {
    type: boolean,
    default: false
  },

  releasedAt: {
    type: Date
  }

}
  , { timestamps: true });

module.exports = mongoose.model("book", bookSchema)