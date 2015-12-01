// Generated by CoffeeScript 1.10.0
(function() {
  'use strict';
  var spawn;

  spawn = require('child_process').spawn;

  module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
      watch: {
        coffee: {
          files: ['{,*/}*.coffee'],
          tasks: ['coffee', 'test']
        }
      },
      coffee: {
        compile: {
          expand: true,
          src: ['app/index.coffee', 'slide/index.coffee'],
          ext: '.js'
        }
      }
    });
    grunt.registerTask('test', 'Run `npm test`', function() {
      var done, test;
      done = this.async();
      test = spawn('npm', ['test'], {
        stdio: 'inherit'
      });
      return test.on('close', done);
    });
    return grunt.registerTask('default', ['coffee', 'test', 'watch']);
  };

}).call(this);

//# sourceMappingURL=Gruntfile.js.map