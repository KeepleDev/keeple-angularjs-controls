angular.module('keeple.controls.fixed-notification').directive('fixedNotificationMessage',
    ['$timeout', 'fixed-notification.service.helper',
        function ($timeout, fixedNotificationHelper) {
            var template = '<div class="fixed-notification-message-{{notification.type}}"><span class="fixed-notification-message-icon"></span><span class="fixed-notification-message-text">{{notification.message}}</span><a class="fixed-notification-close-button" data-ng-click="closeNotification(notification)"></a></div>';
            return {
                restrict: 'A',
                replace: true,
                scope: {
                    notification: '=',
                    closeNotification: '='
                },
                template: template,
                link: function (scope, element) {
                    if (scope.notification.type == fixedNotificationHelper.notificationTypes.SUCCESS) {
                        if (document.hasFocus()) {
                            $timeout(function() {
                                scope.closeNotification(scope.notification);
                            }, 3000);
                        } else {
                            document.on('focus', function () {
                                $timeout(function () {
                                    scope.closeNotification(scope.notification);
                                }, 3000);
                            });
                        }
                    }
                    element.on('mouseover', function () {
                        scope.notification.timeStamp = null;
                    });
                }
            };
        }
    ]
);