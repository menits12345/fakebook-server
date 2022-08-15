const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const postRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// This section will help you create a new record.
postRoutes.route("/post/add").post(function (req, response) {
    let db_connect = dbo.getDb("data");
    console.log("1 document added");
    let myobj = {
        user: req.body.user,
        title: req.body.title,
        body: req.body.body,
        image: req.body.image,
        comments: [],
    };
    db_connect.collection("posts").insertOne(myobj, function (err, res) {
        if (err) throw err;
        response.json(res);
    });
});

// This section will help you get a list of all friends.
postRoutes.route("/post/getPosts/:user").get(function (req, res) {
    let db_connect = dbo.getDb("data");
    db_connect
        .collection("posts")
        .findOne({ user: req.params.user }, function (err, result) {
            if (err) {
                throw err;
            }
            res.json(result);
        });
});

module.exports = postRoutes;