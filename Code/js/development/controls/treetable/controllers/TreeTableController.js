angular.module("treetable").controller("treeTableController", ["$rootScope", "$scope", function ($rootScope, $scope) {
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

    function processItens() {
        /// <param name="itens" type="Array"></param>
        $scope.processedItens = [];
        for (var i = 0; i < $scope.itens.length; i++) {
            var item = $scope.itens[i];
            addItem(item);
        }
    }

    $scope.getItem = getItem;
    $scope.toggleTreeTableRow = toggleTreeTableRow;
    $scope.addItem = addItem;
    $scope.processedItens = [];

    $scope.$watch("itens", function () {
        processItens();
    });

    $rootScope.$on("treetableAddItem", function (e, item) {
        addItem(item);
    });

    $rootScope.$emit("treetableReady");
}]);