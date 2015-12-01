(function() {
  'use strict';
  var SlideGenerator, fs, path, slugify, yeoman,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  fs = require('fs');

  path = require('path');

  yeoman = require('yeoman-generator');

  slugify = require('underscore.string/slugify');

  module.exports = SlideGenerator = (function(superClass) {
    extend(SlideGenerator, superClass);

    function SlideGenerator() {
      return SlideGenerator.__super__.constructor.apply(this, arguments);
    }

    SlideGenerator.prototype.configuring = function() {
      this.option('notes', {
        desc: 'Include speaker notes',
        type: Boolean,
        "default": false
      });
      this.option('markdown', {
        desc: 'Use markdown',
        type: Boolean,
        "default": false
      });
      return this.option('attributes', {
        desc: 'Include attributes on slide sections, e.g. data-background, class, etc.',
        type: Boolean,
        "default": false
      });
    };

    SlideGenerator.prototype.writing = function() {
      var fullPath, list;
      fullPath = this.destinationPath('slides/list.json');
      list = this.fs.readJSON(fullPath);
      if (this.options.markdown) {
        this.filename = (slugify(this.name)) + ".md";
        this.log.info('Using Markdown.');
        if (this.options.notes) {
          this.template('slide-withnotes.md', "slides/" + this.filename);
        } else {
          this.template('slide.md', "slides/" + this.filename);
        }
      } else {
        this.filename = (slugify(this.name)) + ".html";
        this.log.info('Using HTML.');
        if (this.options.notes) {
          this.template('slide-withnotes.html', "slides/" + this.filename);
        } else {
          this.template('slide.html', "slides/" + this.filename);
        }
      }
      if (this.options.attributes) {
        this.log.info("Appending slides/" + this.filename + " to slides/list.json.");
        list.push({
          filename: this.filename,
          attr: {
            'data-background': '#ff0000'
          }
        });
      } else {
        this.log.info("Appending slides/" + this.filename + " to slides/list.json.");
        list.push(this.filename);
      }
      return fs.writeFileSync(fullPath, JSON.stringify(list, null, 4));
    };

    return SlideGenerator;

  })(yeoman.generators.NamedBase);

}).call(this);
