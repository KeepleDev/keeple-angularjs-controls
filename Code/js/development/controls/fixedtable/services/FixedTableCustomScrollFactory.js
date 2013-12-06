/// <reference path="../../../3rd/angular.js" />
/// <reference path="../../../3rd/jquery-2.0.3.js" />

angular.module("keeple.controls.fixedTable").factory("FixedTableCustomScrollFactory", [function () {
    function CustomScrollService(helperService) {

        var wrapper = helperService.getWrapper();
        var table = helperService.getTable();
        var isFocusInsideWrapper = false;
        var updateScrollerTimeOutId;
        var updateWrapperWidthTimeoutId;

        function addCustomScroll() {
            if (helperService.getSettings().useCustomScrollOnPageBottom) {
                var scrollContainer = $("<div class=\"bottom-scroll\"><div></div></div>");
                scrollContainer.children("div").slider({ step: 0.1 });

                wrapper.append(scrollContainer);
            }
            else {
                var scrollRow = $("<tr><th colspan=\"999\"><div class=\"top-scroll\"></div></th></tr>");
                scrollRow.find("div").slider({ step: 0.1 });

                table.children("thead").append(scrollRow);
            }

            addEventHandlers();
        }

        function addEventHandlers() {
            var scroller = helperService.getScrollSlider();
            var $window = $(window);

            wrapper.on("focusout", onFocusOut);
            wrapper.on("focusin", onFocusIn);
            scroller.on("slide", onSlide);
            scroller.on("slidestop", onSlideEnd);
            $window.on("resize", onWindowResize);
        }

        function onFocusOut() {
            isFocusInsideWrapper = false;
        }

        function onFocusIn(event) {
            /// <param name="event" type="Event"></param>
            var eventSrcElement = event.srcElement || event.target;

            wrapper[0].scrollLeft = 0;

            if (isFocusInsideWrapper) {
                return;
            }
            else {
                isFocusInsideWrapper = true;
                fixPositionAfterFocus(eventSrcElement);
            }
        }

        function fixPositionAfterFocus(eventSrcElement) {
            /// <param name="eventSrcElement" type="Element"></param>
            if (eventSrcElement.className.indexOf("ui-slider-handle") >= 0) {
                return;
            }
            setTimeout(function () {
                if (eventSrcElement !== undefined) {
                    var scrollDiv = helperService.getScrollSlider();

                    if (wrapper[0].scrollLeft > 0) {
                        wrapper[0].scrollLeft = 0;
                    }

                    var srcElement = $(eventSrcElement);
                    var srcElementPositionLeft = srcElement.position().left;
                    var srcElementPositionRight = srcElementPositionLeft + srcElement.outerWidth();

                    var slidableWidth = (table.width() - wrapper.width());
                    var slidedPercentage = scrollDiv.slider("value") / 100;
                    var slidedWidth = slidableWidth * slidedPercentage;
                    var newSliderValue = slidedPercentage * 100;

                    var minCurrentVisiblePositionToTheLeft = slidedWidth + helperService.getFixedColumnsTotalWidth(table);
                    var maxCurrentVisiblePositionToTheRight = slidedWidth + wrapper.width();

                    var tooMuchToTheLeft = minCurrentVisiblePositionToTheLeft > srcElementPositionLeft;
                    var tooMuchToTheRight = maxCurrentVisiblePositionToTheRight < srcElementPositionRight;

                    var closestCellWidth = srcElement.closest("td, th").width();

                    if (tooMuchToTheLeft || tooMuchToTheRight) {
                        newSliderValue = (srcElementPositionLeft - helperService.getFixedColumnsTotalWidth(table) - closestCellWidth) / slidableWidth * 100;

                        newSliderValue = Math.max(0, newSliderValue);
                        newSliderValue = Math.min(100, newSliderValue);

                        newSliderValue = newSliderValue.toFixed(0);

                        scrollDiv.slider("value", newSliderValue);
                        scrollDiv.trigger("slide", { value: newSliderValue });
                    }
                }
            }, 1);
        }

        function onSlide() {
            wrapper.trigger("scroll");
        }

        function onSlideEnd() {
            wrapper.trigger("scroll");
        }

        function onWindowResize() {
            updateWrapperWidth();
            if (!helperService.getSettings().useCustomScrollOnPageBottom) {
                updateScroller();
            }
        }

        function updateWrapperWidth() {
            if (updateWrapperWidthTimeoutId) {
                clearTimeout(updateWrapperWidthTimeoutId);
            }
            updateWrapperWidthTimeoutId = setTimeout(function () {

                if (helperService.getSettings().fixedColumns === 0) {
                    wrapper.css("max-width", "");
                    return;
                }

                var auxDiv = $("<div>");
                var originalScrollTop = $(window).scrollTop();
                wrapper.after(auxDiv);
                wrapper.detach();

                var wasHorizontalScrollbarPresent = helperService.isHorizontalScrollbarPresent();
                var maxWidth = auxDiv.width() - 1;
                wrapper.css("max-width", maxWidth);
                auxDiv.after(wrapper);
                auxDiv.detach();

                var isHorizontalScrollbarPresentAfterMaxWidthSet = helperService.isHorizontalScrollbarPresent();

                if (isHorizontalScrollbarPresentAfterMaxWidthSet && !wasHorizontalScrollbarPresent) {
                    var newMaxWidth = maxWidth;
                    while (helperService.isHorizontalScrollbarPresent() && newMaxWidth > maxWidth * 0.9) {
                        newMaxWidth--;
                        wrapper.css("max-width", newMaxWidth);
                    }
                }

                $(window).scrollTop(originalScrollTop);
                wrapper[0].scrollLeft = 0;
            }, 50);
        }

        function updateScroller() {
            if (updateScrollerTimeOutId) {
                clearTimeout(updateScrollerTimeOutId);
            }
            updateScrollerTimeOutId = setTimeout(function () {
                var scrollDiv = helperService.getScrollSlider();
                var totalDefaultColumnsLength = helperService.getFixedColumnsTotalWidth(table);
                var step = (wrapper.width() - totalDefaultColumnsLength) / table.width() * 10;

                if (helperService.getSettings().fixedColumns === 0) {
                    scrollDiv.parent().hide();
                    return;
                }
                else {
                    scrollDiv.parent().show();
                }

                scrollDiv.slider("option", "step", step);

                scrollDiv.css({
                    "margin-left": totalDefaultColumnsLength
                });
                scrollDiv.width((wrapper.width() - totalDefaultColumnsLength) - (wrapper.width() * 0.03));
            }, 50);
        }

        this.addCustomScroll = addCustomScroll;
        this.updateScroller = updateScroller;
        this.updateWrapperWidth = updateWrapperWidth;
    }

    return CustomScrollService;
}]);