angular.module('keeple.controls.fixed-table').directive('fixedTable', [
    'fixed-table.factory.helper',
    'fixed-table.factory.position-calculator',
    'fixed-table.factory.position-updater',
    function (HelperFactory, PositionCalculatorFactory, PositionUpdaterFactory) {
        var HEIGHT_MULTIPLIER = 18;

        // The range expression appears in the directive and must have the form:
        //
        //     x in a to b
        //
        // This helper will return `{ axis: "x", lower: "a", upper: "b" }`
        function parseRangeExpression(expression) {
            /*jshint regexp:false */
            var match = expression.match(/^(x|y)\s*(=|in)\s*(.+) to (.+)$/);
            if (!match) {
                throw new Error("Expected sfScroller in form of '_axis_ in _lower_ to _upper_' but got '" + expression + "'.");
            }
            return {
                axis: match[1],
                lower: match[3],
                upper: match[4]
            };
        }

        return {
            restrict: 'A',
            replace: true,
            compile: function (tElement) {

                tElement.addClass('fixed-table');

                return function (scope, wrapper, attrs) {
                    /// <param name="wrapper" type="jQuery"></param>
                    var settings = scope.$eval(attrs.options) || {},
                        table;
                    var rangeY,
                        lowerY,
                        upperY,
                        rangeX,
                        lowerX,
                        upperX,
                        dummyTop,
                        dummyBottom;

                    table = wrapper.children('table');

                    if (settings.useVirtualScroll) {
                        rangeY = parseRangeExpression(attrs.scrollerY);
                        lowerY = rangeY ? scope.$eval(rangeY.lower) : null;
                        upperY = rangeY ? scope.$eval(rangeY.upper) : null;
                        rangeX = parseRangeExpression(attrs.scrollerX);
                        lowerX = rangeX ? scope.$eval(rangeX.lower) : null;
                        upperX = rangeX ? scope.$eval(rangeX.upper) : null;

                        settings.range = settings.range || 30;
                        settings.slicePosition = settings.slicePosition || 0;
                        dummyTop = document.createElement('tr');
                        dummyBottom = document.createElement('tr');

                        dummyTop.className = 'dummy';
                        dummyBottom.className = 'dummy';

                        setTimeout(function () {
                            table.find('tbody').prepend(dummyTop);
                            table.find('tbody').append(dummyBottom);
                            HEIGHT_MULTIPLIER = table.find('tbody tr:not(.dummy):first').outerHeight();
                        }, 4000);
                    }

                    if (table.attr('border') === undefined) {
                        table.attr('border', 0);
                    }
                    if (table.attr('cellpadding') === undefined) {
                        table.attr('cellpadding', 0);
                    }
                    if (table.attr('cellspacing') === undefined) {
                        table.attr('cellspacing', 0);
                    }

                    settings.parentContainerX = wrapper.closest('[data-fixed-table-parent], [data-fixed-table-parent-x]');
                    settings.parentContainerY = wrapper.closest('[data-fixed-table-parent], [data-fixed-table-parent-y]');

                    if (settings.parentContainerX.length === 0) {
                        settings.parentContainerX = $(window);
                    }
                    if (settings.parentContainerY.length === 0) {
                        settings.parentContainerY = $(window);
                    } else {
                        table.css('margin', 0);
                    }

                    var helperService = new HelperFactory(settings, wrapper);
                    var positionCalculatorService = new PositionCalculatorFactory(helperService);
                    var positionsUpdaterService = new PositionUpdaterFactory(helperService);

                    settings.parentContainerX.on('scroll', onScroll);
                    if (settings.parentContainerY[0] != settings.parentContainerX[0]) {
                        settings.parentContainerY.on('scroll', onScroll);
                    }

                    wrapper.on('fixedColumnsCellsChanged', updatePositions);

                    function onScroll() {
                        var position = positionCalculatorService.calculatePositions();

                        if (settings.useVirtualScroll) {
                            if (rangeY) {
                                var startPositionY = position.Y / HEIGHT_MULTIPLIER;
                                var visibleRowCount = startPositionY + settings.range > upperY ? upperY - startPositionY : settings.range;

                                if (scope.$$phase === '$digest') {
                                    settings.slicePositionY = startPositionY;
                                } else {
                                    scope.$apply(function () { settings.slicePositionY = startPositionY; });
                                }

                                if (startPositionY + settings.range < upperY) {
                                    dummyTop.style.height = position.Y + 'px';
                                } else {
                                    dummyTop.style.height = (Math.ceil(startPositionY) * HEIGHT_MULTIPLIER) + 'px';
                                }
                                var bottomInvisibleRowCount = Math.max(upperY - startPositionY - visibleRowCount, 0);
                                dummyBottom.style.height = (bottomInvisibleRowCount * HEIGHT_MULTIPLIER) + 'px';
                            }
                            if (rangeX) {
                                var firstCell = table.find('thead tr:th:not(.fixed-column):first');
                                if (firstCell) {
                                    var startPositionX = position.X / firstCell.outerWidth();

                                    if (scope.$$phase === '$digest') {
                                        settings.slicePositionX = startPositionX;
                                    } else {
                                        scope.$apply(function () { settings.slicePositionX = startPositionX; });
                                    }
                                }
                            }
                        }

                        positionsUpdaterService.updatePositions(position.X, position.Y);
                        wrapper.trigger('fixedTablePositionUpdated', position);
                    }

                    function updatePositions() {
                        var position = positionCalculatorService.calculatePositions();
                        positionsUpdaterService.updatePositions(position.X, position.Y);
                    }

                    if (settings.useVirtualScroll) {
                        if (rangeY) {
                            scope.$watch(rangeY.lower, function (newVal) {
                                lowerY = newVal;
                            });
                            scope.$watch(rangeY.upper, function (newVal) {
                                upperY = newVal;
                                onScroll();
                            });
                        }
                        if (rangeX) {
                            scope.$watch(rangeX.lower, function (newVal) {
                                lowerY = newVal;
                            });
                            scope.$watch(rangeX.upper, function (newVal) {
                                upperY = newVal;
                                onScroll();
                            });
                        }
                    }

                    scope.$watch(attrs.options + '.fixedColumns', function () {
                        setTimeout(function () {
                            helperService.setSettings(scope.$eval(attrs.options) || {});
                            positionsUpdaterService.updateFixedColumns();

                            var position = positionCalculatorService.calculatePositions();
                            positionsUpdaterService.updatePositions(position.X, position.Y);
                        }, 1);
                    }, true);
                };
            }
        };
    }
]);