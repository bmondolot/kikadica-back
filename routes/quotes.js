var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var moment = require('moment');
var Quote = mongoose.model('Quote');

const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 10;
const DEFAULT_MAX = 100;
const PAGE_PARAM = 'page';
const PERPAGE_PARAM = 'perpage';

const getParamAsInt = (req, name, defaultValue, maxValue = DEFAULT_MAX) => {
	let param = Number(req.params[name]);
	
	if (isNaN(param)) {
		console.warn("This value (" + req.params[name] + ") is not correct for the param \"" + name +"\", set param value to default one (" + defaultValue + ")");
		param = defaultValue;
	} else if (param > maxValue) {
		console.warn("This value (" + req.params[name] + ") is too high for the param \"" + name +"\", set param value to max one (" + maxValue + ")");
		param = maxValue;
	}
	
	return param;
}

/* Get All Quotes */
router.get('/quotes/' + PAGE_PARAM + '/:' + PAGE_PARAM + '/' + PERPAGE_PARAM + '/:' + PERPAGE_PARAM, function(req, res, next) {
	let page = getParamAsInt(req, PAGE_PARAM, DEFAULT_PAGE);
	let perpage = getParamAsInt(req, PERPAGE_PARAM, DEFAULT_PER_PAGE);
	
	Quote.find({deletionDate: {$exists: false}}).sort('-creationDate').skip((page - 1) * perpage).limit(perpage).exec(function(err, quotes) {
		if (err) {
			console.log("Unable to get quotes because of " + err);
			return next(err);
		}
		res.json(quotes);
	});
});

/* Add a new quote */
router.put('/quote', function (req, res, next) {
	let quote = new Quote(req.body);
	
	if (!quote.creationDate) {
		// front sends us creationDate under JSON format : {time: "23/12/2016 19:37"}
		quote.creationDate = new Date(moment(req.body.creationDate.time, 'DD/MM/YYYY hh:mm'));
	}
	
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
	let quote = new Quote(req.body);
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
	let quote = new Quote(req.body);
	
	Quote.findByIdAndUpdate(quote._id, quote.toObject(), {'new': true}, function(err, newQuote) {
		if (err) {
			console.log("Unable to update the quote " + quote._id + " because of " + err);
			return next(err);
		}
		res.json(newQuote);
	});
});

/* Find by quoted user */
router.get('/quotes/byquoteduser/:quoteduser/' + PAGE_PARAM + '/:' + PAGE_PARAM + '/' + PERPAGE_PARAM + '/:' + PERPAGE_PARAM, function(req, res) {
	let page = getParamAsInt(req, PAGE_PARAM, DEFAULT_PAGE);
	let perpage = getParamAsInt(req, PERPAGE_PARAM, DEFAULT_PER_PAGE);
	
	let query = Quote.find({ 'quotedUser': req.params.quoteduser, 'deletionDate': {$exists: false} }).sort('-creationDate').skip((page - 1) * perpage).limit(perpage);

	query.exec(function(err, quotes) {
		if (err) {
			console.log("Unable to get quotes by quotedUser " + req.params.quoteduser + " because of " + err);
			return next(err);
		}
		res.json(quotes);
	});
});

/* Find by author user */
router.get('/quotes/byauthoruser/:authoruser/' + PAGE_PARAM + '/:' + PAGE_PARAM + '/' + PERPAGE_PARAM + '/:' + PERPAGE_PARAM, function(req, res, next) {
	let page = getParamAsInt(req, PAGE_PARAM, DEFAULT_PAGE);
	let perpage = getParamAsInt(req, PERPAGE_PARAM, DEFAULT_PER_PAGE);
	
	let query = Quote.find({ 'authorUser': req.params.authoruser, 'deletionDate': {$exists: false} }).sort('-creationDate').skip((page - 1) * perpage).limit(perpage);

	query.exec(function(err, quotes) {
		if (err) {
			console.log("Unable to get quotes by authorUser " + req.params.authoruser + " because of " + err);
			return next(err);
		}
		res.json(quotes);
	});
});

/* Show soft deleted quotes */
router.get('/quotes/deleted', function(req, res, next) {
	Quote.find({deletionDate: {$exists: true}}).sort('-deletionDate').exec(function(err, quotes) {
		if (err) {
			console.log("Unable to get deleted quotes because of " + err);
			return next(err);
		}
		res.json(quotes);
	});
});

/* Get all authors, ordered by their amount of quotes */
router.get('/authors/' + PAGE_PARAM + '/:' + PAGE_PARAM + '/' + PERPAGE_PARAM + '/:' + PERPAGE_PARAM, function(req, res, next) {
	let page = getParamAsInt(req, PAGE_PARAM, DEFAULT_PAGE);
	let perpage = getParamAsInt(req, PERPAGE_PARAM, DEFAULT_PER_PAGE);
	
	let query = Quote.aggregate( [{ $match: {'deletionDate': {$exists: false}} }, { $group: { _id: '$authorUser', totalQuotes: { $sum: 1} }}] );
	query.sort('-totalQuotes').skip((page - 1) * perpage).limit(perpage);
	
	query.exec(function(err, data) {
		if (err) {
			console.log("Unable to get authors (page=" + page + ", perpage=" + perpage + ") because of " + err);
			return next(err);
		}
		res.json(data);
	});
});

/* Get all quoted, ordered by their amount of quotes */
router.get('/quoted/' + PAGE_PARAM + '/:' + PAGE_PARAM + '/' + PERPAGE_PARAM + '/:' + PERPAGE_PARAM, function(req, res, next) {
	let page = getParamAsInt(req, PAGE_PARAM, DEFAULT_PAGE);
	let perpage = getParamAsInt(req, PERPAGE_PARAM, DEFAULT_PER_PAGE);
	
	let query = Quote.aggregate( [{ $match: {'deletionDate': {$exists: false}} }, { $group: { _id: '$quotedUser', totalQuotes: { $sum: 1} }}] );
	query.sort('-totalQuotes').skip((page - 1) * perpage).limit(perpage);
	
	query.exec(function(err, data) {
		if (err) {
			console.log("Unable to get quoted (page=" + page + ", perpage=" + perpage + ") because of " + err);
			return next(err);
		}
		res.json(data);
	});
});

/* Get random quote */
router.get('/quote/random', function(req, res, next) {
	let lastMonth = new Date();
	lastMonth.setMonth(lastMonth.getMonth() - 1);
	
	Quote.count( {'deletionDate': {$exists: false}, 'creationDate': {$lte: lastMonth}} ).exec(function(err, count) {
		let random = Math.floor(Math.random() * count);
		
		Quote.findOne( {'deletionDate': {$exists: false}, 'creationDate': {$lte: lastMonth}} ).skip(random).exec(function (err, data) {
			if (err) {
				console.log("Unable to get random quote because of " + err);
				return next(err);
			}
			res.json(data);
		});
	});
});

module.exports = router;
