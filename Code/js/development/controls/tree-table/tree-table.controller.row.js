angular.module('keeple.controls.tree-table').controller('tree-table.controller.row', ['$scope', function ($scope) {
    $scope.toggleRow = function (item) {
        item.isExpanded = !item.isExpanded;
    };
}]);