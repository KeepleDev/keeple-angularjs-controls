angular.module("treetable").directive("ngTreetableRow", function () {
    return {
        restrict: "A",
        templateUrl: "treetablerow.html",
        scope: {
            item: "=item"
        }
    };
});