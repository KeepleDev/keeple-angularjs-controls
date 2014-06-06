angular.module('keeple.controls.fixed-table').filter('sublist', function () {
    return function (input, range, start) {
        return input.slice(Math.max(start, 0), start + range);
    };
});