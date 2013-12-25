module.exports = function (grunt) {
    var helper = new GoppHelper();
    var concatOptions = helper.getConcatOptions();
    var cssMinOptions = helper.getCSSMinOptions();
    var cleanOptions = helper.getCleanOptions();
    var jsHintOptions = helper.getJsHintOptions();
    var jasmineOptions = helper.getJasmineOptions();
    var html2JsOptions = helper.getHtml2JsOptions();

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: concatOptions,
        jshint: jsHintOptions,
        cssmin: cssMinOptions,
        clean: cleanOptions,
        jasmine: jasmineOptions,
        html2js: html2JsOptions
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-html2js');

    // Default task(s).
    grunt.registerTask('default', ['test', 'concat']);
    grunt.registerTask('test', ['html2js', 'jshint', 'jasmine']);
};

function GoppHelper() {
    var webProjectFolder = '../Code';
    var scriptsDevelopmentFolder = webProjectFolder + '/js/development';
    var scriptsProductionFolder = webProjectFolder + '/js/production';

    //#region Concat

    function getConcatOptions() {
        return {
            options: {
                force: true,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */\n',
                process: function (src, filepath) {
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
                    scriptsDevelopmentFolder + '/controls/tree-table/tree-table.directive.row.js',
                    scriptsDevelopmentFolder + '/controls/tree-table/tree-table.templates.js'
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
            'fixed-notification': {
                dest: scriptsProductionFolder + '/keeple.controls.fixed-notification.js',
                src: [
                    scriptsDevelopmentFolder + '/controls/fixed-notification/fixed-notification.module.initialization.js',
                    scriptsDevelopmentFolder + '/controls/fixed-notification/fixed-notification.service.helper.js',
                    scriptsDevelopmentFolder + '/controls/fixed-notification/fixed-notification.directive.main.js',
                    scriptsDevelopmentFolder + '/controls/fixed-notification/fixed-notification.directive.message.js',
                    scriptsDevelopmentFolder + '/controls/fixed-notification/fixed-notification.templates.js'
                ]
            },
            pagination: {
                dest: scriptsProductionFolder + '/keeple.controls.pagination.js',
                src: [
                    scriptsDevelopmentFolder + '/controls/pagination/pagination.module.initialization.js',
                    scriptsDevelopmentFolder + '/controls/pagination/pagination.directive.main.js',
                    scriptsDevelopmentFolder + '/controls/pagination/pagination.templates.js'
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
                    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */\n',
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

    //#region Jasmine

    function getJasmineOptions() {
        return {
            src: [
                scriptsDevelopmentFolder + '/controls/tree-table/tree-table.module.initialization.js',
                scriptsDevelopmentFolder + '/controls/tree-table/tree-table.controller.main.js',
                scriptsDevelopmentFolder + '/controls/tree-table/tree-table.controller.row.js',
                scriptsDevelopmentFolder + '/controls/tree-table/tree-table.directive.main.js',
                scriptsDevelopmentFolder + '/controls/tree-table/tree-table.directive.row.js',
                scriptsDevelopmentFolder + '/controls/tree-table/tree-table.templates.js'
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

    //#region Html2Js

    function getHtml2JsOptions() {
        return {
            options: {
                base: scriptsDevelopmentFolder + '/controls',
                quoteChar: '\'',
                fileHeaderString: '/* Arquivo gerado automaticamente pelo grunt, nao altere.\n * Para modificar os templates altere os arquivos *.tpl.html.\n*/'
            },
            'tree-table': {
                src: [scriptsDevelopmentFolder + '/controls/tree-table/templates/**/*.tpl.html'],
                dest: scriptsDevelopmentFolder + '/controls/tree-table/tree-table.templates.js'
            },
            'fixed-notification': {
                src: [scriptsDevelopmentFolder + '/controls/fixed-notification/templates/**/*.tpl.html'],
                dest: scriptsDevelopmentFolder + '/controls/fixed-notification/fixed-notification.templates.js'
            },
            'pagination': {
                src: [scriptsDevelopmentFolder + '/controls/pagination/templates/**/*.tpl.html'],
                dest: scriptsDevelopmentFolder + '/controls/pagination/pagination.templates.js'
            }
        };
    }

    //#endregion

    this.getConcatOptions = getConcatOptions;
    this.getCSSMinOptions = getCSSMinOptions;
    this.getCleanOptions = getCleanOptions;
    this.getJsHintOptions = getJsHintOptions;
    this.getJasmineOptions = getJasmineOptions;
    this.getHtml2JsOptions = getHtml2JsOptions;
}