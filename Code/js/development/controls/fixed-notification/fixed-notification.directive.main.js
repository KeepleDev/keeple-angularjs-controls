angular.module('keeple.controls.fixed-notification').directive('fixedNotification',
    ['$interval', 'fixed-notification.service.helper',
        function ($interval, fixedNotificationHelper) {
            var template = '<div class="pas alert panel-primary fixed-notification" data-ng-if="notifications.length > 0"><ul><li class="fixed-notification-repeat" data-ng-repeat="notification in notifications" data-fixed-notification-message="" data-notification="notification" data-close-notification="closeNotification"></li></ul></div>';
            return {
                restrict: 'A',
                replace: true,
                template: template,
                link: function (scope) {
                    var notificationTimeout = 3000;
                    scope.notifications = [];

                    fixedNotificationHelper.addNotification = function (notification) {
                        scope.notifications.push(notification);
                    };

                    scope.closeNotification = function (notification) {
                        var indexOfNotification = scope.notifications.indexOf(notification);
                        if (indexOfNotification >= 0) {
                            scope.notifications.splice(indexOfNotification, 1);
                        }
                    };

                    $interval(function checkNotifications() {
                        var changed = false;
                        for (var index in scope.notifications) {
                            var notification = scope.notifications[index];
                            if (notification.timeStamp !== null && notification.timeStamp < new Date() - notificationTimeout) {
                                scope.closeNotification(notification);
                                changed = true;
                            }
                        }
                        if (changed) {
                            if (!scope.$$phase) {
                                scope.$apply();
                            }
                        }
                    }, 200, 0, false);
                }
            };
        }
    ]
);