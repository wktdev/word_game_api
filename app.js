'use strict';

const express = require("express");
const app = express();
const validator = require("validator");
const bodyParser = require("body-parser");
const jwt = require("jwt-simple");
const path = require('path');
const Sequelize = require("sequelize");
const connection = new Sequelize("wordapp", "root", "password");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(path.join(__dirname, 'public')));

var secret = 'aliens'; // Change in production

//______________________________________________________________BEGIN user model



const User = connection.define("user", {
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },

    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: {
                msg: "Email address must be valid"
            }
        }

    },
    password: {
        type: Sequelize.TEXT,
        allowNull: false
    }

});


connection.sync();
//______________________________________________________________END user model



//______________________________________________________________BEGIN enable CORS

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//_____________________________________________________________END enable CORS

app.get("/", function(req, res) {
    // var test = path.join(process.cwd(), process.env);
    // console.log(test)
    res.send("Home page");
});


app.get("/drop", function(req, res) {
    User.drop();
    connection.sync();
    res.redirect("/");
});



app.post("/login", function(req, res) {

    var userEmail = req.body.email;
    var enteredPassword = req.body.password;


    User.findOne({
        where: {
            email: userEmail
        }
    }).then(function(user) {
        if (user) {
            var correctPassword = bcrypt.compareSync(enteredPassword, user.password);

            if (correctPassword) {

                var payload = {
                    username: user.username,
                    email: user.email,
                    password: user.password
                };

                console.log("User is found - they should now be logged in__________");
                console.log(payload);
                var token = jwt.encode(payload, secret);
                res.json(token);

            } else {

                console.log("Email or password is invalid");
                res.status(404).json("Email or password is invalid");

            }
        } else {

            res.status(404).json("Email or password is invalid");

        }
    });

});


//______________________________________________________________BEGIN save registration data to database


app.post("/register", function(req, res) {

    var emailIsValid = validator.isEmail(req.body.email);
    var usernameIsValidLength =  validator.isLength(req.body.username, {min:3, max: 20}); 
    var passwordIsValidLength =  validator.isLength(req.body.password, {min:8, max: 25}); 

    if (!emailIsValid) {
        res.status(401).json("Email is not valid");
    }else if(!usernameIsValidLength ){
        res.status(401).json("Username must be between 3 and 20 characters");
    }else if(!passwordIsValidLength){
        res.status(401).json("Password must be between 8 and 25 characters");

    }
        else {
        //__________________________________________________________setup variables

        var passwordEncrypted = bcrypt.hashSync(req.body.password, salt),
            payload = { username: req.body.username, email: req.body.email, password: passwordEncrypted },
            token = jwt.encode(payload, secret),
            decoded = jwt.decode(token, secret);
        //__________________________________________________________END setup variables

        // EMAIL VALIDATION GOES HERE



        User.findOne({
            where: {
                email: payload.email
            },
        }).then(function(user) {




            if (!user) {

                var user = User.build({
                    username: payload.username,
                    email: payload.email,
                    password: payload.password
                });



                user.save();

                res.json(token);
            } else {


                res.status(401).json("Email already in use")

            }

        });
    }
});

//_____________________________________________________________END save registration data to database


//_____________________________________________________________BEGIN send api data
app.post("/api/level", function(req, res) {

    var decoded_JWT = jwt.decode(req.body.jwt, secret);
    var userEmail = decoded_JWT.email;
    var userPassword = decoded_JWT.password;

    console.log(decoded_JWT);

    var levelData = {
        level: "Some level data and stuff"
    };

    User.findOne({
        where: {
            email: userEmail,
            password: userPassword

        },
    }).then(function(user) {
        if (user) {

            res.json(levelData);

        } else {
            res.status(409);
        }
    });


});

app.get("*", function(req, res) {
    res.redirect("/");
});
//________________________________________________________________END send api data

app.listen(3000);

console.log("listening on 3000");
