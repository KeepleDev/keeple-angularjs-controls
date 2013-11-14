﻿angular.module("treetable").controller("treeTableController", ["$rootScope", "$scope", function ($rootScope, $scope) {
    /// <param name="$scope" type="Object"></param>
    function addItem(item) {
        /// <param name="item" type="Object"></param>
        $scope.processedItens = $scope.processedItens || [];
        item.hasTemplate = !!item.template;
        item.children = item.children || [];
        if (item.parentId === null) {
            item.isVisible = true;
            item.level = 1;
            if (item.isExpanded === undefined) {
                item.isExpanded = false;
            }
            $scope.processedItens.splice(0, 0, item);
        }
        else {
            var parent = $scope.getItem(item.parentId);
            var found = false;
            item.isVisible = !!parent.isExpanded;
            item.level = parent.level + 1;
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
                return;
            }
        }
        item.children.sort(sortFunction);
        var childrenToInsert = item.children.slice(0).reverse();
        for (var j = 0; j < childrenToInsert.length; j++) {
            var childItem = childrenToInsert[j];
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
        item.isExpanded = !item.isExpanded;
        item.children = item.children || [];
        if (item.isLoaded || !$scope.options.lazyLoad) {
            if (!item.isExpanded) {
                hideChildItens(item);
            }
            else {
                showChildItens(item);
            }
        }
        else {
            item.isLoading = true;
            $scope.loadChildren(item, function (success) {
                item.isLoading = false;
                if (success) {
                    item.isLoaded = true;
                }
            });
        }
    }

    function hideChildItens(parentItem) {
        var itens = parentItem.children || [];
        for (var i = 0; i < itens.length; i++) {
            var item = itens[i];
            item.isVisible = false;
            hideChildItens(item);
        }
    }

    function showChildItens(parentItem) {
        parentItem.isVisible = true;
        var itens = parentItem.children || [];
        for (var i = 0; i < itens.length; i++) {
            var item = itens[i];
            if (parentItem.isExpanded) {
                item.isVisible = true;
                showChildItens(item);
            }
        }
    }

    function sort(columnIndex) {
        if ($scope.sortColumnIndex !== columnIndex) {
            $scope.sortAsc = true;
        }
        else {
            $scope.sortAsc = !$scope.sortAsc;
        }
        $scope.sortColumnIndex = columnIndex;
        processItens();
    }

    function sortFunction(itemA, itemB) {
        var itemASortColumn = itemA.columns[$scope.sortColumnIndex];
        var itemBSortColumn = itemB.columns[$scope.sortColumnIndex];
        if (itemASortColumn && itemBSortColumn) {
            if ($scope.sortAsc) {
                return (itemASortColumn.value > itemBSortColumn.value) ? 1 : -1;
            }
            else {
                return (itemASortColumn.value < itemBSortColumn.value) ? 1 : -1;
            }
        }
        return 0;
    }

    function processItens() {
        $scope.processedItens = [];
        $scope.itens.sort(sortFunction);
        var itensToInsert = $scope.itens.slice(0).reverse();
        for (var i = 0; i < itensToInsert.length; i++) {
            var item = itensToInsert[i];
            addItem(item);
        }
    }

    $scope.getItem = getItem;
    $scope.toggleTreeTableRow = toggleTreeTableRow;
    $scope.addItem = addItem;
    $scope.processedItens = [];
    $scope.sortColumnIndex = 0;
    $scope.sortAsc = undefined;
    $scope.sort = sort;

    $scope.$watch("itens", function () {
        processItens();
    }, true);

    $rootScope.$emit("treetableReady");
}]);