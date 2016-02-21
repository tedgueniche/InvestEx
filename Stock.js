/*
The MIT License (MIT)

Copyright (c) 2016 Ted Gueniche

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/**
 * Represents a stock (bond, equity, mutual fund, ...)
 * @param {String} symbol Symbol of the stock
 */
var Stock = function(symbol) {
	this.symbol = symbol;
	this.prices = [];
};

Stock.prototype.getMetaInformation = function() {};

/**
 * Get the price of this stock at the end of the specified date
 * This is an asynchronous process
 * @param  {Date} date Date for the closing price    
 * @param  {Function(price)} success Callback when the price is returned
 * @param  {Function(errorMessage)} error   Callback when the price could not be found
 */
Stock.prototype.getClosingPrice = function(date, success, error) {

	//verify this price is not already in cache
	var dateString = YahooAPI.getDateString(date);
	if (typeof this.prices[dateString] !== 'undefined') {
		success(this.prices[dateString]);
	} else {
		var self = this;
		YahooAPI.getQuote(this.symbol, date, function(closingPrice) {

			self.prices[dateString] = closingPrice;
			success(closingPrice);

		}, error);
	}
};

/**
 * Calculate the exact return for this stock between two dates
 * @param  {[type]} startDate First date
 * @param  {[type]} endDate   Second date
 * @param  {Function(returns)} success Callback when the return is returned
 * @param  {Function(errorMessage)} error   Callback when the return could not be calculated
 */
Stock.prototype.calcReturn = function(startDate, endDate, success, error) {

	var self = this;
	YahooAPI.getQuote(self.symbol, startDate, function(startPrice) {

		YahooAPI.getQuote(self.symbol, endDate, function(endPrice) {

			var result = (endPrice / startPrice) - 1;
			console.log("Returns calculated: " + (result * 100) + "%");
			success(result);

		}, error);

	}, error);
};