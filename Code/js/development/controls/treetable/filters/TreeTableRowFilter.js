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