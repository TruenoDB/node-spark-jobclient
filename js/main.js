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
        parent: self//,
        //defaultSparkJobServer: config.sparkJobServer.defaultSparkJobServer
    };

    /* the communication library connection variable */
    window.X = new SparkJobClient(options);
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
    });


});


