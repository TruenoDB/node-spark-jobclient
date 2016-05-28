"use strict";

/**      In God we trust
 * Created by: Servio Palacios on 2016.05.26.
 * Source: restConnector.js
 * Author: Servio Palacios
 * Last edited: 2016.05.26 13:55
 * Description: Spark Job Connector using REST API
 */

//External Libraries
var Client = require('node-rest-client').Client;
var client = new Client();
var client2 = new Client();

//Local Libraries
var Enums = require("./enums");
var config = require("../config.json");

/**
 * @constructor
 *
 */
function SparkJobClient(options) {

    var self = this;

    if(typeof options === "undefined"){ //I only set this when it is integrity check
        throw new Error("[options] parameter not defined.");
    }

    self._sparkJobServer = options.defaultSparkJobServer;
    self._sparkJobServerPort = options.defaultPort;
    self._requestedJobs = [];

    //self._threshold = config.security.threshold;

}//SparkJobClient Constructor

/* Generates Random Numbers */
SparkJobClient.prototype.wordCountRequest = function() {

    var self = this;
    var args = {
        data: { input: {string: "hello gorman"} },
        headers: { "Content-Type": "application/json" }
    };

    //client.post("http://192.168.116.139:8090/jobs?appName=wordcount&classPath=spark.jobserver.WordCountExample", args, function (data, response) {
    //TODO change appname, must be generated                                                          <--HERE-->
    var strRequest = "http://" + self._sparkJobServer + ":" + self._sparkJobServerPort + "/jobs?appName=test&classPath=spark.jobserver.WordCountExample";
    client.post(strRequest, args, function (data, response) {
        // parsed response body as js object
        console.log(data);
        console.log(data.result);
        self._requestedJobs.push(data.result.jobId);

        self.setupTimer(data.result.jobId);
        // raw response
        //console.log(response);
    });

    return strRequest;
};

/* Generates Random Numbers returns string */
SparkJobClient.prototype.randomString = function(nBytes) {
    

};



/* timer */
//curl localhost:8090/jobs/223e8a46-91a3-4ed1-871a-97512e59c087
SparkJobClient.prototype.setupTimer = function(jobId) {
    var self = this;

    var args = {
        headers: { "Content-Type": "application/json"//,
                    //"Access-Control-Allow-Origin": "*"
                },
        mode: 'no-corps'
    };

    console.log(jobId);

    var client3 = new Client();

    client3.interval = setInterval(function () {
        var strRequest = "http://" + self._sparkJobServer + ":" + self._sparkJobServerPort + "/jobs/"+ jobId;
        client3.post(strRequest, args, function (data, response) {
            // parsed response body as js object
            console.log(data);
            //console.log(data.result);
            //self._requestedJobs.push(data.result.jobId);
            // raw response
            //console.log(response);
        });
    }, 10000);

};

/* Exporting module */
module.exports = SparkJobClient;

