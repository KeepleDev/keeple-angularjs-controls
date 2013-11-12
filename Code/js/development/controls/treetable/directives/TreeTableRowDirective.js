angular.module("treetable").directive("ngTreeTableRow", function () {
    return {
        restrict: "A",
        templateUrl: "js/development/controls/treetable/templates/treetablerow.html",
        scope: {
            item: "=item",
            toggleTreeTableRow: "=toggleTreeTableRow"
        }
    };
});