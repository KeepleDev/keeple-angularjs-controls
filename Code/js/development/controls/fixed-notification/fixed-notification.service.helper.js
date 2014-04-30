angular.module('keeple.controls.fixed-notification').service('fixed-notification.service.helper', [function GoppHelperService() {
    this.notificationTypes = {
        SUCCESS: 'success',
        INFO: 'info',
        WARNING: 'warning',
        ERROR: 'error'
    };

    this.showNotification = function (message, type) {
        var notification = {
            message: message,
            type: type,
            timeStamp: null
        };
        if (angular.isFunction(this.addNotification)) {
            this.addNotification(notification);
        }
    };
}]);