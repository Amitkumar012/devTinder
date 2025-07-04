
const express = require("express");
const authRouter = express.Router();
const {validateSignUpData} = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");


authRouter.post("/signup", async (req,res) => { 
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

        const savedUser = await user.save();
        const token = await savedUser.getJWT();

            res.cookie("token", token);

        
        res.json({ message: "User Added Successfully", data: savedUser})
    }   catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }


});


authRouter.post("/login", async (req,res) => {
    try{
        const{ emailId, password } = req.body;

        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error ("Invalid credential");
        }
        const isPasswordValid = await user.validatePassword(password)

        if(isPasswordValid){

            const token = await user.getJWT();

            res.cookie("token", token);

            res.send(user);
        }
        else{
            throw new Error ("Invalid credential"); 
        }
    }
    catch(err){
         res.status(400).send("ERROR : " + err.message)
    }
    
});

authRouter.post("/logout", async (req,res) => {
    // 
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send("Logout Successful");
})

module.exports = authRouter;
