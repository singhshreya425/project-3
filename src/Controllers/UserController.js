const BookModel = require("../Models/BooksModel")
const ReviewModel = require("../Models/ReviewModel")
const UserModel = require("../Models/UserModel")
//const mongoose = require("mongoose");
const jwt = require('jsonwebtoken')

//========================================================validator and regex====================================================//
const isValid = function (value) {
    if (typeof value == "undifined" || value == "null") return false
    if (typeof value == "string" && value.trim().length == 0) return false
    return true
};
const isValidPassword = function (password) {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    return passwordRegex.test(password);
};
let ab=/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/
//========================================================create user====================================================//
const createUser = async (req, res) => {
    try {
        const data = req.body
        if (Object.keys(data).length == 0)
            return res.status(400).send("name, phone, email, password, title are Mandatory to create user")
        let { title, name, phone, email, password } = data
        if (!isValid(phone))
            return res.status(400).send({ status: false, message: "phone is required" })
        if (!isValid(name))
            return res.status(400).send({ status: false, message: "name is required" })
        if (!isValid(email))
            return res.status(400).send({ status: false, message: "email is required" })
        if (!isValid(password))
            return res.status(400).send({ status: false, message: "password is required" })
        if (!isValid(title))
            return res.status(400).send({ status: false, message: "title is required" })
        // else {
            //if (title != "Mr" && title != "Mrs" && title != "Miss") return res.status(400).send({ status: false, message: "Enter Mr, Mrs, Miss as a title" })
      //  }
        if (!phone.match(ab)) {
            return res.status(400).send({ status: false, message: "Enter valid phone number" })
        }
        if (!isValidPassword(password))
            return res.status(400).send({ status: false, message: "Password Should contain min 1 uppercase , lowercase and one special character" })
        const pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        const validmail = email.match(pattern)
        if (!validmail)
            return res.status(400).send("Enter Valid Email")
        const mail = await UserModel.findOne({ email: email })
        if (mail)
            return res.status(400).send({ status: false, message: "EmailId Already Registered " })
        const create = await UserModel.create(data)
        return res.status(201).send({ status: true, message: "User Created Successfully", data: create })

        // let user = req.body
        // let email=req.body.email;
        // let password=req.body.password

        // if (Object.keys(user).length == 0){
        //     return res.status(400).send({status:false,msg:"Invalid request please provide valid user"});
        // }
        // let name=req.body.name
        // let phone=req.body.phone

        // if(!user.title)return res.status(400).send({msg:"title is required"})
        // if(!user.name)return res.status(400).send({msg:"name is required"})
        // if(!user.phone)return res.status(400).send({msg:"phone is required"})
        // if(!user.email)return res.status(400).send({msg:"email is required"})
        // if(!user.password)return res.status(400).send({msg:"password is required"})


    } catch (error) {
        return res.status(500).send({ satatus: false, msg: error.message })
    }
}
module.exports.createUser = createUser

//========================================================login====================================================//
const login = async function (req, res) {
    try {
        const email = req.body.email
        const password = req.body.password
        const check = await UserModel.findOne({ $and: [{ email: email, password: password }] })
        if (!check)
            return res.status(400).send({ status: false, message: "Email or Password Not Match" })
        const create = jwt.sign({ userId: check._id.toString(), password: password }, "Secret-Key-lithium", { expiresIn: '12h' })
        return res.status(201).send({ status: true, message: "Token Created", data: create })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports.login = login