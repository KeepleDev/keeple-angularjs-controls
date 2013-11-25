angular.module("keeple.controls.treeTable").controller("treeTableRowController", ["$rootScope", "$scope", function ($rootScope, $scope) {
    $scope.toggleRow = function (item) {
        item.isExpanded = !item.isExpanded;
    };
}]);