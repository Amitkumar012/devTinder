

const express = require('express');

const app = express();

app.post("/user/login",(req,res) => {
    res.send("User logged in successfully");
})

const { adminAuth , userAuth } = require("./middlewares/auth"); 
  // handle Auth Middleware for all GET,POST....
app.use("/admin", adminAuth );
app.use("/admin", userAuth );
app.use("/user/data", adminAuth, (req,res) =>{
    console.log("Data sent successfully" );
    res.send("data sent")
});

app.options("/user/delete", adminAuth,(req,res) => {
    res.send("Data deleted already")
})

app.get("/user", userAuth, (req,res) => { 
    res.send("User data send");    
}); 

app.get("/admin/getAllData", (req,res) => { 
    res.send("all data send");    
});

app.get("/admin/deleteUser", (req,res) => {
        res.send("Deleted a user ");   
});

app.listen(7777, () => {
    console.log("Server is running successfully on port 7777");
});
