var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Kway = mongoose.model('Kway');

/*
 * Show all Kway
 */
router.get('/kways', function(req, res, next) {
	Kway.find().sort('-to').exec(function(err, quotes) {
		if (err) {
			console.log("Unable to get list of kway because of " + err);
			return next(err);
		}
		res.json(quotes);
	});
});

/*
 * Calculate the distance that kway travels
 */
router.get('/kways/distance', function(req, res, next) {
	Kway.aggregate( { $group: { _id: null, totalDistance: { $sum: "$distance"} }} ).exec(function(err, totalDistance) {
		if (err) {
			console.log("Unable to get distance that kway traveled because of " + err);
			return next(err);
		}
		res.json(totalDistance);
	});
});

/* Add a new kway */
router.put('/kway', function (req, res, next) {
	var kway = new Kway(req.body);
	
	kway.save(function(err, pos) {
		if (err) {
			console.log("Unable to add kway " + kway + " because of " + err);
			return next(err);
		}
		res.json(kway);
	});
});

module.exports = router;
