/// <reference path="../../../3rd/jasmine.js" />
/// <reference path="../../../3rd/angular.js" />
/// <reference path="../../../3rd/angular-mocks.js" />
/// <reference path="../../../../../data/tests/itens.js" />
/* globals describe, it, getTestItens, beforeEach, expect */
describe("TreeTable Row Directive", function () {
    var scope = { processedItens: [] };
    var compile = {};
    var testItens = getTestItens();

    var template = "<tr data-tree-table-row=\"item\">";
    template += "<td>{{item.nome}}</td>";
    template += "<td>{{item.ano}}</td>";
    template += "<td>{{item.cpu}}</td>";
    template += "<td>{{item.memoria}}</td>";
    template += "</tr>";

    beforeEach(angular.mock.module("keeple.controls.treeTable"));
    beforeEach(angular.mock.inject(function ($rootScope, $controller, $compile) {
        scope = $rootScope.$new();
        scope.item = testItens[0];
        compile = $compile;
    }));

    it("should add an expand/collapse anchor in first cell if item is parent", function () {
        var element = compile(template)(scope);
        scope.$digest();
        expect(element.find("td:first a.tree-table-toggle").length).toBe(1);
    });

    it("should not add an expand/collapse anchor in cells that are not the first", function () {
        scope.item.columns.push(testItens[1].columns);
        var element = compile(template)(scope);
        scope.$digest();
        expect(element.find("td:eq(1) a.tree-table-toggle").length).toBe(0);
    });

    it("should add an collapse class if item is expanded", function () {
        scope.item.isExpanded = true;
        var element = compile(template)(scope);
        scope.$digest();
        expect(element.find("td:first a.tree-table-toggle.collapse").length).toBe(1);
    });

    it("should add an expand class if item is not expanded", function () {
        scope.item.isExpanded = false;
        var element = compile(template)(scope);
        scope.$digest();
        expect(element.find("td:first a.tree-table-toggle.expand").length).toBe(1);
    });
});