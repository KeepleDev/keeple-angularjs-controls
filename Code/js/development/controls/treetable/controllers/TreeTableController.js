angular.module("treetable").controller("treeTableController", ["$rootScope", "$scope", function ($rootScope, $scope) {
    /// <param name="$scope" type="Object"></param>
    function addItem(item) {
        /// <param name="item" type="Object"></param>
        $scope.processedItens = $scope.processedItens || [];
        item.hasTemplate = !!item.template;
        item.children = item.children || [];
        if (item.parentId === null) {
            item.isVisible = true;
            if (item.isExpanded === undefined) {
                item.isExpanded = false;
            }
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
        item.children.sort(sortFunction);
        for (var j = 0; j < item.children.length; j++) {
            var childItem = item.children[j];
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
        if (item.isLoaded || !$scope.options.lazyLoad) {
            for (var i = 0; i < $scope.processedItens.length; i++) {
                var subItem = $scope.processedItens[i];
                if (subItem.parentId == item.id) {
                    subItem.isVisible = !subItem.isVisible;
                }
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
        item.isExpanded = !item.isExpanded;
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
                return (itemASortColumn.value < itemBSortColumn.value) ? 1 : -1;
            }
            else {
                return (itemASortColumn.value > itemBSortColumn.value) ? 1 : -1;
            }
        }
        return 0;
    }

    function processItens() {
        $scope.processedItens = [];
        $scope.itens.sort(sortFunction);
        for (var i = 0; i < $scope.itens.length; i++) {
            var item = $scope.itens[i];
            addItem(item);
        }
    }

    $scope.getItem = getItem;
    $scope.toggleTreeTableRow = toggleTreeTableRow;
    $scope.addItem = addItem;
    $scope.processedItens = [];
    $scope.sortColumnIndex = 0;
    $scope.sortAsc = false;
    $scope.sort = sort;

    $scope.$watch("itens", function () {
        processItens();
    });

    $rootScope.$emit("treetableReady");
}]);