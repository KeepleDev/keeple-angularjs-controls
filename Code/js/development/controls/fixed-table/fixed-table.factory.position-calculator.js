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
                var tableInitialPositionX = 0;
                var offsetParent = table.offsetParent();
                while (offsetParent.offsetParent()[0] !== containerX[0] && offsetParent.offsetParent().find(containerX).length === 0) {
                    tableInitialPositionX += offsetParent.position().left * (1 / parseFloat(offsetParent.css("zoom")));
                    offsetParent = offsetParent.offsetParent();
                }

                var zoomParent = wrapper;
                var zoom = 1;
                while (zoomParent.parent()[0] != containerX[0] && zoomParent.parent().length > 0) {
                    zoomParent = zoomParent.parent();
                    zoom = zoom * parseFloat(zoomParent.css('zoom'));
                }
                if (!zoom) {
                    zoom = 1;
                }

                positionX = (containerX.scrollLeft() * (1 / zoom)) - table.position().left - tableInitialPositionX;
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
                var offsetParent = wrapper.offsetParent();
                while (offsetParent.offsetParent()[0] !== containerY[0] && offsetParent.offsetParent().find(containerY).length === 0) {
                    tableInitialPositionY += offsetParent.position().top * (1 / parseFloat(offsetParent.css("zoom")));
                    offsetParent = offsetParent.offsetParent();
                }

                var zoomParent = wrapper;
                var zoom = 1;
                while (zoomParent.parent()[0] != containerY[0] && zoomParent.parent().length > 0) {
                    zoomParent = zoomParent.parent();
                    zoom = zoom * parseFloat(zoomParent.css('zoom'));
                }
                if (!zoom) {
                    zoom = 1;
                }

                positionY = (containerY.scrollTop() * (1 / zoom)) - wrapper.position().top - tableInitialPositionY;
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