/// <reference path="../../../3rd/angular.js" />
/// <reference path="../../../3rd/jquery-2.0.3.js" />

angular.module("keeple.controls.fixedTable").factory("FixedTableHelperFactory", [function () {
    function HelperService(settings, wrapper) {
        /// <param name="settings" type="Object" value="getDefaultSettings()"></param>
        /// <param name="wrapper" type="jQuery"></param>

        var table = wrapper.children("table");

        function getSlidedWidth() {
            var slidedPercentage = getScrollSlider().slider("value") / 100;
            var slidableWidth = table.width() - wrapper.width();
            var slidedWidth = slidableWidth * slidedPercentage;

            return slidedWidth;
        }

        function getScrollSlider() {
            if (settings.useInternalScrollOnPageBottom) {
                return wrapper.find(".bottom-scroll");
            }
            else {
                return table.children("thead").find(".top-scroll");
            }
        }

        function isHorizontalScrollbarPresent() {
            var root = document.compatMode == "BackCompat" ? document.body : document.documentElement;
            var isPresent = root.scrollWidth > root.clientWidth;

            return isPresent;
        }

        function isInternalScrollEnabled() {
            return settings.useInternalScroll && settings.fixedColumns > 0;
        }

        function isValidTable() {
            var hasTable = table.is("table");
            var hasThead = table.find("thead").length > 0;
            var hasTbody = table.find("tbody").length > 0;

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
                useInternalScroll: false,
                useInternalScrollOnPageBottom: true,
                autoScroll: false
            };
        }

        function isInternalScrollNeeded() {
            return wrapper.width() < table.width();
        }

        function isInitialized() {
            return wrapper.find(table).length === 1;
        }

        function getParentContainerX() {
            return settings.parentContainerX || $(window);
        }

        function getParentContainerY() {
            return settings.parentContainerY || $(window);
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
        this.isInternalScrollEnabled = isInternalScrollEnabled;
        this.isValidTable = isValidTable;
        this.getDefaultSettings = getDefaultSettings;
        this.isInternalScrollNeeded = isInternalScrollNeeded;
        this.isInitialized = isInitialized;
        this.getParentContainerX = getParentContainerX;
        this.getParentContainerY = getParentContainerY;
        this.getTable = getTable;
        this.getWrapper = getWrapper;
        this.getSettings = getSettings;
        this.setSettings = setSettings;
    }

    return HelperService;
}]);