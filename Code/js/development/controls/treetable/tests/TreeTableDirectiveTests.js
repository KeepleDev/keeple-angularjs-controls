/// <reference path="../../../3rd/jasmine.js" />
/// <reference path="../../../3rd/angular.js" />
/// <reference path="../../../3rd/angular-mocks.js" />
/// <reference path="../../../../../data/tests/itens.js" />
/* globals describe, it, getTestItens, beforeEach, expect */
describe("TreeTable Directive", function () {
    var scope = { processedItens: [] };
    var compile = {};
    var testItens = getTestItens();

    var template = "";
    template += "<table data-tree-table=\"treeTable\" class=\"tree-table table table-bordered\">";
    template += "<thead>";
    template += "<tr>";
    template += "<th>Fabricante/Celular</th>";
    template += "<th>Ano de Fabricação</th>";
    template += "<th>CPU</th>";
    template += "<th>Memoria</th>";
    template += "</tr>";
    template += "</thead>";
    template += "<tbody>";
    template += "<tr data-ng-repeat=\"item in treeTable.processedItens\" data-tree-table-row=\"item\" data-ng-switch=\"item.tipo\" class=\"l{{item.level}}\">";
    template += "<td colspan=\"4\" data-ng-switch-when=\"Fabricante\">{{item.nome}}</td>";
    template += "<td data-ng-switch-when=\"Celular\">{{item.nome}}</td>";
    template += "<td data-ng-switch-when=\"Celular\">{{item.ano}}</td>";
    template += "<td data-ng-switch-when=\"Celular\">{{item.cpu}}</td>";
    template += "<td data-ng-switch-when=\"Celular\">{{item.memoria}}</td>";
    template += "</tr>";
    template += "</tbody>";
    template += "</table>";


    beforeEach(angular.mock.module("keeple.controls.treeTable"));
    beforeEach(angular.mock.inject(function ($rootScope, $controller, $compile) {
        scope = $rootScope.$new();
        scope.treeTable = {};
        scope.treeTable.itens = testItens;
        compile = $compile;
    }));

    it("should add the same number of root rows as the number root itens", function () {
        var element = compile(template)(scope);
        scope.$digest();
        expect(element.find("tbody > tr").length).toBe(2);
    });

    it("should add the same number of child rows as the number child itens when item is expanded", function () {
        var element = compile(template)(scope);
        scope.$digest();
        scope.treeTable.itens[0].isExpanded = true;
        scope.$digest();
        expect(element.find("tbody > tr").length).toBe(5);
    });

    it("should remove the same number of child rows as the number child itens when item is collapsed", function () {
        scope.treeTable.itens[0].isExpanded = true;
        var element = compile(template)(scope);
        scope.$digest();
        scope.treeTable.itens[0].isExpanded = false;
        scope.$digest();
        expect(element.find("tbody > tr").length).toBe(2);
    });
});