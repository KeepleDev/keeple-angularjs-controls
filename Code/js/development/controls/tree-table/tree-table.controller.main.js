angular.module('keeple.controls.tree-table').controller('tree-table.controller.main', ['$rootScope', '$scope', function ($rootScope, $scope) {
    /// <param name="$scope" type="Object"></param>

    var preProcessedItens = [];

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
            var parent = getItem(item.parentNodeId);
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
        if ($scope.treeTable.options.lazyLoad && !item.isLoaded) {
            if (item.isExpanded && !item.isLoading && item.isParent) {
                item.isLoading = true;
                $scope.treeTable.loadChildren(item, function (success) {
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
            for (var j = 0; j < childrenToInsert.length; j++) {
                var childItem = childrenToInsert[j];
                addItem(childItem);
            }
        }
    }

    function insertItemInProcessedItens(item) {
        var indexToInsert = getIndexToInsertItem(item);
        preProcessedItens.splice(indexToInsert, 0, item);
        item.hasBeenAddedInTreeTable = true;
    }

    function getIndexToInsertItem(item) {
        var i = 0;
        if (item.parentNodeId === null) {
            return i;
        }
        for (i = 0; i < preProcessedItens.length; i++) {
            var processedItem = preProcessedItens[i];
            if (processedItem.nodeId == item.parentNodeId) {
                return i + 1;
            }
        }
        return i;
    }

    function getItem(itemNodeId) {
        /// <returns type="Object" />
        for (var i = 0; i < preProcessedItens.length; i++) {
            var processedItem = preProcessedItens[i];
            if (processedItem.nodeId == itemNodeId) {
                return processedItem;
            }
        }
        return null;
    }

    function processItens() {
        var itensToInsert = $scope.treeTable.itens.slice(0).reverse();
        preProcessedItens = [];
        for (var i = 0; i < itensToInsert.length; i++) {
            var item = itensToInsert[i];
            addItem(item);
        }
        $scope.treeTable.preProcessedItens = preProcessedItens;
        $scope.treeTable.processedItens = treetableRowFilter(preProcessedItens);
    }

    function treetableRowFilter(itens) {
        var filtered = [];
        for (var i = 0; i < itens.length; i++) {
            var item = itens[i];
            if (item.isVisible) {
                filtered.push(item);
            }
        }
        return filtered;
    }

    $scope.treeTable.options = $scope.treeTable.options || {};
    $scope.treeTable.processedItens = [];

    $scope.$watch('treeTable.itens', function itensChangedWatch() {
        processItens();
    }, true);

    $rootScope.$emit('treeTableReady');
}]);