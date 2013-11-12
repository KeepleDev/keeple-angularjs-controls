module.exports = function (grunt) {
    var helper = new GoppHelper(grunt);
    var uglifyOptions = helper.getUglifyOptions();
    var concatOptions = helper.getConcatOptions();
    var cssMinOptions = helper.getCSSMinOptions();
    var cleanOptions = helper.getCleanOptions();
    var jsHintOptions = helper.getJsHintOptions();
    var watchOptions = helper.getWatchOptions();

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        uglify: uglifyOptions,
        concat: concatOptions,
        jshint: jsHintOptions,
        cssmin: cssMinOptions,
        clean: cleanOptions,
        watch: watchOptions
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-clean");

    // Default task(s).
    grunt.registerTask("default", ["test", "concat:project", "concat:treetable", "uglify"]);
    grunt.registerTask("dev", ["test", "concat:project", "concat:treetable", "cssmin", "watch"]);
    grunt.registerTask("prod", ["clean", "uglify", "cssmin"]);
    grunt.registerTask("test", ["jshint"]);
};

function GoppHelper(grunt) {
    var webProjectFolder = "../Code"
    var scriptsDevelopmentFolder = webProjectFolder + "/js/development";
    var scriptsProductionFolder = webProjectFolder + "/js/production";

    //#region Uglify

    function getUglifyOptions() {
        var projectMapping = {};
        var treeTableMapping = {};
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

        var uglify = {
            options: {
                banner: "/*! <%= pkg.name %> - v<%= pkg.version %> - " + "<%= grunt.template.today(\"yyyy-mm-dd\") %> */\n"
            },
            project: {
                files: projectMapping
            },
            treeTable: {
                files: treeTableMapping
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
            project: {
                dest: scriptsDevelopmentFolder + "/project.js",
                src: [
                    scriptsDevelopmentFolder + "/3rd/jquery-2.0.3.js",
                    scriptsDevelopmentFolder + "/3rd/bootstrap.js",
                    scriptsDevelopmentFolder + "/3rd/angular.js",
                    scriptsDevelopmentFolder + "/3rd/angular-sanitize.js",
                    scriptsDevelopmentFolder + "/utils.js"
                ]
            },
            treetable: {
                dest: scriptsDevelopmentFolder + "/treetable.js",
                src: [
                    scriptsDevelopmentFolder + "/controls/treetable/TreeTableModuleInitialization.js",
                    scriptsDevelopmentFolder + "/controls/treetable/controllers/TreeTableController.js",
                    scriptsDevelopmentFolder + "/controls/treetable/directives/TreeTableCellTemplateDirective.js",
                    scriptsDevelopmentFolder + "/controls/treetable/directives/TreeTableDirective.js",
                    scriptsDevelopmentFolder + "/controls/treetable/directives/TreeTableRowDirective.js",
                    scriptsDevelopmentFolder + "/controls/treetable/filters/TreeTableRowFilter.js"
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
                    scriptsDevelopmentFolder + "/controls/**/*",
                    scriptsDevelopmentFolder + "/pages/**/*"
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
            treetable: {
                files: scriptsDevelopmentFolder + "/controls/**/*",
                tasks: ["concat:treetable"]
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
}