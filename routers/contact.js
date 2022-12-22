
const express = require("express");

const router = express.Router();
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { promisify } = require("util");
const app = express();



//nodemailer authentications
const sender = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "mani8754209@gmail.com",
        pass: "failjiaazouonlfj"
    }
});


router.get("/Contact_us", async function (req, res, next) {
    try{
        //composing email
       
        const composemail = {
            from: "rahmanalla572@gmail.com",
            to: `mani8754209@gmail.com`,
            subject: "Hotel OTP",
            html: `<pre>
Hi,<b>nn</b>

Your OTP is 9900 to Change Password.

Thanks By,
Hotel.
</pre>`
        };


        //sending mail
sender.sendMail(composemail, function (erroremail, info) {
    if (erroremail) {
      console.log(erroremail);
        res.json({
            message:"Something Wrong in email",

        })
    } else {
        console.log(info);
        res.json({
            sucess:"gg"

        })
        
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

  
})

module.exports = router;