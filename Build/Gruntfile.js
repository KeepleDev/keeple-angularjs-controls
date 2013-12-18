module.exports = function (grunt) {
    var helper = new GoppHelper(grunt);
    var uglifyOptions = helper.getUglifyOptions();
    var concatOptions = helper.getConcatOptions();
    var cssMinOptions = helper.getCSSMinOptions();
    var cleanOptions = helper.getCleanOptions();
    var jsHintOptions = helper.getJsHintOptions();
    var watchOptions = helper.getWatchOptions();
    var jasmineOptions = helper.getJasmineOptions();

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: uglifyOptions,
        concat: concatOptions,
        jshint: jsHintOptions,
        cssmin: cssMinOptions,
        clean: cleanOptions,
        watch: watchOptions,
        jasmine: jasmineOptions
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    // Default task(s).
    grunt.registerTask('default', ['test', 'concat', 'uglify']);
    grunt.registerTask('dev', ['test', 'concat', 'cssmin', 'watch']);
    grunt.registerTask('prod', ['clean', 'uglify', 'cssmin']);
    grunt.registerTask('test', ['jshint', 'jasmine']);
};

function GoppHelper(grunt) {
    var webProjectFolder = '../Code';
    var scriptsDevelopmentFolder = webProjectFolder + '/js/development';
    var scriptsProductionFolder = webProjectFolder + '/js/production';

    //#region Uglify

    function getUglifyOptions() {
        var projectMapping = {};
        var treeTableMapping = {};
        var imageButtonMapping = {};
        projectMapping[scriptsDevelopmentFolder + '/project.js'] = [
            scriptsDevelopmentFolder + '/3rd/jquery-2.0.3.js',
            scriptsDevelopmentFolder + '/3rd/bootstrap.js',
            scriptsDevelopmentFolder + '/3rd/angular.js',
            scriptsDevelopmentFolder + '/utils.js'
        ];

        treeTableMapping[scriptsDevelopmentFolder + '/treetable.js'] = [
            scriptsDevelopmentFolder + '/controls/tree-table/TreeTableModuleInitialization.js',
            scriptsDevelopmentFolder + '/controls/tree-table/controllers/TreeTableController.js',
            scriptsDevelopmentFolder + '/controls/tree-table/directives/TreeTableCellTemplateDirective.js',
            scriptsDevelopmentFolder + '/controls/tree-table/directives/TreeTableDirective.js',
            scriptsDevelopmentFolder + '/controls/tree-table/directives/TreeTableRowDirective.js',
            scriptsDevelopmentFolder + '/controls/tree-table/filters/TreeTableRowFilter.js'
        ];

        imageButtonMapping[scriptsDevelopmentFolder + '/imagebutton.js'] = [
            scriptsDevelopmentFolder + '/controls/imagebutton/ImageButtonModuleInitialization.js',
            scriptsDevelopmentFolder + '/controls/imagebutton/controllers/ImageButtonController.js',
            scriptsDevelopmentFolder + '/controls/imagebutton/directives/ImageButtonDirective.js'
        ];

        var uglify = {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + "<%= grunt.template.today(\"yyyy-mm-dd\") %> */\n"
            },
            project: {
                files: projectMapping
            },
            treeTable: {
                files: treeTableMapping
            },
            imageButton: {
                files: imageButtonMapping
            }
        };

        return uglify;
    }

    function addVersionInformationToFilePath(filePath) {
        /// <param name="filePath" type="String"></param>
        if (filePath.indexOf('.', 3) >= 0) {
            var lastIndex = filePath.lastIndexOf('.');
            filePath = filePath.substring(0, lastIndex) + '-<%= pkg.version %>' + filePath.substring(lastIndex, filePath.length);
        }
        return filePath;
    }

    //#endregion

    //#region Concat

    function getConcatOptions() {
        return {
            options: {
                force: true,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */\n',
                process: function (src, filepath) {
                    /// <param name="filepath" type="String"></param>
                    var separator = ';\n';
                    if (filepath.indexOf('.sql') > 0) {
                        separator = '\n\n\n';
                    }
                    return separator + src;
                }
            },
            treeTable: {
                dest: scriptsProductionFolder + '/keeple.controls.tree-table.js',
                src: [
                    scriptsDevelopmentFolder + '/controls/tree-table/tree-table.module.initialization.js',
                    scriptsDevelopmentFolder + '/controls/tree-table/tree-table.controller.main.js',
                    scriptsDevelopmentFolder + '/controls/tree-table/tree-table.controller.row.js',
                    scriptsDevelopmentFolder + '/controls/tree-table/tree-table.directive.main.js',
                    scriptsDevelopmentFolder + '/controls/tree-table/tree-table.directive.row.js'
                ]
            },
            fixedTable: {
                dest: scriptsProductionFolder + '/keeple.controls.fixed-table.js',
                src: [
                    scriptsDevelopmentFolder + '/controls/fixed-table/fixed-table.module.initialization.js',
                    scriptsDevelopmentFolder + '/controls/fixed-table/fixed-table.directive.main.js',
                    scriptsDevelopmentFolder + '/controls/fixed-table/fixed-table.factory.helper.js',
                    scriptsDevelopmentFolder + '/controls/fixed-table/fixed-table.factory.position-calculator.js',
                    scriptsDevelopmentFolder + '/controls/fixed-table/fixed-table.factory.position-updater.js',
                    scriptsDevelopmentFolder + '/controls/fixed-table/fixed-table.factory.custom-scroll.js'
                ]
            },
            fixedNotification: {
                dest: scriptsProductionFolder + '/keeple.controls.fixed-notification.js',
                src: [
                    scriptsDevelopmentFolder + '/controls/fixed-notification/fixed-notification.module.initialization.js',
                    scriptsDevelopmentFolder + '/controls/fixed-notification/fixed-notification.service.helper.js',
                    scriptsDevelopmentFolder + '/controls/fixed-notification/fixed-notification.directive.main.js',
                    scriptsDevelopmentFolder + '/controls/fixed-notification/fixed-notification.directive.message.js'
                ]
            },
            pagination: {
                dest: scriptsProductionFolder + '/keeple.controls.pagination.js',
                src: [
                    scriptsDevelopmentFolder + '/controls/pagination/pagination.module.initialization.js',
                    scriptsDevelopmentFolder + '/controls/pagination/pagination.directive.main.js'
                ]
            }
        };
    }

    //#endregion

    //#region CSS Min

    function getCSSMinOptions() {
        var files = {};
        files[webProjectFolder + '/css/production/treetable-<%= pkg.version %>.css'] = [];
        return {
            all: {
                options: {
                    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + "<%= grunt.template.today(\"yyyy-mm-dd\") %> */\n",
                    processImport: 1
                },
                files: files
            }
        };
    }

    //#endregion

    //#region Clean

    function getCleanOptions() {
        return {
            options: { force: true },
            scripts: [scriptsProductionFolder + '/*']
        };
    }

    //#endregion

    //#region JsHint

    function getJsHintOptions() {
        return {
            options: {
                bitwise: true,
                camelcase: true,
                curly: true,
                eqeqeq: false,
                eqnull: true,
                loopfunc: true,
                immed: true,
                newcap: true,
                noarg: true,
                nonew: true,
                quotmark: 'single',
                unused: true,
                trailing: true,
                browser: true,
                devel: true,
                jquery: true,
                undef: true,
                scripturl: true,
                globals: {
                    'namespace': false,
                    'angular': false
                }
            },
            files: {
                src: [
                    scriptsDevelopmentFolder + '/utils.js',
                    scriptsDevelopmentFolder + '/controls/**/*.js',
                    scriptsDevelopmentFolder + '/pages/**/*.js'
                ]
            }
        };
    }

    //#endregion

    //#region Watch

    function getWatchOptions() {
        return {
            project: {
                files: [scriptsDevelopmentFolder + '/3rd/**/*', scriptsDevelopmentFolder + '/utils.js'],
                tasks: ['concat:project']
            },
            treeTable: {
                files: scriptsDevelopmentFolder + '/controls/tree-table/**/*',
                tasks: ['concat:treeTable']
            }
        };
    }

    //#endregion

    //#region Jasmine

    function getJasmineOptions() {
        return {
            src: [
                scriptsDevelopmentFolder + '/controls/tree-table/tree-table.module.initialization.js',
                scriptsDevelopmentFolder + '/controls/tree-table/tree-table.controller.main.js',
                scriptsDevelopmentFolder + '/controls/tree-table/tree-table.controller.row.js',
                scriptsDevelopmentFolder + '/controls/tree-table/tree-table.directive.main.js',
                scriptsDevelopmentFolder + '/controls/tree-table/tree-table.directive.row.js'
            ],
            options: {
                specs: [
                    scriptsDevelopmentFolder + '/controls/tree-table/tests/tree-table.controller.main.spec.js',
                    scriptsDevelopmentFolder + '/controls/tree-table/tests/tree-table.directive.main.spec.js',
                    scriptsDevelopmentFolder + '/controls/tree-table/tests/tree-table.directive.row.spec.js'
                ],
                vendor: [
                    scriptsDevelopmentFolder + '/3rd/jquery-2.0.3.js',
                    scriptsDevelopmentFolder + '/3rd/bootstrap.js',
                    scriptsDevelopmentFolder + '/3rd/angular.js',
                    scriptsDevelopmentFolder + '/3rd/angular-mocks.js',
                    scriptsDevelopmentFolder + '/3rd/angular-sanitize.js',
                    scriptsDevelopmentFolder + '/utils.js'
                ],
                helpers: [
                    webProjectFolder + '/data/tests/itens.js'
                ],
                template: require('grunt-template-jasmine-istanbul'),
                templateOptions: {
                    coverage: 'tests/coverage/coverage.json',
                    report: 'tests/coverage'
                }
            }
        };
    }

    //#endregion

    function getFilesByPattern(pattern) {
        var structures = grunt.file.expand(pattern);
        var files = [];
        for (var key in structures) {
            var structure = structures[key];
            if (grunt.file.isFile(structure)) {
                if (files.indexOf(structure) < 0) {
                    files.push(structure);
                }
            }
        }
        return files;
    }

    this.getUglifyOptions = getUglifyOptions;
    this.getConcatOptions = getConcatOptions;
    this.getCSSMinOptions = getCSSMinOptions;
    this.getCleanOptions = getCleanOptions;
    this.getJsHintOptions = getJsHintOptions;
    this.getWatchOptions = getWatchOptions;
    this.getJasmineOptions = getJasmineOptions;
}