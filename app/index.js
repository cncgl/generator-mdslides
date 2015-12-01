(function() {
  'use strict';
  var RevealGenerator, _, capitalize, chalk, path, semver, slugify, yeoman, yosay,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  path = require('path');

  yeoman = require('yeoman-generator');

  semver = require('semver');

  yosay = require('yosay');

  chalk = require('chalk');

  slugify = require('underscore.string/slugify');

  capitalize = require('underscore.string/capitalize');

  _ = require('lodash');

  module.exports = RevealGenerator = (function(superClass) {
    extend(RevealGenerator, superClass);

    function RevealGenerator() {
      return RevealGenerator.__super__.constructor.apply(this, arguments);
    }

    RevealGenerator.prototype.initializing = function() {
      this.pkg = this.fs.readJSON(path.join(__dirname, '../package.json'));
      return this.config.defaults({
        presentationTitle: 'Reveal.js and Yeoman is Awesomeness',
        packageVersion: '0.0.0',
        revealTheme: 'black',
        useSass: false,
        deployToGithubPages: false
      });
    };

    RevealGenerator.prototype.prompting = {
      askFor: function() {
        var cb, prompts;
        cb = this.async();
        this.log(yosay());
        this.log(chalk.magenta('This includes the amazing Reveal.js Framework\n' + 'and a Gruntfile for your presentation pleasure.\n'));
        prompts = [
          {
            name: 'presentationTitle',
            message: 'What are you going to talk about?',
            "default": this.config.get('presentationTitle')
          }, {
            name: 'packageVersion',
            message: 'What version should we put in the package.json file?',
            "default": this.config.get('packageVersion'),
            validate: function(input) {
              if (!semver.valid(input)) {
                return 'Please enter a correct semver version, i.e. MAJOR.MINOR.PATCH.';
              }
              return true;
            }
          }, {
            name: 'useSass',
            message: 'Do you want to use Sass to create a custom theme?',
            type: 'confirm',
            "default": this.config.get('useSass')
          }, {
            name: 'revealTheme',
            type: 'list',
            message: 'What Reveal.js theme would you like to use?',
            when: function(props) {
              return props.useSass === false;
            },
            choices: this.fs.readJSON(path.join(__dirname, './theme_choices.json')),
            "default": this.config.get('revealTheme')
          }, {
            name: 'deployToGithubPages',
            message: 'Do you want to deploy your presentation to Github Pages? This requires an empty Github repository.',
            type: 'confirm',
            "default": this.config.get('deployToGithubPages')
          }, {
            name: 'githubUsername',
            message: 'What is your Github username?',
            "default": this.config.get('githubUsername'),
            when: function(props) {
              return props.deployToGithubPages === true;
            }
          }, {
            name: 'githubRepository',
            message: 'What is the Github repository name?',
            "default": this.config.get('githubRepository'),
            when: function(props) {
              return props.deployToGithubPages === true;
            }
          }
        ];
        return this.prompt(prompts, (function(_this) {
          return function(props) {
            _this.config.set('presentationTitle', props.presentationTitle);
            _this.config.set('packageVersion', props.packageVersion);
            _this.config.set('useSass', props.useSass);
            _this.config.set('revealTheme', props.revealTheme);
            _this.config.set('deployToGithubPages', props.deployToGithubPages);
            _this.config.set('githubUsername', props.githubUsername);
            _this.config.set('githubRepository', props.githubRepository);
            return cb();
          };
        })(this));
      }
    };

    RevealGenerator.prototype.writing = {
      app: function() {
        this.fs.copyTpl(this.templatePath('_index.md'), this.destinationPath('slides/index.md'), this);
        this.fs.copyTpl(this.templatePath('_Gruntfile.coffee'), this.destinationPath('Gruntfile.coffee'), this);
        this.fs.copyTpl(this.templatePath('_package.json'), this.destinationPath('package.json'), {
          slugify: slugify,
          config: this.config
        });
        this.fs.copy(this.templatePath('loadhtmlslides.js'), this.destinationPath('js/loadhtmlslides.js'));
        this.fs.copy(this.templatePath('list.json'), this.destinationPath('slides/list.json'));
        if (this.config.get('useSass')) {
          this.fs.copy(this.templatePath('theme.scss'), this.destinationPath('css/source/theme.scss'));
        }
        this.fs.copyTpl(this.templatePath('__index.html'), this.destinationPath('templates/_index.html'), {
          '_': _,
          capitalize: capitalize,
          config: this.config
        });
        this.fs.copyTpl(this.templatePath('__section.html'), this.destinationPath('templates/_section.html'), {
          '_': _,
          config: this.config
        });
        return this.fs.write(this.destinationPath('resources/.gitkeep'), 'Used to store static assets');
      },
      projectfiles: function() {
        this.fs.copy(this.templatePath('editorconfig'), this.destinationPath('.editorconfig'));
        return this.fs.copy(this.templatePath('jshintrc'), this.destinationPath('.jshintrc'));
      },
      runtime: function() {
        return this.fs.copy(this.templatePath('gitignore'), this.destinationPath('.gitignore'));
      }
    };

    RevealGenerator.prototype.install = function() {
      return this.installDependencies({
        skipInstall: this.options['skip-install'],
        npm: true,
        bower: false
      });
    };

    return RevealGenerator;

  })(yeoman.generators.Base);

}).call(this);
