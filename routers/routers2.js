
var mysql = require('mysql');
const express = require("express");
const handlebar = require("express-handlebars");
const bodyparser = require("body-parser");
const app = express();
const router = express.Router();
const morgan = require('morgan');
const dotenv = require('dotenv');


var con = require('../connections/connections')


router.get("/Testing", function (req, res, next) {
   
});

module.exports=router;