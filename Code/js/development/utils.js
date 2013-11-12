function namespace(namespaceString) {
    var parts = namespaceString.split("."),
        parent = window,
        currentPart = "";

    for (var i = 0, length = parts.length; i < length; i++) {
        currentPart = parts[i];
        if (!parent[currentPart]) {
            //console.log("Definindo namespace: " + currentPart);
        }
        parent[currentPart] = parent[currentPart] || {};
        parent = parent[currentPart];
    }

    return parent;
}

(function (utils, $, undefined) {

}(namespace("treetable.utils"), jQuery));