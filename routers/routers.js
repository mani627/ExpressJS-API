
const express = require("express");

const router = express.Router();
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { promisify } = require("util");
const app = express();

// sql connection
const con = require('../connections/connections');
//nodemailer authentications
const sender = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "mani8754209@gmail.com",
        pass: "failjiaazouonlfj"
    }
});

// dotenv.config({
//     path: "./.env"
// })




router.post("/Register", async function (req, res, next) {
    //it encode password
    let hide_password = await bcrypt.hash(req.body.Password, 8);
try{
    con.query(`INSERT INTO Users  (Name, Email, Password,city) 
    select '${req.body.Name}', '${req.body.Email}','${hide_password}','${req.body.city}'
    where ((SELECT count(Email) FROM Users WHERE Email = '${req.body.Email}')=0) `, (err, result) => {
        if (err) {
            res.json(err)
        } else {
            res.json(result.affectedRows)
        }
    })
}catch(error){
    res.json({
        error: {
          status: error.status || 500,
          message: error.message || "Internal Server Error",
        },
    });  
}
  

});



router.post("/ChangePassword",async function (req, res, next) {
    try{
        if (req.body.types === 'firstcheck') {
       
            con.query(`call change_password('${req.body.Email}',null,'firstcheck')`, (err, result) => {
                if (err) {
                    res.json(err)
                } else {
                  
                    if (result.length!==2) {
                       
                        //composing email
                        let random_otp = Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;
                        const composemail = {
                            from: "mani8754209@gmail.com",
                            to: `${req.body.Email}`,
                            subject: "Hotel OTP",
                            html: `<pre>
Hi,<b>${result[0][0].name}</b>
        
Your OTP is ${random_otp} to Change Password.
    
Thanks By,
Hotel.
        </pre>`
                        };
    
                        sender.sendMail(composemail, function (erroremail, info) {
                            if (erroremail) {
                              console.log(erroremail);
                                res.json({
                                    message:"Something Wrong in email",

                                })
                            } else {
                                console.log(info);
                                res.json({
                                    otp:random_otp,

                                })
                                
                            }
                        })
    
                        
                    } else  {
                       
                        res.json("Email Not Exist")
                    }
    
                }
            })
        }
        else {
          
            let hide_password = await bcrypt.hash(req.body.Password, 8);
            con.query(`call change_password('${req.body.Email}','${hide_password}','changepassword') `, (err, results) => {
                if (err) {
                    res.json(err)
                } else {
                    res.json(results[0][0].result)
                }
            })
        }
    }catch(error){
        res.json({
            error: {
              status: error.status || 500,
              message: error.message || "Internal Server Error",
            },
        }); 
    }
});


//middleware


router.post("/Login", async function (req, res, next) {

  

    //  let hide_password= await bcrypt.hash(req.body.Password,8)
    try {
        if (!req.body.Email || !req.body.Password) {
            res.status(400).send("Bad Request")
        } else {
            con.query(`select * from users where email= '${req.body.Email}' `, async (err, result) => {
                if (err) {
                    //sql query syntex error  or error from my sql example: slect
                    res.json(err)
                } else {
                    // no records that means given wrong input
                    if (result.length == 0) {
                        res.json("Email dose not exist")
                    } else {                 //it decodes and compare password
console.log(req.body.Password, result,await bcrypt.compare(req.body.Password, result[0].Password));

// bcrypt.compare('mypassword', hash, function(err, result) {
//     if (err) { throw (err); }
//     console.log(result);
// });
                     
                        if (!(await bcrypt.compare(req.body.Password, result[0].Password))) {
                            res.json("PassWord Invalid")
                        } else {
                            let email = result[0].Email
                            const token = jwt.sign({ id: email}, process.env.JWT_SECRET, {
                                expiresIn: process.env.JWT_EXPIRES_IN
                            })

                            // let cookieoptions = {
                            //     expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                            //     httpOnly: true
                            // }
                            // console.log(new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000), Date.now(),
                            //     90 * 24 * 60 * 60 * 1000);
                            // res.cookie("mani", token, cookieoptions)
                            // let decode;
                            // (async () => {
                            //     decode = await promisify(jwt.verify)(
                            //         token, process.env.JWT_SECRET
                            //     )
                            //     console.log(decode);
                            //     res.json(decode);
                            // })()
                            res.json({
                                message:"successfully login",
                                token:token,
                                details:[result[0].Name,result[0].Id,result[0].status],
                           
                            })
                        }
                    }

                }
            })
        }
    }catch(error){
        res.json({
            error: {
              status: error.status || 500,
              message: error.message || "Internal Server Error",
            },
        }); 
       
    }

});

module.exports = router;


// {
//     "Name": "Mani",
//     "Email": "mani@gmail.com",
//     "Password": "8754@Mani",
//     "city": "karaikudi"
//   }