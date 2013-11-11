/// <reference path="../3rd/angular.js" />
(function (pages, $, undefined) {
    var index = angular.module("treetable");

    index.controller("indexController", ["$rootScope", "$http", "$scope", function ($rootScope, $http, $scope) {
        $scope.itens = [];
        $scope.columns = ["Celular", "Ano de Fabricação"];
        $rootScope.$on("treetableReady", function () {
            $http.get("data/itens.js").success(function (response) {
                for (var i = 0; i < response.itens.length; i++) {
                    var item = response.itens[i];
                    $rootScope.$emit("treetableAddItem", item);
                }
            });
        });
    }]);
}(namespace("pages"), jQuery));