var KeepleControls;
(function (KeepleControls) {
    (function (TreeTable) {
        angular.module('keeple.controls.tree-table').directive('treeTable', function () {
            return {
                restrict: 'A',
                controller: 'tree-table.controller.main',
                scope: {
                    treeTable: '=options'
                }
            };
        });
    })(KeepleControls.TreeTable || (KeepleControls.TreeTable = {}));
    var TreeTable = KeepleControls.TreeTable;
})(KeepleControls || (KeepleControls = {}));
//# sourceMappingURL=tree-table.directive.main.js.map
