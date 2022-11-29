const BookModel =require("../Models/BooksModel")
const ReviewModel =require("../Models/ReviewModel")
const UserModel = require("../Models/UserModel")


const isValidstring =function(name){
    const  nameRegex =/^[a-zA-Z]{2,30}$/
    return nameRegex.test(name)
}

const createBooks=async function(req,res){
    try{
    let data=req.body
    const {title,excerpt,userId,ISBN ,category,subcategory,releasedAt}=data
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
    let regexForString=/^[a-zA-Z]+$/
    let verifyString=regexForString.test(title)
    if(!verifyString){
        return res.status(400).send({status:false,msg:"invalid string type"})
    }
    let verifySubcategory=regexForString.test(subcategory)
    if(!verifySubcategory){
        return res.status(400).send({status:false,msg:"invalid subcategory type"})
    }
    let verifycategory=regexForString.test(category)
    if(!verifycategory){
        return res.status(400).send({status:false,msg:"invalid category type"})
    }
    let regexForIsbn=/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/
    let verifyIsbn=regexForIsbn.test(ISBN)
    if(!verifyIsbn){
        return res.status(400).send({status:false,msg:"invalid ISBN"})
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




const getBook=async function(req,res){
    try{
        let query=req.query
        const { userId,category, subcategory } = req.query
        if (!userId && !category && !subcategory ) {
            const getAllBooks= await BookModel.find({isDeleted: false}).select({ISBN:0,subcategory:0,deletedAt:0,isDeleted:0,createdAt:0,updatedAt:0})
            return res.status(200).send({ status: true, data: getAllBooks })
        }
        if(category){
            if (!isValidstring(category)) {
                return res.status(400).send({status :false , msg: "Enter A Valid Category" })
            }
        }
        if(subcategory){
            if (!isValidstring(subcategory)) {
                return res.status(400).send({status :false , msg: "Enter A Valid subCategory" })
            }
        }
        if(userId){
            if (!isValidobjectid(userId)) {
                return res.status(400).send({status :false , msg: "Enter A Valid userid" })
            }
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
module.exports.createBooks=createBooks






