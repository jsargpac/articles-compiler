const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const httpRequest = require('https');
var querystring = require('querystring');
var mongoose = require('mongoose');
var fs = require('fs');
var util = require('util');
var async = require('async');
var PropertiesReader = require('properties-reader');

const article = require('../models/Article.js');
var properties = PropertiesReader(__dirname + '/properties.file');

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

    function retrieveFromPocket() {
        var pocketAuthUrl = "https://getpocket.com/v3/oauth/request";
        var pocketLoginUrl = "https://getpocket.com/auth/authorize";
        var pocketGet = "https://getpocket.com/v3/get";
        var http = new XMLHttpRequest();
        var consumerKey = properties.get('pocket.consumer_key');
        var accessToken = properties.get('pocket.access_token');
        var count = 10000;
        var offset = 2;

        var finalUrl = pocketGet + "?access_token=" + accessToken + "&consumer_key=" + consumerKey + "&count=" + count + "&offset=" + offset;
        console.log(finalUrl);

        http.open("POST", finalUrl, true);
        http.onreadystatechange = function () {
            if (http.readyState == 4 && http.status == 200) {
                var response = JSON.parse(http.responseText);
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

    retrieveFromPocket();

};