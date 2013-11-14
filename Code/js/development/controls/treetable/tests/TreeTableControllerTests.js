/// <reference path="../../../3rd/jasmine.js" />
/// <reference path="../../../3rd/angular.js" />
/// <reference path="../../../3rd/angular-mocks.js" />
/// <reference path="../../../../../data/tests/itens.js" />
/* globals describe, it, getTestItens, beforeEach, expect, spyOn */
describe("TreeTable Controller", function () {
    var ctrl = {};
    var scope = { processedItens: [] };
    var testItens = getTestItens();

    beforeEach(angular.mock.module("treetable"));
    beforeEach(angular.mock.inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
        ctrl = $controller("treeTableController", { $scope: scope });
        testItens = getTestItens();
    }));

    it("should initialize with no processed itens", function () {
        expect(scope.processedItens.length).toBe(0);
    });

    it("should initialize with default value for options", function () {
        expect(scope.options).toBeDefined();
    });

    it("should add itens on processed list when itens are added", function () {
        var testItem = testItens[0];
        testItem.children = [];
        scope.itens = [testItem];
        scope.$apply();
        expect(scope.processedItens.length).toBe(1);
    });

    it("should add child itens on processed list when itens are added", function () {
        var testItem = testItens[0];
        var childItem = testItens[0].children[0];
        testItem.children = [];
        scope.itens = [testItem];
        scope.$apply();
        testItem.children = [childItem];
        scope.$apply();
        expect(scope.processedItens.length).toBe(2);
    });

    it("should add itens and descendants on processed list when itens are added", function () {
        var testItem = testItens[0];
        scope.itens = [testItem];
        scope.$apply();
        expect(scope.processedItens.length).toBe(4);
    });

    it("should add descendants on processed list after the parents", function () {
        var testItem = testItens[0];
        scope.itens = [testItem];
        scope.$apply();

        var parentItemIndex = scope.processedItens.indexOf(testItem);
        var childItemIndex = scope.processedItens.indexOf(testItem.children[0]);
        expect(parentItemIndex).toBeLessThan(childItemIndex);
    });

    it("should add itens on processed list according to original itens order", function () {
        var testItem = testItens[0];
        scope.itens = [testItem];
        scope.$apply();

        var firstChildItemIndex = scope.processedItens.indexOf(testItem.children[0]);
        var secondChildItemIndex = scope.processedItens.indexOf(testItem.children[1]);
        var thirdChildItemIndex = scope.processedItens.indexOf(testItem.children[2]);
        expect(firstChildItemIndex).toBe(secondChildItemIndex - 1);
        expect(secondChildItemIndex).toBe(thirdChildItemIndex - 1);
    });

    it("should not change order of itens in original object", function () {
        var testItem = testItens[0];
        var originalChildItem = testItem.children[0];
        scope.itens = [testItem];
        scope.$apply();

        expect(originalChildItem.id).toBe(testItem.children[0].id);
    });

    it("should set item level", function () {
        var testItem = testItens[0];
        scope.itens = [testItem];
        scope.$apply();
        expect(testItem.level).toBe(1);
    });

    it("should set child item level", function () {
        var testItem = testItens[0];
        scope.itens = [testItem];
        scope.$apply();
        expect(testItem.children[0].level).toBe(2);
    });

    it("should set root item to visible", function () {
        var testItem = testItens[0];
        scope.itens = [testItem];
        scope.$apply();
        expect(testItem.isVisible).toBeTruthy();
    });

    it("should set root item to not expanded if not defined", function () {
        var testItem = testItens[0];
        scope.itens = [testItem];
        scope.$apply();
        expect(testItem.isExpanded).toBe(false);
    });

    it("should not change root item expanded if defined", function () {
        var testItem = testItens[0];
        testItem.isExpanded = true;
        scope.itens = [testItem];
        scope.$apply();
        expect(testItem.isExpanded).toBe(true);
    });

    it("should set child item to visible if parent item is expanded", function () {
        var testItem = testItens[0];
        testItem.isExpanded = true;
        scope.itens = [testItem];
        scope.$apply();
        expect(testItem.children[0].isVisible).toBe(true);
    });

    it("should set child item to not visible if parent item is not expanded", function () {
        var testItem = testItens[0];
        testItem.isExpanded = true;
        scope.itens = [testItem];
        scope.$apply();
        testItem.isExpanded = false;
        scope.$apply();
        expect(testItem.children[0].isVisible).toBe(false);
    });

    it("should set item hasTemplate to false if template is falsy", function () {
        var testItem = testItens[0];
        scope.itens = [testItem];
        scope.$apply();
        expect(testItem.hasTemplate).toBe(false);
    });

    it("should set item hasTemplate to true if template is truthy", function () {
        var testItem = testItens[0];
        testItem.template = "Teste";
        scope.itens = [testItem];
        scope.$apply();
        expect(testItem.hasTemplate).toBe(true);
    });

    it("should set expanded to true on toggle if expanded is false", function () {
        var testItem = testItens[0];
        testItem.isExpanded = false;
        scope.itens = [testItem];
        scope.$apply();
        testItem.isExpanded = !testItem.isExpanded;
        scope.$apply();
        expect(testItem.isExpanded).toBe(true);
    });

    it("should set expanded to false on toggle if expanded is true", function () {
        var testItem = testItens[0];
        testItem.isExpanded = true;
        scope.itens = [testItem];
        scope.$apply();
        testItem.isExpanded = !testItem.isExpanded;
        scope.$apply();
        expect(testItem.isExpanded).toBe(false);
    });

    it("should set isLoading to true only while loading if lazyLoad is true", function () {
        var testItem = testItens[0];
        scope.options = { lazyLoad: true };
        scope.itens = [testItem];
        scope.$apply();
        scope.loadChildren = function (item, callback) {
            expect(testItem.isLoading).toBe(true);
            callback(true);
            expect(testItem.isLoading).toBe(false);
        };
        testItem.isExpanded = !testItem.isExpanded;
        scope.$apply();
    });

    it("should set isLoaded to true after done loading if lazyLoad is true", function () {
        var testItem = testItens[0];
        scope.options = { lazyLoad: true };
        scope.itens = [testItem];
        scope.$apply();
        scope.loadChildren = function (item, callback) {
            callback(true);
            expect(testItem.isLoaded).toBe(true);
        };
        spyOn(scope, "loadChildren").andCallThrough();
        testItem.isExpanded = !testItem.isExpanded;
        scope.$apply();
        expect(scope.loadChildren).toHaveBeenCalled();
    });

    it("should not call loadChildren on second expand if lazyLoad is true", function () {
        var testItem = testItens[0];
        scope.options = { lazyLoad: true };
        scope.itens = [testItem];
        scope.$apply();
        var loadChildrenCallCount = 0;
        scope.loadChildren = function (item, callback) {
            loadChildrenCallCount++;
            callback(true);
        };
        spyOn(scope, "loadChildren").andCallThrough();

        testItem.isExpanded = !testItem.isExpanded;
        scope.$apply();
        testItem.isExpanded = !testItem.isExpanded;
        scope.$apply();
        testItem.isExpanded = !testItem.isExpanded;
        scope.$apply();
        expect(scope.loadChildren).toHaveBeenCalled();
        expect(loadChildrenCallCount).toBe(1);
    });

    it("should not change isExpanded on children if parentItem isExpanded changes", function () {
        var testItem = testItens[0];
        testItem.isExpanded = true;
        testItem.children[0].isExpanded = true;
        scope.itens = [testItem];
        scope.$apply();
        testItem.isExpanded = false;
        scope.$apply();
        expect(testItem.children[0].isExpanded).toBe(true);
    });
});