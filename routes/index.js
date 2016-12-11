var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Quote = mongoose.model('Quote');
var Kway = mongoose.model('Kway');

const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 10;
const PAGE_PARAM = 'page';
const PERPAGE_PARAM = 'perpage';

function getParamAsInt(req, name, defaultValue) {
	var param = Number(req.params[name]);
	
	if (isNaN(param)) {
		console.warn("This value (" + req.params[name] + ") is not correct for the param \"" + name +"\", set param value to default one (" + defaultValue + ")");
		param = defaultValue;
	}
	
	return param;
}

/*
 * @Deprecated 
 * GET All Quotes
 */
router.get('/quotes', function(req, res, next) {
	console.warn("/quotes route is deprecated, please use /quotes" + PAGE_PARAM + '/:' + PAGE_PARAM + '/' + PERPAGE_PARAM + '/:' + PERPAGE_PARAM + " instead.");
	
	Quote.find({deletionDate: {$exists: false}}).sort('-creationDate').exec(function(err, quotes) {
		if (err) {
			console.log("Unable to get quotes because of " + err);
			return next(err);
		}
		res.json(quotes);
	});
});

router.get('/quotes/' + PAGE_PARAM + '/:' + PAGE_PARAM + '/' + PERPAGE_PARAM + '/:' + PERPAGE_PARAM, function(req, res, next) {
	var page = getParamAsInt(req, PAGE_PARAM, DEFAULT_PAGE);
	var perpage = getParamAsInt(req, PERPAGE_PARAM, DEFAULT_PER_PAGE);
	
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

/*
 * @Deprecated
 * Find by quoted user
 */
router.get('/quotes/byquoteduser/:quoteduser', function(req, res) {
	console.warn("/quotes/byquoteduser/:quoteduser route is deprecated, please use /quotes/" + PAGE_PARAM + '/:' + PAGE_PARAM + '/' + PERPAGE_PARAM + '/:' + PERPAGE_PARAM + " instead.");
	
	var query = Quote.find({ 'quotedUser': req.params.quoteduser, 'deletionDate': {$exists: false} }).sort('-creationDate');

	query.exec(function(err, quotes) {
		if (err) {
			console.log("Unable to get quotes by quotedUser " + req.params.quoteduser + " because of " + err);
			return next(err);
		}
		res.json(quotes);
	});
});

router.get('/quotes/byquoteduser/:quoteduser/' + PAGE_PARAM + '/:' + PAGE_PARAM + '/' + PERPAGE_PARAM + '/:' + PERPAGE_PARAM, function(req, res) {
	var page = getParamAsInt(req, PAGE_PARAM, DEFAULT_PAGE);
	var perpage = getParamAsInt(req, PERPAGE_PARAM, DEFAULT_PER_PAGE);
	
	var query = Quote.find({ 'quotedUser': req.params.quoteduser, 'deletionDate': {$exists: false} }).sort('-creationDate').skip((page - 1) * perpage).limit(perpage);

	query.exec(function(err, quotes) {
		if (err) {
			console.log("Unable to get quotes by quotedUser " + req.params.quoteduser + " because of " + err);
			return next(err);
		}
		res.json(quotes);
	});
});

/*
 * @Deprecated 
 * Find by author user
 */
router.get('/quotes/byauthoruser/:authoruser', function(req, res, next) {
	console.warn("/quotes/byauthoruser/:authoruser route is deprecated, please use /quotes/" + PAGE_PARAM + '/:' + PAGE_PARAM + '/' + PERPAGE_PARAM + '/:' + PERPAGE_PARAM+ " instead.");
	
	var query = Quote.find({ 'authorUser': req.params.authoruser, 'deletionDate': {$exists: false} }).sort('-creationDate');

	query.exec(function(err, quotes) {
		if (err) {
			console.log("Unable to get quotes by authorUser " + req.params.authoruser + " because of " + err);
			return next(err);
		}
		res.json(quotes);
	});
});

router.get('/quotes/byauthoruser/:authoruser/' + PAGE_PARAM + '/:' + PAGE_PARAM + '/' + PERPAGE_PARAM + '/:' + PERPAGE_PARAM, function(req, res, next) {
	var page = getParamAsInt(req, PAGE_PARAM, DEFAULT_PAGE);
	var perpage = getParamAsInt(req, PERPAGE_PARAM, DEFAULT_PER_PAGE);
	
	var query = Quote.find({ 'authorUser': req.params.authoruser, 'deletionDate': {$exists: false} }).sort('-creationDate').skip((page - 1) * perpage).limit(perpage);

	query.exec(function(err, quotes) {
		if (err) {
			console.log("Unable to get quotes by authorUser " + req.params.authoruser + " because of " + err);
			return next(err);
		}
		res.json(quotes);
	});
});

/*
 * Show soft deleted quotes
 */
router.get('/quotes/deleted', function(req, res, next) {
	Quote.find({deletionDate: {$exists: true}}).sort('-deletionDate').exec(function(err, quotes) {
		if (err) {
			console.log("Unable to get deleted quotes because of " + err);
			return next(err);
		}
		res.json(quotes);
	});
});

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
