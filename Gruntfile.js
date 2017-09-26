module.exports = function(grunt) {
    // Load the task runners
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Configure the task runners
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            dist: {
                options: {
                    sourceMap:  true,
                    style:      'compressed'
                },
                files: {
                    // destination // source file
                    'css/main.css': 'src/main.scss'
                }
            }
        },

        postcss: {
            options: {
                map: true,
                processors: [
                    require('autoprefixer')
                ],
                browsers: ['last 2 versions', 'ie >= 9', 'and_chr >= 2.3']
            },
            dist: {
                src: 'css/*.css'
            }
        },

        babel: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    // destination // source file
                    "dist/index.js": "src/index.js"
                }
            }
        },

        uglify: {
            options: {
                sourceMap:      true,
                sourceMapName:  'dist/index.min.js.map',
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            dist: {
                files: {
                    // destination // source file
                    'dist/index.min.js': ['dist/index.js']
                }
            }
        },

        watch: {
            css: {
                files: ['src/*.scss'],
                tasks: ['sass:dist', 'postcss:dist']
            },
            js: {
                files: ['src/*.js'],
                tasks: ['babel:dist']
            }
        }
    });

    // Define our tasks
    grunt.registerTask('default', ['sass:dist', 'postcss:dist', 'babel:dist', 'uglify:dist', 'watch']);
};