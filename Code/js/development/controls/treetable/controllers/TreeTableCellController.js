angular.module("treetable").controller("treetableCellController", ["$rootScope", "$scope", function ($rootScope, $scope) {
    $scope.toggleTreeTableRow = function (item) {
        $rootScope.$emit("treetableToggleRow", item);
    };
}]);