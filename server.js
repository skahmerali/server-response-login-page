// var users = [
//     {
//         userName: "zubair",
//         userEmail: "zubair@gmail.com",
//         userPassword: 222
//     }
// ]
// var express = require("express");
// var cors = require('cors')
// var morgan = require('morgan')
// const PORT = process.env.PORT || 5000
// var bodyParser = require('body-parser')
// var app = express();


// app.use(cors());
// app.use(morgan('dev'))
// app.use(bodyParser.json())  


// app.get("/", (req,res,next)     => {
//     console.log("some one get menu");
//     res.send("signup success full");
// })

// app.post("/signup",(req,res,next)=>{

//     // res.send("user available")
//     var vEmail = req.body.userEmail;
//     console.log(vEmail);
//     var isFound= false;
//     for(i = 0 ; i < users.length ; i++)
//     {
//         if(users[i] === vEmail){
//             isFound=true;
//             break;

//         }

//     }
//     if(isFound){
//         res.send("user already EXSISTS");

//     }
//     else{
//         users.push(req.body);
//         res.send("signup SUCCESSFULLY");

//     }
//     console.log(users)

// })


// app.post("/login",(req, res, next) => {
//     var Loginemail=req.body.email;
//     var Loginpass=req.body.pass; 
//     var isFound = false;

//     for (var i = 0 ; i < users.length; i++){
//         console.log(users[i].userEmail, Loginemail)
//         if(users[i].userEmail === Loginemail){
//             isFound=i;
//             console.log(isFound)
//             break;
//         }
//     }
//     if(isFound === false){
//         res.send("users not available");
//     }
//     else if(users[isFound].userPassword == Loginpass){
//         res.send("congratulation");
//     }
//     else{
//         res.status(404).send("tingTONG invalid password or email")
//     }
// })


// app.listen(PORT,()=>{
//     console.log("server is running")
// })




// var PORT = process.env.PORT || 3000;


var express = require("express");
var bodyParser = require('body-parser');
var cors = require("cors");
var morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
var bcrypt = require("bcrypt-inzi")
var jwt = require('jsonwebtoken');



var SERVER_SECRET = process.env.SECRET || "1234";


let dbURI = "mongodb+srv://ahmerali:ahmerali@cluster0.slkv6.mongodb.net/ahmerali";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });


mongoose.connection.on('connected', function () {
    console.log("Mongoose is connected");
});

mongoose.connection.on('disconnected', function () {

    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {

    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {

    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});


var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phone: String,
    gender: String,
    createdOn: { type: Date, 'default': Date.now }
});
var userModel = mongoose.model("users", userSchema);


var app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));

app.use("/", express.static(path.resolve(path.join(__dirname, "public"))));


app.post("/signup", (req, res, next) => {

    if (!req.body.name
        || !req.body.email
        || !req.body.password
        || !req.body.number
        || !req.body.gender) {

        res.status(403).send(`
            please send name, email, passwod, phone and gender in json body.
            e.g:
            {
                "name": "malik",
                "email": "malikasinger@gmail.com",
                "password": "abc",
                "phone": "03001234567",
                "gender": "Male"
            }`)
        console.log("noman khan")

        return;
    }













    userModel.findOne({ email: req.body.email },
        function (err, doc) {
            if (!err && !doc) {

                bcrypt.stringToHash(req.body.password).then(function (hash) {

                    var newUser = new userModel({
                        "name": req.body.name,
                        "email": req.body.email,
                        "password": hash,
                        "phone": req.body.phone,
                        "gender": req.body.gender,
                    })
                    newUser.save((err, data) => {
                        if (!err) {
                            res.send({
                                message: "user created"
                            })
                        } else {
                            console.log(err);
                            res.status(500).send({
                                message: "user create error, " + err
                            })
                        }
                    });
                })

            } else if (err) {
                res.status(500).send({
                    message: "db error"
                })
            } else {
                res.status(409).send({
                    message: "user already exist"
                })
            }
        })

})

app.post("/login", (req, res, next) => {

    if (!req.body.email || !req.body.password) {

        res.status(403).send(`
            please send email and passwod in json body.
            e.g:
            {
                "email": "malikasinger@gmail.com",
                "password": "abc",
            }`)
        return;
    }

    userModel.findOne({ email: req.body.email },
        function (err, user) {
            if (err) {
                res.status(500).send({
                    message: "an error occured: " + JSON.stringify(err)
                });
            } else if (user) {

                bcrypt.varifyHash(req.body.password, user.password).then(isMatched => {
                    if (isMatched) {
                        console.log("matched");

                        var token =
                            jwt.sign({
                                id: user._id,
                                name: user.name,
                                email: user.email,
                                phone: user.phone,
                                gender: user.gender,
                                ip: req.connection.remoteAddress
                            }, SERVER_SECRET)


                        res.send({
                            message: "login success",
                            user: {
                                name: user.name,
                                email: user.email,
                                phone: user.phone,
                                gender: user.gender,
                            },
                            token: token
                        });

                    } else {
                        console.log("not matched");
                        res.status(401).send({
                            message: "incorrect password"
                        })
                    }
                }).catch(e => {
                    console.log("error: ", e)
                })

            } else {
                res.status(403).send({
                    message: "user not found"
                });
            }
        });



    app.get("/profile", (req, res, next) => {

        if (!req.headers.token) {
            res.status(403).send(`
                    please provide token in headers.
                    e.g:
                    {
                        "token": "h2345jnfiuwfn23423...kj345352345"
                    }`)
            return;
        }

        var decodedData = jwt.verify(req.headers.token, SERVER_SECRET);
        console.log("user: ", decodedData)

        userModel.findById(decodedData.id, 'name email phone gender createdOn',
            function (err, doc) {

                if (!err) {

                    res.send({
                        profile: doc
                    })
                } else {
                    res.status(500).send({
                        message: "server error"
                    })
                }

            })

    })




    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log("server is running on: ", PORT);
    })






















//     var newUser = new userModel({
//         "name": req.body.name,
//         "email": req.body.email,
//         "password": req.body.password,
//         "phone": req.body.phone,
//         "gender": req.body.gender,
//     })

//     newUser.save((err, data) => {
//         if (!err) {
//             res.send("user created")
//         } else {
//             console.log(err);
//             res.status(500).send("user create error, " + err)
//         }
//     });
// })

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log("server is running on: ", PORT);
// })