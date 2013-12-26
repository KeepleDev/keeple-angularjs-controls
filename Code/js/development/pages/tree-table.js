/// <reference path="../3rd/angular.js" />
angular.module('project', ['keeple.controls.tree-table']).controller('project.controller.tree-table.main', [
    '$rootScope',
    '$http',
    '$scope',
    '$q',
    '$timeout',
    function ($rootScope, $http, $scope, $q, $timeout) {
        /// <param name="$scope" type="Object"></param>
        var children = {};

        $scope.modal = {};
        $scope.modal.title = 'Dados do Celular';
        $scope.modal.show = false;

        $scope.treeTable = {};
        $scope.treeTable.itens = [];
        $scope.treeTable = {
            itens: [],
            options: {
                lazyLoad: true
            },
            loadChildren: function (parentItem) {
                var defered = $q.defer();
                $timeout(function () {
                    if (parentItem === null) {
                        var salt = Math.floor(Math.random() * 100000);
                        $http.get('data/itens.js?' + salt).success(function (response) {
                            for (var i = 0; i < response.itens.length; i++) {
                                var item = response.itens[i];
                                if (item.children) {
                                    children[item.nodeId] = item.children;
                                    item.children = [];
                                }
                            }
                            defered.resolve(response.itens);
                        });
                    } else {
                        defered.resolve(children[parentItem.nodeId]);
                    }
                }, 300);
                return defered.promise;
            }
        };
    }
]);