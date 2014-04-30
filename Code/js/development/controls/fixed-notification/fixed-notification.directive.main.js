angular.module('keeple.controls.fixed-notification').directive('fixedNotification', [
        '$interval',
        'fixed-notification.service.helper',
        function ($interval, fixedNotificationHelper) {
            var template = '<div class="fixed-notification"><ul><li class="fixed-notification-repeat" data-ng-repeat="notification in notifications" data-fixed-notification-message="" data-notification="notification" data-close-notification="closeNotification"></li></ul></div>';
            return {
                restrict: 'A',
                replace: true,
                template: template,
                link: function (scope, element) {
                    scope.notifications = [];

                    fixedNotificationHelper.addNotification = function (notification) {
                        $('.modal:visible').length > 0 ? element.addClass('full') : element.removeClass('full');

                        scope.notifications[0] = notification;
                    };

                    scope.closeNotification = function (notification) {
                        var indexOfNotification = scope.notifications.indexOf(notification);
                        if (indexOfNotification >= 0) {
                            scope.notifications.splice(indexOfNotification, 1);
                        }
                    };

                    window.onbeforeunload = function () {
                        $('.fixed-notification').remove();
                    };
                }
            };
        }
    ]
);