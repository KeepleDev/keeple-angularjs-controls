angular.module("treetable").directive("ngTreetable", function () {
    return {
        restrict: "A",
        templateUrl: "treetable.html",
        scope: {
            processedItens: "=itens",
            columns: "=columns",
            options: "=options"
        }
    };
});