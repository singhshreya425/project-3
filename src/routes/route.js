const express = require ("express")
const router = express.Router()
const BookController = require("../Controllers/BookController")
const ReviewController=require("../Controllers/ReviewController")
const UserController = require("../controllers/userController")



router.post ("/register",UserController.createUser)
router.post ("/login",UserController.login)
router.post ("/books",BookController.createBooks)
router.get ("/books",BookController.getBook)
router.get ("/booksss/:bookId",BookController.getBookData)
router.put ("/books/:bookId",BookController.updateBooks)
router.delete ("/books/:bookId",BookController.deleteBook)
router.post ("/books/:bookId/review",ReviewController.createReview)
router.put ("/books/:bookId/review/:reviewId")
router.delete ("/books/:bookId/review/:reviewId")

router.all("/*", function (req, res) {
    try{
    res.status(404).send({status: false,msg: "The api you request is not available"})

}catch(err){res.send(err.message)}})

module.exports=router