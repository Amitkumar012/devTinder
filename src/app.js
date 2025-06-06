
const express = require('express');
const connectDB= require("./config/database")
const app = express();
const User = require("./models/user");
const {validateSignUpData} = require("./utils/validation");
const bcrypt = require("bcrypt");

app.use(express.json());

app.post("/signup", async (req,res) => {
    try{//Validation of Data
        validateSignUpData(req);

        const {firstName,lastName,emailId,password} = req.body;
        // Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash)
        
        //Creating a new instance of the user model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });

    
        await user.save();
        res.send("User Added Successfully")
    }   catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
    
});

app.post("/login", async (req,res) => {
    try{
        const{ emailId, password } = req.body;

        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error ("Invalid credential")
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if(isPasswordValid){
            res.send("Login successful!!!");
        }
        else{
            throw new Error ("Invalid credential");
        }
    }
    catch(err){
         res.status(400).send("ERROR : " + err.message)
    }
    
});
// Get user by email
app.get("/user",async (req,res) => {
    const userEmail = req.body.emailId;

    try{
        console.log(userEmail)
        const user = await User.findOne()
        if(!user){
            res.status(404).send("User not find")
        }
        else{
            res.send(user);
        }
        
        // const user = await User.find({ emailId: userEmail});
        // if(user.length === 0){
        //     res.status(404).send("User not find")
        // }
        // else{
        //     res.send(user);
        // }
        
    }
    catch(err ){
        res.status(400).send("Something went wrong")
    }
});

// Feed API - GET /Feed - get all the users from the database

app.get("/feed", async (req,res) =>{
    try{
        const users = await User.find({});
        res.send(users); 
    }
    catch(err){
         res.status(400).send("Something went wrong")
    }

});

// Delete data from database
app.delete("/user",async(req,res) => {
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId)
        res.send("User deleted ")
    }
    catch(err){
         res.status(400).send("Something went wrong")
    }
})

app.patch("/user",async(req,res) => {
    const userId = req.body.userId;
    const data = req.body;

    
    try{
        const ALLOWED_UPDATES = [
        "photoUrl",
        "about",
        "gender",
        "age",
        "skills",
        "userId"
    ]
     
    const isUpdateAllowed = Object.keys(data).every((k) =>
         ALLOWED_UPDATES.includes(k)
    );
    if(!isUpdateAllowed){
        throw new Error("Updates not allowed")
    }
        const user = await User.findByIdAndUpdate({_id: userId }, data, {
            returnDocument: "after",
            runValidators: true,
        });
        console.log(user);
        res.send("User updated ")
    }
    catch(err){
         res.status(400).send("UPDATE FAILED"+ err.message);
    }
})
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
