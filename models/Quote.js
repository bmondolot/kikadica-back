var mongoose = require('mongoose');

var QuoteSchema = new mongoose.Schema({
  text: String,
  creationDate: Date,
  quotedUser: String,
  authorUser: String
});

mongoose.model('Quote', QuoteSchema);