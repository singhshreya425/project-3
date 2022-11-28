const BookModel =require("../Models/BooksModel")
const ReviewModel =require("../Models/ReviewModel")
const UserModel = require("../Models/UserModel")
const mongoose=require("mongoose");

const createuser = async (req, res) =>{
    try {
        let user = req.body
        let email=req.body.email;
        let password=req.body.password

        if (Object.keys(user).length == 0){
            return res.status(400).send({status:false,msg:"Invalid request please provide valid user"});
        }
        let name=req.body.name
        let phone=req.body.phone
        
        if(!user.title)return res.status(400).send({msg:"title is required"})
        if(!user.name)return res.status(400).send({msg:"name is required"})
        if(!user.phone)return res.status(400).send({msg:"phone is required"})
        if(!user.email)return res.status(400).send({msg:"email is required"})
        if(!user.password)return res.status(400).send({msg:"password is required"})


    } catch (error) {
        return res.status(500).send({satatus:false,msg:error.message})
    }
}
module.exports.createuser=createuser