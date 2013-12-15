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

                    var helperService = new HelperFactory(settings, wrapper);
                    var positionCalculatorService = new PositionCalculatorFactory(helperService);
                    var positionsUpdaterService = new PositionUpdaterFactory(helperService);
                    var customScrollService = new CustomScrollFactory(helperService);

                    if (settings.useCustomScroll) {
                        customScrollService.addCustomScroll();
                        wrapper.addClass('custom-scroll');
                    }

                    var $window = $(window);

                    $window.on('scroll', onScroll);
                    wrapper.on('scroll', onScroll);
                    wrapper.on('fixedColumnsCellsChanged', updateCustomScroller);

                    function onScroll() {
                        var position = positionCalculatorService.calculatePositions();
                        positionsUpdaterService.updatePositions(position.X, position.Y);
                    }

                    function updateCustomScroller() {
                        if (settings.useCustomScroll) {
                            customScrollService.updateWrapperWidth();
                            customScrollService.updateScroller();

                            var position = positionCalculatorService.calculatePositions();
                            positionsUpdaterService.updatePositions(position.X, position.Y);
                        }
                        if (helperService.isCustomScrollEnabled()) {
                            wrapper.addClass('custom-scroll');
                        }
                        else {
                            wrapper.removeClass('custom-scroll');
                        }
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