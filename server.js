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
    console.log("some one get menu");
    res.send("signup success full");
})

app.post("/signup",(req,res,next)=>{

    // res.send("user available")
    var vEmail = req.body.userEmail;
    console.log(vEmail);
    var isFound= false;
    for(i = 0 ; i < users.length ; i++)
    {
        if(users[i] === vEmail){
            isFound=true;
            break;
            
        }
        
    }
    if(isFound){
        res.send("user already EXSISTS");
        
    }
    else{
        users.push(req.body);
        res.send("signup SUCCESSFULLY");
        
    }
    console.log(users)
    
})


app.post("/login",(req, res, next) => {
    var Loginemail=req.body.email;
    var Loginpass=req.body.pass; 
    var isFound = false;

    for (var i = 0 ; i < users.length; i++){
        console.log(users[i].userEmail, Loginemail)
        if(users[i].userEmail === Loginemail){
            isFound=i;
            console.log(isFound)
            break;
        }
    }
    if(isFound === false){
        res.send("users not available");
    }
    else if(users[isFound].userPassword == Loginpass){
        res.send("congratulation");
    }
    else{
        res.status(404).send("tingTONG invalid password or email")
    }
})


app.listen(3000,()=>{
    console.log("server is running")
})

