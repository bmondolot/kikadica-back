const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Quote = mongoose.model('Quote');
const Kway = mongoose.model('Kway');
const Feed = require('feed');

router.get('/', function (req, res, next) {
	
	Quote.find({deletionDate: {$exists: false}}).sort('-creationDate').limit(10).exec(function(err, quotes) {
		if (err) {
			console.log("Unable to get quotes because of " + err);
			return next(err);
		}

		let feed = new Feed({
			title: 'Kikadica',
			description: 'Kikadica',
			link: "http://localhost"
		});
		
		quotes.forEach(function (q) {
	        feed.addItem({
	            title: q.text,
	            description: q.text,
	            date: q.creationDate,
	            link: "http://localhost/"
	        });
	    });

		feed.addCategory('Philosophy');
		
		res.set('Content-Type', 'text/xml');
		res.send(feed.render('rss-2.0'));
	});
});

module.exports = router;
