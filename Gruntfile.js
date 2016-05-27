"use strict";

/**      In God we trust
 * Created by: Servio Palacios on 2016.05.26.
 * Source: Gruntfile.js
 * Author: Servio Palacios
 * Last edited: 2016.05.26. 14:38
 * Description: Converts automatically libraries needed in the web browsers
 */
module.exports = function (grunt) {
    // Show elapsed time at the end
    require("time-grunt")(grunt);
    // Load all grunt tasks
    require("load-grunt-tasks")(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        watch: {
            supervisorBrowser: {
                files: "<%= browserify.supervisor.dependencies %>",
                tasks: ["browserify:supervisor"]
            }
        },
        browserify: {
            supervisor: {
                dependencies: [
                    "lib/restConnector.js",
                    "config.js",
                    "lib/enums.js"
                ],
                files: {
                    "browserClient.js":["lib/restConnector.js"]
                }
            }
        }//browserify
    });

    grunt.loadNpmTasks('grunt-browserify');

    grunt.registerTask("default", ["browserify"]);
};