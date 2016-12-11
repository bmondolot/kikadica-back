var mongoose = require('mongoose');

var KwaySchema = new mongoose.Schema({
	user : String,
	location : String,
	distance : Number,
	from : Date,
	to : Date,
	photos : [ {
		photo : String
	} ]
});

mongoose.model('Kway', KwaySchema);