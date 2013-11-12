angular.module("treetable").directive("ngTreetableCellTemplate", function ($compile) {
    return {
        restrict: "A",
        scope: {
            item: "=item",
            itemColumn: "=itemColumn"
        },
        link: function (scope, element) {
            if (scope.itemColumn.hasTemplate) {
                var html = scope.itemColumn.template;
                var e = $compile(html)(scope);
                element.replaceWith(e);
            }
        }
    };
});