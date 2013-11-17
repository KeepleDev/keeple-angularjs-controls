angular.module("keeple.controls.treeTable").controller("treeTableController", ["$rootScope", "$scope", function ($rootScope, $scope) {
    /// <param name="$scope" type="Object"></param>
    function addItem(item) {
        /// <param name="item" type="Object"></param>
        item.hasTemplate = !!item.template;
        item.children = item.children || [];
        if (item.parentNodeId === null) {
            item.isVisible = true;
            item.level = 1;
            if (item.isExpanded === undefined) {
                item.isExpanded = false;
            }
            insertItemInProcessedItens(item);
        }
        else {
            var parent = $scope.getItem(item.parentNodeId);
            if (parent) {
                item.isVisible = !!parent.isExpanded && parent.isVisible;
                item.level = parent.level + 1;
                item.isExpanded = !!item.isExpanded;
                insertItemInProcessedItens(item);
            }
            else {
                return;
            }
        }
        if ($scope.options.lazyLoad && !item.isLoaded) {
            if (item.isExpanded && !item.isLoading && item.isParent) {
                item.isLoading = true;
                $scope.loadChildren(item, function (success) {
                    item.isLoading = false;
                    if (success) {
                        item.isLoaded = true;
                    }
                });
            }
        }
        else {
            var childrenToInsert = item.children.slice(0);
            childrenToInsert.reverse();
            childrenToInsert.sort(sortFunction);
            for (var j = 0; j < childrenToInsert.length; j++) {
                var childItem = childrenToInsert[j];
                addItem(childItem);
            }
        }
    }

    function insertItemInProcessedItens(item) {
        var indexToInsert = getIndexToInsertItem(item);
        $scope.processedItens.splice(indexToInsert, 0, item);
        item.hasBeenAddedInTreeTable = true;
    }

    function getIndexToInsertItem(item) {
        var i = 0;
        if (item.parentNodeId === null) {
            return 0;
        }
        for (i = 0; i < $scope.processedItens.length; i++) {
            var processedItem = $scope.processedItens[i];
            if (processedItem.nodeId == item.parentNodeId) {
                return i + 1;
            }
        }
        return i;
    }

    function getItem(itemNodeId) {
        /// <returns type="Object" />
        for (var i = 0; i < $scope.processedItens.length; i++) {
            var processedItem = $scope.processedItens[i];
            if (processedItem.nodeId == itemNodeId) {
                return processedItem;
            }
        }
        return null;
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
        var itensToInsert = $scope.itens.slice(0).reverse();
        itensToInsert.sort(sortFunction);
        $scope.processedItens = [];
        for (var i = 0; i < itensToInsert.length; i++) {
            var item = itensToInsert[i];
            addItem(item);
        }
    }

    function processColumns() {
        $scope.columns = $scope.columns || [];
        $scope.headerLines = [];
        for (var i = 0; i < $scope.columns.length; i++) {
            var column = $scope.columns[i];
            if (typeof column === "string") {
                var value = column;
                column = {};
                column.value = value;
                column.line = 1;
            }
            if (!column.colspan) {
                column.colspan = 1;
            }
            if (column.isSortable === undefined) {
                column.isSortable = true;
            }
            $scope.headerLines[column.line - 1] = $scope.headerLines[column.line - 1] || [];
            $scope.headerLines[column.line - 1].columns = $scope.headerLines[column.line - 1].columns || [];
            $scope.headerLines[column.line - 1].columns.push(column);
        }
    }

    $scope.getItem = getItem;
    $scope.addItem = addItem;
    $scope.processedItens = [];
    $scope.sortColumnIndex = -1;
    $scope.sortAsc = undefined;
    $scope.sort = sort;
    $scope.options = $scope.options || {};
    $scope.headerLines = [];

    $scope.$watch("itens", function itensChangedWatch() {
        processItens();
    }, true);

    $scope.$watch("columns", function columnsChangedWatch() {
        processColumns();
    }, true);

    processColumns();

    $rootScope.$emit("treetableReady");
}]);