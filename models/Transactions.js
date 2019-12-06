
//requiring node modules.
const mongoose = require('mongoose');

let transactionSchema = new mongoose.Schema({
    artId: {type: String, required: true, ref:'Items'},
    buyerId: {type: String, required: false},
    status: { type: String, enum: ['PENDING', 'ACCEPTED', 'FAILED'], default: 'PENDING' },
    referenceNumber: {type:String, required: true},

});

transactionSchema.set('toJSON', { virtuals: true });
transactionSchema.set('toObject', { virtuals: true });

// transaction model
transaction = mongoose.model('Transactions', transactionSchema);

module.exports = transaction;