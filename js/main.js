/**
 * Created by: Servio Palacios on 2016.05.27.
 * Source: main.js
 * Author: Servio
 * Description:
 *
 */
$(document).ready(function () {

    /* The global media object */
    var self = {};

    /* Connection settings */
    /*var options = {
        parent: self,
        defaultSparkJobServer: config.defaultSparkJobServer
    };*/

    /* the communication library connection variable */
    //window.io = new Comm(options);
    window.self = self;

    self.jobs = [];

    /* App UI logic */
    $("#btn_pagerank").click(function(){
        console.log("I got it");
    });

});


