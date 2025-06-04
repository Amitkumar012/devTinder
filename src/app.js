
const express = require('express');
const connectDB= require("./config/database")
const app = express();
const User = require("./models/user");


app.post("/signup", async (req,res) => {
    //Creating a new instance of the user model
    const user = new User({
        firstName : "Sachin",
        lastName : "Tendulkar",
        emailId: "sachin22@gmail.com",
        password: "sachin123",
    });
    try{
        await user.save();
    res.send("User Added Successfully")
    } catch (err) {
        res.status(400).send("Error saving the user:" + err.message);
    }
    
});


connectDB()
    .then(() => {
        console.log("Database connection established...")
        app.listen(7777, () => {
    console.log("Server is running successfully on port 7777");
});
    })
    .catch((err) => {
        console.error("Database cannot be connected!!")
    });
