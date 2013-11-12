/// <reference path="../3rd/angular.js" />
/// <reference path="../3rd/jquery-2.0.3.js" />
angular.module("project").directive("ngImageButton", function ($compile) {
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