var KeepleControls;
(function (KeepleControls) {
    (function (TreeTable) {
        angular.module('keeple.controls.tree-table').controller('tree-table.controller.row', [
            '$scope',
            function ($scope) {
                $scope.toggleRow = function (item) {
                    item.isExpanded = !item.isExpanded;
                };
            }
        ]);
    })(KeepleControls.TreeTable || (KeepleControls.TreeTable = {}));
    var TreeTable = KeepleControls.TreeTable;
})(KeepleControls || (KeepleControls = {}));
//# sourceMappingURL=tree-table.controller.row.js.map
