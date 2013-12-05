/// <reference path="../../../3rd/jquery-2.0.3.js" />
angular.module("keeple.controls.fixedTable").directive("fixedTable",
    ["FixedTableHelperFactory", "FixedTablePositionCalculatorFactory", "FixedTablePositionUpdaterFactory",
        function (HelperFactory, PositionCalculatorFactory, PositionUpdaterFactory) {
            return {
                restrict: "A",
                scope: {
                    fixedTable: "=fixedTable"
                },
                compile: function () {

                    return function (scope, originalElement) {
                        /// <param name="originalElement" type="jQuery"></param>
                        var settings = scope.fixedTable || {};

                        var helperService = new HelperFactory(settings, originalElement);
                        var positionCalculatorService = new PositionCalculatorFactory(helperService);
                        var positionsUpdaterService = new PositionUpdaterFactory(helperService);

                        var $window = $(window);

                        function setupOnScroll() {
                            $window.scroll(function () {
                                var position = positionCalculatorService.calculatePositions();
                                positionsUpdaterService.updateCellsPosition(position.X, position.Y);
                            });
                        }

                        scope.$watch("fixedTable", function () {
                            helperService.setSettings(scope.fixedTable || {});
                            positionsUpdaterService.updateFixedColumns();

                            var position = positionCalculatorService.calculatePositions();
                            positionsUpdaterService.updateCellsPosition(position.X, position.Y);

                        }, true);

                        setupOnScroll();
                        /// <param name="element" type="jQuery"></param>
                    };
                }
            };
        }
    ]);