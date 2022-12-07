const express = require ("express")
const router = express.Router()
const BookController = require("../Controllers/BookController")
const ReviewController=require("../Controllers/ReviewController")
const UserController = require("../controllers/userController")
const middleWare = require ("../Middleware/authmiddleware")
const aws = require('aws-sdk');


router.post ("/register",UserController.createUser)
router.post ("/login",UserController.login)
router.post ("/books",middleWare.authenticate,BookController.createBooks)
router.get ("/books",middleWare.authenticate,BookController.getBook)
router.get ("/books/:bookId",middleWare.authenticate,BookController.getBookData)
router.put ("/books/:bookId",middleWare.authenticate,BookController.updateBooks)
router.delete ("/books/:bookId",middleWare.authenticate,BookController.deleteBook)
router.post ("/books/:bookId/review",ReviewController.createReview)
router.put ("/books/:bookId/review/:reviewId",ReviewController.reviewUpdate)
router.delete ("/books/:bookId/review/:reviewId",ReviewController.reviewDelete)


aws.config.update({
    accessKeyId: "AKIAY3L35MCRZNIRGT6N",
    secretAccessKey: "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",
    region: "ap-south-1"
})

let uploadFile= async ( file) =>{
   return new Promise( function(resolve, reject) {
    // this function will upload file to aws and return the link
    let s3= new aws.S3({apiVersion: '2006-03-01'}); // we will be using the s3 service of aws

    var uploadParams= {
        ACL: "public-read",
        Bucket: "classroom-training-bucket",  //HERE
        Key: "saurabhcloude/" + file.originalname, //HERE 
        Body: file.buffer
    }


    s3.upload( uploadParams, function (err, data ){
        if(err) {
            return reject({"error": err})
        }
        console.log(data)
        console.log("file uploaded succesfully")
        return resolve(data.Location)
    })

    // let data= await s3.upload( uploadParams)
    // if( data) return data.Location
    // else return "there is an error"

   })
}

router.post("/write-file-aws", async function(req, res){

    try{
        let files= req.files
        if(files && files.length>0){
            //upload to s3 and get the uploaded link
            // res.send the link back to frontend/postman
            let uploadedFileURL= await uploadFile( files[0] )
            res.status(201).send({msg: "file uploaded succesfully", data: uploadedFileURL})
        }
        else{
            res.status(400).send({ msg: "No file found" })
        }
        
    }
    catch(err){
        res.status(500).send({msg: err})
    }
    
})


router.all("/*", function (req, res) {
    try{
    res.status(404).send({status: false,msg: "The api you request is not available"})

}catch(err){res.send(err.message)}})

module.exports=router