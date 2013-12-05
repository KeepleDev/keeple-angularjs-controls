/// <reference path="../3rd/angular.js" />
angular.module("project", ["keeple.controls.fixedTable", "ngSanitize"]).controller("fixedTableController",
    ["$rootScope", "$http", "$scope",
        function ($rootScope, $http, $scope) {
            /// <param name="$scope" type="Object"></param>
            $scope.columnsCount = 10;
            $scope.rowsCount = 40;

            $scope.columns = [];
            $scope.rows = [];

            $scope.fixedColumnsCount = 0;
            $scope.fixedTable = {
                fixedColumns: 0
            };

            for (var i = 0; i < $scope.columnsCount; i++) {
                $scope.columns.push("ColunaParaFixedTeste" + i);
            }

            for (var j = 0; j < $scope.rowsCount; j++) {
                $scope.rows.push({ id: j + 1 });
            }

            $scope.$watch("rowsCount", function (newValue, oldValue) {
                if (newValue > oldValue) {
                    while (newValue > oldValue) {
                        $scope.rows.push({ id: oldValue + 1 });
                        oldValue = oldValue + 1;
                    }
                }
                else if (newValue < oldValue) {
                    while (newValue < oldValue) {
                        oldValue = oldValue - 1;
                        $scope.rows.splice($scope.rows.length - 1, 1);
                    }
                }
            });

            $scope.$watch("columnsCount", function (newValue, oldValue) {
                if (newValue > oldValue) {
                    while (newValue > oldValue) {
                        $scope.columns.push("ColunaParaFixedTeste" + oldValue);
                        oldValue = oldValue + 1;
                    }
                }
                else if (newValue < oldValue) {
                    while (newValue < oldValue) {
                        oldValue = oldValue - 1;
                        $scope.columns.splice($scope.columns.length - 1, 1);
                    }
                }
            });

            $scope.$watch("fixedColumnsCount", function () {
                $scope.fixedTable.fixedColumns = $scope.fixedColumnsCount;
            });
        }
    ]);