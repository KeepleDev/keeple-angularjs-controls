/// <reference path="../3rd/angular.js" />
angular.module("project", ["treetable"]).controller("indexController", ["$rootScope", "$http", "$scope", function ($rootScope, $http, $scope) {
    /// <param name="$scope" type="Object"></param>
    $scope.treetable = {};
    $scope.treetable.itens = [];
    $scope.treetable.columns = ["Celular", "Ano de Fabricação", "CPU", "Memoria"];
    $scope.treetable.options = {};
    $scope.treetable.options.lazyLoad = false;
    $rootScope.$on("treetableReady", function () {
        $http.get("data/itens.js").success(function (response) {
            $scope.treetable.itens = response.itens;
            //for (var i = 0; i < response.itens.length; i++) {
            //    var item = response.itens[i];
            //    $rootScope.$emit("treetableAddItem", item);
            //}
        });
    });
}]);