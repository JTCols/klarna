//////////////////////////////////////////////////////////////////////////
//    This is the main Gruntfile for the Klarna template
/////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////
// # NOTE ABOUT GLOB STYLE PATTERN MATCHING
// For performance reasons you may only want match one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'
/////////////////////////////////////////////////////////////////////
module.exports = function (grunt) {

    var WEB_ROOT = "src/",
        LESS_ROOT = WEB_ROOT + "less/",
        SCRIPT_ROOT = WEB_ROOT + "scripts/",
        LESS_MAIN = LESS_ROOT + "/main.less",
        CSS_ROOT = WEB_ROOT + "css/",
        CSS_DEST = WEB_ROOT + "css/main.css";

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);


    // Project configuration.
    grunt.initConfig({


        //runs our Jasmine test suite
        karma: {
            unit: {
                configFile: 'karma.conf.js'//external configuration file
            }
        },

        //use this to clean any temp files that may be created during the build process
        clean: {
            //clean css directory
            css: [
                CSS_ROOT
            ]
        },



        // Watches files for changes and runs tasks based on the changed files
        watch: {



        },

        //To remove Ruby dependency we are switching over to LESS for CSS preprocessing
        //Pre-process the Less files into css.
        less: {
            local: {
                options: {
                    paths: [LESS_ROOT]
                },
                files: {
                    "src/css/main.css": LESS_MAIN
                }
            },
            dev: {}

        },


        //Cleans up some common issues with JS source code
        //If you run this before JSHint it will cut down on fails
        jsbeautifier: {

            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                SCRIPT_ROOT + '**/*.js'//,
                //'!' + SCRIPT_ROOT + '/AssetViewer.js'//exclusion example
            ]

        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                SCRIPT_ROOT + '**/*.js'//,
                // '!' + SCRIPT_ROOT + '/AssetViewer.js' //exclusion example
            ]

        }

    });

    // Default task(s).
    grunt.registerTask('default', ['build']);

};