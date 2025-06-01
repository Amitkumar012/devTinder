
const express = require('express');

const app = express();

app.use("/route", rH, [rH2, rH3], rH4, rH)

app.use(
  "/user",
 [(req, res, next) => {
    console.log("Handling the route user")
    next();
    
    
 },
 (req,res, next) => {
    console.log("Handling the route user 2")
    res.send("2 Response")
    next()
 },
 (req,res, next) => {
    console.log("Handling the route user 3")
    res.send("3 Response")
    next()
 },
 (req,res, next) => {
    console.log("Handling the route user 4")
    res.send("4 Response")
    next()
 }

]);


app.listen(7777, () => {
    console.log("Server is running successfully on port 7777");
});
