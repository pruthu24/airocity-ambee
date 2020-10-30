const express = require("express");
const fs = require('fs');
const path = require('path')
const mysql = require("mysql");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config({path:'./.env'})
const app = express();
const db = mysql.createConnection({
    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE
});

const publicDirectory = path.join(__dirname,'./public');
app.use(express.static(publicDirectory));
app.use(express.static('images'));

//Sent by html form
app.use(express.urlencoded({extended:false}));
//sent by API Client
app.use(express.json());
//Cookie parser
app.use(cookieParser());

app.set('view engine','hbs');

db.connect((error)=>{
    if(error){
        console.log(error)
    }else{
        console.log("MYSQL Connected")
    }
})

//Defining Routes

app.use('/',require('./routes/pages'));
app.use('/auth',require('./routes/auth'));
app.use(function(req,res){
    res.status(404).render('404.hbs');
});

app.listen(8081,()=>{
    console.log("server started")
})
