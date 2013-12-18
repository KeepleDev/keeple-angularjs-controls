/// <reference path="../3rd/angular.js" />
angular.module('project', ['keeple.controls.fixed-notification', 'ngSanitize']).controller('project.controller.fixed-notification.main',
    ['$scope', 'fixed-notification.service.helper',
        function ($scope, fixedNotificationHelper) {
            /// <param name="$scope" type="Object"></param>

            $scope.type = 'success';

            $scope.sendNotification = function () {
                fixedNotificationHelper.showNotifcation($scope.message, $scope.type);
            };
        }
    ]);