
const express = require("express");
const router = express.Router();

const { promisify } = require("util");
const app = express();


const project_url = require('../Utilities/project_url');
const con = require('../connections/connections');


router.post("/Upload", async function (req, res, next) {

    
   
try{
    // move file from req to folder.
let incoming_length= req.files.image_file.length-1;
let total='';
    req.files.image_file.forEach((file,index)=>{
        console.log(incoming_length);
        let recieved_file=file;
        let modify_name=`${new Date().getTime()}_${recieved_file.name}`;
        recieved_file.mv(`${project_url}${modify_name}`);

        if(incoming_length===index){
            total+='http://localhost:8080/Images/'+modify_name
        }else{
            total+='http://localhost:8080/Images/'+modify_name+','
        }
       
    })
    
    con.query(`call Add_Hotel('${req.body.Name}','${req.body.Location}','${req.body.details}',
    ${req.body.single_bed_price},${req.body.double_bed_price},${req.body.offer},'${req.body.features}',
    '${req.body.keyword}','${req.body.Rooms_no}',${req.body.Rating},'${total}')` , (err, result) => {
        if (err) {
            res.json({
                error: {
                  message: err.message
                },
            })
        } else {
            res.json(result)
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

router.get("/Get_Hotels", async function (req, res, next) {
    try{
        con.query(`select * from Hotel_Details order by created_Date desc` , (err, result) => {
            if (err) {
                res.json({
                    error: {
                      message: err.message
                    },
                })
            } else {
                res.json(result)
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






// update 
router.post("/Update_hotel", async function (req, res, next) {

    console.log(req.body);
   
    try{
        let total='';
        if(req.files){
      
     // move file from req to folder.
     let incoming_length= req.files.image_file.length-1;
  
         req.files.image_file.forEach((file,index)=>{
             console.log(incoming_length);
             let recieved_file=file;
             let modify_name=`${new Date().getTime()}_${recieved_file.name}`;
             recieved_file.mv(`${project_url}${modify_name}`);
     
             if(incoming_length===index){
                 total+='http://localhost:8080/Images/'+modify_name
             }else{
                 total+='http://localhost:8080/Images/'+modify_name+','
             }
            
         })
        }else{
      
 total=req.body.image_file
        }
   
        // formdata.append("Name", hotel_details.Name);
        // formdata.append("Location", hotel_details.Location);
        // formdata.append("details", hotel_details.details);
        // formdata.append("single_bed_price", hotel_details.single_bed_price);
        // formdata.append("double_bed_price", hotel_details.double_bed_price);
        // formdata.append("offer", hotel_details.offer);
        // formdata.append("features", selected);
        // formdata.append("keyword", hotel_details.keyword);
        // formdata.append("Rooms_no", hotel_details.Rooms_no);
        // formdata.append("Rating", "5");
        // con.query(`call Add_Hotel('${req.body.Name}','${req.body.Location}','${req.body.details}',
        // ${req.body.single_bed_price},${req.body.double_bed_price},${req.body.offer},'${req.body.features}',
        // '${req.body.keyword}','${req.body.Rooms_no}',${req.body.Rating},'${total}')`

        con.query(`call Update_Hotel(${req.body.hotel_id},'${req.body.Name}','${req.body.Location}',
        '${req.body.details}',${req.body.single_bed_price},${req.body.double_bed_price},${req.body.offer},
        '${req.body.features}','${req.body.keyword}',${req.body.Rooms_no},${req.body.Rating},'${total}')` , (err, result) => {
            if (err) {
                res.json({
                    error: {
                      message: err.message,
                      type:"sql"
                    },
                })
            } else {
                res.json(result)
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



// delete
    router.post("/Delete_Hotel", async function (req, res, next) {
        
    try{
        con.query(`DELETE FROM Hotel_Details WHERE hotel_id='${req.body.id}' `, (err, result) => {
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

module.exports = router;