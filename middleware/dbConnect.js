//requiring node modules.
const mongoose = require('mongoose');

//connecting to mongo database.
mongoose.connect("mongodb://localhost/arteDB", { useUnifiedTopology: true, useNewUrlParser: true });

let db = mongoose.connection;
// on db connection error.
db.on('error', console.error.bind(console, 'connection error'));

//on db connection open.
db.once('open', function() {
    // we're connected!
    console.log('db connected');

    //creating Schema.
    let userSchema = new mongoose.Schema({
        userName: String,
        googleId: String,
        userProfilePhotoUrl: String
    });

    let itemSchema = new mongoose.Schema({
        itemName: String,
        itemPrice: String,
        itemCategory: String,
        itemAuthorId: Object,
        itemDescription: String,
        itemThumbnailUrl: String,
        itemFullResUrl: String
    });

    let transactionSchema = new mongoose.Schema({
        buyerId: Object,
        sellerId: Object,
        status: { type: String, enum: ['pending', 'accepted', 'failed'], default: 'pending' }
    });

    //creating database models.
    //user model
    let users = mongoose.model('Users', userSchema);
    // saving users model instance
    users.create({}, function(err) {
        if (err) return handleError(err);
        // saved!
    });

    //items model
    let items = mongoose.model('Items', itemSchema);
    // saving items model instance
    users.create({}, function(err) {
        if (err) return handleError(err);
        // saved!
    });

    // transactions model
    let transactions = mongoose.model('Transactions', transactionSchema);
    // saving transactions model instance
    users.create({}, function(err) {
        if (err) return handleError(err);
        // saved!
    });

});


// module.exports = {
//     createDbSchemas: function() {

//     }
// };