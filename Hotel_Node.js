
const express = require("express");

const bodyparser = require("body-parser");
const app = express();

const morgan = require('morgan');
const dotenv = require('dotenv');

const cookies= require('cookie-parser');
const cors = require('cors');

const fileUpload= require('express-fileupload');

app.use(fileUpload())
app.use(cors());
app.use(cookies());

// app.use(express.static('Images')); 
app.use('/Images', express.static( __dirname+'/Images'));
   
   
// const port=process.env.port||5000;

// app.listen(port,()=>{
//     console.log("listening...");
// }) 




//database constant config
dotenv.config({
    path: "./.env"
})
app.use(bodyparser.json());

//current project path
console.log("current", __dirname);
//database connection
// var con = require('./connections/connections')

// con.connect(function (err) {
//     if (err) {
//        return  console.log("connection err",err);
//     };
//     console.log("database connected")


// })



//urlencoded
app.use(express.urlencoded({extended:false}))

//middleware
app.use(morgan('dev'))

//main url
app.use("/", require('./routers/routers'))
app.use("/", require('./routers/add_hotel'))

app.use("/", require('./routers/routers2'))
// contact
app.use("/", require('./routers/contact'))


   



// return if url dose not match
app.get("*",function(req,res){
    res.json({
        messsage:"Not Found URL"
    })
})

app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).send('broke');
   })


   
app.listen(8080, () => {
    console.log("Port Connected");
})