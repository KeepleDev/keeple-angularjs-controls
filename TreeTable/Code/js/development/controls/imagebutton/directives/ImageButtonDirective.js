/// <reference path="../3rd/angular.js" />
/// <reference path="../3rd/jquery-2.0.3.js" />
angular.module("imageButton").directive("ngImageButton", function ($compile) {
    return {
        restrict: "E",
        scope: {
            btnClass: "=btnClass",
            text: "=text",
            identifier: "=identifier"
        },
        template: "<a ng-click=\"click()\" data-ng-controller=\"imageButtonController\"><span ng-class='btnClass' class='glyphicon'></span><span ng-bind-html='text'></span><a/>",
        link: function (scope, element) {
            var html = this.template;
            var e = $compile(html)(scope);
            element.after(e);
        }
    };
});