var KeepleControls;
(function (KeepleControls) {
    (function (TreeTable) {
        /* Arquivo gerado automaticamente pelo grunt, nao altere.
        * Para modificar os templates altere os arquivos *.tpl.html.
        */
        angular.module('templates-tree-table', ['tree-table/templates/loading-row.tpl.html', 'tree-table/templates/toggle-span.tpl.html']);

        angular.module('tree-table/templates/loading-row.tpl.html', []).run([
            '$templateCache', function ($templateCache) {
                $templateCache.put('tree-table/templates/loading-row.tpl.html', '<tr class="l{{item.level+1}} tree-table-loading">\n' + '    <td colspan="999"><span class="loading-animation"></span>Carregando</td>\n' + '</tr>\n' + '');
            }
        ]);

        angular.module('tree-table/templates/toggle-span.tpl.html', []).run([
            '$templateCache', function ($templateCache) {
                $templateCache.put('tree-table/templates/toggle-span.tpl.html', '<span\n' + '    data-ng-click="toggleRow(item)"\n' + '    data-ng-class="{\'glyphicon glyphicon-chevron-down collapse\': item.isExpanded && item.isParent, \'glyphicon glyphicon-chevron-right expand\': !item.isExpanded && item.isParent}"\n' + '    class="tree-table-toggle"></span>');
            }
        ]);
    })(KeepleControls.TreeTable || (KeepleControls.TreeTable = {}));
    var TreeTable = KeepleControls.TreeTable;
})(KeepleControls || (KeepleControls = {}));
//# sourceMappingURL=tree-table.templates.js.map
