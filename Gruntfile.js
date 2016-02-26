'use strict';

/**
 * Main grunt file
 *
 * @author      ritesh
 * @version     1.0.0
 */

var paths = {
  js: ['*.js', 'test/**/*.js','**/*.js', '!node_modules/**', '!public/bower_components/**' ]
};

module.exports = function(grunt) {
  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: {
        src: paths.js,
        options: {
          jshintrc: true
        }
      }
    },
    env: {
      test: {
        NODE_ENV: 'test'
      }
    }
  });

  //Load NPM tasks
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['jshint']);
};