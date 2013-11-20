angular.module("keeple.controls.treeTable").directive("treeTable", function () {
    return {
        restrict: "A",
        controller: "treeTableController",
        scope: {
            treeTable: "=treeTable"
        }
    };
});