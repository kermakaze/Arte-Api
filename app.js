// jshint esversion: 12
// requiring node modules.
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const request = require('request');
const mongoose = require('mongoose');
const User = require('./models/Users.js');
const ArtItem = require('./models/ArtItem');
const Transactions = require('./models/Transactions.js');
const PaymentUtil = require('./util/PaymentUtil');

const ResponseUtils = require('./util/ResponseUtils');

const logger = require('morgan');


//connecting to mongo database.
mongoose.connect("mongodb://localhost/arteDB", {useUnifiedTopology: true, useNewUrlParser: true});

// creating app using express module.
const app = express();

app.use(logger('dev'
));

app.use(bodyParser.json());

// creating app post requests.
app.post("/register_google", async (req, res) => {

    try {
        let user = await User.create({
            username: req.body.username,
            googleId: req.body.googleId,
            profilePhotoUrl: req.body.profilePhotoUrl
        });

        res.send({
            id: user.id
        })
    } catch (e) {
        console.error(e);
        ResponseUtils.sendError(res, 500, "Failed to create account")
    }
});

app.post("/login_google", async (req, res) => {

    let user = await User.findOne({googleId: req.body.googleId});

    if (!user) {
        return await ResponseUtils.sendError(res, 404, "Account not found")

    } else {
        res.send({
            id: user.id
        })
    }
});

//Webhook
app.post('/transaction_status', async (req, res) => {

    let transaction = await Transactions.findOneAndUpdate({referenceNumber: req.body.txRef},
        {
            status: 'ACCEPTED'
        });

    console.log(transaction)

    res.send("ack!")
});


app.use(async function (req, res, next) {

    // check header or url parameters or post parameters for token
    let id = req.headers['id'];

    // decode token
    if (id) {
        // verifies secret and checks exp

        let user = await User.findById(id)


        if (!user) {
            return res.status(404).send({
                error: 'User  with this token has been deleted!'
            });
        }


        req.currentUserId = id;
        req.user = user;

        //console.log(user);
        next();

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            error: 'No Id provided.'
        });

    }
});

app.post("/uploadArtItem", async (req, res) => {
    // for creating art items
    try {
        let artItem = await ArtItem.create({
            price: req.body.price,

            sellerId: req.currentUserId,
            description: req.body.description,

            fullResUrl: req.body.fullResUrl
        });
        ResponseUtils.sendGenericResponse(res);
    } catch (e) {
        ResponseUtils.sendServerError(res);
    }
});

app.get('/art_items', async (req, res) => {

    try {

        let artItems = await ArtItem.find({sellerId: {
                $ne: req.currentUserId
            }})
            .populate("sellerId");

        res.send(artItems)

    } catch (e) {
        ResponseUtils.sendServerError(res);
        console.error(e)
    }
});

app.get('/art_sold', async (req, res) => {


    let transactions = await Transactions.find({status: 'ACCEPTED'})
        .populate('artId');
    console.log(transactions)

    res.send(transactions)
});

app.post("/purchase_item", async (req, res) => {
    try {


        // for creating transactions


        let referenceNo = PaymentUtil.randomAlphaString(12);
        let transaction = await Transactions.create({
            artId:req.body.artId,
            buyerId: req.currentUserId,

            referenceNumber: referenceNo
        });
        let artItem = await ArtItem.findById(req.body.artId);


        console.log(artItem)

        // testng payment generaton.
        let link = await PaymentUtil.getPaymentLink(referenceNo, 'info@arte.com', artItem.price);

        res.send({link: link});

    }
    catch (e) {
        console.error(e);ResponseUtils.sendServerError(res);
    }

});
app.get('/info', async (req, res)=>{
    let user = await User.findById(req.currentUserId);
    res.send(user)

});



// server
app.listen(80, () => {
    console.log("Server started on port 80");
});


