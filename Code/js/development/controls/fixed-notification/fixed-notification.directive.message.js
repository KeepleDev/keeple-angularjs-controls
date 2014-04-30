angular.module('keeple.controls.fixed-notification').directive('fixedNotificationMessage',
    ['$timeout', 'fixed-notification.service.helper',
        function ($timeout, fixedNotificationHelper) {
            var template = '<div class="fixed-notification-message-{{notification.type}}"><span class="fixed-notification-message-icon glyphicon glyphicon-{{notification.type}}"></span><span class="fixed-notification-message-text" data-ng-bind-html="notification.message"></span><a class="fixed-notification-close-button" data-ng-click="closeNotification(notification)"></a></div>';
            return {
                restrict: 'A',
                replace: true,
                scope: {
                    notification: '=',
                    closeNotification: '='
                },
                template: template,
                link: function (scope, element) {
                    var timeOutId;
                    var timeOut = 3000;
                    if (scope.notification.type == fixedNotificationHelper.notificationTypes.SUCCESS) {
                        if (document.hasFocus()) {
                            timeOutId = $timeout(function () {
                                scope.closeNotification(scope.notification);
                            }, timeOut);
                        } else {
                            $(document).on('focus', function () {
                                timeOutId = $timeout(function () {
                                    scope.closeNotification(scope.notification);
                                }, timeOut);
                            });
                        }
                    }
                    element.on('mouseover', function () {
                        if (timeOutId) {
                            $timeout.cancel(timeOutId);
                        }
                    });
                }
            };
        }
    ]
);