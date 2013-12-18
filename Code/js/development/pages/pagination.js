/// <reference path="../3rd/angular.js" />
angular.module('project', ['keeple.controls.pagination']).controller('project.controller.pagination.main',
    ['$scope',
        function ($scope) {
            /// <param name="$scope" type="Object"></param>

            $scope.currentPage = 1;
            $scope.pageSize = 10;
            $scope.itensCount = 100;

            $scope.options = {
                currentPage: $scope.currentPage,
                pageSize: $scope.pageSize,
                itensCount: $scope.itensCount,
                prevText: 'Anterior',
                nextText: 'Próximo',
                onPaginationChange: function (pageNumber) {
                    $scope.currentPage = pageNumber;
                }
            };

            $scope.updateOptions = function () {
                $scope.options.pageSize = $scope.pageSize;
                $scope.options.itensCount = $scope.itensCount;
            };
        }
    ]);