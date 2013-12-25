angular.module('keeple.controls.tree-table').directive('treeTableRow', [
    '$compile',
    '$templateCache',
    function ($compile, $templateCache) {
        var toggleSpanTemplate = $templateCache.get('tree-table/templates/toggle-span.tpl.html');
        var loadingRowTemplate = $templateCache.get('tree-table/templates/loading-row.tpl.html');

        return {
            restrict: 'A',
            controller: 'tree-table.controller.row',
            scope: {
                item: '=treeTableRow'
            },
            link: function (scope, element) {
                var loadingRow = $compile(loadingRowTemplate)(scope);
                var firstCell = element.children('td:first');
                var toggleAnchor = $compile(toggleSpanTemplate)(scope);
                if (firstCell.length > 0) {
                    element.children('td:first').prepend(toggleAnchor);
                }
                element.addClass('l' + scope.item.level);
                element.on('DOMNodeInserted', function addToggleAnchor() {
                    firstCell = element.children('td:first');
                    var isAnchorPresent = firstCell.find(toggleAnchor).length > 0;
                    if (firstCell.length > 0 && !isAnchorPresent) {
                        setTimeout(function () {
                            element.children('td:first').prepend(toggleAnchor);
                        }, 1);
                    }
                });
                scope.$watch('item.isLoading', function () {
                    if (scope.item.isLoading) {
                        element.after(loadingRow);
                    }
                    else {
                        loadingRow.detach();
                    }
                });
            }

        };
    }
]);