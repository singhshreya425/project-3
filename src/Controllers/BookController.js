const { isValidObjectId, default: mongoose } = require("mongoose")
const { isBoolean } = require("../../../project-01/src/Validation/Valid")
const BookModel =require("../Models/BooksModel")
const ReviewModel =require("../Models/ReviewModel")
const UserModel = require("../Models/UserModel")
// const mongoose = require ( mongoose )



let regexForString=/^[\w ]+$/

let regexForIsbn=/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/

let regexForDate=/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/




const createBooks=async function(req,res){
    try{
    let data=req.body
    const {title,excerpt,userId,ISBN ,category,subcategory,isDeleted,releasedAt}=data
    if(data.length==0){
        return res.status(400).send({status:false,msg:"body is empty provide details to create book"})
    }
    if(!title){
        return res.status(400).send({status:false,msg:"title is mandatory"})
    }
    if(!excerpt){
        return res.status(400).send({status:false,msg:"excerpt is mandatory"})
    }
    if(!userId){
        return res.status(400).send({status:false,msg:"userId is mandatory"})
    }
    if(!ISBN){
        return res.status(400).send({status:false,msg:"ISBN is mandatory"})
    }
    if(!category){
        return res.status(400).send({status:false,msg:"category is mandatory"})
    }
    if(!subcategory){
        return res.status(400).send({status:false,msg:"subcategory is mandatory"})
    }

    if(!releasedAt){
        return res.status(400).send({status:false,msg:"releasedAt is mandatory"})
    }


    if(!excerpt.match(regexForString)){
        return res.status(400).send({status:false,msg:"invalid excerpt"})
    }

    if(!isValidObjectId(userId)){
    return res.status(400).send({status :false , msg: "Enter Valid user Id" })
    }

    if(!ISBN.match(regexForIsbn)){
        return res.status(400).send({status:false,msg:"invalid ISBN"})
    }

    if(!category.match(regexForString)){
        return res.status(400).send({status:false,msg:"invalid category type"})
    }
    
    if(!subcategory.match(regexForString)){
        return res.status(400).send({status:false,msg:"invalid subcategory type"})
    }

    if(!isBoolean(isDeleted)){
        return res.status(400).send({status:false,msg:"it contains only boolean value"})
    }

    if(!releasedAt.match(regexForDate)){
        return res.status(400).send({status:false,msg:"invalid date"})
    }

     let verifyTitle=await BookModel.findOne({title:title})
    if(verifyTitle){
        return res.status(400).send({status:false,msg:"title already exists"})
    }

    let verifyISBN=await BookModel.findOne({ISBN:ISBN})
    if(verifyISBN){
        return res.status(400).send({status:false,msg:" ISBN already exists"})
    }
    const newBook=await BookModel.create(data)
    return res.status(201).send({status:true,msg:"book created successfully",data:newBook})
}
catch(error){
return res.status(500).send({status:false,msg:error.message})
}
}

module.exports.createBooks=createBooks



const getBook=async function(req,res){
    try{
        let query=req.query
        const { userId,category, subcategory } = req.query
        if (!userId && !category && !subcategory ) {
            const getAllBooks= await BookModel.find({isDeleted: false}).select({ISBN:0,subcategory:0,deletedAt:0,isDeleted:0,createdAt:0,updatedAt:0})
            return res.status(200).send({ status: true, data: getAllBooks })
        }
    
            if (!isValidObjectId(userId)) {
                return res.status(400).send({status :false , msg: "Enter A Valid userid" })
            }
        

        const Books = await BookModel.find({isDeleted : false,...query}).select({ISBN:0,subcategory:0,deletedAt:0,isDeleted:0,createdAt:0,updatedAt:0})
        if (Books.length == 0) {
            return res.status(400).send({ status: false, msg: 'books are not found' })   }
        
        else res.status(200).send({ status: true, data: Books })
    
    }catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}

module.exports.getBook=getBook



const getBookData = async (req,res)=>{
    try {
        const BookId = req.params.bookId
        //const iid=mong
        if (!BookId.match(regexForString)) {
            return res.status(400).send({status :false , msg: "Enter BookId" })
        }
    
        if (!isValidObjectId(BookId)) {
            return res.status(400).send({status :false , msg: "Enter Valid BookId" })
        }

        const data = await BookModel.findById(BookId)
        if (!data) return res.status(404).send({ status: false, msg: "no book present with this id" })

        if (data.isDeleted == true) return res.status(404).send({ status: false, msg: "Book does not exist" })

        // const bookIdis = data._id.toString()
        // if(bookIdis!==BookId){
        //     res.status(401).send({ status: false, msg: "Not Authorized" })
        // }
        // else {
            const result = await BookModel.find({_id:BookId})
            res.status(200).send({ status: true, msg:result  })
        
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports.getBookData=getBookData



const updateBooks = async function (req, res) {
    try {
        let bookId = req.params.bookId;

        if (!bookId) {
            return res.status(400).send({ status: false, message: "please provide a bookId in params" })
        }

        let findbookId = await BookModel.findById(bookId)
        if (!findbookId) {
            return res.status(404).send({ status: false, msg: "bookId doesn't exists" })
        }

        let updatedata = req.body;

        let { title, excerpt,releasedAt,ISBN } = updatedata;

        const isVAlidRequestBody = function (requestBody) {
            return Object.keys(requestBody).length > 0
        }

        if(!isVAlidRequestBody(updatedata)){
            return res.status(400).send({ status: false, msg: "please input Book Details" })
        }

        let checkTitle = await BookModel.findOne({ title: title })
        if (checkTitle) {
            return res.status(400).send({ status: false, msg: "title name already exist" })
        }

        let checkISBN = await BookModel.findOne({ ISBN: ISBN })
        if (checkISBN) {
            return res.status(400).send({ status: false, msg: "ISBN name already exist" })
        }

        let availabId = await BookModel.findOne({ _id: bookId, isDeleted: false });
        if (!availabId) {
            return res.status(404).send({ status: false, msg: "bookId not found" })
        }

     let changes = await BookModel.findOneAndUpdate({ _id: bookId, isDeleted: false },{ title: title, excerpt: excerpt, ISBN: ISBN, releasedAt: releasedAt } ,{ new: true });

        return res.status(200).send({ status: true, message: 'updated book info', data: changes });


    } catch (error) {
        return res.status(500).send(error.message)
    }

}

module.exports.updateBooks=updateBooks


const deleteBook = async function (req, res) {
    try {
        let bookId = req.params.bookId

        if (!bookId) {
            return res.status(400).send({ status: false, message: "please provide a bookId in params" })
        };

        if (!isValidObjectId(bookId)) {
            return res.status(400).send({status :false , msg: "Enter Valid BookId" })
        }

        let findbookId = await BookModel.findById(bookId)
        if (!findbookId) {
            return res.status(404).send({ status: false, msg: "no book present with this id" })
        }

        const checkBookId = await BookModel.findOne({ _id: bookId, isDeleted: false })

        if (!checkBookId) {
            return res.status(404).send({ status: false, message: "book does not exist" })
        }

        let deletedBook = await BookModel.findByIdAndUpdate({ _id: bookId }, { $set: { isDeleted: true } }, { new: true });

        return res.status(200).send({ status: true, message: "book sucessfully deleted", deletedBook });

    } catch (error) {
        return res.status(500).send(error.message)
    }
}

module.exports.deleteBook=deleteBook
