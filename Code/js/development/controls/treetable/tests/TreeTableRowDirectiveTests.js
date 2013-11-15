/// <reference path="../../../3rd/jasmine.js" />
/// <reference path="../../../3rd/angular.js" />
/// <reference path="../../../3rd/angular-mocks.js" />
/// <reference path="../../../../../data/tests/itens.js" />
/* globals describe, it, getTestItens, beforeEach, expect */
describe("TreeTable Directive", function () {
    var scope = { processedItens: [] };
    var compile = {};
    var testItens = getTestItens();

    var template = "<tr data-ng-tree-table-row=\"\" data-item=\"item\"></tr>";

    var treeTableRowTemplate = "<td data-ng-repeat=\"column in item.columns\" colspan=\"{{column.colspan}}\" data-ng-tree-table-cell-template=\"\" data-item=\"item\" data-item-column=\"column\" >";
    treeTableRowTemplate = treeTableRowTemplate + "<a data-ng-if=\"$first && item.isParent\" href=\"#\" data-ng-click=\"item.isExpanded = !item.isExpanded\" data-ng-class=\"{true:'collapse', false:'expand'}[item.isExpanded]\" class=\"treetable-toggle\"></a>";
    treeTableRowTemplate = treeTableRowTemplate + "</td>";

    beforeEach(angular.mock.module("treetable"));
    beforeEach(angular.mock.inject(function ($rootScope, $controller, $compile, $templateCache) {
        scope = $rootScope.$new();
        scope.item = testItens[0];
        compile = $compile;
        $templateCache.put("js/development/controls/treetable/templates/treetablerow.html", treeTableRowTemplate);
    }));

    it("should add the same number of cells as the number of item columns", function () {
        var element = compile(template)(scope);
        scope.$digest();
        expect(element.find("td").length).toBe(1);

        scope.item = testItens[0].children[1];
        element = compile(template)(scope);
        scope.$digest();
        expect(element.find("td").length).toBe(4);
    });

    it("should add an expand/collapse anchor in first cell if item is parent", function () {
        var element = compile(template)(scope);
        scope.$digest();
        expect(element.find("td:first a.treetable-toggle").length).toBe(1);
    });

    it("should not add an expand/collapse anchor in cellS that are not the first", function () {
        scope.item.columns.push(testItens[1].columns);
        var element = compile(template)(scope);
        scope.$digest();
        expect(element.find("td:eq(1) a.treetable-toggle").length).toBe(0);
    });

    it("should add an collapse class if item is expanded", function () {
        scope.item.isExpanded = true;
        var element = compile(template)(scope);
        scope.$digest();
        expect(element.find("td:first a.treetable-toggle.collapse").length).toBe(1);
    });

    it("should add an expand class if item is not expanded", function () {
        scope.item.isExpanded = false;
        var element = compile(template)(scope);
        scope.$digest();
        expect(element.find("td:first a.treetable-toggle.expand").length).toBe(1);
    });
});