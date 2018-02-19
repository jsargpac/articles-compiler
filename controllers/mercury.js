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
 * GET /mercury
 * Mercury page.
 */
exports.getMercury = (req, res) => {
  article.find({already_imported: true }, function(err, docs) {
    res.render('mercury', {
        title: 'Mercury',
        articles: docs });
  });
};

/**
 * POST /mercury
 * Import articles content with Mercury
 */
exports.importMercury = (req, res, next) => {

    console.log("import");

    function importContent() {
        var mercuryUrl = "https://mercury.postlight.com/parser";
        var http = new XMLHttpRequest();
        console.log("ok");
        console.log(properties);
        var key = properties.get('mercury.key');
        console.log(key);

        article.find(function(err, docs) {
            var n = 0;
            for (id in docs) {
                var doc = docs[id];
                if (doc['url'] == undefined) continue;
                if (n > 0 ) break;
                console.log(doc['title']);
                console.log(doc['already_imported']);
                console.log(doc['content']);
                if (!doc['already_imported']) {
                    var finalUrl = mercuryUrl + "?url=" + doc.url;
                    http.open("GET", finalUrl, true);
                    http.setRequestHeader("x-api-key", key);
                    http.onreadystatechange = function () {
                        if (http.readyState == 4 && http.status == 200) {
                            var response = JSON.parse(http.responseText);
                            console.log("imported");
                            doc['content'] = response['content'];
                            doc['date'] = response['date_published'];
                            doc['dek'] = response['dek'];
                            doc['word_count_mercury'] = response['word_count'];
                            doc['domain'] = response['domain'];
                            doc['already_imported'] = true;
                            doc.save();
                        } else {
                            console.log(http.status);
                        }
                    }
                    http.send();
                    n++;
                }
            }
        });

    };

    importContent();
};