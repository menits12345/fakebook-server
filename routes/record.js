const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

//const mongoose = require("mongoose");

var bodyParser = require('body-parser')
app.use(bodyParser.json({ limit: '10mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true, parameterLimit: 500000 }))

recordRoutes.route("/").get(function (req, res) {
    res.json({ status: 'success' });
});

// This section will help you get a list of all the records.
recordRoutes.route("/record").get(function (req, res) {
    let db_connect = dbo.getDb("data");
    db_connect
        .collection("records")
        .find({})
        .toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

// This section will help you get a list of all the records with name.
recordRoutes.route("/record/find/:name").get(function (req, res) {
    let db_connect = dbo.getDb("data");
    let myquery = { name: req.params.name };
    db_connect
        .collection("records")
        .find({ myquery })
        .toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

// This section will help you check if user with name exists.
recordRoutes.route("/record/findUser/:name").get(function (req, res) {
    let myquery = { name: req.params.name };
    let db_connect = dbo.getDb("data");
    db_connect.collection("records").findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

// This section will help you check if user with name and password exists.
recordRoutes.route("/record/validate/:name").get(function (req, res) {
    const myArray = req.params.name.split("@");
    let myquery = { name: myArray[0], password: myArray[1] };
    let db_connect = dbo.getDb("data");
    db_connect.collection("records").findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

// This section will help you get a single record by id
recordRoutes.route("/record/:id").get(function (req, res) {
    let db_connect = dbo.getDb("data");
    let myquery = { _id: ObjectId(req.params.id) };
    db_connect.collection("records").findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

// This section will help you create a new record.
recordRoutes.route("/record/add").post(function (req, response) {
    let db_connect = dbo.getDb("data");
    let myobj = {
        name: req.body.name,
        password: req.body.password,
        gender: req.body.gender,
        friends: [],
        posts: []
    };
    db_connect.collection("records").insertOne(myobj, function (err, res) {
        if (err) throw err;
        response.json(res);
    });
});

// This section will help you update a record by id.
recordRoutes.route("/update/:id").post(function (req, response) {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };
    let newvalues = {
        $set: {
            name: req.body.name,
            position: req.body.position,
            gender: req.body.level,
        },
    };
    db_connect
        .collection("records")
        .updateOne(myquery, newvalues, function (err, res) {
            if (err) throw err;
            console.log("1 document updated");
            response.json(res);
        });
});

// This section will help you delete a record
recordRoutes.route("/:id").delete((req, response) => {
    let db_connect = dbo.getDb("data");
    let myquery = { _id: ObjectId(req.params.id) };
    db_connect.collection("records").deleteOne(myquery, function (err, obj) {
        if (err) throw err;
        console.log("1 document deleted");
        response.json(obj);
    });
});

// This section will help you add a friend.
recordRoutes.route("/addFriend/:name").post(function (req, response) {
    let db_connect = dbo.getDb();
    let myquery = { name: req.params.name };
    let myquery2 = { $push: { friends: req.body.to } }
    db_connect
        .collection("records")
        .updateOne(myquery, myquery2, function (err, res) {
            if (err) throw err;
            console.log("1 document updated");
            response.json(res);
        });
});

// This section will help you get a list of all friends.
recordRoutes.route("/record/getFriends/:name").get(function (req, res) {
    let db_connect = dbo.getDb("data");
    let myquery = { name: req.params.name };
    db_connect
        .collection("records")
        .findOne({ name: req.params.name }, function (err, result) {
            if (err) throw err;
            res.json(result.friends);
        });
});

// This section will help you delete a friend.
recordRoutes.route("/record/deleteFriend/:name").post(function (req, response) {
    let db_connect = dbo.getDb();
    console.log("1 document updated");
    let myquery = { name: req.params.name };
    let myquery2 = { $pull: { friends: req.body.to } }
    db_connect
        .collection("records")
        .updateOne(myquery, myquery2, function (err, res) {
            if (err) {
                console.log(req.params.name);
                throw err;
            }
            console.log("1 document updated");
            response.json(res);
        });
});


// This section will help you add a post.
recordRoutes.route("/addPost/:user").post(function (req, response) {
    let db_connect = dbo.getDb();
    var today = new Date(Date.now());
    let myquery = { name: req.params.user };
    let myquery2 = {
        $push: {
            posts: {
                date: today,
                user: req.params.user,
                title: req.body.title,
                body: req.body.body,
                image: req.body.image,
                comments: [],
            }
        }
    }
    console.log("added");
    db_connect
        .collection("records")
        .updateOne(myquery, myquery2, function (err, res) {
            if (err) throw err;
            response.json(res);
        });
});

// This section will help you get a list of all posts.
recordRoutes.route("/record/getPosts/:name").get(function (req, res) {
    let db_connect = dbo.getDb("data");
    let myquery = { name: req.params.name };
    db_connect
        .collection("records")
        .findOne({ name: req.params.name }, function (err, result) {
            if (err) throw err;
            res.json(result.posts);
        });
});

module.exports = recordRoutes;