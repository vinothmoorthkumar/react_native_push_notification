const express = require('express')

const app = express()
var bodyParser = require('body-parser')
app.use(bodyParser.json({ }))

const port = 3000
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

let dbo
MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    dbo = db.db("mydb");

});
app.post('/', (req, res) => {
    console.log("req.body",req.body)
    var myobj = { token: req.body.token };
    dbo.collection("fcm").insertOne(myobj, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        // db.close();
    });
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})