var users = [
    {
        userName: "zubair",
        userEmail: "zubair@gmail.com",
        userPassword: 222
    }
]
var express = require("express");
var cors = require('cors')
var morgan = require('morgan')
// const PORT = process.env.PORT || 5000
var bodyParser = require('body-parser')
var app = express();


app.use(cors());
app.use(morgan('dev'))
app.use(bodyParser.json())  


app.get("/", (req,res,next)     => {
     res.send("server is running")
})

app.listen(3000,()=>{
    console.log("server is running")
})