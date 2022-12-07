const BookModel =require("../Models/BooksModel")
const ReviewModel =require("../Models/ReviewModel")
const UserModel = require("../Models/UserModel")
const mongoose = require ("mongoose")


// function isValidObjectId(objectId) {
//     return mongoose.Types.ObjectId.isValid(objectId);
// }

const createReview = async function (req, res) {
    try {
        const data = req.body
        if (Object.entries(data).length == 0) {
            return res.status(400).send({ status: false, msg: "please provide some data" })
        }

            let bookId = req.params.bookId
            let bookId1 = req.body.bookId
            if (!bookId)
                return res.status(400).send({ status: false, msg: " please enter bookId" })
                
    
            if (!isValidObjectId(bookId)) {
                     
                return res.status(400).send({ status: false, msg: " not a valid book id" })
                 
             }

             if (!bookId1)
                return res.status(400).send({ status: false, msg: " please enter bookId in request body" })


             if (!isValidObjectId(bookId1)) {
                return res.status(400).send({ status: false, message: "not a valid book id in body" })
                
                 }

            let book = await BookModel.findOne({ _id: bookId, isDeleted: false })
            if (!book) {
                return res.status(404).send({ status: false, msg: "Book not exists" })
            }
        
            if(!(data.rating>0 && data.rating<=5)) 
            return res.status(400).send({ status: false, msg: "rating should be in between 1 to 5" })

            const newReview = await ReviewModel.create( data )
            return res.status(201).send({status:true ,msg:"Review added Successfully",data:newReview})
        
   } catch (err) {
   res.status(500).send({ msg: "server error", error: err.message })
   }
}

module.exports.createReview=createReview

const reviewUpdate = async function (req, res) {
    try {
        let data = req.body;
        const  { rating } = data
        if (Object.entries(data).length == 0) {
            return res.status(400).send({ status: false, msg: "please provide some data" })
        }


        let bookId = req.params.bookId;

        if (!bookId)
        return res.status(400).send({ status: false, msg: " please enter bookId" })

        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, msg:  "enter valid book id"})
        }

        let book = await BookModel.findOne({ _id: bookId, isDeleted: false })
        if (!book) {
            return res.status(404).send({ status: false, msg: "Book  not found" })
        }

        let reviewId = req.params.reviewId;

        if (!reviewId)
        return res.status(400).send({ status: false, msg: " please enter rewiewId" })

        if (!isValidObjectId(reviewId)) {
            return res.status(400).send({ status: false, msg: "enter valid review id" })
        }

        let reviewExit = await ReviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!reviewExit) {
            return res.status(404).send({ status: false, msg: "review  not exists" })
        }
       
       if (rating < 1 || rating > 5) return res.status(400).send({ status: false, msg: "rating should be inbetween 1 and 5" })
      

        let savedData = await ReviewModel.findOneAndUpdate({ _id: reviewId },
            data, { updatedAt: new Date(), new: true })
        return res.status(200).send({ status: true, msg: savedData });
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports.reviewUpdate = reviewUpdate


const reviewDelete = async function (req, res) {
    try {
   
        let bookId = req.params.bookId;
        let reviewId = req.params.reviewId;

        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, msg: "enter valid book id" })
        }

        if (!isValidObjectId(reviewId)) {
            return res.status(400).send({ status: false, msg: "enter valid review id" })
        }

        let book = await BookModel.findOne({ _id: bookId, isDeleted: false })
        if (!book) {
            return res.status(404).send({ status: false, msg: "Book  not found" })
        }

        let review = await ReviewModel.findOne({ _id: reviewId, bookId: bookId ,isDeleted: false })
        if (!review) {
            return res.status(404).send({ status: false, msg: "Review  not found" })
        }



        let deletedreview = await ReviewModel.findOneAndUpdate({ _id: reviewId },
           {$set: { isDeleted: true, deletedAt: new Date() }});

            book.reviews=book.reviews ===0? 0:book.reviews - 1
            await book.save()
        return res.status(200).send({ status: true, msg: 'success', data: deletedreview });
    }

    catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, msg: error.message })
    }
}


module.exports.reviewDelete=reviewDelete 



