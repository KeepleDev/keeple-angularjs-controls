angular.module("treetable").directive("ngTreeTableRow", function () {
    return {
        restrict: "A",
        templateUrl: "templates/treetablerow.html",
        scope: {
            item: "=item"
        }
    };
});