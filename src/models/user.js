
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
        default:"https://www.google.com/imgres?q=dummy%20full%20user%20profile%20picture&imgurl=http%3A%2F%2Fhancockogundiyapartners.com%2Fwp-content%2Fuploads%2F2019%2F07%2Fdummy-profile-pic-300x300.jpg&imgrefurl=http%3A%2F%2Fhancockogundiyapartners.com%2Fmanagement%2Fdummy-profile-pic-300x300%2F&docid=Wprl4053WgGqDM&tbnid=KOplAU0T2gzb9M&vet=12ahUKEwiX_pnuhNqNAxX61jgGHQGwK1YQM3oECC4QAA..i&w=300&h=300&hcb=2&ved=2ahUKEwiX_pnuhNqNAxX61jgGHQGwK1YQM3oECC4QAA"
    },
    about: {
        type: String,
        default: "This is a default about of the user",
    },
    skills: {
        type: [String],
    },
},{
    timestamps: true
});

userSchema.methods.getJWT = async function () {
    const user = this;

    const token = await jwt.sign({ _id: user._id}, "DEV@Tinder$2005", { 
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