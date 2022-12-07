const express = require("express")
// const bodyParser = require("body-parser")
const route = require("./routes/route")
const mongoose = require("mongoose")
const app = express()
const multer= require("multer");
const { AppConfig } = require('aws-sdk');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use( multer().any())


mongoose.connect("mongodb+srv://singhshreya425:shreyasingh1234@cluster0.yxxvuvg.mongodb.net/shreya526",{useNewUrlParser:true})
.then (()=>console.log(("MongoDb is connected")))
.catch (err=> console.log(err.message))

app.use ("/",route)
app.listen(process.env.PORT||3000, function(){console.log("express is running on port "+ (process.env.PORT||3000))})
