angular.module("treetable").directive("ngTreeTable", function () {
    return {
        restrict: "A",
        templateUrl: "js/development/controls/treetable/templates/treetable.html",
        scope: {
            itens: "=itens",
            columns: "=columns",
            options: "=options",
            loadChildren: "=loadChildren"
        }
    };
});