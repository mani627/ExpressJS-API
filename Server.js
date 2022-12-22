// var http = require("http");
// var fs = require("fs");
// var url = require('url');
// var nodemailer = require('nodemailer');
// var formidable = require('formidable')


// http.createServer(function (req, res) {

//     if (req.url == "/") {
//         res.writeHead(200, { 'content-type': 'text/html' });
//         res.write(`<form action="/action_page" method="post" enctype="multipart/form-data">`);
//         res.write(`<input type="file" name="filess">`);

//         res.write(`<input type="submit">`);
//         res.end();
//     }


//     else if (req.url == "/action_page") {
//         let formm = new formidable.IncomingForm()
//         formm.parse(req, function (err, fields, files) {
//             // res.write(`${files}`)
//             console.log(files.filess.filepath);
//             var oldpath = files.filess.filepath;
//             var newpath = `C:/Users/Ramasamy/Desktop/` + files.filess.originalFilename;
//             fs.rename(oldpath, newpath, function (err) {
//                 if (err) throw err
//                 res.write('successfull');
//                 res.end();
//             })

//         })
//         res.end();
//     }

// }).listen(5000)