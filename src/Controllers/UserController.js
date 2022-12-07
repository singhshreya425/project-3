// const BookModel = require("../Models/BooksModel")
// const ReviewModel = require("../Models/ReviewModel")
const UserModel = require("../Models/UserModel")
const jwt = require('jsonwebtoken')

//========================================================validator and regex====================================================//
let regexvalidName = /^[a-zA-Z]+([\s][a-zA-Z,]+)*$/;

let regexValidNumber = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/;

const regexValidEmail =/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]{2,3})*$/ 

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,15}$/;


//========================================================create user====================================================//


const createUser = async (req, res) => {
    try {
        const data = req.body
        if (Object.keys(data).length == 0)
            return res.status(400).send("give some data  to create user")
        let { title, name, phone, email, password} = data
        if (!data.phone)
            return res.status(400).send({ status: false, message: "phone is required" })
        if (!data.name)
            return res.status(400).send({ status: false, message: "name is required" })
        if (!data.email)
            return res.status(400).send({ status: false, message: "email is required" })
        if (!data.password)
            return res.status(400).send({ status: false, message: "password is required" })
        if (!data.title)
            return res.status(400).send({ status: false, message: "title is required" })

        if (!name.match(regexvalidName))
        return res.status(400).send({ status: false, msg: "please enetr a valid name" });
    
        if (title !=="Mrs" &&title !=="Mr" &&title !=="Miss") 
        return res.status(400).send({ status: false, message: "enter valid title" })
      
        if (!phone.match(regexValidNumber)) 
        return res.status(400).send({ status: false, msg: "please enetr a valid phone number" })

        if (!password.match(passwordRegex))
            return res.status(400).send({ status: false, message: "Password Should contain min 1 uppercase , lowercase and one special character" })
      
        if (!email.match(regexValidEmail))
            return res.status(400).send("Enter Valid Email")

        const mail = await UserModel.findOne({ email: email })
        if (mail) return res.status(400).send({ status: false, message: "EmailId Already Registered " })

        const isphone = await UserModel.findOne({ phone: phone })
        if (isphone) return res.status(400).send({ status: false, message: "phone number is Already Registered " })

        const create = await UserModel.create(data)
        return res.status(201).send({ status: true, message: "User Created Successfully", data: create })

    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports.createUser = createUser


//========================================================login====================================================//
const login = async function (req, res) {
    try {
        const email = req.body.email
        const password = req.body.password
        if (!email)
        return res.status(400).send({ status: false, message: "email is required" })
        if (!password)
        return res.status(400).send({ status: false, message: "password is required" })

        if (!email.match(regexValidEmail))
        return res.status(400).send("Enter Valid Email")

        const check = await UserModel.findOne({ email: email, password: password })
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