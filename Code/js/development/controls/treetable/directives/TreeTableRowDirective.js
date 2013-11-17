angular.module("keeple.controls.treeTable").directive("ngTreeTableRow", function () {
    var template = "<td data-ng-repeat=\"column in item.columns\" colspan=\"{{column.colspan}}\" data-ng-tree-table-cell-template=\"\" data-item=\"item\" data-item-column=\"column\" >";
    template += "<a data-ng-if=\"$first\" data-ng-click=\"item.isExpanded = !item.isExpanded\" data-ng-class=\"{collapse: item.isExpanded && item.isParent, expand: !item.isExpanded && item.isParent}\" class=\"tree-table-toggle\"></a>";
    template += "</td>";

    return {
        restrict: "A",
        template: template,
        scope: {
            item: "=item"
        }
    };
});