
const express = require('express');

const app = express();

app.get("/user/:userId/:name/:password", (req,res) => {
    console.log(req.params);
    res.send({firstName: "Amit", lastName: "Kumar"})
});


app.listen(7777, ()=> {
    console.log("Server is running successfully on port 7777");
});
