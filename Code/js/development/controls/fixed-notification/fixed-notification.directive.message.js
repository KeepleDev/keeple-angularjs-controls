angular.module('keeple.controls.fixed-notification').directive('fixedNotificationMessage', [
    '$timeout',
    'fixed-notification.service.helper',
    '$templateCache',
    function ($timeout, fixedNotificationHelper, $templateCache) {
        var template = $templateCache.get('fixed-notification/templates/fixed-notification.message.tpl.html');
        return {
            restrict: 'A',
            replace: true,
            scope: {
                notification: '=',
                closeNotification: '='
            },
            template: template,
            link: function (scope, element) {
                var timeoutId;

                if (scope.notification.type == fixedNotificationHelper.notificationTypes.ERROR) {
                    scope.messageType = 'danger';
                }
                else if (scope.notification.type == fixedNotificationHelper.notificationTypes.SUCCESS) {
                    scope.messageType = 'primary';
                    if (document.hasFocus()) {
                        timeoutId = $timeout(function () {
                            scope.closeNotification(scope.notification);
                        }, 3000);
                    } else {
                        document.on('focus', function () {
                            timeoutId = $timeout(function () {
                                scope.closeNotification(scope.notification);
                            }, 3000);
                        });
                    }
                } else {
                    scope.messageType = scope.notification.type;
                }
                element.on('mouseover', function () {
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                    }
                });
            }
        };
    }
]);