angular.module("keeple.controls.treeTable").directive("treeTable", function () {
    var template = "<table data-ng-controller=\"treeTableController\" class=\"tree-table\" data-ng-class=\"treeTableClass\">";
    template += "<thead>";
    template += "<tr data-ng-repeat=\"line in headerLines\">";
    template += "<th data-ng-repeat=\"column in line.columns\" colspan=\"{{column.colspan}}\" data-ng-class=\"column.class\">";
    template += "<a data-ng-if=\"column.isSortable\" href=\"javascript:void()\" data-ng-click=\"sort($index)\" data-ng-bind=\"column.value\"></a>";
    template += "<span data-ng-if=\"column.isSortable && sortColumnIndex == $index\" data-ng-class=\"{true: 'sort-asc' , false: 'sort-desc'}[sortAsc]\" class=\"tree-table-sort\"></span>";
    template += "<span data-ng-if=\"!column.isSortable\" data-ng-bind=\"column.value\"></span>";
    template += "</th>";
    template += "</tr>";
    template += "</thead>";
    template += "<tbody>";
    template += "<tr data-ng-tree-table-row=\"\" data-ng-repeat-start=\"item in (processedItens | treetableRowFilter)\" data-item=\"item\" class=\"l{{item.level}}\">";
    template += "</tr>";
    template += "<tr data-ng-repeat-end=\"\" data-ng-if=\"item.isLoading\" class=\"l{{item.level+1}} tree-table-loading\">";
    template += "<td colspan=\"999\">";
    template += "<span class=\"loading-animation\"></span>Carregando";
    template += "</td>";
    template += "</tr>";
    template += "</tbody>";
    template += "</table>";

    return {
        restrict: "A",
        controller: "treeTableController",
        scope: {
            treeTable: "=treeTable"
        }
    };
});