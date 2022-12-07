const { isValidObjectId, default: mongoose } = require("mongoose")
const BookModel =require("../Models/BooksModel")
const ReviewModel =require("../Models/ReviewModel")
const UserModel = require("../Models/UserModel")



let regexForString=/^[\w ]+$/

let regexForIsbn=/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/

let regexForDate=/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/




const createBooks=async function(req,res){
    try{
    let data=req.body
    const {title,excerpt,userId,ISBN ,category,subcategory,releasedAt}=data
    if(data.length==0){
        return res.status(400).send({status:false,msg:"please give some data to create a book"})
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

    if (req.decode.userId !== userId ) {
        res.status(401).send({ status: false, msg: "Not Authorized" })
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
            const getAllBooks= await BookModel.find({isDeleted: false}).select({ISBN:0,subcategory:0,deletedAt:0,isDeleted:0,createdAt:0,updatedAt:0}).sort({title:1})

            return res.status(200).send({ status: true, data: getAllBooks})
        }
    
            if (!isValidObjectId(userId)) {
                return res.status(400).send({status :false , msg: "Enter A Valid userid" })
            }
        
       let book=await BookModel.find({isDeleted:false,...query}).select({ISBN:0,subcategory:0,deletedAt:0,isDeleted:0,createdAt:0,updatedAt:0}).sort({title:1})
       if(book.length==0) return res.status(404).send({status:false,msg:"books are not found"})

       return res.status(200).send({status:true,data:book})
        
    
    }catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}

module.exports.getBook=getBook



const getBookData = async (req,res)=>{
    try {
        const BookId = req.params.bookId
        if (!BookId.match(regexForString)) {
            return res.status(400).send({status :false , msg: "Enter BookId" })
        }
    
        if (!isValidObjectId(BookId)) {
            return res.status(400).send({status :false , msg: "Enter Valid BookId" })
        }

        const data = await BookModel.findById(BookId)
        if (!data) return res.status(404).send({ status: false, msg: "no book present with this id" })

        if (data.isDeleted == true) return res.status(404).send({ status: false, msg: "Book does not exist" })

       const checkReview = await ReviewModel.find({bookId: BookId, isDeleted: false})
       const checkReviewCount= await ReviewModel.find({bookId: BookId, isDeleted: false}).count()
       
       
       
       let final = await BookModel.findOne({ _id:BookId, isDeleted: false }).sort({title:1})
      
     final = JSON.parse(JSON.stringify(final));
     final.reviews=checkReviewCount
     final.updateReview=checkReview

            res.status(200).send({ status: true, msg:final  })
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

        if (!isValidObjectId(bookId)) {
            return res.status(400).send({status :false , msg: "Enter Valid BookId" })
        }

        let findbookId = await BookModel.findById(bookId)
        if (!findbookId) {
            return res.status(404).send({ status: false, msg: "book doesn't found" })
        }

        let updatedata = req.body;

        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, msg: "No data given for updation" })

        let { title, excerpt,releasedAt,ISBN } = updatedata;


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
            return res.status(404).send({ status: false, msg: "book does not exist" })
        }

        let BooKis=await BookModel.findById(bookId)
        useridIs=BooKis.userId.toString()
        if (req.decode.userId !== useridIs) {
            res.status(401).send({ status: false, msg: "Not Authorized" })
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

        let BooKis=await BookModel.findById(bookId)
        useridIs=BooKis.userId.toString()
        if (req.decode.userId !== useridIs) {
            res.status(401).send({ status: false, msg: "Not Authorized" })
        }   
    
        return res.status(200).send({ status: true, message: "book sucessfully deleted" });

    } catch (error) {
        return res.status(500).send(error.message)
    }
}

module.exports.deleteBook=deleteBook
