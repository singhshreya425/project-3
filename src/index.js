const express = require("express")
const bodyParser = require("body-parser")
const route = require("./routes/route")

const app = express()
const mongoose = require("mongoose")

app.use (bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))

mongoose.connect("mongodb+srv://singhshreya425:shreyasingh1234@cluster0.yxxvuvg.mongodb.net/shreya526",{useNewUrlParser:true})
.then (()=>console.log(("MongoDb is connected")))
.catch (err=> console.log(err.message))

app.use ("/",route)
app.listen(process.env.PORT||3001, function(){console.log("express is running on port "+ (process.env.PORT||3001))})
