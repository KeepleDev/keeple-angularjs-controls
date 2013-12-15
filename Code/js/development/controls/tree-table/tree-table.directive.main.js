angular.module('keeple.controls.tree-table').directive('treeTable', function () {
    return {
        restrict: 'A',
        controller: 'tree-table.controller.main',
        scope: {
            treeTable: '=options'
        }
    };
});