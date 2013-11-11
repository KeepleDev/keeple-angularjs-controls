/// <reference path="../3rd/angular.js" />
/// <reference path="../3rd/jquery-2.0.3.js" />
(function (treetable, $, undefined) {

    var app = angular.module("treetable", ["ngSanitize"]);

    app.controller("treetableController", ["$rootScope", "$scope", function ($rootScope, $scope) {
        /// <param name="$scope" type="Object"></param>
        function addItem(item) {
            /// <param name="item" type="Object"></param>
            $scope.processedItens = $scope.processedItens || [];
            item.hasTemplate = !!item.template;
            item.children = item.children || [];
            if (item.parentId === null) {
                item.isVisible = true;
                item.isExpanded = false;
                $scope.processedItens.push(item);
            }
            else {
                var parent = $scope.getItem(item.parentId);
                var found = false;
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
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    $scope.processedItens.push(item);
                }
            }
            for (var i = 0; i < item.children.length; i++) {
                var childItem = item.children[i];
                addItem(childItem);
            }
        }

        function getItem(itemId) {
            /// <returns type="Object" />
            for (var i = 0; i < $scope.processedItens.length; i++) {
                var processedItem = $scope.processedItens[i];
                if (processedItem.id == itemId) {
                    return processedItem;
                }
            }
            return null;
        }

        function toggleTreeTableRow(item) {
            for (var i = 0; i < $scope.processedItens.length; i++) {
                var subItem = $scope.processedItens[i];
                if (subItem.parentId == item.id) {
                    subItem.isVisible = !subItem.isVisible;
                }
            }
            item.expanded = !item.expanded;
        }

        $scope.getItem = getItem;

        $rootScope.$on("treetableToggleRow", function (e, item) {
            toggleTreeTableRow(item)
        });

        $rootScope.$on("treetableAddItem", function (e, item) {
            addItem(item);
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