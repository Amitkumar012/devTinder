require("dotenv").config();
const express = require('express');

const connectDB= require("./config/database")
const app = express();
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");

require("./utils/cronjob");


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter); 

connectDB()
    .then(() => {
        console.log("Database connection established...")
        app.listen(process.env.PORT, () => {
    console.log("Server is running successfully on port 7777");
});
    })
    .catch((err) => { 
        console.error("Database cannot be connected!!")
    });
 