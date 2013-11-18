/// <reference path="../3rd/angular.js" />
angular.module("project", ["keeple.controls.treeTable", "imageButton", "modal", "ngSanitize"]).controller("indexController", ["$rootScope", "$http", "$scope", function ($rootScope, $http, $scope) {
    /// <param name="$scope" type="Object"></param>
    var children = {};

    $scope.modal = {};
    $scope.modal.title = "Dados do Celular";
    $scope.modal.show = false;

    $scope.treeTable = {};
    $scope.treeTable.itens = [];
    $scope.treeTable.columns = [{ line: 1, value: "Fabricante/Celular" }, { line: 1, value: "Ano de Fabricação" }, { line: 1, value: "CPU" }, { line: 1, value: "Memoria" }];
    $scope.treeTable.options = {};
    $scope.treeTable.options.lazyLoad = true;
    $scope.treeTable.loadChildren = function (parentItem, callback) {
        /// <param name="callback" type="Function">Description</param>
        if (callback) {
            setTimeout(function () {
                parentItem.children = children[parentItem.nodeId];
                callback(true);
                $scope.$apply();
            }, 300);
        }
    };
    $rootScope.$on("treetableReady", function () {
        var salt = Math.floor(Math.random() * 100000);
        $http.get("data/itens.js?" + salt).success(function (response) {
            for (var i = 0; i < response.itens.length; i++) {
                var item = response.itens[i];
                item.colspan = item.tipo === "Fabricante" ? 4 : 1;
                if (item.children) {
                    children[item.nodeId] = item.children;
                    item.children = [];
                }
            }
            //angular.copy(response.itens, $scope.treeTable.itens);
            $scope.treeTable.itens = response.itens;
            $scope.treeTable.itens[0].test = "true";
        });
    });

    $rootScope.$on("imageButtonClick", function (e, identifier) {
        var item = findItem($scope.treeTable.itens, identifier);
        if (item) {
            $scope.modal.show = true;
            $scope.modal.item = item;
        }
    });

    function findItem(itens, itemNodeId) {
        for (var i = 0; i < itens.length; i++) {
            var item = itens[i];
            if (item.nodeId == itemNodeId) {
                return item;
            }
            else if (item.children) {
                var itemFound = findItem(item.children, itemNodeId);
                if (itemFound !== null) {
                    return itemFound;
                }
            }
        }
        return null;
    }
}]);