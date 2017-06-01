var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var path = require('path');

var app = express();

app.get('/api/:_isbn', function(req, res){


	//Headers
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	
	//Links
	var amazonUsed = 'https://www.amazon.com/gp/offer-listing/' + req.params._isbn + '/ref=olp_f_used?ie=UTF8&f_used=true&f_usedAcceptable=true&f_usedGood=true&f_usedLikeNew=true&f_usedVeryGood=true';
	var amazonNew = 'https://www.amazon.com/gp/offer-listing/' + req.params._isbn + '/ref=olp_f_new?ie=UTF8&f_new=true';
	var amazonRental = 'https://www.amazon.com/gp/offer-listing/' + req.params._isbn + '/ref=olp_f_new?ie=UTF8&f_rental=true';

	//Return object with info
	var p = {
		title: '',
		options: []
	};

	//Request for Used
	getPrice(amazonUsed, p, function(){
		//Request for New
		getPrice(amazonNew, p, function(){
			//Request for Rental
			getPrice(amazonRental, p, function(){
				res.send(p);
			});
		});
	});

});

app.listen(3000, function(){
	console.log('Server Started on Port 3000...');
});

function getPrice(url, p, cb){

	const options = {  
	    url: url,
	    method: 'GET',
	    headers: {
	        'Accept': 'application/json',
	        'Accept-Charset': 'utf-8',
	        'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-GB; rv:1.8.1.6) Gecko/20070725'
	    }
	};

	request(options, function(err, resp, body){

		let $ = cheerio.load(body);

		$title = $('h1').first().text().trim().replace(/  /g, '');
		$condition = $('.olpCondition').first().text().trim().replace(/  /g, '').replace('\n', ' ');
		$price = $('.olpOfferPrice').first().text().trim();

		p.title = $title;
		p.options.push({
			condition: $condition,
			price: $price,
			url: options.url
		});
		cb();
	});
}














