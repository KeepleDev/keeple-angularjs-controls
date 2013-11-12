angular.module("treetable").directive("ngTreeTable", function () {
    return {
        restrict: "A",
        templateUrl: "treetable.html",
        scope: {
            itens: "=itens",
            columns: "=columns",
            options: "=options"
        }
    };
});