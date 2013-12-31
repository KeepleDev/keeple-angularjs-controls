angular.module('keeple.controls.fixed-notification').service('fixed-notification.service.helper', [function GoppHelperService() {
    this.notificationTypes = {
        SUCCESS: 'success',
        INFO: 'info',
        WARNING: 'warning',
        ERROR: 'error'
    };

    function showNotification(message, type) {
        /// <summary></summary>
        /// <param name="message" type="String"></param>
        /// <param name="type" type="string"></param>
        var notification = {
            message: message,
            type: type,
            timeStamp: null
        };
        if (angular.isFunction(this.addNotification)) {
            this.addNotification(notification);
        }
    }

    this.showNotification = showNotification;
}]);