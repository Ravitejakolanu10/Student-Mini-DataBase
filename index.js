import express from "express";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
const port = 3000;

let data = [];
let id = 0;

try{
    const rawdata = fs.readFileSync("data.json","utf-8");
    data = JSON.parse(rawdata);
    console.log("Loaded Data ",data);
    
    if (data.length > 0 ){
        id = data[data.length-1].newid;
    }
}
catch(error){
    console.log(error);
    
}


//uses
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static("styles"))

//get
app.get("/",(req,res)=>{
    res.render("home.ejs");
})

//post
app.post("/submit",(req,res)=>{
    const newdata = {
        newid : ++id,
        firstname : req.body.fname,
        lastname : req.body.lname,
        rollnumber : req.body.roll,
        branch : req.body.branch
    }
    data.push(newdata);
    fs.writeFileSync("data.json",JSON.stringify(data));
    res.json(data);

})

//search
app.get("/search",(req,res)=>{
    const searchData = req.query.search.toLowerCase();
    const resultData = data.filter(user=> user.firstname.toLowerCase().includes(searchData) );

    res.render("search.ejs",{
        searchData,resultData
    });

})

//listen
app.listen(port,()=>{
    console.log(`Server Running from port https://localhost:${port}`);
    
})