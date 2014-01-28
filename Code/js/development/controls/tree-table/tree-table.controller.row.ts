module KeepleControls.TreeTable {
    angular.module('keeple.controls.tree-table').controller('tree-table.controller.row', [
        '$scope',
        function ($scope: ITreeTableRowController) {
            $scope.toggleRow = function (item: ITreeTableItem) {
                item.isExpanded = !item.isExpanded;
            };
        }
    ]);
}