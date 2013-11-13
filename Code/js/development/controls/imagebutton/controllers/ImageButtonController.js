angular.module("imageButton").controller("imageButtonController", ["$rootScope", "$scope", function ($rootScope, $scope) {
    $scope.click = function () {
        $rootScope.$emit("imageButtonClick", $scope.identifier);
    };
}]);