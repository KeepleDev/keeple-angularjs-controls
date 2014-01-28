/// <reference path="../../3rd/jquery.d.ts" />
module KeepleControls.TreeTable {
    angular.module('keeple.controls.tree-table').directive('treeTableRow', [
        '$compile',
        '$templateCache',
        ($compile: ng.ICompileService, $templateCache: ng.ITemplateCacheService) => {
            var toggleSpanTemplate = $templateCache.get('tree-table/templates/toggle-span.tpl.html');
            var loadingRowTemplate = $templateCache.get('tree-table/templates/loading-row.tpl.html');

            return {
                restrict: 'A',
                controller: 'tree-table.controller.row',
                scope: {
                    item: '=treeTableRow'
                },
                link: (scope: ITreeTableRowController, element: ng.IAugmentedJQuery) => {
                    var loadingRow = $compile(loadingRowTemplate)(scope);
                    var firstCell = element.children('td:first');
                    var toggleAnchor = $compile(toggleSpanTemplate)(scope);
                    if (firstCell.length > 0) {
                        element.children('td:first').prepend(toggleAnchor);
                    }
                    element.addClass('l' + scope.item.level);
                    element.on('DOMNodeInserted', ()=> {
                        firstCell = element.children('td:first');
                        var isAnchorPresent = firstCell.find(toggleAnchor).length > 0;
                        if (firstCell.length > 0 && !isAnchorPresent) {
                            setTimeout(()=> {
                                element.children('td:first').prepend(toggleAnchor);
                            }, 1);
                        }
                    });
                    scope.$watch('item.isLoading', () => {
                        if (scope.item.isLoading) {
                            element.after(loadingRow);
                        } else {
                            loadingRow.detach();
                        }
                    });
                }

            };
        }
    ]);
}