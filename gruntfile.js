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
    require('load-grunt-tasks')(grunt);
    
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: ['build/', "scripts/jsx/**/*.js"],
            jsx: ['scripts/**/*.build.js', 'scripts/**/*.build.js.map']
        },
        uglify: {
            development: {
                options: {
                    sourceMap: true
                },
                files: [
                    //html
                    //{ expand: true, src: ['build/scripts/**/*.js'], dest: '.' },
                    {
                        src: ['public/react/react.js', 'public/react/react-dom.js'],
                        dest: 'build/public/react/react.bundle.js'
                    },
                ]
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
                    'build/styles/contents.css': ['public/jquery-ui/jquery-ui.css', 'styles/editor_handle.css', 'styles/notification.css'],
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
                tasks: ['clean:build', 'copy', 'cssmin', 'babel', 'processhtml', 'browserify', 'clean:jsx']
            }
        },
        babel: {
            options: {
                presets: ['react']
            },
            dist: {
                files: [
                    {
                        expand: true,     // Enable dynamic expansion.
                        src: ['scripts/**/*.jsx'],
                        dest: '.',   // Destination path prefix.
                        ext: '.build.js',   // Dest filepaths will have this extension.
                        extDot: 'last'   // Extensions in filenames begin after the first dot
                    }
                ]
            }
        },
        browserify: {
            libs: {
                // External modules that don't need to be constantly re-compiled
                src: [],
                dest: 'build/public/react/react.bundle.js',
                options: {
                    require: ["react", "react-dom"]
                }
            },
            development: {
                options: {
                    browserifyOptions: {
                        debug: true,
                        external: ['react', 'react-dom'],
                    },
                    external: ['react', 'react-dom'],
                },
                files: [
                    {
                        expand: true,     // Enable dynamic expansion.
                        src: ['scripts/**/*.js'],
                        dest: 'build/',   // Destination path prefix.
                        ext: '.js',   // Dest filepaths will have this extension.
                        extDot: 'first'   // Extensions in filenames begin after the first dot
                    }
                ]
            }
        }
    });

    grunt.registerTask('default', ['clean:build', 'copy', 'cssmin', 'babel', 'processhtml', 'browserify', 'clean:jsx']);
};