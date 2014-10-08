'use strict';

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);


    grunt.initConfig({

        cfg: require('./build.config.js'),
        pkg: grunt.file.readJSON("package.json"),


        /**
         * The banner is the comment that is placed at the top of our compiled
         * source files. It is first processed as a Grunt template, where the `<%=`
         * pairs are evaluated based on this very configuration object.
         */
        meta: {
            banner: '/**\n' + ' * <%= pkg.title %> - v<%= pkg.version %> (build <%= build_info.build %>) - <%= grunt.template.today("yyyy-mm-dd") %>\n' + ' * <%= pkg.homepage %>\n' + ' *\n' + ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' + '*/\n'
        },


        /**
         * ´watch´ makes sure updated files are compiled and injected into browser. Uses
         * grunt-regarde, we rename it later to keep safe.
         */
        watch: {

            // Separate from rest of files to enable injection of new css after other files have changed.
            livereload_css: {
                options: {
                    livereload: true
                },
                files: [
                    '<%= cfg.dir.build %>/assets/css/*.css'
                ],
            },

            livereload_js: {
                options: {
                    livereload: true
                },
                files: [
                    '<%= cfg.dir.build %>/*.html',
                    '<%= cfg.dir.build %>/app/**/*.js',
                    '<%= cfg.dir.build %>/common/**/*.js',
                    '<%= cfg.dir.build %>/views/**/*.js'
                ],
            },

            compass: {
                files: ['<%= cfg.dir.src %>/assets/css/**/*.{scss,sass}'],
                tasks: ['compass', 'autoprefixer']
            },

            /**
             * Keep track of changes to js files in the app folder.
             */
            app_js: {
                files: [
                    '<%= cfg.dir.src %>/app/**/*.js',
                    '!<%= cfg.dir.src %>/app/**/*.spec.js'
                ],
                tasks: [
                    // 'newer:jshint:app_js',
                    'newer:copy:app_js'
                ]
            },

            /**
             * When index.html changes, we need to recompile it.
             */
            index: {
                files: '<%= cfg.dir.src %>/index.html',
                tasks: ['index:build']
            },

            html: {
                files: [
                    '<%= cfg.dir.src %>/*.html',
                    '!<%= cfg.dir.src %>/index.html'
                ],
                tasks: ['newer:copy:html']
            },

            /**
             * When our templates change, we only rewrite the template cache.
             */
            app_html: {
                files: '<%= cfg.dir.src %>/app/**/*.tpl.html',
                tasks: ['newer:copy:app_html', 'html2js:app_html']
            }
        },


        /**
         * Development server
         */
        connect: {
            options: {
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    port: 9000,
                    livereload: 35729,
                    open: false,
                    base: [
                        '<%= cfg.dir.build %>'
                    ]
                }
            },
            test: {
                options: {
                    port: 9001,
                    base: [
                        '<%= cfg.dir.dist %>',
                    ]
                }
            },
            compile: {
                options: {
                    port: 9002,
                    keepalive: true,
                    base: [
                        '<%= cfg.dir.dist %>',
                    ]
                }
            }
        },


        /**
         * Clean folders
         */
        clean: {
            all: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp/*',
                        '<%= cfg.dir.build %>/*',
                        '<%= cfg.dir.dist %>/*'
                    ]
                }]
            }
        },


        /**
         * The Karma configurations.
         */
        karma: {
            options: {
                configFile: 'build/karma-unit.js'
            },
            unit: {
                runnerPort: 9101,
            }
        },


        /**
         * This task compiles the karma template so that changes to its file array
         * don't have to be managed manually.
         */
        karmaconfig: {
            unit: {
                dir: '<%= cfg.dir.build %>',
                cwd: '<%= cfg.dir.src %>'
            }
        },


        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish'),
                force: true
            },
            app_js: {
                src: [
                    '<%= cfg.dir.src %>/app/**/*.js',
                    '!<%= cfg.dir.src %>/app/**/*.spec.js'
                ]
            }
        },


        /**
         * Compass for compiling our scss files, build gives you a nested css file with line
         * comments and traceback while compile creates a minified version without comments or
         * debug information.
         */
        compass: {
            build: {
                options: {
                    cssDir: '.tmp/css',
                    debugInfo: false,
                    fontsDir: '<%= cfg.dir.build %>/assets/fonts',
                    generatedImagesDir: '<%= cfg.dir.src %>/assets/images/generated',
                    httpFontsPath: '/assets/fonts',
                    httpGeneratedImagesPath: '/assets/images/generated',
                    httpImagesPath: '/assets/images',
                    imagesDir: '<%= cfg.dir.build %>/assets/images',
                    javascriptsDir: '<%= cfg.dir.build %>/assets/js',
                    noLineComments: false,
                    outputStyle: 'nested',
                    relativeAssets: true,
                    sassDir: '<%= cfg.dir.src %>/assets/css',
                    trace: true
                }
            }
        },


        autoprefixer: {
            options: ['last 1 version'],
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/css',
                    src: '{,*/}*.css',
                    dest: '<%= cfg.dir.build %>/assets/css/'
                }]
            }
        },


        /**
         * Cleans up our HTML code
         */
        htmlmin: {
            options: {
                removeComments: true,
                removeCommentsFromCDATA: true,
                removeCDATASectionsFromCDATA: true,
                collapseWhitespace: true,
                collapseBooleanAttributes: false,
                removeAttributeQuotes: false,
                removeRedundantAttributes: false,
                useShortDoctype: true,
                removeEmptyAttributes: false,
                removeOptionalTags: false,
                removeEmptyElements: false
            },
            templates: {
                files: [{
                    expand: true,
                    src: [
                        '.tmp/**/*.html',
                        '!.tmp/index.html'
                    ]
                }]
            },
            html: {
                files: [{
                    expand: true,
                    src: '<%= cfg.dir.dist %>/*.html'
                }]
            }
        },


        cssmin: {
            options: {
                report: 'min',
                keepSpecialComments: 0,
                banner: '<%= meta.banner %>'
            },
            compile: {
                expand: true,
                cwd: '<%= cfg.dir.build %>/assets/css/',
                src: ['*.css'],
                dest: '<%= cfg.dir.dist %>/assets/css/',
            }
        },


        uglify: {
            options: {
                report: 'min',
                mangle: false,
                banner: '<%= meta.banner %>'
            }
        },


        /**
         * `ng-min` annotates the sources before minifying. That is, it allows us
         * to code without the array syntax.
         */
        ngmin: {
            compile: {
                files: [{
                    src: ['app/**/*.js'],
                    cwd: '<%= cfg.dir.build %>',
                    dest: '<%= cfg.dir.build %>',
                    expand: true
                }]
            }
        },


        /**
         * Create cachefirendly filenames
         */
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= cfg.dir.dist %>/assets/**/*.js',
                        '<%= cfg.dir.dist %>/assets/css/**/*.css',
                        '<%= cfg.dir.dist %>/assets/images/**/*.{png,jpg,gif}'
                    ]
                }
            }
        },


        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: '<%= cfg.dir.dist %>/index.html',
            options: {
                dest: '<%= cfg.dir.dist %>',
                root: '<%= cfg.dir.build %>'
            }
        },
        usemin: {
            html: ['<%= cfg.dir.dist %>/{,*/}*.html'],
            css: ['<%= cfg.dir.dist %>/assets/{,*/}*.css']
        },


        /**
         * The `copy` task just copies files from A to B. We use it here to copy
         * our project assets (images, fonts, etc.) and javascripts into
         * `build_dir`, and then to copy the assets to `compile_dir`.
         */
        copy: {
            app_js: {
                files: [{
                    src: [
                        'app/**/*.js',
                        '!app/**/*.spec.js'
                    ],
                    cwd: '<%= cfg.dir.src %>',
                    dest: '<%= cfg.dir.build %>',
                    expand: true
                }]
            },
            app_html: {
                files: [{
                    src: [
                        'app/**/*.tpl.html'
                    ],
                    cwd: '<%= cfg.dir.src %>',
                    dest: '<%= cfg.dir.build %>',
                    expand: true
                }]
            },
            assets_js: {
                files: [{
                    src: [
                        'assets/js/**/*'
                    ],
                    cwd: '<%= cfg.dir.src %>',
                    dest: '<%= cfg.dir.build %>',
                    expand: true
                }]
            },
            assets_images: {
                files: [{
                    src: [
                        'assets/images/**/*.{jpg,png,gif}'
                    ],
                    cwd: '<%= cfg.dir.src %>',
                    dest: '<%= cfg.dir.build %>',
                    expand: true
                }]
            },
            assets_fonts: {
                files: [{
                    src: [
                        'assets/fonts/*.{eot,svg,ttf,woff}'
                    ],
                    cwd: '<%= cfg.dir.src %>',
                    dest: '<%= cfg.dir.build %>',
                    expand: true
                }]
            },
            html: {
                files: [{
                    src: [
                        '*.html',
                        '!index.html'
                    ],
                    cwd: '<%= cfg.dir.src %>',
                    dest: '<%= cfg.dir.build %>',
                    expand: true
                }]
            },
            compile: {
                files: [{
                    src: [
                        '*.html',
                        'favicon.*',
                        'assets/fonts/**/*',
                        'assets/images/**/*'
                    ],
                    cwd: '<%= cfg.dir.src %>',
                    dest: '<%= cfg.dir.dist %>',
                    expand: true
                }]
            }
        },


        concurrent: {
            options: {
                limit: 10
            },
            build: [
                'compass',
                'copy:app_js',
                'copy:app_html',
                'copy:assets_js',
                'copy:assets_images',
                'copy:assets_fonts',
                'copy:html'
            ]
        },


        /**
         * HTML2JS is a Grunt plugin that takes all of your template files and
         * places them into JavaScript files as strings that are added to
         * AngularJS's template cache. This means that the templates too become
         * part of the initial payload as one JavaScript file. Neat!
         */
        html2js: {
            options: {
                base: '<%= cfg.dir.build %>'
            },
            app_html: {
                options: {
                    module: 'templates'
                },
                src: '<%= cfg.dir.build %>/app/**/*.tpl.html',
                dest: '<%= cfg.dir.build %>/views/templates.js',
            }
        },


        index: {
            build: {
                dir: '<%= cfg.dir.build %>',
                src: [
                    'views/**/*',
                    'app/**/*.js'
                ],
                cwd: '<%= cfg.dir.build %>'
            }
        }
    });


    /* ------------------------------------------------ *\
        $Grunt tasks
    \* ------------------------------------------------ */

    grunt.registerTask('serve', function (target) {
        if (target === 'compile') {
            return grunt.task.run(['compile', 'connect:compile']);
        }

        grunt.task.run([
            'build',
            'connect:livereload',
            'watch'
        ]);
    });


    grunt.registerTask('lint', function (target) {
        if (typeof target === 'undefined') {
            return grunt.task.run(['jshint:all']);
        }

        grunt.task.run([
            'jshint:' + target
        ]);
    });


    grunt.registerTask('build', [
        'clean',
        'concurrent:build',
        'autoprefixer',
        'html2js',
        'index'
    ]);


    grunt.registerTask('compile', [
        'clean',
        'concurrent:build',
        'ngmin',
        'autoprefixer',
        'htmlmin:templates',
        'html2js',
        'karma',
        'copy:compile',
        'useminPrepare',
        'cssmin',
        'concat',
        'uglify',
        'rev',
        'usemin',
        'htmlmin:html'
    ]);


    grunt.registerMultiTask('index', 'Process index.html template', function () {
        var scripts = this.filesSrc;

        grunt.file.copy('src/index.html', 'build/index.html', {
            process: function (contents, path) {
                return grunt.template.process(contents, {
                    data: {
                        scripts: scripts,
                        version: grunt.config('pkg.version'),
                        copyright: grunt.config('pkg.copyright')
                    }
                });
            }
        });
    });
};
