
const express = require("express");
const authRouter = express.Router();
const {validateSignUpData} = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { sendVerificationEmail } = require("../routes/EmailVerification")
const UserVerification = require("../utils/EmailVerification")

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
            verified: false,
        });

        const savedUser = await user.save();
        await sendVerificationEmail(savedUser);
        

        
         res.status(201).json({ message: "User created. Check email to verify." });
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

authRouter.get("/verify/:userId/:uniqueString", async (req, res) => {
    console.log("Verification route hit");
    const { userId, uniqueString } = req.params;

    try {
        const record = await UserVerification.findOne({ userId });
        if (!record) throw new Error("Invalid or expired verification link");

        const { expiresAt, uniqueString: hashed } = record;

        if (expiresAt < Date.now()) {
            await UserVerification.deleteOne({ userId });
            await User.deleteOne({ _id: userId });
            return res.redirect(`${process.env.FRONTEND_URL}/verified?error=true&message=${encodeURIComponent("Link expired")}`);
        }

        const match = await bcrypt.compare(uniqueString, hashed);
        if (!match) throw new Error("Invalid verification link");
        console.log("✔ Updating user verified flag in DB...");

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { verified: true },
            { new: true }
            
        );
        console.log("✅ Verified user:", updatedUser);
        if (!updatedUser) throw new Error("User not found after update");
        if (!updatedUser) throw new Error("User not found after update");
        
        await UserVerification.deleteOne({ userId });
        console.log("✅ Verified user:", updatedUser.emailId);
        res.redirect(`${process.env.FRONTEND_URL}/verified?error=false&message=${encodeURIComponent("Email verified successfully!")}`);
    } catch (error) {
        console.log("❌ Verification failed:", error.message);
        res.redirect(`${process.env.FRONTEND_URL}/verified?error=true&message=${encodeURIComponent(error.message)}`);
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
            if (!user.verified) {
                throw new Error("Please verify your email before logging in.");
            }

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
