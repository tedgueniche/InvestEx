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
 * YahooAPI Namespace
 */
var YahooAPI = YahooAPI || {};
YahooAPI.queryURL = "http://query.yahooapis.com/v1/public/yql";

/**
 * Get the cost in USD of the symbol for the specified date
 * @param  {String} symbol Symbol to check the price for
 * @param  {Date} date Date for the closing price
 * @param  {Function(price)} success Callback when the price is returned
 * @param  {Function(errorMessage)} error   Callback when the price could not be found
 */
YahooAPI.getQuote = function(symbol, date, success, error) {

	var data = encodeURIComponent('select * from yahoo.finance.historicaldata where symbol in ("' + symbol + '") and startDate = "' + YahooAPI.getDateString(date) + '" and endDate = "' + YahooAPI.getDateString(date) + '"');

	var self = this;
	$.getJSON(YahooAPI.queryURL, 'q=' + data + "&format=json&diagnostics=true&env=http://datatables.org/alltables.env")
		.done(function(data) {

			if (data.query.results === null) {
				error("No price for this date");
			} else {
				var closingPrice = data.query.results.quote.Close;
				success(closingPrice);
			}
		})
		.fail(function(jqxhr, textStatus, error) {
			var err = textStatus + ", " + error;
			error('Request failed: ' + err);
		});
};

/**
 * Transform a date object into its string representation for the Yahoo API
 * @param  {Date} date Date to transform
 * @return {String}      String representation
 */
YahooAPI.getDateString = function(date) {

	var day = date.getDate();
	var month = date.getMonth() + 1;
	month = (month < 10) ? "0" + month : month;
	var year = date.getFullYear();
	var dateString = year + "-" + month + "-" + day;

	return dateString;
};