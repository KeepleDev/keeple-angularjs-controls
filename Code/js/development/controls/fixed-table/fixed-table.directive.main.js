angular.module('keeple.controls.fixed-table').directive('fixedTable', [
    'fixed-table.factory.helper',
    'fixed-table.factory.position-calculator',
    'fixed-table.factory.position-updater',
    'fixed-table.factory.custom-scroll',
    function (HelperFactory, PositionCalculatorFactory, PositionUpdaterFactory, CustomScrollFactory) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                options: '=options'
            },
            compile: function (tElement) {

                tElement.addClass('fixed-table');

                return function (scope, wrapper) {
                    /// <param name="wrapper" type="jQuery"></param>
                    var settings = scope.options || {};

                    var table = wrapper.children('table');

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
                    settings.parentContainerY = wrapper.closest('[data-fixed-table-parent], [data-fixed-table-parent-x]');

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
                    var customScrollService = new CustomScrollFactory(helperService);

                    settings.parentContainerX.on('scroll', onScroll);
                    if (settings.parentContainerY[0] != settings.parentContainerX[0]) {
                        settings.parentContainerY.on('scroll', onScroll);
                    }

                    if (settings.useCustomScroll) {
                        customScrollService.addCustomScroll();
                        wrapper.addClass('custom-scroll');
                        wrapper.on('scroll', onScroll);
                    }

                    if (settings.useCustomScroll) {
                        wrapper.on('fixedColumnsCellsChanged', updateCustomScroller);
                    } else {
                        wrapper.on('fixedColumnsCellsChanged', updatePositions);
                    }

                    function onScroll() {
                        var position = positionCalculatorService.calculatePositions();
                        positionsUpdaterService.updatePositions(position.X, position.Y);
                    }

                    function updateCustomScroller() {
                        if (settings.useCustomScroll) {
                            customScrollService.updateWrapperWidth();
                            customScrollService.updateScroller();

                            updatePositions();
                        }
                        if (helperService.isCustomScrollEnabled()) {
                            wrapper.addClass('custom-scroll');
                        }
                        else {
                            wrapper.removeClass('custom-scroll');
                        }
                    }

                    function updatePositions() {
                        var position = positionCalculatorService.calculatePositions();
                        positionsUpdaterService.updatePositions(position.X, position.Y);
                    }

                    scope.$watch('fixedTable', function () {
                        helperService.setSettings(scope.options || {});
                        positionsUpdaterService.updateFixedColumns();

                        var position = positionCalculatorService.calculatePositions();
                        positionsUpdaterService.updatePositions(position.X, position.Y);
                    }, true);

                    /// <param name="element" type="jQuery"></param>
                };
            }
        };
    }
]);