module KeepleControls.TreeTable {
    angular.module('keeple.controls.tree-table').directive('treeTable', () => {
        return {
            restrict: 'A',
            controller: 'tree-table.controller.main',
            scope: {
                treeTable: '=options'
            }
        };
    });
}