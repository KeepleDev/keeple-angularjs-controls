/* Arquivo gerado automaticamente pelo grunt, nao altere.
 * Para modificar os templates altere os arquivos *.tpl.html.
*/
angular.module('templates-pagination', ['pagination/templates/pagination.main.tpl.html']);

angular.module('pagination/templates/pagination.main.tpl.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('pagination/templates/pagination.main.tpl.html',
    '<ul class="pagination">\n' +
    '    <li class="previous">\n' +
    '        <a href="#" data-ng-click="prevClick();$event.preventDefault();">\n' +
    '            <span><i class="fui-arrow-left"></i>{{prevText}}</span>\n' +
    '        </a>\n' +
    '    </li>\n' +
    '    <li class="next">\n' +
    '        <a href="#" data-ng-click="nextClick();$event.preventDefault();">\n' +
    '            <span>{{nextText}}<i class="fui-arrow-right"></i></span>\n' +
    '        </a>\n' +
    '    </li>\n' +
    '</ul>\n' +
    '');
}]);
