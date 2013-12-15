/// <reference path="~/js/development/3rd/angular.js" />
/// <reference path="~/js/development/3rd/jquery-2.0.3.js" />

angular.module('keeple.controls.fixed-table').factory('fixed-table.factory.helper', [function () {
    function HelperService(settings, wrapper) {
        /// <param name="settings" type="Object" value="getDefaultSettings()"></param>
        /// <param name="wrapper" type="jQuery"></param>

        var table = wrapper.children('table');

        function getSlidedWidth() {
            var slidedPercentage = getScrollSlider().slider('value') / 100;
            var slidableWidth = table.width() - wrapper.width();
            var slidedWidth = slidableWidth * slidedPercentage;

            return slidedWidth;
        }

        function getScrollSlider() {
            if (settings.useCustomScrollOnPageBottom) {
                return wrapper.find('.bottom-scroll');
            }
            else {
                return table.children('thead').find('.top-scroll');
            }
        }

        function isHorizontalScrollbarPresent() {
            var root = document.compatMode == 'BackCompat' ? document.body : document.documentElement;
            var isPresent = root.scrollWidth > root.clientWidth;

            return isPresent;
        }

        function isCustomScrollEnabled() {
            return settings.useCustomScroll && settings.fixedColumns > 0;
        }

        function isValidTable() {
            var hasTable = table.is('table');
            var hasThead = table.find('thead').length > 0;
            var hasTbody = table.find('tbody').length > 0;

            if (hasTable && hasThead && hasTbody) {
                return true;
            }

            return false;
        }

        function getDefaultSettings() {
            return {
                parentContainer: window,
                opacity: 0.95,
                onCreate: null, //callback function
                fixedColumns: 0,
                parentContainerX: null,
                parentContainerY: null,
                useCustomScroll: false,
                useCustomScrollOnPageBottom: true,
                autoScroll: false
            };
        }

        function isCustomScrollNeeded() {
            return wrapper.width() < table.width();
        }

        function isInitialized() {
            return wrapper.find(table).length === 1;
        }

        function getFixedColumnsTotalWidth() {
            var totalDefaultColumnsLength = 0;
            var columnCount = 0;
            table.find('thead tr:first th').slice(0, settings.fixedColumns).each(function () {
                if ($(this).attr('colspan') > 0) {
                    columnCount += parseInt($(this).attr('colspan'), 10);
                }
                else {
                    columnCount++;
                }
                totalDefaultColumnsLength += $(this).outerWidth();

                if (columnCount >= settings.fixedColumns) {
                    return false;
                }
                return true;
            });

            totalDefaultColumnsLength = totalDefaultColumnsLength + 5;

            return totalDefaultColumnsLength;
        }

        function getParentContainerX() {
            if (settings.parentContainerX) {
                return $(settings.parentContainerX);
            }
            else if (settings.parentContainer) {
                return $(settings.parentContainer);
            }
            else {
                return $(window);
            }
        }

        function getParentContainerY() {
            if (settings.parentContainerY) {
                return $(settings.parentContainerY);
            }
            else if (settings.parentContainer) {
                return $(settings.parentContainer);
            }
            else {
                return $(window);
            }
        }

        function getTable() {
            return table;
        }

        function getWrapper() {
            return wrapper;
        }

        function getSettings() {
            return settings || {};
        }

        function setSettings(val) {
            settings = val;
        }

        this.getSlidedWidth = getSlidedWidth;
        this.getScrollSlider = getScrollSlider;
        this.isHorizontalScrollbarPresent = isHorizontalScrollbarPresent;
        this.isCustomScrollEnabled = isCustomScrollEnabled;
        this.isValidTable = isValidTable;
        this.getDefaultSettings = getDefaultSettings;
        this.isCustomScrollNeeded = isCustomScrollNeeded;
        this.isInitialized = isInitialized;
        this.getParentContainerX = getParentContainerX;
        this.getParentContainerY = getParentContainerY;
        this.getTable = getTable;
        this.getWrapper = getWrapper;
        this.getSettings = getSettings;
        this.setSettings = setSettings;
        this.getFixedColumnsTotalWidth = getFixedColumnsTotalWidth;
    }

    return HelperService;
}]);