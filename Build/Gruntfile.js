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
        pkg: grunt.file.readJSON("package.json"),
        uglify: uglifyOptions,
        concat: concatOptions,
        jshint: jsHintOptions,
        cssmin: cssMinOptions,
        clean: cleanOptions,
        watch: watchOptions,
        jasmine: jasmineOptions
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-jasmine");

    // Default task(s).
    grunt.registerTask("default", ["test", "concat", "uglify"]);
    grunt.registerTask("dev", ["test", "concat", "cssmin", "watch"]);
    grunt.registerTask("prod", ["clean", "uglify", "cssmin"]);
    grunt.registerTask("test", ["jshint", "jasmine"]);
};

function GoppHelper(grunt) {
    var webProjectFolder = "../Code"
    var scriptsDevelopmentFolder = webProjectFolder + "/js/development";
    var scriptsProductionFolder = webProjectFolder + "/js/production";

    //#region Uglify

    function getUglifyOptions() {
        var projectMapping = {};
        var treeTableMapping = {};
        var imageButtonMapping = {};
        projectMapping[scriptsDevelopmentFolder + "/project.js"] = [
            scriptsDevelopmentFolder + "/3rd/jquery-2.0.3.js",
            scriptsDevelopmentFolder + "/3rd/bootstrap.js",
            scriptsDevelopmentFolder + "/3rd/angular.js",
            scriptsDevelopmentFolder + "/utils.js"
        ];

        treeTableMapping[scriptsDevelopmentFolder + "/treetable.js"] = [
            scriptsDevelopmentFolder + "/controls/treetable/TreeTableModuleInitialization.js",
            scriptsDevelopmentFolder + "/controls/treetable/controllers/TreeTableController.js",
            scriptsDevelopmentFolder + "/controls/treetable/directives/TreeTableCellTemplateDirective.js",
            scriptsDevelopmentFolder + "/controls/treetable/directives/TreeTableDirective.js",
            scriptsDevelopmentFolder + "/controls/treetable/directives/TreeTableRowDirective.js",
            scriptsDevelopmentFolder + "/controls/treetable/filters/TreeTableRowFilter.js"
        ];

        imageButtonMapping[scriptsDevelopmentFolder + "/imagebutton.js"] = [
            scriptsDevelopmentFolder + "/controls/imagebutton/ImageButtonModuleInitialization.js",
            scriptsDevelopmentFolder + "/controls/imagebutton/controllers/ImageButtonController.js",
            scriptsDevelopmentFolder + "/controls/imagebutton/directives/ImageButtonDirective.js"
        ]

        var uglify = {
            options: {
                banner: "/*! <%= pkg.name %> - v<%= pkg.version %> - " + "<%= grunt.template.today(\"yyyy-mm-dd\") %> */\n"
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
        if (filePath.indexOf(".", 3) >= 0) {
            var lastIndex = filePath.lastIndexOf(".");
            filePath = filePath.substring(0, lastIndex) + "-<%= pkg.version %>" + filePath.substring(lastIndex, filePath.length);
        }
        return filePath;
    }

    //#endregion

    //#region Concat

    function getConcatOptions() {
        return {
            options: {
                force: true,
                banner: "/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today(\"yyyy-mm-dd HH:MM:ss\") %> */\n",
                process: function (src, filepath) {
                    /// <param name="filepath" type="String"></param>
                    var separator = ";\n";
                    if (filepath.indexOf(".sql") > 0) {
                        separator = "\n\n\n";
                    }
                    return separator + src;
                }
            },
            treeTable: {
                dest: scriptsProductionFolder + "/treetable.js",
                src: [
                    scriptsDevelopmentFolder + "/controls/treetable/TreeTableModuleInitialization.js",
                    scriptsDevelopmentFolder + "/controls/treetable/controllers/TreeTableController.js",
                    scriptsDevelopmentFolder + "/controls/treetable/controllers/TreeTableRowController.js",
                    scriptsDevelopmentFolder + "/controls/treetable/directives/TreeTableCellTemplateDirective.js",
                    scriptsDevelopmentFolder + "/controls/treetable/directives/TreeTableDirective.js",
                    scriptsDevelopmentFolder + "/controls/treetable/directives/TreeTableRowDirective.js",
                    scriptsDevelopmentFolder + "/controls/treetable/filters/TreeTableRowFilter.js"
                ]
            },
            imageButton: {
                dest: scriptsProductionFolder + "/imagebutton.js",
                src: [
                    scriptsDevelopmentFolder + "/controls/imagebutton/ImageButtonModuleInitialization.js",
                    scriptsDevelopmentFolder + "/controls/imagebutton/controllers/ImageButtonController.js",
                    scriptsDevelopmentFolder + "/controls/imagebutton/directives/ImageButtonDirective.js"
                ]
            },
            modal: {
                dest: scriptsProductionFolder + "/modal.js",
                src: [
                    scriptsDevelopmentFolder + "/controls/modal/ModalModuleInitialization.js",
                    scriptsDevelopmentFolder + "/controls/modal/directives/ModalDirective.js"
                ]
            }
        }
    }

    //#endregion

    //#region CSS Min

    function getCSSMinOptions() {
        var files = {};
        files[webProjectFolder + "/css/production/treetable-<%= pkg.version %>.css"] = [];
        return {
            all: {
                options: {
                    banner: "/*! <%= pkg.name %> - v<%= pkg.version %> - " + "<%= grunt.template.today(\"yyyy-mm-dd\") %> */\n",
                    processImport: 1
                },
                files: files
            }
        }
    }

    //#endregion

    //#region Clean

    function getCleanOptions() {
        return {
            options: { force: true },
            scripts: [scriptsProductionFolder + "/*"]
        }
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
                quotmark: "double",
                unused: true,
                trailing: true,
                browser: true,
                devel: true,
                jquery: true,
                undef: true,
                scripturl: true,
                globals: {
                    "namespace": false,
                    "angular": false
                }
            },
            files: {
                src: [
                    scriptsDevelopmentFolder + "/utils.js",
                    scriptsDevelopmentFolder + "/controls/**/*.js",
                    scriptsDevelopmentFolder + "/pages/**/*.js"
                ]
            }
        };
    }

    //#endregion

    //#region Watch

    function getWatchOptions() {
        return {
            project: {
                files: [scriptsDevelopmentFolder + "/3rd/**/*", scriptsDevelopmentFolder + "/utils.js"],
                tasks: ["concat:project"]
            },
            treeTable: {
                files: scriptsDevelopmentFolder + "/controls/treetable/**/*",
                tasks: ["concat:treeTable"]
            },
            imageButton: {
                files: scriptsDevelopmentFolder + "/controls/imagebutton/**/*",
                tasks: ["concat:imageButton"]
            },
            modal: {
                files: scriptsDevelopmentFolder + "/controls/modal/**/*",
                tasks: ["concat:modal"]
            }
        };
    }

    //#endregion

    //#region Jasmine

    function getJasmineOptions() {
        return {
            src: [
                scriptsDevelopmentFolder + "/controls/treetable/TreeTableModuleInitialization.js",
                scriptsDevelopmentFolder + "/controls/treetable/controllers/TreeTableController.js",
                scriptsDevelopmentFolder + "/controls/treetable/controllers/TreeTableRowController.js",
                scriptsDevelopmentFolder + "/controls/treetable/directives/TreeTableCellTemplateDirective.js",
                scriptsDevelopmentFolder + "/controls/treetable/directives/TreeTableDirective.js",
                scriptsDevelopmentFolder + "/controls/treetable/directives/TreeTableRowDirective.js",
                scriptsDevelopmentFolder + "/controls/treetable/filters/TreeTableRowFilter.js"
            ],
            options: {
                specs: [
                    scriptsDevelopmentFolder + "/controls/treetable/tests/TreeTableControllerTests.js",
                    scriptsDevelopmentFolder + "/controls/treetable/tests/TreeTableCellTemplateDirectiveTests.js",
                    scriptsDevelopmentFolder + "/controls/treetable/tests/TreeTableDirectiveTests.js",
                    scriptsDevelopmentFolder + "/controls/treetable/tests/TreeTableRowDirectiveTests.js",
                    scriptsDevelopmentFolder + "/controls/treetable/tests/TreeTableRowFilterTests.js"
                ],
                vendor: [
                    scriptsDevelopmentFolder + "/3rd/jquery-2.0.3.js",
                    scriptsDevelopmentFolder + "/3rd/bootstrap.js",
                    scriptsDevelopmentFolder + "/3rd/angular.js",
                    scriptsDevelopmentFolder + "/3rd/angular-mocks.js",
                    scriptsDevelopmentFolder + "/3rd/angular-sanitize.js",
                    scriptsDevelopmentFolder + "/utils.js"
                ],
                helpers: [
                    webProjectFolder + "/data/tests/itens.js",
                    scriptsDevelopmentFolder + "/controls/imagebutton/ImageButtonModuleInitialization.js",
                    scriptsDevelopmentFolder + "/controls/imagebutton/controllers/ImageButtonController.js",
                    scriptsDevelopmentFolder + "/controls/imagebutton/directives/ImageButtonDirective.js"
                ],
                template: require("grunt-template-jasmine-istanbul"),
                templateOptions: {
                    coverage: "tests/coverage/coverage.json",
                    report: "tests/coverage"
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