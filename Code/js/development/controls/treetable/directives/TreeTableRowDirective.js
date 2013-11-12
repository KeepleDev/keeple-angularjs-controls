angular.module("treetable").directive("ngTreeTableRow", function () {
    return {
        restrict: "A",
        templateUrl: "treetablerow.html",
        scope: {
            item: "=item",
            toggleTreeTableRow: "=toggleTreeTableRow"
        }
    };
});