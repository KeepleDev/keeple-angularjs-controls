/// <reference path="../3rd/angular.js" />
/// <reference path="../3rd/jquery-2.0.3.js" />
(function (treetable, $, undefined) {

    var app = angular.module("treetable", ["ngSanitize"]);

    app.controller("treetableController", ["$rootScope", "$scope", function ($rootScope, $scope) {
        /// <param name="$scope" type="Object"></param>
        $scope.toggleTreeTableRow = function (e, item) {
            for (var i = 0; i < $scope.processedItens.length; i++) {
                var subItem = $scope.processedItens[i];
                if (subItem.parentId == item.id) {
                    subItem.isVisible = !subItem.isVisible;
                }
            }
            item.expanded = !item.expanded;
        };

        $scope.getItem = function (itemId) {
            /// <returns type="Object" />
            for (var i = 0; i < $scope.processedItens.length; i++) {
                var processedItem = $scope.processedItens[i];
                if (processedItem.id == itemId) {
                    return processedItem;
                }
            }
            return null;
        };

        $rootScope.$on("treetableToggleRow", $scope.toggleTreeTableRow);

        $rootScope.$on("treetableAddItem", function (e, item) {
            /// <param name="item" type="Object"></param>
            $scope.processedItens = $scope.processedItens || [];
            item.hasTemplate = !!item.template;
            if (item.parentId === null) {
                item.isVisible = true;
                item.isExpanded = false;
            }
            else {
                var parent = $scope.getItem(item.parentId);
                item.isVisible = !!parent.isExpanded;
                for (var i = 0; i < $scope.processedItens.length; i++) {
                    var processedItem = $scope.processedItens[i];
                    if (processedItem.id == item.parentId) {
                        if (i === $scope.processedItens.length - 1) {
                            $scope.processedItens.push(item);
                        }
                        else {
                            $scope.processedItens.splice(i + 1, 0, item);
                        }
                        return;
                    }
                }
            }
            $scope.processedItens.push(item);
        });

        $rootScope.$emit("treetableReady");
    }]);

    app.controller("treetableCellController", ["$rootScope", "$scope", function ($rootScope, $scope) {
        var item = $scope.item;
        $scope.toggleTreeTableRow = function (item) {
            $rootScope.$emit("treetableToggleRow", item);
        };
    }]);

    app.directive("ngTreetable", function () {
        return {
            restrict: "A",
            templateUrl: "treetable.html",
            scope: {
                processedItens: "=itens",
                columns: "=columns"
            }
        }
    });

    app.directive("ngTreetableRow", function ($compile) {
        return {
            restrict: "A",
            templateUrl: "treetablerow.html",
            scope: {
                item: "=item",
                first: "=first"
            }
        }
    });

    app.directive("ngTreetableCellTemplate", function ($compile) {
        return {
            restrict: "A",
            scope: {
                item: "=item",
                itemColumn: "=itemColumn"
            },
            link: function (scope, element, attrs) {
                if (scope.itemColumn.hasTemplate) {
                    var html = scope.itemColumn.template;
                    var e = $compile(html)(scope);
                    element.replaceWith(e);
                }
            }
        }
    });

    app.filter("treetableRowFilter", function () {
        return function (itens) {
            var filtered = [];
            for (var i = 0; i < itens.length; i++) {
                var item = itens[i];
                if (item.isVisible) {
                    filtered.push(item);
                }
            }
            return filtered;
        }
    });

}(namespace("treetable"), jQuery));