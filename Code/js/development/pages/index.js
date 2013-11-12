/// <reference path="../3rd/angular.js" />
angular.module("project", ["treetable"]).controller("indexController", ["$rootScope", "$http", "$scope", function ($rootScope, $http, $scope) {
    /// <param name="$scope" type="Object"></param>
    $scope.treetable = {};
    $scope.treetable.itens = [];
    $scope.treetable.columns = ["Celular", "Ano de Fabricação", "CPU", "Memoria"];
    $scope.treetable.options = {};
    $scope.treetable.options.lazyLoad = false;
    $scope.treetable.loadChildren = function (parentItem, callback) {
        /// <param name="callback" type="Function">Description</param>
        if (callback) {
            setTimeout(function () {
                callback(true);
                $scope.$apply();
            }, 2000);
        }
    };
    $rootScope.$on("treetableReady", function () {
        var salt = Math.floor(Math.random() * 100000);
        $http.get("data/itens.js?" + salt).success(function (response) {
            $scope.treetable.itens = response.itens;
        });
    });
}]);