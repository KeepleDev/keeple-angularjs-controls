/// <reference path="../../../3rd/jasmine.js" />
/// <reference path="../../../3rd/angular.js" />
/// <reference path="../../../3rd/angular-mocks.js" />
/// <reference path="../../../../../data/tests/itens.js" />
/* globals describe, it, getTestItens, beforeEach, expect */
describe("TreeTable Directive", function () {
    var scope = { processedItens: [] };
    var compile = {};
    var testItens = getTestItens();

    var template = "<div data-ng-tree-table=\"\" data-itens=\"treetable.itens\" data-columns=\"treetable.columns\" data-options=\"treetable.options\" data-load-children=\"treetable.loadChildren\" data-tree-table-class=\"'table table-bordered'\"></div>";

    var treeTableTemplate = "<table data-ng-controller=\"treeTableController\" class=\"treetable\" data-ng-class=\"treeTableClass\">";
    treeTableTemplate = treeTableTemplate + "<thead>";
    treeTableTemplate = treeTableTemplate + "<tr>";
    treeTableTemplate = treeTableTemplate + "<th data-ng-repeat=\"column in columns\">";
    treeTableTemplate = treeTableTemplate + "<a href=\"#\" data-ng-click=\"sort($index)\" data-ng-bind=\"column\"></a>";
    treeTableTemplate = treeTableTemplate + "<span data-ng-if=\"sortColumnIndex == $index\" data-ng-class=\"{true: 'sort-asc' , false: 'sort-desc'}[sortAsc]\" class=\"sort\"></span>";
    treeTableTemplate = treeTableTemplate + "</th>";
    treeTableTemplate = treeTableTemplate + "</tr>";
    treeTableTemplate = treeTableTemplate + "</thead>";
    treeTableTemplate = treeTableTemplate + "<tbody>";
    treeTableTemplate = treeTableTemplate + "<tr data-ng-tree-table-row=\"\" data-ng-repeat-start=\"item in (processedItens | treetableRowFilter)\" data-item=\"item\" class=\"l{{item.level}}\">";
    treeTableTemplate = treeTableTemplate + "</tr>";
    treeTableTemplate = treeTableTemplate + "<tr data-ng-repeat-end=\"\" data-ng-if=\"item.isLoading\" class=\"l{{item.level+1}} loading\">";
    treeTableTemplate = treeTableTemplate + "<td colspan=\"999\">Carregando";
    treeTableTemplate = treeTableTemplate + "</td>";
    treeTableTemplate = treeTableTemplate + "</tr>";
    treeTableTemplate = treeTableTemplate + "</tbody>";
    treeTableTemplate = treeTableTemplate + "</table>";

    var treeTableRowTemplate = "<td data-ng-repeat=\"column in item.columns\" colspan=\"{{column.colspan}}\" data-ng-tree-table-cell-template=\"\" data-item=\"item\" data-item-column=\"column\" >";
    treeTableRowTemplate = treeTableRowTemplate + "<a data-ng-if=\"$first && item.isParent\" href=\"#\" data-ng-click=\"item.isExpanded = !item.isExpanded\" data-ng-class=\"{true:'collapse', false:'expand'}[item.isExpanded]\" class=\"treetable-toggle\"></a>";
    treeTableRowTemplate = treeTableRowTemplate + "</td>";


    beforeEach(angular.mock.module("treetable"));
    beforeEach(angular.mock.inject(function ($rootScope, $controller, $compile, $templateCache) {
        scope = $rootScope.$new();
        scope.treetable = {};
        scope.treetable.columns = ["Coluna1", "Coluna2"];
        scope.treetable.itens = testItens;
        compile = $compile;
        $templateCache.put("js/development/controls/treetable/templates/treetable.html", treeTableTemplate);
        $templateCache.put("js/development/controls/treetable/templates/treetablerow.html", treeTableRowTemplate);
    }));

    it("should add the same number of header cells as the number columns", function () {
        var element = compile(template)(scope);
        scope.$digest();
        expect(element.find("th").length).toBe(2);
    });

    it("should add the same number of root rows as the number root itens", function () {
        var element = compile(template)(scope);
        scope.$digest();
        expect(element.find("tbody > tr").length).toBe(2);
    });

    it("should add the same number of child rows as the number child itens when item is expanded", function () {
        var element = compile(template)(scope);
        scope.$digest();
        scope.treetable.itens[0].isExpanded = true;
        scope.$digest();
        expect(element.find("tbody > tr").length).toBe(5);
    });

    it("should remove the same number of child rows as the number child itens when item is collapsed", function () {
        scope.treetable.itens[0].isExpanded = true;
        var element = compile(template)(scope);
        scope.$digest();
        scope.treetable.itens[0].isExpanded = false;
        scope.$digest();
        expect(element.find("tbody > tr").length).toBe(2);
    });
});