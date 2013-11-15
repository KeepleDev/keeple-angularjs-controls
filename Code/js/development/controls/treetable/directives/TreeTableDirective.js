angular.module("treetable").directive("ngTreeTable", function () {
    return {
        restrict: "A",
        templateUrl: "templates/treetable.html",
        scope: {
            itens: "=itens",
            columns: "=columns",
            options: "=options",
            loadChildren: "=loadChildren",
            treeTableClass: "=treeTableClass"
        }
    };
});