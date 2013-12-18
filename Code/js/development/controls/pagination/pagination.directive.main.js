angular.module('keeple.controls.pagination').directive('pagination',
    [
        function () {
            var template = '';
            template = template + '<ul class="pagination">';
            template = template + '<li class="previous"><a href="#" data-ng-click="prevClick();$event.preventDefault();"><span><i class="fui-arrow-left"></i>{{prevText}}</span></a></li>';
            template = template + '<li class="next"><a href="#" data-ng-click="nextClick();$event.preventDefault();"><span>{{nextText}}<i class="fui-arrow-right"></i></span></a></li>';
            template = template + '</ul>';

            return {
                restrict: 'A',
                replace: true,
                template: template,
                scope: {
                    options: '='
                },
                link: function (scope) {
                    var pageSize = scope.options.pageSize;
                    var itensCount = scope.options.itensCount;
                    var currentPage = scope.options.currentPage || 1;
                    var maxPage = Math.ceil(itensCount / pageSize);

                    scope.prevText = scope.options.prevText;
                    scope.nextText = scope.options.nextText;

                    scope.prevClick = function () {
                        if (currentPage > 1) {
                            currentPage = currentPage - 1;
                            if (angular.isFunction(scope.options.onPaginationChange)) {
                                scope.options.onPaginationChange(currentPage);
                            }
                        }
                    };
                    scope.nextClick = function () {
                        if (currentPage < maxPage) {
                            currentPage = currentPage + 1;
                            if (angular.isFunction(scope.options.onPaginationChange)) {
                                scope.options.onPaginationChange(currentPage);
                            }
                        }
                    };

                    scope.$watch('options.pageSize', function (newPageSize, oldPageSize) {
                        var oldCurrentPage = currentPage;
                        currentPage = Math.ceil(oldPageSize * (currentPage - 1) / newPageSize) + 1;
                        pageSize = scope.options.pageSize;
                        calculatePagination(oldCurrentPage != currentPage);
                    });

                    scope.$watch('options.itensCount', function () {
                        itensCount = scope.options.itensCount;
                        calculatePagination(false);
                    });

                    scope.$watch('options.currentPage', function (newCurrentPage) {
                        currentPage = newCurrentPage;
                        calculatePagination(true);
                    });

                    function calculatePagination(changed) {
                        maxPage = Math.ceil(itensCount / pageSize);
                        if (currentPage > maxPage) {
                            currentPage = maxPage;
                            changed = true;
                        }
                        if (changed && angular.isFunction(scope.options.onPaginationChange)) {
                            scope.options.onPaginationChange(currentPage);
                        }
                    }
                }
            };
        }
    ]
);