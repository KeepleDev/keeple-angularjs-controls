/// <reference path="../../../3rd/jasmine.js" />
/// <reference path="../../../3rd/angular.js" />
/// <reference path="../../../3rd/angular-mocks.js" />
/// <reference path="../../../../../data/tests/itens.js" />
/* globals describe, it, beforeEach, expect */
describe("TreeTable Controller", function () {
    var filter = function () { };
    var scope = { processedItens: [] };

    beforeEach(angular.mock.module("keeple.controls.treeTable"));
    beforeEach(angular.mock.inject(function ($rootScope, $filter) {
        scope = $rootScope.$new();
        filter = $filter;
    }));

    it("should return only visible itens", function () {
        var testItens = [{
            id: 1,
            isVisible: true
        }, {
            id: 2,
            isVisible: false
        }, {
            id: 3,
            isVisible: true
        }];
        var processedItens = filter("treetableRowFilter")(testItens);
        expect(processedItens.length).toBe(2);
    });

    it("should return filtered itens in the same order as the input itens", function () {
        var testItens = [{
            id: 1,
            isVisible: true
        }, {
            id: 2,
            isVisible: false
        }, {
            id: 3,
            isVisible: true
        }];
        var processedItens = filter("treetableRowFilter")(testItens);
        expect(processedItens[0].id).toBe(1);
        expect(processedItens[1].id).toBe(3);
    });
});