const express = require('express');
const router = express.Router();

router.get('/registration',(req,res)=>{
    res.render('registration');
})

router.get('/index',(req,res)=>{
    res.render('index');
})


router.get('/login',(req,res)=>{
    res.render('login');
})


router.get('/',(req,res)=>{
    res.render('index');
})



module.exports = router;