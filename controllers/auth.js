const mysql = require("mysql");
const jwt = require('jsonwebtoken'); // For cookies
const bcrypt = require('bcryptjs'); //For password protection
const fs = require('fs')
const { contains } = require("jquery");

const db = mysql.createConnection({
    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE
});


//Login

exports.index = async(req,res)=>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).render('login',{
                message: 'Please provide an email and password'
            })
        }
        db.query('SELECT * FROM users WHERE email = ?',[email],async(error,results)=>{
            const finalDec = (!results || (!await bcrypt.compare(password,results[0].password)));
            if(!results || (!await bcrypt.compare(password,results[0].password))){
                res.status(401).render('login',{
                    message:'Email or Password is incorrect',
                    logMeIn:'login'               
                })
            }else if(email != results[0].email){
                res.status(401).render('login',{
                    message:'Email or Password is incorrect',
                    logMeIn:'login'
                })
            }else{
                const id = results[0].id;
                //User unique token
                const token = jwt.sign({id},process.env.JWT_SECRET,{
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                const cookieOptions = {
                    expires: new Date(
                        Date.now()+process.env.JWT_COOKIE_EXPIRES*24*60*60*1000
                    ),
                    httpOnly:true
                }
                res.cookie('jwt',token,cookieOptions);

                res.status(200).render('home',{
                    message: 'Please provide an email and password',
                    logoutStyle:'/',
                    loginStyle:'logout',
                    calculateMethod:"/auth/index"
                })
            }
        });
    } catch(error){
        res.status(401).render('login',{
            message:'Email or Password is incorrect',
        })             
    }
}

            //-------------------calculation--------------------

exports.home=(req,res)=>{
    const{pollutant,unit,concentration}=req.body;
    let pm2Values;
    if(pollutant==="pm2"){
    console.log(`This is  the pollutant vlaue ${pollutant}`);
        if(concentration>=0 && concentration <=12){
            console.log("Good")
            pm2Values={
                aqiLo:0,
                aqiHi:50,
                concLo:0,
                concHi:12,
                cato:"Good",
                bg:"row-good",
                group:"None",
                effect:"None"

            }
        }else if(concentration>=12.1 && concentration<=35.4){
            console.log("Moderate")
            pm2Values={
                aqiLo:51,
                aqiHi:100,
                concLo:12.1,
                concHi:35.4,
                cato:"Moderate",
                bg:"row-moderate",
                group:"People with respiratory disease at risk",
                effect:"Reduce prolonged or heavy exertion."
            }
        }else if(concentration>=35.5 && concentration<=55.4){
            console.log("Sensitive")
            pm2Values={
                aqiLo:101,
                aqiHi:150,
                concLo:35.5,
                concHi:55.4,
                cato:"Sensitive",
                bg:"row-sensitive",
                group:"People with respiratory disease at risk",
                effect:"Symptoms and aggravation of lung disease"

            }
        }else if(concentration>=55.5 && concentration<=150.4){
            console.log("Unhealthy")
            pm2Values={
                aqiLo:151,
                aqiHi:200,
                concLo:55.5,
                concHi:150.4,
                cato:"Unhealthy",
                bg:"row-unhealthy",
                group:"People with respiratory disease at risk",
                effect:"Increased respiratory effects in general population"

            }
        }else if(concentration>=150.5 && concentration<=250.4){
            console.log("Very Unhealthy")
            pm2Values={
                aqiLo:201,
                aqiHi:300,
                concLo:150.5,
                concHi:250.4,
                cato:"Very Unhealthy",
                bg:"row-veryUnhealthy",
                group:"People with respiratory disease at risk",
                effect:"Increase in respiratory symptoms of lung disease"

            }
        }else{
            console.log("Hazardous")
            pm2Values={
                aqiLo:301,
                aqiHi:500,
                concLo:250.5,
                concHi:500.4,
                cato:"Hazardous",
                bg:"row-hazardous",
                group:"People with respiratory disease at risk",
                effect:"Serious risk of respiratory symptoms of lung disease"
            }
        }
        const ans = calculator(pm2Values.aqiHi ,pm2Values.aqiLo,pm2Values.concHi,pm2Values.concLo,concentration);
        res.status(200).render('home',{
            aqiAns:ans,
            aqiCat:pm2Values.cato,
            aqiBg:pm2Values.bg,
            aqiGroup:pm2Values.group,
            aqiEffects:pm2Values.effect              
        })
    }else if(pollutant==="pm10"){
        console.log(`This is  the pollutant vlaue ${pollutant}`);

        if(concentration>=0 && concentration <=54){
            console.log("Good")
            pm10Values={
                aqiLo:0,
                aqiHi:50,
                concLo:0,
                concHi:54,
                cato:"Good",
                bg:"row-good",
                group:"None",
                effect:"None"
                
            }
        }else if(concentration>=55 && concentration<=154){
            console.log("Moderate")
            pm10Values={
                aqiLo:51,
                aqiHi:100,
                concLo:55,
                concHi:154,
                cato:"Moderate",
                bg:"row-moderate",
                group:"People with respiratory disease at risk",
                effect:"Reduce prolonged or heavy exertion"
            }
        }else if(concentration>=155 && concentration<=254){
            console.log("Sensitive")
            pm10Values={
                aqiLo:101,
                aqiHi:150,
                concLo:155,
                concHi:254,
                cato:"Sensitive",
                bg:"row-sensitive",
                group:"People with respiratory disease at risk",
                effect:"Symptoms and aggravation of lung disease"

            }
        }else if(concentration>=255 && concentration<=354){
            console.log("Unhealthy")
            pm10Values={
                aqiLo:151,
                aqiHi:200,
                concLo:255,
                concHi:354,
                cato:"Unhealthy",
                bg:"row-unhealthy",
                group:"People with respiratory disease at risk",
                effect:"Increased respiratory effects in general population"

            }
        }else if(concentration>=355 && concentration<=424){
            console.log("Very Unhealthy")
            pm10Values={
                aqiLo:201,
                aqiHi:300,
                concLo:355,
                concHi:424,
                cato:"Very Unhealthy",
                bg:"row-veryUnhealthy",
                group:"People with respiratory disease at risk",
                effect:"Increase in respiratory symptoms of lung disease"

            }
        }else{
            console.log("Hazardous")
            pm10Values={
                aqiLo:301,
                aqiHi:500,
                concLo:425,
                concHi:604,
                cato:"Hazardous",
                bg:"row-hazardous",
                group:"People with respiratory disease at risk",
                effect:"Serious risk of respiratory symptoms of lung disease"

            }
        }
        const ans = calculator(pm10Values.aqiHi ,pm10Values.aqiLo,pm10Values.concHi,pm10Values.concLo,concentration);
        res.status(200).render('home',{
            aqiAns:ans,
            aqiCat:pm10Values.cato, 
            aqiBg:pm10Values.bg,
            aqiGroup:pm10Values.group,
            aqiEffects:pm10Values.effect                 


        })

    }else{
        console.log(`This is  the pollutant vlaue ${pollutant}`);
        if(concentration>=0.000 && concentration <=0.054){
            console.log("Good")
            ozoneValues={
                aqiLo:0,
                aqiHi:50,
                concLo:0.00,
                concHi:0.050,
                cato:"Good",
                bg:"row-good",
                group:"None",
                effect:"None"
            }
        }else if(concentration>=0.055 && concentration<=0.070){
            console.log("Moderate")
            ozoneValues={
                aqiLo:51,
                aqiHi:100,
                concLo:0.055,
                concHi:0.070,
                cato:"Moderate",
                bg:"row-moderate",
                group:"People with respiratory disease at risk",
                effect:"Reduce prolonged or heavy exertion"
            }
        }else if(concentration>=0.071 && concentration<=0.085){
            console.log("Sensitive")
            ozoneValues={
                aqiLo:101,
                aqiHi:160,
                concLo:0.71,
                concHi:0.085,
                cato:"Sensitive",
                bg:"row-sensitive",
                group:"People with respiratory disease at risk",
                effect:"Symptoms and aggravation of lung disease"

            }
        }else if(concentration>=0.086 && concentration<=0.105){
            console.log("Unhealthy")
            ozoneValues={
                aqiLo:151,
                aqiHi:200,
                concLo:0.086,
                concHi:0.105,
                cato:"Unhealthy",
                bg:"row-unhealthy",
                group:"People with respiratory disease at risk",
                effect:"Increase in respiratory symptoms of lung disease"
            }
        }else if(concentration<=100 || concentration>=500){
            console.log("Unhealthy")
            ozoneValues={
                aqiError:"Please Enter the value between 100 and 500"
            }
        }else{
            console.log("Very Unhealthy")
            ozoneValues={
                aqiLo:201,
                aqiHi:300,
                concLo:0.106,
                concHi:0.200,
                cato:"Very Unhealthy",
                bg:"row-veryUnhealthy",
                group:"People with respiratory disease at risk",
                effect:"Serious risk of respiratory symptoms of lung disease",
            }
        }
        const ans = calculator(ozoneValues.aqiHi ,ozoneValues.aqiLo,ozoneValues.concHi,ozoneValues.concLo,concentration);
        res.status(200).render('home',{
            aqiAns:ans,
            aqiCat:ozoneValues.cato,   
            aqiBg:ozoneValues.bg,       
            aqiGroup:ozoneValues.group,
            aqiEffects:ozoneValues.effect,
            aqiError:ozoneValues.aqiError        
        });
    }
}

const calculator = (aqiHi,aqiLo,concHi,concLo,con) =>{
    console.log(aqiLo,aqiHi,concLo,concHi)
    const dividen = aqiHi-aqiLo;
    console.log(dividen);
    const divisor = concHi - concLo;
    console.log(divisor);
    const first = Math.round(dividen/divisor*(con-concLo)+aqiLo);
    console.log(first);
    var JsonValue = {
        Concentraion:con,
        Aqi:first
    }
    fs.appendFile("value.json",JSON.stringify(JsonValue),"utf8",function(err,data){
        console.log("Data Stored")
    })

    return first;
}


//Registration
exports.register = (req,res)=>{
    console.log(req.body);
    const{name,email,password,passwordConfirm} = req.body;
    //SQL query to look into the database (i.e -> Postional parameter to avoid SQL Injection) 
    db.query('SELECT email FROM users WHERE email = ?',[email],async(error,result)=>{
         if(error){
             console.log(error);
         }
         if(result.length > 0){
             return res.render('registration',{
                 message:'That Email has been already registered'
             })
         }else if(password !== passwordConfirm){
            return res.render('registration',{ 
                message:'Password do not match'
            });
         }


         //Hashing password
         let hashedPassword = await bcrypt.hash(password,8);
         console.log(hashedPassword);

         db.query('INSERT INTO users SET ?', {name: name, email: email,password: hashedPassword},(error,results)=>{
             if(error){
                 console.log(error);
             }else{
                 console.log(results);
                return res.render('registration',{
                    message:'Thank you. Please Login'
                });
             }
         })
    });

}