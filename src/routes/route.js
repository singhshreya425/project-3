const express = require ("express")
const router = express.Router()
const BookController = require("../Controllers/BookController")
const ReviewController=require("../Controllers/ReviewController")
const UserController = require("../controllers/userController")
const middleWare = require ("../Middleware/authmiddleware")



router.post ("/register",UserController.createUser)
router.post ("/login",UserController.login)
router.post ("/books",BookController.createBooks)
router.get ("/books",BookController.getBook)
router.get ("/books/:bookId",BookController.getBookData)
router.put ("/books/:bookId",middleWare.authenticate,BookController.updateBooks)
router.delete ("/books/:bookId",middleWare.authenticate,BookController.deleteBook)
router.post ("/books/:bookId/review",ReviewController.createReview)
router.put ("/books/:bookId/review/:reviewId",ReviewController.updateReview)
router.delete ("/books/:bookId/review/:reviewId",ReviewController.deleteReview)

router.all("/*", function (req, res) {
    try{
    res.status(404).send({status: false,msg: "The api you request is not available"})

}catch(err){res.send(err.message)}})

module.exports=router