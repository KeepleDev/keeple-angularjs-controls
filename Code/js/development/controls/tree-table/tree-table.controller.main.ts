/// <reference path="../../3rd/angular.d.ts" />
module KeepleControls.TreeTable {
    angular.module('keeple.controls.tree-table').controller('tree-table.controller.main', [
        '$rootScope',
        '$scope',
        ($rootScope: ng.IScope, $scope: ITreeTableMainController) => {
            var preProcessedItens: ITreeTableItem[] = [];

            function addItem(parentItem: ITreeTableItem, item: ITreeTableItem) {
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
                        $scope.treeTable.loadChildren(item).then(itens=> {
                            item.isLoaded = true;
                            item.children = itens;
                        }).finally(() => {
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

            function insertItemInProcessedItens(parentItem: ITreeTableItem, item: ITreeTableItem) {
                var indexToInsert = getIndexToInsertItem(parentItem);
                preProcessedItens.splice(indexToInsert, 0, item);
            }

            function getIndexToInsertItem(parentItem: ITreeTableItem) {
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

            function treetableRowFilter(itens: ITreeTableItem[]) {
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

            $scope.$watch('treeTable.itens', () => {
                processItens();
            }, true);

            if (angular.isFunction($scope.treeTable.loadChildren)) {
                $scope.treeTable.loadChildren(null).then(itens=> {
                    $scope.treeTable.itens = itens;
                });
            }
        }
    ]);
}