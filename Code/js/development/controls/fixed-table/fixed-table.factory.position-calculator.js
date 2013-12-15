angular.module('keeple.controls.fixed-table').factory('fixed-table.factory.position-calculator', [function () {
    function FixedTablePositionCalculatorService(helperService) {
        /// <param name="helperService" type="Object"></param>

        var containerX = helperService.getParentContainerX();
        var containerY = helperService.getParentContainerY();
        var wrapper = helperService.getWrapper();
        var table = helperService.getTable();

        function calculatePositions() {
            var positionX = calculatePositionX();
            var positionY = calculatePositionY();

            return {
                X: positionX,
                Y: positionY
            };
        }

        function calculatePositionX() {
            if (helperService.isCustomScrollEnabled()) {
                return calculatePositionXWithCustomScroll();
            }
            else {
                return calculatePositionXWithoutCustomScroll();
            }
        }

        function calculatePositionXWithCustomScroll() {
            return helperService.getSlidedWidth();
        }

        function calculatePositionXWithoutCustomScroll() {
            var positionX = 0;
            if (containerX[0] == window) {
                positionX = containerX.scrollLeft() - table.offset().left;
            }
            else {
                positionX = containerX.scrollLeft() - table.position().left;
            }
            if (positionX < 0) {
                positionX = 0;
            }
            return positionX;
        }

        function calculatePositionY() {
            var positionY = 0;
            if (containerY[0] == window) {
                positionY = containerY.scrollTop() - table.offset().top;
            }
            else {
                var tableInitialPositionY = 0;
                if (wrapper.offsetParent()[0] === containerY[0]) {
                    tableInitialPositionY = containerY.scrollTop() + wrapper.position().top;
                }

                positionY = containerY.scrollTop() - table.position().top - tableInitialPositionY;
            }
            if (positionY < 0) {
                positionY = 0;
            }
            return positionY;
        }

        this.calculatePositions = calculatePositions;
    }

    return FixedTablePositionCalculatorService;
}]);