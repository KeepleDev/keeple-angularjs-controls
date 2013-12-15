/// <reference path="../3rd/angular.js" />
angular.module('project', ['keeple.controls.fixed-notification', 'ngSanitize']).controller('project.controller.fixed-notification.main',
    ['$rootScope', '$http', '$scope', 'fixed-notification.service.helper',
        function ($rootScope, $http, $scope, fixedNotificationHelper) {
            /// <param name="$scope" type="Object"></param>

            $scope.sendNotification = function () {
                fixedNotificationHelper.showNotifcation($scope.message, $scope.type);
            };
        }
    ]);