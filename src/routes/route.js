const express = require ("express")
const router = express.Router()
const BookController = require("../Controllers/BookController")
const ReviewController=require("../Controllers/ReviewController")
const UserController = require("../Controllers/UserController")



router.post ("/register",UserController.createUser)
router.post ("/login")
router.post ("/books")
router.get ("/books")
router.get ("/books/:bookId")
router.put ("/books/:bookId")
router.delete ("/books/:bookId")
router.post ("/books/:bookId/review")
router.put ("/books/:bookId/review/:reviewId")
router.delete ("/books/:bookId/review/:reviewId")

module.exports=router