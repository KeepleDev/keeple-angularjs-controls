/// <reference path="../3rd/angular.js" />
/// <reference path="../3rd/jquery-2.0.3.js" />
(function (treetable, $, undefined) {
    var app = angular.module("treetable");

    app.directive("ngImageButton", function ($compile) {
        return {
            restrict: "E",
            scope: {
                btnClass: "=btnClass",
                text: "=text"
            },
            template: "<span ng-class='btnClass' class='btn' ng-bind-html='text'><span>",
            replace: true
        }
    });

}(namespace("treetable"), jQuery));