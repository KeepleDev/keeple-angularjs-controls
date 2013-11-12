/// <reference path="../3rd/angular.js" />
angular.module("project", ["treetable"]).controller("indexController", ["$rootScope", "$http", "$scope", function ($rootScope, $http, $scope) {
    /// <param name="$scope" type="Object"></param>
    $scope.itens = [];
    $scope.columns = ["Celular", "Ano de Fabricação", "CPU", "Memoria"];
    $scope.options = {};
    $scope.options.lazyLoad = false;
    $rootScope.$on("treetableReady", function () {
        $http.get("data/itens.js").success(function (response) {
            for (var i = 0; i < response.itens.length; i++) {
                var item = response.itens[i];
                $rootScope.$emit("treetableAddItem", item);
            }
        });
    });
}]);