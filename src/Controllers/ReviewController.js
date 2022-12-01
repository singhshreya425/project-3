const BookModel =require("../Models/BooksModel")
const ReviewModel =require("../Models/ReviewModel")
const UserModel = require("../Models/UserModel")
const mongoose = require ("mongoose")


function isValidObjectId(objectId) {
    return mongoose.Types.ObjectId.isValid(objectId);
}

const createReview = async function (req, res) {
    try {
        const data = req.body
        if (Object.entries(data).length == 0) {
            return res.status(400).send({ status: false, msg: "please provide some data" })
        }
        else {
            let bookId = req.body.bookId
            let bookId1 = req.params.bookId
            if (!bookId)
                return res.status(400).send({ status: false, msg: " please enter bookId" })
                
    
            if (!isValidObjectId(bookId)) {
                     
                return res.status(400).send({ status: false, msg: " not a valid book id" })
                 
             }

             if (!isValidObjectId(bookId1)) {
                return res.status(400).send({ status: false, message: "not a valid book id in params" })
                
                 }

            let book = await BookModel.findOne({ _id: bookId, isDeleted: false })
            if (!book) {
                return res.status(404).send({ status: false, msg: "Book not exists" })
            }
            
          
      
            if(!(data.rating>0 && data.rating<=5)) 
            return res.status(400).send({ status: false, msg: "rating should be in between 1 to 5" })

            

const newReview = await ReviewModel.create( data )

    //    const checkReviewCount = await ReviewModel.find({bookId: bookId, isDeleted: false}).count()

    //    const incBookReviewCount = await BookModel.findOneAndUpdate({_id: bookId},{$set : {reviews : checkReviewCount}}, {new: true})

        
        // const{ ...data1 } = incBookReviewCount

       
        // data1._doc.reviewsData =  newReview
        
        
        return res.status(201).send({status:true ,msg:"Review added Successfully",data:newReview})
        }
   } catch (err) {
   res.status(500).send({ msg: "server error", error: err.message })
   }
}

module.exports.createReview=createReview

const updateReview = async function (req, res) {
    try {
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId

        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, msg: "enter valid bookId" })
        }

        // if (!validObjectId(bookId)) {
        //     return res.status(400).send({ status: false, msg: "bookId is not in valid format" })
        // }

        const checkbookIdExist = await BookModel.findOne({ _id: bookId, isDeleted: false })
        if (!checkbookIdExist) {
            return res.status(404).send({ status: false, msg: "book not found with this id" })
        }

        if (checkbookIdExist.isDeleted==true) {
            return res.status(404).send({ status: false, msg: "does not exist" })
        }


        if (!isValidObjectId(reviewId)) {
            return res.status(400).send({ status: false, msg: "enter valid reviewId" })
        }

        // if (!validObjectId(reviewId)) {
        //     return res.status(400).send({ status: false, msg: "reviewId is not in valid format" })
        // }

        const checkReviewIdExist = await ReviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!checkReviewIdExist) {
            return res.status(400).send({ status: false, msg: "no review present with this id" })
        }

        if (checkReviewIdExist.isDeleted==true) {
            return res.status(400).send({ status: false, msg: "review does not exist" })
        }
        
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "data is missing from the body" })
        }
        
        const { reviewersName, rating, review } = data
        // let obj = {}

        if (reviewersName) {
            if (!isValid(reviewersName)) { 
                return res.status(400).send({ status: false, msg: "name is not in valid format" })
            }
            obj.reviewedBy = reviewersName.trim()
        }

        // if (rating) {
        //     if (!isValid(rating)) {
        //         return res.status(400).send({ status: false, msg: "rating is not in valid format" })
        //     }
            if (rating < 1 || rating > 5) return res.status(400).send({ status: false, msg: "rating should be inbetween 1 and 5" })
            obj.rating = rating
        

        if (review) {
            if (!isValid(review)) {
                return res.status(400).send({ status: false, msg: "review is not in valid format" })
            }

            obj.review = review.trim()
        }

        const updatedReview = await ReviewModel.findOneAndUpdate({ _id: reviewId },{ $set: obj }, { new: true })

        const bookDetailsAfterUpdate = await BookModel.findById({ _id: bookId }).select({_id: 1, title: 1, excerpt: 1,
            userId: 1, category: 1, subcategory: 1, deleted: 1, reviews: 1, releasedAt: 1, createdAt: 1, updatedAt: 1})

        const allReviewrs = await ReviewModel.find({ bookId: bookId }).select({_id: 1, bookId: 1, reviewedBy: 1,reviewedAt: 1, rating: 1, review: 1})

        const { ...data1 } = bookDetailsAfterUpdate
        data1._doc.reviewsData = allReviewrs

        return res.status(200).send({ status: true, msg: "updated", data: data1._doc })

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports.updateReview=updateReview



const deleteReview = async (req, res) => {

    try {
        let bookId = req.params.bookId;
        if(!isValidObjectId(bookId)){return res.status(400).send({status:false, message:"Please enter a valid Book Id"})}

        let bookData = await BookModel.findById(bookId)

        if(!bookData){return res.status(404).send({status:false, message:"No such book found"})}
        if(bookData.isDeleted == true){return res.status(400).send({status:false, message:"Book is Deleted"})}
        if (bookData.reviews == 0){return res.status(400).send({status:false, message:"No review for this book"})}
        
        
        let reviewId = req.params.reviewId;
        if(!isValidObjectId(reviewId)){return res.status(400).send({status:false, message:"Please enter a valid review Id"})}

        let reviewData = await ReviewModel.findById(reviewId)

        if(!reviewData){return res.status(404).send({status:false, message:"No such review found"})}
        if(reviewData.isDeleted == true){return res.status(400).send({status:false, message:"review is alredy Deleted"})}

        let review = bookData.reviews-1

        await ReviewModel.findByIdAndUpdate({_id:reviewId}, { $set: { isDeleted: true } })
        let updateReview = await BookModel.findByIdAndUpdate({_id:bookId}, {$set:{reviews:review}}, {new:true})

        let reviewsData = await ReviewModel.find({ bookId: bookId, isDeleted: false })  
        
        updateReview.reviewsData = reviewsData
        res.status(200).send({ status: true, message: 'deleted successfully', data: updateReview })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


module.exports.deleteReview=deleteReview 


