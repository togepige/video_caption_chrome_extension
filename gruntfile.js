module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-processhtml');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ['build/', "scripts/jsx/**/*.js"],
        uglify: {
            development: {
                options: {
                    sourceMap: true
                },
                files: {
                    'build/content_scripts/inject_menu.min.js': ['scripts/content_scripts/inject_menu.js'],
                    'build/content_scripts/inject_editor.min.js': ['scripts/content_scripts/inject_editor.js'],
                    'build/content_scripts/event_handler.min.js': ['scripts/content_scripts/event_handler.js'],
                    'build/background/background.min.js': ['scripts/background/background.js'],
                    'build/content_scripts/content_scripts.min.js': ['public/jquery-2.2.4.min.js', "/public/jquery-ui/jquery-ui.js", "public/velocity.min.js"],
                }
            }
        },
        copy: {
            images: {
                files: [
                    //html
                    { expand: true, src: ['html/**'], dest: 'build/' },
                    // Images
                    { expand: true, src: ['images/**'], dest: 'build/' },
                    // Fonts
                    { expand: true, src: ['public/**/*.woff', "public/**/*.woff2", 'public/**/*.ttf'], dest: 'build/' },
                    
                    { expand: true, src: ['manifest.json'], dest: 'build/' },
                    {
                        expand: true,
                        src: ['public/**/*.min.css'],
                        dest: 'build/',
                        rename: function (dest, src) {       // The value for rename must be a function
                            return dest + src.replace('min.', '');
                        }
                    },
                    {
                        expand: true,
                        src: ['public/**/*.min.js'],
                        dest: 'build/',
                        rename: function (dest, src) {       // The value for rename must be a function
                            return dest + src.replace('min.', '');
                        }
                    },
                ]
            }
        },
        cssmin: {
            development: {
                files: {
                    'build/styles/contents.css': ['public/jquery-ui/jquery-ui.css', 'styles/editor_handle.css'],
                    'build/styles/menu.css': ['styles/menu.css'],
                    'build/styles/editor.css': ['styles/editor.css'],
                }
            }
        },
        processhtml: {
            development: {
                options: {
                    process: true,
                },
                files: [
                    {
                        expand: true,
                        src: ['build/html/*.html'],
                        dest: '.',
                        ext: '.html'
                    }
                ]
            }
        },
        watch: {
            rebuild: {
                files: ['scripts/**/*.jsx', "scripts/**/*.js", "html/**/*.html", "styles/**/*.css", "minifest.json"],
                tasks: ['copy', 'cssmin', 'browserify']
            }
        },
        browserify: {
            development: {
                options: {
                    browserifyOptions: {
                        debug: true
                    },
                    transform: [['babelify', { presets: ['react'] }]],
                    exclude: ["scripts/**/*.bundle.js"]
                },
                files: [
                    {
                        expand: true,     // Enable dynamic expansion.
                        src: ['scripts/**/*.jsx', 'scripts/**/*.js'],
                        dest: 'build/',   // Destination path prefix.
                        ext: '.js',   // Dest filepaths will have this extension.
                        extDot: 'last'   // Extensions in filenames begin after the first dot
                    }
                ]
            }
        },
    });

    grunt.registerTask('default', ['clean', 'copy', 'cssmin', 'browserify', 'watch']);
};