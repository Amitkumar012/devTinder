
const express = require('express');

const app = express();

app.use("/user",(req,res) => {
    res.send("HAHAHAHA")
}); 

app.get("/user", (req,res) => {
    res.send({firstName: "Amit", lastName: "Kumar"})
});

app.post("/user",(req,res) => {
    // console.log("Save data to the database");
    //Saving data
    res.send("Data is successfully saved to database");

});

app.delete("/user", (req, res) => {
    res.send("If you want to delete you can do.")
});


app.use("/test",(req,res) => {
    res.send("Hello from the server");
});


app.listen(7777, ()=> {
    console.log("Server is running successfully on port 7777");
});
