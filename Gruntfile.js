/*jslint node: true */
/*jshint strict:false */

// This is the default port that livereload listens on;
// change it if you configure livereload to use another port.
var LIVERELOAD_PORT = 35729;
// lrSnippet is just a function.
// It's a piece of Connect middleware that injects
// a script into the static served html.
var lrSnippet = require('connect-livereload')({
  port: LIVERELOAD_PORT
});
// All the middleware necessary to serve static files.
var livereloadMiddleware = function(connect, options) {
  return [
    // Inject a livereloading script into static files.
    lrSnippet,
    // Serve static files.
    connect.static(options.base),
    // Make empty directories browsable.
    connect.directory(options.base)
  ];
};



/*global module:false*/
module.exports = function(grunt) {
  // load all grunt tasks matching the `grunt-*` pattern
  require('load-grunt-tasks')(grunt);
  // Project configuration.
  grunt.initConfig({

    bower: {
      install: {
        options: {
          targetDir: './src/assets/bower_components',
          layout: 'byType',
          install: true,
          verbose: true,
          cleanTargetDir: false,
          cleanBowerDir: false,
          bowerOptions: {}
        }
      }
    },


    'bower-install': {

      target: {

        // Point to the files that should be updated when
        // you run `grunt bower-install`
        src: ['src/assets/jade/template.jade'],
        // ignorePath: ['dist/css/', 'dist/js/'],


        fileTypes: {
          fileExtension: {

          },

          // defaults:
          jade: {
            block: /(([\s\t]*)<!--\s*bower:*(\S*)\s*-->)(\n|\r|.)*?(<!--\s*endbower\s*-->)/gi,
            detect: {
              js: /<script.*src=['"](.+)['"]>/gi,
              css: /<link.*href=['"](.+)['"]/gi
            },
            replace: {
              js: '<script type="text/javascript" src="assets/{{filePath}}"></script>',
              css: '<link type="text/css" rel="stylesheet" href="assets/{{filePath}}" />'
            }
          }
        }
        // cssPattern: '<link href="{{filePath}}" rel="stylesheet">',
        // Customize how your <script>s are included into
        // your HTML file.
        //
        //   default: '<script src="{{filePath}}"></script>'
        // jsPattern: '<script type="text/javascript" src="{{filePath}}"></script>',
        // Optional:
        // ---------
        // cwd: '',
        // ignorePath: '',
        // exclude: [],
        // fileTypes: {}
      }
    },
    /**
     * This replaces the font location within the uikit min css
     * @type {Object}
     */
    // replace: {
    //   'replace-bower-copy': {
    //     overwrite: true,
    //     src: ['src/assets/bower_components/uikit/uikit.min.css'], // source files array (supports minimatch)
    //     replacements: [{
    //       from: /\.\.\/fonts\//g,
    //       to: ''
    //     }]
    //   },
    //   'replace-bower-install': {
    //     overwrite: true,
    //     src: ['src/assets/jade/*.jade'], // source files array (supports minimatch)
    //     // dest: 'src/', // destination directory or file
    //     replacements: [{

    //       from: /dist\/css\/|dist\/js\/|dist\//g, // regex replacement ('Fooo' to 'Mooo')
    //       to: ''

    //     }]
    //   }
    // },
    // stylus: {
    //   compile: {
    //     options: {
    //       // paths: ['path/to/import', 'another/to/import'],
    //       // urlfunc: 'embedurl', // use embedurl('test.png') in our code to trigger Data URI embedding
    //       // use: [
    //       //   require('fluidity') // use stylus plugin at compile time
    //       // ],
    //       // import: [ //  @import 'foo', 'bar/moo', etc. into every .styl file
    //       //   'foo', //  that is compiled. These might be findable based on values you gave
    //       //   'bar/moo' //  to `paths`, or a plugin you added under `use`
    //       // ]
    //     },
    //     files: {
    //       'src/assets/css/viewer.css': 'src/assets/styl/viewer.styl', // 1:1 compile
    //       'src/assets/css/press.css': 'src/assets/styl/press.styl' // 1:1 compile

    //       // 'path/to/another.css': ['path/to/sources/*.styl', 'path/to/more/*.styl'] // compile and concat into single file
    //     }
    //   }
    // },

    jade: {
      compile: {
        options: {
          pretty: true,
          client: false,
          data: {
            debug: false
          }
        },
        files: {
          "src/index.html": ["src/assets/jade/index.jade"]
          // "src/models.html": ["src/assets/jade/models.jade"],
          // "src/press.html": ["src/assets/jade/press.jade"],


        }
      }
    },

    // The connect task is used to serve static files with a local server.
    connect: {
      client: {
        options: {
          // The server's port, and the folder to serve from:
          // Ex: 'localhost:9000' would serve up 'client/index.html'
          port: 9000,
          base: 'src',
          // Custom middleware for the HTTP server:
          // The injected JavaScript reloads the page.
          middleware: livereloadMiddleware
        }
      }
    },
    // The watch task is used to run tasks in response to file changes
    watch: {
      client: {
        // '**' is used to include all subdirectories
        // and subdirectories of subdirectories, and so on, recursively.
        files: ['src/assets/styl/*', 'src/assets/jade/*.jade', 'src/assets/js/*', '!**/bower_components/**'],
        // In our case, we don't configure any additional tasks,
        // since livereload is built into the watch task,
        // and since the browser refresh is handled by the snippet.
        // Any other tasks to run (e.g. compile CoffeeScript) go here:
        tasks: ['jade', 'stylus'],
        options: {
          livereload: LIVERELOAD_PORT
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= connect.client.options.port %>'
      }
    }
  });

  // These plugins provide necessary tasks.
  // by using the load-grunt-tasks modul
  // this is obsolete
  //
  //
  // grunt.loadNpmTasks('grunt-contrib-nodeunit');
  // grunt.loadNpmTasks('grunt-contrib-jshint');
  // grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  //
  grunt.registerTask('compile-stylus,', ['stylus']);

  grunt.registerTask('install-bower', ['bower-install', 'replace']);
  grunt.registerTask('copy-bower', ['bower', 'replace:replace-bower-copy']);
  grunt.registerTask('compile-jade', ['jade']);

  // grunt.registerTask('serve', ['connect:server', 'watch:client']);

  grunt.registerTask('server', function() {
    grunt.task.run([
      'jade',
      'stylus',
      'connect:client',
      'open',
      'watch:client'
    ]);
  });

  grunt.registerTask('default', ['server']);
};