'use strict';

var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var uuid = require('node-uuid');
var ipn = require('paypal-ipn');
var Paypal = require('paypal-ap');
var paypal = new Paypal({
	username:  'gbachik-facilitator_api1.gmail.com',
    password:  '1393581229',
    signature: 'An5ns1Kso7MWUdW4ErQKJJJ4qi4-A0-y.5ij40isgBfYOT.pvUsu0O.M'
});

module.exports = function(app) {

	app.get('/pay/:downloadId', function(req, res, next){

		Article.findById(req.params.downloadId, function(err, article){

			var ourFee = Math.ceil((article.price * 0.01) * 10) / 10;
			var paymentOptions = {
				actionType:   'PAY',
				currencyCode: 'USD',
				cancelUrl:  'http://localhost:3000/cancel',
				returnUrl:  'http://localhost:3000/complete',
				ipnUrl:     'http://localhost:3000/ipn',
				memo: article.title + ' - ' + article._id,
				reverseAllParallelPaymentsOnError : true,
				receiverList: {
					receiver: [{
						email: 'gbachik-facilitator@gmail.com',
						amount: ourFee,
						primary:'false'
					},{
						email: article.ppEmail,
						amount: article.price,
						primary:'true'
					}]
				},
				feesPayer: 'PRIMARYRECEIVER',
				trackingId: uuid.v1()
			};

			paypal.pay(paymentOptions, function(err, result) {
				if (err) {
					console.log(err);
					return next(err);
				}
				//payKey is used to trigger a paypal dialog on the clientside
				res.json({ payKey: result.payKey });
			});
		});
	});

	app.post('/ipn', function(req, res, next) {
		res.send(200);
		ipn.verify(params, function callback(err, msg) {
			if (err) {
				console.error(msg);
				return next(err);
			} else {
			//Do stuff with original params here
			console.log(params);
				if (params.payment_status == 'Completed') {
					//Payment has been confirmed as completed
				}
			}	
		});
	});

	app.get('/cancel', function(/*req, res, next*/){
		//triggers when the user cancel the payflow
		console.log('Failed to pay!');
	});

	app.get('/complete', function(req, res){
		//triggers when the user completes the payflow successfull
		res.end('You Paid!');
	});

};
