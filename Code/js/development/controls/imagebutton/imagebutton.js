/// <reference path="../3rd/angular.js" />
/// <reference path="../3rd/jquery-2.0.3.js" />
angular.module("project").directive("ngImageButton", function ($compile) {
    return {
        restrict: "E",
        scope: {
            btnClass: "=btnClass",
            text: "=text"
        },
        template: "<a><span ng-class='btnClass' class='btn'></span><span ng-bind-html='text'></span><a/>",
        link: function (scope, element) {
            var html = this.template;
            var e = $compile(html)(scope);
            element.replaceWith(e);
        }
    };
});