
const express = require('express');

const app = express();

app.get("/getUserData", (req,res) => { 
    //Logic of DB call
    throw new Error("dfgh");
    res.send("User data send");    
}); 

app.use("/", (err, req, res, next) =>{
    if(err){
        res.status(500).send("something went wrong")
    }
})

app.listen(7777, () => {
    console.log("Server is running successfully on port 7777");
});
