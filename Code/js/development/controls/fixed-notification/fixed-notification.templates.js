/* Arquivo gerado automaticamente pelo grunt, nao altere.
 * Para modificar os templates altere os arquivos *.tpl.html.
*/
angular.module('templates-fixed-notification', ['fixed-notification/templates/fixed-notification.main.tpl.html', 'fixed-notification/templates/fixed-notification.message.tpl.html']);

angular.module('fixed-notification/templates/fixed-notification.main.tpl.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('fixed-notification/templates/fixed-notification.main.tpl.html',
    '<div class="pas alert panel-primary fixed-notification" \n' +
    '     data-ng-if="notifications.length > 0">\n' +
    '    <ul>\n' +
    '        <li class="fixed-notification-repeat" \n' +
    '            data-ng-repeat="notification in notifications" \n' +
    '            data-fixed-notification-message="" \n' +
    '            data-notification="notification" data-close-notification="closeNotification"></li>\n' +
    '    </ul>\n' +
    '</div>');
}]);

angular.module('fixed-notification/templates/fixed-notification.message.tpl.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('fixed-notification/templates/fixed-notification.message.tpl.html',
    '<div class="pvs mas alert alert-{{notification.type}} fixed-notification-message-{{notification.type}}">\n' +
    '    <span class="fixed-notification-message-text text-{{messageType}}"\n' +
    '        data-ng-bind-html="notification.message"></span>\n' +
    '    <button class="close fui-cross" data-ng-click="closeNotification(notification)"></button>\n' +
    '</div>\n' +
    '');
}]);
