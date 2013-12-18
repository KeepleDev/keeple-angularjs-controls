/// <reference path="../../../3rd/jquery-2.0.3.js" />
angular.module('keeple.controls.tree-table').directive('treeTableRow', ['$compile', function ($compile) {
    var template = '<span data-ng-click="toggleRow(item)" data-ng-class="{\'glyphicon glyphicon-chevron-down collapse\': item.isExpanded && item.isParent, \'glyphicon glyphicon-chevron-right expand\': !item.isExpanded && item.isParent}" class="tree-table-toggle"></span>';
    var loadingRowTemplate = '<tr class="l{{item.level+1}} tree-table-loading"><td colspan="999"><span class="loading-animation"></span>Carregando</td></tr>';

    return {
        restrict: 'A',
        controller: 'tree-table.controller.row',
        scope: {
            item: '=treeTableRow'
        },
        link: function (scope, element) {
            var loadingRow = $compile(loadingRowTemplate)(scope);
            var firstCell = element.children('td:first');
            var toggleAnchor = $compile(template)(scope);
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
}]);