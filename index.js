const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


let users = {};


app.post("/user", (req,res)=>{

const user = req.body;


if(!users[user.id]){

users[user.id] = {

id:user.id,
name:user.name,
points:1000,
joined:true

};

}


res.json(users[user.id]);

});



app.get("/user/:id",(req,res)=>{

const user = users[req.params.id];

if(user){

res.json(user);

}else{

res.json({

points:0

});

}


});



app.listen(3000,()=>{

console.log("Aryantred API Running");

});
