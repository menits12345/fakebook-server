const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(require("./routes/record"));
// use the express-static middleware
app.use(express.static("public"));
var bodyParser = require('body-parser')
app.use(bodyParser.json({ limit: '50mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 500000 }))

// get driver connection
const dbo = require("./db/conn");


app.listen(process.env.PORT, () => {
    // perform a database connection when server starts
    dbo.connectToServer(function (err) {
        if (err) console.error(err);

    });
    console.log(`Server is running on port: ${process.env.PORT}`);
});