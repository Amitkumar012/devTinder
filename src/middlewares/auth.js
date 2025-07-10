const jwt = require("jsonwebtoken")
const User = require("../models/user")

const userAuth = async (req, res, next) => {
    try{
        console.log("Cookies:", req.cookies);
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Token is not Valid!!!!!");
        }

        const decodedObj = await jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded JWT:", decodedObj);
        const { id } = decodedObj;

        const user = await User.findById(id);
        console.log("User from DB:", user);
        if(!user){
            throw new Error("User not found!!");
        }
        req.user = user;
        next();
    }
    catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
};

module.exports = {
    
    userAuth,
};