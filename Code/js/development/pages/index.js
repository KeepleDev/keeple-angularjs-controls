/// <reference path="../3rd/angular.js" />
angular.module("project", ["treetable", "imageButton", "modal"]).controller("indexController", ["$rootScope", "$http", "$scope", function ($rootScope, $http, $scope) {
    /// <param name="$scope" type="Object"></param>
    var children = {};

    $scope.modal = {};
    $scope.modal.title = "Dados do Celular";
    $scope.modal.show = false;

    $scope.treetable = {};
    $scope.treetable.itens = [];
    $scope.treetable.columns = ["Fabricante/Celular", "Ano de Fabricação", "CPU", "Memoria"];
    $scope.treetable.options = {};
    $scope.treetable.options.lazyLoad = true;
    $scope.treetable.loadChildren = function (parentItem, callback) {
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
                if (item.children) {
                    children[item.id] = item.children;
                    item.children = [];
                }
            }
            $scope.treetable.itens = response.itens;
        });
    });

    $rootScope.$on("imageButtonClick", function (e, identifier) {
        var item = findItem($scope.treetable.itens, identifier);
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