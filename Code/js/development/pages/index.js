/// <reference path="../3rd/angular.js" />
angular.module("project", ["treetable"]).controller("indexController", ["$rootScope", "$http", "$scope", function ($rootScope, $http, $scope) {
    /// <param name="$scope" type="Object"></param>
    var children = {};

    $scope.treetable = {};
    $scope.treetable.itens = [];
    $scope.treetable.columns = ["Fabricante/Celular", "Ano de Fabricação", "CPU", "Memoria"];
    $scope.treetable.options = {};
    $scope.treetable.options.lazyLoad = true;
    $scope.treetable.loadChildren = function (parentItem, callback) {
        /// <param name="callback" type="Function">Description</param>
        if (callback) {
            setTimeout(function () {
                parentItem.children = children[parentItem.id];
                callback(true);
                $scope.$apply();
            }, 1000);
        }
    };
    $rootScope.$on("treetableReady", function () {
        var salt = Math.floor(Math.random() * 100000);
        $http.get("data/itens.js?" + salt).success(function (response) {
            for (var i = 0; i < response.itens.length; i++) {
                var item = response.itens[i];
                if (item.children) {
                    children[item.id] = item.children;
                    item.children = [];
                }
            }
            $scope.treetable.itens = response.itens;
        });
    });
}]);