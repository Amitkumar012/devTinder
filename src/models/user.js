
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        index: true,
        minLength: 4,
        maxLength: 100,
    },
    lastName: {
        type: String,
        
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: String,
        min: 18,
    },
    gender: {
        type: String,
        enum: {
            values: ["male","female","other"],
            message: '{VALUE} is not a valid gender type'
        },
        // validate(value){
        //     if(!["male","female","others"].includes(value)) {
        //         throw new Error("Gender data is not valid");
        //     }
        // }, 
    },
    photoUrl:{
        type: String,
        default:"https://t4.ftcdn.net/jpg/02/44/43/69/360_F_244436923_vkMe10KKKiw5bjhZeRDT05moxWcPpdmb.jpg"
    },
    about: {
        type: String,
        default: "This is a default about of the user",
    },
    skills: {
        type: [String],
    },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default:null },    
},{
    timestamps: true
});

userSchema.methods.getJWT = async function () {
    const user = this;

    const token = await jwt.sign({ id: user._id}, "DEV@Tinder$2005", { 
        expiresIn: "7d",
    });

    return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(
        passwordInputByUser,
        passwordHash
    ); 

    return isPasswordValid;
};


module.exports = mongoose.model("User", userSchema);