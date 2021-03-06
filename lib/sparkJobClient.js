"use strict";

/*
  ________                                                 _______   _______
 /        |                                               /       \ /       \
 $$$$$$$$/______   __    __   ______   _______    ______  $$$$$$$  |$$$$$$$  |
    $$ | /      \ /  |  /  | /      \ /       \  /      \ $$ |  $$ |$$ |__$$ |
    $$ |/$$$$$$  |$$ |  $$ |/$$$$$$  |$$$$$$$  |/$$$$$$  |$$ |  $$ |$$    $$<
    $$ |$$ |  $$/ $$ |  $$ |$$    $$ |$$ |  $$ |$$ |  $$ |$$ |  $$ |$$$$$$$  |
    $$ |$$ |      $$ \__$$ |$$$$$$$$/ $$ |  $$ |$$ \__$$ |$$ |__$$ |$$ |__$$ |
    $$ |$$ |      $$    $$/ $$       |$$ |  $$ |$$    $$/ $$    $$/ $$    $$/
    $$/ $$/        $$$$$$/   $$$$$$$/ $$/   $$/  $$$$$$/  $$$$$$$/  $$$$$$$/
 */

/**      In God we trust
 * Created by: Servio Palacios on 2016.05.26.
 * Source: restConnector.js
 * Author: Servio Palacios
 * Last edited: 2016.06.01 13:55
 * Description: Spark Job Connector using REST API
 */

//External Libraries
var Client = require('node-rest-client').Client;
var client = new Client();

//Local Libraries
var Enums = require("./enums");
var config = require("../config.json");
var counter = 1;
var algorithmResult = {};

/**
 * @constructor
 *
 */
function SparkJobClient(options) {

    var self = this;

    if(typeof options === "undefined"){
        throw new Error("[options] parameter not defined.");
    }

    self._sparkJobServer = options.defaultSparkJobServer;
    self._sparkJobServerPort = options.defaultPort;
    self._requestedJobs = [];

    //self._threshold = config.security.threshold;

}//SparkJobClient Constructor

/* Generates PageRank Request */
SparkJobClient.prototype.pageRankRequest = function() {

    var self = this;
    counter = 1;

    var args = {
        data: { input: {string: config.schema} },
        headers: { "Content-Type": "application/json" }
    };

    var strRequest = self._createHTTPRequestString(Enums.algorithmType.PAGE_RANK);

    client.post(strRequest, args, function (data, response) {

        self._requestedJobs.push(data.result.jobId);

        $('#tbl_jobs > tbody:last-child').append('<tr><td>' + data.result.jobId + '</td><td>Page Rank</td><td>Started</td></tr>');
        self.setupTimer(data.result.jobId, Enums.algorithmType.PAGE_RANK);

    });

    return strRequest;
};

/* Generates ConnectedComponents Request */
SparkJobClient.prototype.connectedComponents = function() {

    var self = this;
    counter = 1;

    var args = {
        data: { input: {string: config.schema} },
        headers: { "Content-Type": "application/json" }
    };

    var strRequest = self._createHTTPRequestString(Enums.algorithmType.CONNECTED_COMPONENTS);

    client.post(strRequest, args, function (data, response) {

        self._requestedJobs.push(data.result.jobId);

        $('#tbl_jobs > tbody:last-child').append('<tr><td>' + data.result.jobId + '</td><td>Connected Components</td><td>Started</td></tr>');
        self.setupTimer(data.result.jobId, Enums.algorithmType.CONNECTED_COMPONENTS);
    });

    return strRequest;
};


/* Generates Triangle Counting Request */
SparkJobClient.prototype.triangleCounting = function() {

    var self = this;
    counter = 1;

    var args = {
        data: { input: {string: config.schema} },
        headers: { "Content-Type": "application/json" }
    };

    var strRequest = "http://" + self._sparkJobServer + ":" + self._sparkJobServerPort + "/jobs?appName=algorithms&classPath=spark.jobserver.TriangleCounting";
    client.post(strRequest, args, function (data, response) {
        console.log(data);
        console.log(data.result);
        self._requestedJobs.push(data.result.jobId);

        $('#tbl_jobs > tbody:last-child').append('<tr><td>' + data.result.jobId + '</td><td>Triangle Counting</td><td>Started</td></tr>');
        self.setupTimer(data.result.jobId, Enums.algorithmType.TRIANGLE_COUNTING);
    });

    return strRequest;
};

/* Generates Word Count Request */
SparkJobClient.prototype.wordCountRequest = function() {

    var self = this;
    counter = 1;

    var args = {
        data: { input: {string: "scala_api"} },
        headers: { "Content-Type": "application/json" }
    };

    var strRequest = "http://" + self._sparkJobServer + ":" + self._sparkJobServerPort + "/jobs?appName=algorithms&classPath=spark.jobserver.WordCountExample";
    client.post(strRequest, args, function (data, response) {
        //console.log(data);
        //console.log(data.result);
        self._requestedJobs.push(data.result.jobId);

        $('#tbl_jobs > tbody:last-child').append('<tr><td>' + data.result.jobId + '</td><td>Word Count</td><td>Started</td></tr>');
        self.setupTimer(data.result.jobId, Enums.algorithmType.WORD_COUNT);

    });

    return strRequest;
};

/* Creates CORS request */
SparkJobClient.prototype.createCORSRequest =  function createCORSRequest(method, url) {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {

            // Check if the XMLHttpRequest object has a "withCredentials" property.
            // "withCredentials" only exists on XMLHTTPRequest2 objects.
            xhr.open(method, url, true);

        } else if (typeof XDomainRequest != "undefined") {

            // Otherwise, check if XDomainRequest.
            // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
            xhr = new XDomainRequest();
            xhr.open(method, url);

        } else {

            // Otherwise, CORS is not supported by the browser.
            xhr = null;

        }//else
        return xhr;
};

/* timer */
SparkJobClient.prototype.setupTimer = function(jobId, algorithmType) {
    var self = this;

    var args = {
        headers: {"Content-Type": "application/json"}
    };

    //console.log(jobId);

    var client3 = new Client();

    client3.interval = setInterval(function () {

        var strRequest = "http://" + self._sparkJobServer + ":" + self._sparkJobServerPort + "/jobs/"+ jobId;

        //It worked when I change this to GET method request
        client3.get(strRequest, args, function (data, response) {

            console.log(data);

            if(data.status === Enums.jobStatus.FINISHED){

                $('#tbl_jobs > tbody:last-child').append('<tr><td>' + jobId + '</td><td>' + algorithmType + '</td><td>' + data.status + '(' + data.duration + ')</td></tr>');
                $('.progress-bar').css('width', 100+'%').attr('aria-valuenow', 100);
                clearInterval(client3.interval);

                //Results table
                if(algorithmType === Enums.algorithmType.PAGE_RANK){

                    var result = data.result;

                    for(var i = 0; i < result.length; i++){
                        $('#tbl_pr > tbody:last-child').append('<tr><td>' + result[i][0] + '</td><td>' + result[i][1] + '</td></tr>');
                    }

                }
            }
            else if(data.status === Enums.jobStatus.RUNNING){

                $('.progress-bar').css('width', counter+'%').attr('aria-valuenow', counter);
                counter++;

            }
            else if(data.status === Enums.jobStatus.ERROR){
                counter = 0;
                $('.progress-bar').css('width', counter+'%').attr('aria-valuenow', counter);
                clearInterval(client3.interval);

                $('#tbl_jobs > tbody:last-child').append('<tr><td>' + jobId + '</td><td>' + algorithmType + '</td><td>' + data.status + '</td></tr>');
            }

            //console.log(data.result);
            //self._requestedJobs.push(data.result.jobId);

            algorithmResult = data.result;
        });
    }, 200);

};

/* Creating HTTP Request for Spark Job Server */
SparkJobClient.prototype._createHTTPRequestString =  function(algorithmType) {

    var self = this;

    var strRequest = "http://" + self._sparkJobServer + ":" + self._sparkJobServerPort + "/jobs?appName=";

    if(algorithmType === Enums.algorithmType.PAGE_RANK){
            strRequest += config.algorithmsPublishedJob + "&classPath=" + config.pageRankClassPath;
    }

    if(algorithmType === Enums.algorithmType.CONNECTED_COMPONENTS){
        strRequest += config.algorithmsPublishedJob + "&classPath=" + config.connectedComponentsClassPath;
    }

    if(algorithmType === Enums.algorithmType.TRIANGLE_COUNTING){
       //TODO
    }

    return strRequest;
};

/* Exporting module */
module.exports = SparkJobClient;

