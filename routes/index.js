var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Quote = mongoose.model('Quote');


/* GET All Quotes */
router.get('/quotes', function(req, res, next) {
	Quote.find(function(err, quotes) {
		if (err) {
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
			return next(err);
		}
		res.json(quote);
	});
});

/* Update a quote */
router.post('/quote', function (req, res, next) {
	var quote = new Quote(req.body);
	
	Quote.findByIdAndUpdate(quote._id, quote.toObject(), {"new": true}, function(err, newQuote) {
		if (err) {
			console.log("Unable to update the quote " + quote._id + " because of " + err);
			return next(err);
		}
		res.json(newQuote);
	});
});

/* Find by quoted user */
router.param('quoteduser', function(req, res, next, username) {
	var query = Quote.find({ "quotedUser": username	});

	query.exec(function (err, quotes){
		if (err) { 
			return next(err); 
		}
		if (!quotes) { 
			return next(new Error("can't find Quote")); 
		}
		
		req.quotes = quotes;
		return next();
	  });
});
router.get('/quotes/byquoteduser/:quoteduser', function(req, res) {
	res.json(req.recette);
});

/* Find by author user */
router.param('authoruser', function(req, res, next, username) {
	var query = Quote.find({ "authoruser": username	});

	query.exec(function (err, quotes){
		if (err) { 
			return next(err); 
		}
		if (!quotes) { 
			return next(new Error("can't find Quote")); 
		}
		
		req.quotes = quotes;
		return next();
	  });
});
router.get('/quotes/byauthoruser/:authoruser', function(req, res) {
	res.json(req.recette);
});

module.exports = router;
