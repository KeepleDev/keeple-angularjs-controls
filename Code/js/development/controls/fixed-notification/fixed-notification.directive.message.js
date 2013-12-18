angular.module('keeple.controls.fixed-notification').directive('fixedNotificationMessage',
    ['$timeout', 'fixed-notification.service.helper',
        function ($timeout, fixedNotificationHelper) {
            var template = '<div class="pvs mas alert alert-{{notification.type}} fixed-notification-message-{{notification.type}}"><span class="fixed-notification-message-text text-{{messageType}}" ng-bind-html="notification.message"></span><button class="close fui-cross" data-ng-click="closeNotification(notification)"></button></div>';
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
                            timeoutId = $timeout(function() {
                                scope.closeNotification(scope.notification);
                            }, 3000);
                        } else {
                            document.on('focus', function() {
                                timeoutId = $timeout(function() {
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
    ]
);