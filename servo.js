var fs = require('fs');

exports.testPage = function (site_url, callback) {
	var request = require('request');
	if (site_url == undefined) throw "Need to define the URL"
	request.head({url: site_url}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			callback(response.headers)
		}
		else {
			console.log("Something went wrong");
		}
	})
}

exports.getETags = function (site_url, callback) {
	this.testPage(site_url, function (d) {
		callback(d.etag)
	})
}

exports.getPage = function (options, callback) {
	var request = require('request');
	if (options.headers == undefined) {options["headers"] = {"User-Agent":'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)'}}
	request({headers: options["headers"],url: options["site_url"]}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			callback(body)
		}
		else {
			console.log("Something went wrong");
		}
	})
}

exports.writePage = function (options, callback) {
	if (options.fname == undefined) {options["fname"] = "temp.html"}
	if (options.site_url == undefined) {throw "Need to set a URL to be scraped"}

	//TODO: Abstract the options call with an error that url needs to be defined
	getPage({"site_url":options["site_url"]}, function (body) {
		fs.writeFileSync(options["fname"], body, encoding="utf-8")
		callback(body)
	})
}

exports.getHash = function (page_str, callback) {
	var crypto = require('crypto');
	var shasum = crypto.createHash('sha256');
	shasum.update(page_str)
	var page_hash = shasum.digest('hex')
	callback(page_hash)
}

exports.getPageHash = function (site_url, callback) {
	var self = this;
	self.getPage({"site_url":site_url}, function (body) {
		self.getHash(body, function (hash) {
			callback(hash)
		})
	})
}