var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Quote = mongoose.model('Quote');
var async = require('async');

/*
 * The purpose of this function is just to inform Async that parallel calls are finished
 */
const informQueryHasFinished = () => {
	return true;
}

/*
 * Get all users of some type, then add them to a collection an finally informa Async treatment is over 
 */
const getDistinctUsers = (typeOfUser, collection, next, informQueryHasFinished) => {
	Quote.distinct(typeOfUser).exec(
		function(err, users) {
			if (err) {
				console.log("Unable to get list of " + typeOfUser + " because of " + err);
				return next(err);
			}
			users.forEach(function(elt) {
				collection.add(elt);
			});
			
			informQueryHasFinished();
		}
	)
}

/* Get all users */
router.get('/', function(req, res, next) {
	let collection = new Set();
	
	// Mongoose promises are asynchronous so we have to use Async module to parallelize them in order to finally manipulate the whole list
	async.parallel([
		function(informQueryHasFinished) {
			getDistinctUsers('quotedUser', collection, next, informQueryHasFinished);
		},
		function(informQueryHasFinished) {
			getDistinctUsers('authorUser', collection, next, informQueryHasFinished);
		}
	], function() {
		res.json(Array.from(collection).sort());
	});
});

module.exports = router;
