/// <reference path="../3rd/angular.js" />
/// <reference path="../3rd/jquery-2.0.3.js" />
angular.module("modal").directive("ngModal", function () {
    return {
        restrict: "A",
        scope: {
            title: "=title",
            show: "=show"
        },
        transclude: true,
        templateUrl: "js/development/controls/modal/templates/modal.html",
        link: function (scope, element) {
            scope.$watch("show", function () {
                if (scope.show) {
                    $(element.children()).modal("show");
                }
                else {
                    $(element.children()).modal("hide");
                }
            });
            $(element).on("hidden.bs.modal", function () {
                scope.show = false;
                scope.$apply();
            });
        }
    };
});