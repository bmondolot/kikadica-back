var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Quote = mongoose.model('Quote');
var Kway = mongoose.model('Kway');


/* GET All Quotes */
router.get('/quotes', function(req, res, next) {
	console.warn("/quotes route is deprecated, please use /quotes/page/:page/perpage/:quotesperpage instead.");
	
	Quote.find({deletionDate: {$exists: false}}).sort('-creationDate').exec(function(err, quotes) {
		if (err) {
			console.log("Unable to get quotes because of " + err);
			return next(err);
		}
		res.json(quotes);
	});
});

router.get('/quotes/page/:page/perpage/:quotesperpage', function(req, res, next) {
	var page = Number(req.params.page);
	var quotesperpage = Number(req.params.quotesperpage);
	
	// by default we will get first page with 10 quotes
	if (isNaN(page)) {
		page = 1;
	}
	if (isNaN(quotesperpage)) {
		quotesperpage = 10;
	}
	
	Quote.find({deletionDate: {$exists: false}}).sort('-creationDate').skip((page - 1) * quotesperpage).limit(quotesperpage).exec(function(err, quotes) {
		if (err) {
			console.log("Unable to get quotes because of " + err);
			return next(err);
		}
		res.json(quotes);
	});
});

/* Add a new quote */
router.put('/quote', function (req, res, next) {
	var quote = new Quote(req.body);
	
	quote.save(function(err, pos) {
		if (err) {
			console.log("Unable to add quote " + quote + " because of " + err);
			return next(err);
		}
		res.json(quote);
	});
});

/* Delete a quote */
router.delete('/quote', function (req, res, next) {
	var quote = new Quote(req.body);
	quote.deletionDate = new Date();	
	
	Quote.findByIdAndUpdate(quote._id, quote.toObject(), {'new': true}, function(err, newQuote) {
		if (err) {
			console.log("Unable to delete the quote " + quote._id + " because of " + err);
			return next(err);
		}
		res.json(newQuote);
	});
});

/* Update a quote */
router.post('/quote', function (req, res, next) {
	var quote = new Quote(req.body);
	
	Quote.findByIdAndUpdate(quote._id, quote.toObject(), {'new': true}, function(err, newQuote) {
		if (err) {
			console.log("Unable to update the quote " + quote._id + " because of " + err);
			return next(err);
		}
		res.json(newQuote);
	});
});

/* Find by quoted user */
router.get('/quotes/byquoteduser/:quoteduser', function(req, res) {
	var query = Quote.find({ 'quotedUser': req.params.quoteduser, 'deletionDate': {$exists: false} }).sort('-creationDate');

	query.exec(function(err, quotes) {
		if (err) {
			console.log("Unable to get quotes by quotedUser " + req.params.quoteduser + " because of " + err);
			return next(err);
		}
		res.json(quotes);
	});
});

/* Find by author user */
router.get('/quotes/byauthoruser/:authoruser', function(req, res, next) {
	var query = Quote.find({ 'authorUser': req.params.authoruser, 'deletionDate': {$exists: false} }).sort('-creationDate');

	query.exec(function(err, quotes) {
		if (err) {
			console.log("Unable to get quotes by authorUser " + req.params.authoruser + " because of " + err);
			return next(err);
		}
		res.json(quotes);
	});
});

module.exports = router;
