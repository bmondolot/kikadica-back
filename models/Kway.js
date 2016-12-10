var mongoose = require('mongoose');

var KwaySchema = new mongoose.Schema({
  user: String,
  location: String,
  distance: Number
});

mongoose.model('Kway', KwaySchema);