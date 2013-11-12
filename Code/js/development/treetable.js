/*! Gopp - v2.19.1 - 2013-11-12 11:17:57 */
;
angular.module("treetable", ["ngSanitize"]);
;
angular.module("treetable").controller("treetableCellController", ["$rootScope", "$scope", function ($rootScope, $scope) {
    $scope.toggleTreeTableRow = function (item) {
        $rootScope.$emit("treetableToggleRow", item);
    };
}]);
;
angular.module("treetable").controller("treetableController", ["$rootScope", "$scope", function ($rootScope, $scope) {
    /// <param name="$scope" type="Object"></param>
    function addItem(item) {
        /// <param name="item" type="Object"></param>
        $scope.processedItens = $scope.processedItens || [];
        item.hasTemplate = !!item.template;
        item.children = item.children || [];
        if (item.parentId === null) {
            item.isVisible = true;
            item.isExpanded = false;
            $scope.processedItens.push(item);
        }
        else {
            var parent = $scope.getItem(item.parentId);
            var found = false;
            item.isVisible = !!parent.isExpanded;
            for (var i = 0; i < $scope.processedItens.length; i++) {
                var processedItem = $scope.processedItens[i];
                if (processedItem.id == item.parentId) {
                    if (i === $scope.processedItens.length - 1) {
                        $scope.processedItens.push(item);
                    }
                    else {
                        $scope.processedItens.splice(i + 1, 0, item);
                    }
                    found = true;
                    break;
                }
            }
            if (!found) {
                $scope.processedItens.push(item);
            }
        }
        for (var j = 0; j < item.children.length; j++) {
            var childItem = item.children[j];
            addItem(childItem);
        }
    }

    function getItem(itemId) {
        /// <returns type="Object" />
        for (var i = 0; i < $scope.processedItens.length; i++) {
            var processedItem = $scope.processedItens[i];
            if (processedItem.id == itemId) {
                return processedItem;
            }
        }
        return null;
    }

    function toggleTreeTableRow(item) {
        for (var i = 0; i < $scope.processedItens.length; i++) {
            var subItem = $scope.processedItens[i];
            if (subItem.parentId == item.id) {
                subItem.isVisible = !subItem.isVisible;
            }
        }
        item.isExpanded = !item.isExpanded;
    }

    $scope.getItem = getItem;

    $rootScope.$on("treetableToggleRow", function (e, item) {
        toggleTreeTableRow(item);
    });

    $rootScope.$on("treetableAddItem", function (e, item) {
        addItem(item);
    });

    $rootScope.$emit("treetableReady");
}]);
;
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
;
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
;
angular.module("treetable").directive("ngTreetableRow", function () {
    return {
        restrict: "A",
        templateUrl: "treetablerow.html",
        scope: {
            item: "=item"
        }
    };
});
;
angular.module("treetable").filter("treetableRowFilter", function () {
    return function (itens) {
        var filtered = [];
        for (var i = 0; i < itens.length; i++) {
            var item = itens[i];
            if (item.isVisible) {
                filtered.push(item);
            }
        }
        return filtered;
    };
});