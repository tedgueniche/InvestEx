



var Stock = function(ticker) {
	this.ticker = ticker;
	this.prices = [];
}

Stock.prototype.getClosingPrice = function(date, success, error) {
	
	var day = date.getDate();
	var month = date.getMonth() + 1;
	month = (month < 10) ? "0" + month : month;
	var year = date.getFullYear();

	var dateString = year +"-"+ month +"-"+ day;
	console.log("Fetching "+ dateString);

	if(this.prices[dateString] != undefined) {
		success(this.prices[dateString]);
	}

	var url = 'http://query.yahooapis.com/v1/public/yql';
    var data = encodeURIComponent('select * from yahoo.finance.historicaldata where symbol in ("' + this.ticker + '") and startDate = "'+ dateString +'" and endDate = "'+ dateString +'"');

    var self = this;
    $.getJSON(url, 'q=' + data + "&format=json&diagnostics=true&env=http://datatables.org/alltables.env")
	    .done(function (data) {

	    	var closingPrice = data.query.results.quote.Close;
	    	self.prices[dateString] = closingPrice;
	        console.log("Price: " + closingPrice);

	        success(closingPrice);
	    })
	    .fail(function (jqxhr, textStatus, error) {
	        var err = textStatus + ", " + error;
	        console.log('Request failed: ' + err);

	        error(textStatus + ", " + error);
	    });
};


Stock.prototype.calcReturn = function(startDate, endDate, success, error) {

	var self = this;
	this.getClosingPrice(startDate, function(startPrice) {

		self.getClosingPrice(endDate, function(endPrice) {

			var result = (endPrice / startPrice) - 1;
			console.log("Returns calculated: "+ (result * 100) + "%");
			success(result);

		}, function() {});

	}, function() {});

}