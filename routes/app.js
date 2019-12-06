// jshint esversion: 12
// requiring node modules.
const express = require("express");
const bodyParser = require("body-parser");
const request = require('request');
const mongoose = require('mongoose');
const Users = require('../models/Users.js');
const Items = require('../models/Items.js');
const Transactions = require('../models/Transactions.js');
const Payments = require('../util/payment.js');


//connecting to mongo database.
mongoose.connect("mongodb://localhost/arteDB", { useUnifiedTopology: true, useNewUrlParser: true });

// creating app using express module.
const app = express();

app.use(bodyParser.json());

// creating app post requests.
app.post("/createUser", (req, res) => {
    // for creating users
    let name = req.body.name;
    let id = req.body.googleId;
    let photoUrl = req.body.photoUrl;

    Users.create({ userName: name, googleId: id, userProfilePhotoUrl: photoUrl }, function(err, small) {
        if (err) return handleError(err);
        else {
            res.send('Success');
        }
    });
});

app.post("/createItem", (req, res) => {
    // for creating art items
    let name = req.body.artname;
    let Price = req.body.price;
    let Category = req.body.category;
    let AuthorId = req.body.authorId;
    let Description = req.body.description;
    let ThumbnailUrl = req.body.thumbnailUrl;
    let FullResUrl = req.body.fullResUrl;

    Items.create({ itemName: name, itemPrice: Price, itemCategory: Category, itemAuthorId: AuthorId, itemDescription: Description, itemThumbnailUrl: ThumbnailUrl, itemFullResUrl: FullResUrl }, function(err, small) {
        if (err) return handleError(err);
        else {
            res.send('Success');
        }
    });
});

app.post("/createTransaction", async(req, res) => {
    // for creating transactions
    let buyer = req.body.buyerId;
    let seller = req.body.sellerId;
    let transactionStatus = req.body.status;

    Transactions.create({ buyerId: buyer, sellerId: seller, status: transactionStatus, referenceNumber: Payments.randomAlphaString(12) }, async function(err, small) {
        if (err) console.log(err);
        else {
            // testng payment generaton.
            let link = await Payments.getPaymentLink('1dfsdfsf', 'sedem.amelfsdfls.3@gmal', 30);

            res.send({ link: link });
        }
    });
});

// server
app.listen(3000, () => {
    console.log("Server started on port 3000");
});