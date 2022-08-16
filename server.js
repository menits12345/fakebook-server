const express = require("express");
var bodyParser = require('body-parser');
var app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
// use the express-static middleware

app.use(express.static("public"));
app.use(bodyParser({ limit: '50mb' }));
app.use(require("./routes/record"));

// get driver connection
const dbo = require("./db/conn");


app.listen(process.env.PORT, () => {
    // perform a database connection when server starts
    dbo.connectToServer(function (err) {
        if (err) console.error(err);

    });
    console.log(`Server is running on port: ${process.env.PORT}`);
});