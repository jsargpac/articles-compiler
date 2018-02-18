const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const httpRequest = require('https');
var querystring = require('querystring');
var mongoose = require('mongoose');
var fs = require('fs');
var util = require('util');
var async = require('async');
var PropertiesReader = require('properties-reader');

const article = require('../models/Article.js');
var properties = PropertiesReader('/config/properties.file');

/**
 * GET /pocket
 * Pocket page.
 */
exports.getPocket = (req, res) => {
  article.find((err, docs) => {
    res.render('pocket', {
        title: 'Pocket',
        articles: docs });
  });  
};

/**
 * POST /pocket
 * Import pocket articles
 */
exports.importPocket = (req, res, next) => {

    function authPocket() {
        var pocketAuthUrl = "https://getpocket.com/v3/oauth/request";
        var pocketLoginUrl = "https://getpocket.com/auth/authorize";
        var pocketGet = "https://getpocket.com/v3/get";
        var http = new XMLHttpRequest();
        var consumerKey = properties.pocket.consumer_key;
        var accessToken = properties.pocket.access_token;
        var count = 10000;
        var offset = 2;

        var finalUrl = pocketGet + "?access_token=" + accessToken + "&consumer_key=" + consumerKey + "&count=" + count + "&offset=" + offset;
        console.log(finalUrl);

        http.open("POST", finalUrl, true);
        http.onreadystatechange = function () {
            if (http.readyState == 4 && http.status == 200) {
                var response = JSON.parse(http.responseText);
                //console.log(response);
                //var articles = response.dataset.data.map(function (value, index) { return value[0]; });
                var n = 0;
                for (var id in response['list']) {
                    console.log(response['list'][id]['resolved_url']);
                    var doc = new article();
                    doc['id'] = mongoose.Types.ObjectId();
                    doc['url'] = response['list'][id]['resolved_url'];
                    doc['title'] = response['list'][id]['resolved_title'];
                    doc['excerpt'] = response['list'][id]['excerpt'];
                    if (response['list'][id]['favorite'] == '1') {
                        doc['favorite'] = true;
                    }
                    
                    doc['word_count'] = response['list'][id]['word_count'];
                    n++;
                    //doc.save();
                }
                console.log(n);
            } else {
                console.log(http.status);
            }
        }
        http.send();
    }

    authPocket();

/*    transaction.find({ 'nature': 'Acquisition' }, function (err, transactions) {
        if (err) return handleError(err);
        if (transactions != null) {
            // getData(transactions[0].isin);
            async.each(transactions, function(transactionFound, callback) {
                getData(transactionFound.isin);
            })
            // transactions.forEach(function(transactionFound) {
            //     async.parallel(getData(transactionFound.isin));
            // }, this);
        }
    });

    function getData(isin) {
        getCodeFromISIN(isin, function (err, stock) {
            var startDate = "2017-01-01";
            var endDate = "2017-09-22";
            requestQuandlData(stock, startDate, endDate);
        });
    }

    function getCodeFromISIN(isinSource, callback) {
        stock.findOne({ 'isin': isinSource }, function (err, stockFound) {
            if (err) return handleError(err);
            if (stockFound != null) {
                console.log(stockFound.code);
                callback(null, stockFound);
            }
        })
    }

    //AlphaVantage API Key: 974UTD95QA2DV3Y5
    function requestAlphaVantageData(symbol) {
        var alpha = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=1min&apikey=974UTD95QA2DV3Y5";
        var http = new XMLHttpRequest();
        http.open("GET", quandl, true);
        http.onreadystatechange = function () {
            if (http.readyState == 4 && http.status == 200) {
                var response = JSON.parse(http.responseText);
                console.log(response);
            }
        }
        http.send();
    }

    // Quandl API Key: x-sv5jiML9zikPj8wjJy
    function requestQuandlData(stock, startDate, endDate) {
        var quandl = "https://www.quandl.com/api/v3/datasets/EURONEXT/" + stock.code + "?start_date=" + startDate +
            "&end_date=" + endDate + "&api_key=x-sv5jiML9zikPj8wjJy";
        // console.log(quandl);
        if (stock != null) {
            if (!stock.already_imported) {
                var http = new XMLHttpRequest();
                http.open("GET", quandl, true);
                http.onreadystatechange = function () {
                    if (http.readyState == 4 && http.status == 200) {
                        var response = JSON.parse(http.responseText);
                        var dates = response.dataset.data.map(function (value, index) { return value[0]; })
                        dates.reverse();
                        var closes = response.dataset.data.map(function (value, index) { return value[4]; })
                        closes.reverse();
                        updateStockClose(stock, dates, closes);
                    }
                }
                http.send();
            }
        }
    }

    function updateStockClose(stock, dates, closes) {
        if (stock != null) {
            console.log("Ajout close : " + stock.code + " - " + stock.close.length + " / " + dates.length);
            // if (stock.close.length == 0) stock.close = [[]];
            stock.close = [[]];
            for (i = 0; i < dates.length; i++) stock.close.push([dates[i], closes[i]]);
            stock.already_imported = true;
            stock.save();
        }
    }*/

};