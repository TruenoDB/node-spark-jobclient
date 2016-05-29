/**
 * Created by: Servio Palacios on 2016.05.27.
 * Source: main.js
 * Author: Servio Palacios
 * Description:
 *
 */
$(document).ready(function () {

    /* The global media object */
    var self = {};

    /* Connection settings */
    var options = {
        parent: self,
        defaultSparkJobServer: config.sparkJobServer.defaultSparkJobServer,
        defaultPort: config.sparkJobServer.defaultPort //8090
    };

    /* the spark library connection variable */
    window.SparkClient = new SparkJobClient(options);
    window.self = self;

    self.jobs = [];

    /* App UI logic */
    $("#btn_pagerank").click(function(){
        console.log("Page Rank");
    });

    $("#btn_connectedcomponents").click(function(){
        console.log("Connected Components");
    });

    $("#btn_trianglecounting").click(function(){
        console.log("Triangle Counting");
    });

    $("#btn_shortestpath").click(function(){
        console.log("Shortest Path");
    });

    $("#btn_wordcount").click(function(){
        console.log("Word Count");


        /*$.ajax({

            // The 'type' property sets the HTTP method.
            // A value of 'PUT' or 'DELETE' will trigger a preflight request.
            type: 'GET',

            // The URL to make the request to.
            url: 'http://spark.maverick.com:8090/jobs?appName=wordcount&classPath=spark.jobserver.WordCountExample',

            // The 'contentType' property sets the 'Content-Type' header.
            // The JQuery default for this property is
            // 'application/x-www-form-urlencoded; charset=UTF-8', which does not trigger
            // a preflight. If you set this value to anything other than
            // application/x-www-form-urlencoded, multipart/form-data, or text/plain,
            // you will trigger a preflight request.
            contentType: 'text/plain',

            xhrFields: {
                // The 'xhrFields' property sets additional fields on the XMLHttpRequest.
                // This can be used to set the 'withCredentials' property.
                // Set the value to 'true' if you'd like to pass cookies to the server.
                // If this is enabled, your server must respond with the header
                // 'Access-Control-Allow-Credentials: true'.
                withCredentials: false
            },

            headers: {
                // Set any custom headers here.
                // If you set any non-simple headers, your server must include these
                // headers in the 'Access-Control-Allow-Headers' response header.
            },

            success: function(data) {
                console.log("success");
                console.log(data);
                // Here's where you handle a successful response.
            },

            error: function() {

                console.log("error");
                // Here's where you handle an error response.
                // Note that if the error was due to a CORS issue,
                // this function will still fire, but there won't be any additional
                // information about the error.
            }
        });*/



        /*var xhr = createCORSRequest('PUT', "http://192.168.116.139:8090/jobs?appName=wordcount&classPath=spark.jobserver.WordCountExample");
        if (!xhr) {
            throw new Error('CORS not supported');
        }

        xhr.onload = function() {
            var responseText = xhr.responseText;
            console.log(responseText);
            // process the response.
        };

        xhr.onerror = function() {
            console.log('There was an error!');
        };*/
        SparkClient.wordCountRequest();
    });

    /*function createCORSRequest(method, url) {
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

        }
        return xhr;
    }*/


});




