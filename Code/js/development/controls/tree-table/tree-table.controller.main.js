var KeepleControls;
(function (KeepleControls) {
    /// <reference path="../../3rd/angular.d.ts" />
    (function (TreeTable) {
        angular.module('keeple.controls.tree-table').controller('tree-table.controller.main', [
            '$rootScope',
            '$scope',
            function ($rootScope, $scope) {
                var preProcessedItens = [];

                function addItem(parentItem, item) {
                    item.children = item.children || [];
                    if (parentItem === null) {
                        item.isVisible = true;
                        item.level = 1;
                        if (item.isExpanded === undefined) {
                            item.isExpanded = false;
                        }
                        insertItemInProcessedItens(null, item);
                    } else {
                        if (parentItem) {
                            item.isVisible = !!parentItem.isExpanded && parentItem.isVisible;
                            item.level = parentItem.level + 1;
                            item.isExpanded = !!item.isExpanded;
                            insertItemInProcessedItens(parentItem, item);
                        } else {
                            return;
                        }
                    }
                    if (!item.isParent) {
                        item.isLoaded = true;
                    }
                    if ($scope.treeTable.options.lazyLoad && !item.isLoaded) {
                        if (item.isExpanded && !item.isLoading && item.isParent) {
                            item.isLoading = true;
                            $scope.treeTable.loadChildren(item).then(function (itens) {
                                item.isLoaded = true;
                                item.children = itens;
                            }).finally(function () {
                                item.isLoading = false;
                            });
                        }
                    } else {
                        var childrenToInsert = item.children.slice(0);
                        childrenToInsert.reverse();
                        for (var j = 0; j < childrenToInsert.length; j++) {
                            var childItem = childrenToInsert[j];
                            addItem(item, childItem);
                        }
                    }
                }

                function insertItemInProcessedItens(parentItem, item) {
                    var indexToInsert = getIndexToInsertItem(parentItem);
                    preProcessedItens.splice(indexToInsert, 0, item);
                }

                function getIndexToInsertItem(parentItem) {
                    var i = 0;
                    if (parentItem == null) {
                        return i;
                    }
                    for (i = 0; i < preProcessedItens.length; i++) {
                        var processedItem = preProcessedItens[i];
                        if (processedItem.nodeId == parentItem.nodeId) {
                            return i + 1;
                        }
                    }
                    return i;
                }

                function processItens() {
                    if (angular.isArray($scope.treeTable.itens) && $scope.treeTable.itens !== null) {
                        var itensToInsert = $scope.treeTable.itens.slice(0).reverse();
                        preProcessedItens = [];
                        for (var i = 0; i < itensToInsert.length; i++) {
                            var item = itensToInsert[i];
                            addItem(null, item);
                        }
                        $scope.treeTable.preProcessedItens = preProcessedItens;
                        $scope.treeTable.processedItens = treetableRowFilter(preProcessedItens);
                    }
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

                $scope.treeTable.options = $scope.treeTable.options || { lazyLoad: true };
                $scope.treeTable.processedItens = [];

                $scope.$watch('treeTable.itens', function () {
                    processItens();
                }, true);

                if (angular.isFunction($scope.treeTable.loadChildren)) {
                    $scope.treeTable.loadChildren(null).then(function (itens) {
                        $scope.treeTable.itens = itens;
                    });
                }
            }
        ]);
    })(KeepleControls.TreeTable || (KeepleControls.TreeTable = {}));
    var TreeTable = KeepleControls.TreeTable;
})(KeepleControls || (KeepleControls = {}));
//# sourceMappingURL=tree-table.controller.main.js.map
