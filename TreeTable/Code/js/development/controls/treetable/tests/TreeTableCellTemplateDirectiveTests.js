/// <reference path="../../../3rd/jasmine.js" />
/// <reference path="../../../3rd/angular.js" />
/// <reference path="../../../3rd/angular-mocks.js" />
/// <reference path="../../../../../data/tests/itens.js" />
/* globals describe, it, getTestItens, beforeEach, expect */
describe("TreeTable Cell Template Directive", function () {
    var scope = { processedItens: [] };
    var compile = {};
    var testItem = getTestItens()[0].children[0];

    beforeEach(angular.mock.module("keeple.controls.treeTable"));
    beforeEach(angular.mock.inject(function ($rootScope, $controller, $compile) {
        scope = $rootScope.$new();
        testItem = getTestItens()[0].children[0];
        compile = $compile;
    }));

    it("should add the template to the code", function () {
        scope.item = testItem;
        scope.column = testItem.columns[0];
        var element = compile("<div data-ng-tree-table-cell-template='' data-item='item' data-item-column='column' class='template'></div>")(scope);
        scope.$digest();
        expect(element.find("span").length).toBe(1);
    });

    it("should bind the template to the code", function () {
        scope.item = testItem;
        scope.column = testItem.columns[0];
        var element = compile("<div data-ng-tree-table-cell-template='' data-item='item' data-item-column='column' class='template'></div>")(scope);
        scope.$digest();
        expect(element.find("span").text()).toBe("Moto X™");
    });

    it("should add the column value when there is no template", function () {
        scope.item = testItem;
        scope.column = testItem.columns[0];
        scope.column.hasTemplate = false;
        var element = compile("<div data-ng-tree-table-cell-template='' data-item='item' data-item-column='column' class='template'></div>")(scope);
        scope.$digest();
        expect(element.text()).toBe("Moto X™");
    });

});