var fs = require('fs');
var cheerio = require('cheerio');
var et = require('elementtree')

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
			callback(body.toString())
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
	this.getPage({"site_url":options["site_url"]}, function (body) {
		fs.writeFileSync(options["fname"], body, encoding="utf-8")
		callback(body)
	})
}

exports.getHash = function (str, callback) {
	var crypto = require('crypto');
	var shasum = crypto.createHash('sha256');
	shasum.update(str)
	var page_hash = shasum.digest('hex')
	callback(page_hash)
}

exports.getPageHash = function (site_url, callback) {
	var self = this;
	self.getPage({"site_url":site_url}, function (body) {
		self.getHash(body, callback)
	})
}

exports.parsePage = function (site_url, callback) {
	this.getPage({"site_url": site_url}, function (body) {
		var $ = cheerio.load(body);
		callback($);
	})
}

exports.getElementsFromPage = function(site_url, elem, callback) {
	this.parsePage(site_url, function ($) {
		var res = $(elem);
		if (res.length > 1) {
			var resArray = [];
			res.each(function (i, node) {
				resArray[i] = cheerio(node)
			})
			callback(resArray)
		}
		else {
			callback([res])
		}
	})
}

exports.getHTMLElementsFromPage = function (site_url, elem, callback) {
	this.getElementsFromPage(site_url, elem, function (node) {
		callback(node.html())
	})
}

exports.getElementArrayHash = function (elems, callback) {
	var hashArray = []
	var self = this
	elems.map(function (elem, i, array) {
		self.getHash(elem.html(), function (hash) {
			hashArray.push(hash)
		})
	})
	callback(hashArray)
}