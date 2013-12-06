/// <reference path="../../../3rd/angular.js" />
/// <reference path="../../../3rd/jquery-2.0.3.js" />

angular.module("keeple.controls.fixedTable").factory("FixedTablePositionUpdaterFactory", [function () {
    function FixedTablePositionUpdaterService(helperService) {
        /// <param name="helperService" type="Object"></param>

        var table = helperService.getTable();

        var lastFixedColumns = helperService.getSettings().fixedColumns;

        var memoryElements = {
            headerCells: $(),
            headerCellsFixedColumn: $(),
            bodyCellsFixedColumn: $()
        };

        table.children("thead").on("DOMNodeInserted", function addHeaderCell(evt) {
            var target = evt.originalEvent.target;
            if (target.nodeName.toUpperCase() === "TH" || target.nodeName.toUpperCase() === "TD") {
                processAddedHeaderCell($(target));
            }
            else if (target.nodeName.toUpperCase() === "TR") {
                $(target).children("td, th").each(function () {
                    processAddedHeaderCell($(this));
                });
            }
        });

        table.children("thead").on("DOMNodeRemoved", function remvoeHeaderCell(evt) {
            var target = evt.originalEvent.target;
            if (target.nodeName.toUpperCase() === "TH" || target.nodeName.toUpperCase() === "TD") {
                processRemovedHeaderCell($(target));
            }
            else if (target.nodeName.toUpperCase() === "TR") {
                $(target).children("td, th").each(function () {
                    processRemovedHeaderCell($(this));
                });
            }
        });

        table.children("tbody").on("DOMNodeInserted", function addBodyCell(evt) {
            var target = evt.originalEvent.target;
            if (target.nodeName.toUpperCase() === "TH" || target.nodeName.toUpperCase() === "TD") {
                processAddedBodyCell($(target));
            }
            else if (target.nodeName.toUpperCase() === "TR") {
                $(target).children("td, th").each(function () {
                    processAddedBodyCell($(this));
                });
            }
        });

        table.children("tbody").on("DOMNodeRemoved", function removeBodyCell(evt) {
            var target = evt.originalEvent.target;
            if (target.nodeName.toUpperCase() === "TH" || target.nodeName.toUpperCase() === "TD") {
                processRemovedBodyCell($(target));
            }
            else if (target.nodeName.toUpperCase() === "TR") {
                $(target).children("td, th").each(function () {
                    processRemovedBodyCell($(this));
                });
            }
        });

        function processInitialTableCells() {
            table.children("thead").children("tr").children("td, th").each(function () {
                processAddedHeaderCell($(this));
            });

            table.children("tbody").children("tr").children("td, th").each(function () {
                processAddedBodyCell($(this));
            });
        }

        function processAddedHeaderCell(cell) {
            /// <param name="cell" type="jQuery"></param>
            if (cell.closest("table")[0] == table[0]) {
                var index = getVirtualColumnCount(cell.prevAll("td, th"));
                if (index < helperService.getSettings().fixedColumns) {
                    cell.addClass("fixed-column");
                    memoryElements.headerCellsFixedColumn = memoryElements.headerCellsFixedColumn.add(cell);
                }
                else {
                    cell.addClass("fixed-header");
                    memoryElements.headerCells = memoryElements.headerCells.add(cell);
                }
                helperService.getWrapper().trigger("fixedColumnsCellsChanged");
            }
        }

        function processRemovedHeaderCell(cell) {
            if (cell.closest("table")[0] == table[0]) {
                memoryElements.headerCells.remove(cell);
                if (memoryElements.headerCellsFixedColumn.is(cell)) {
                    memoryElements.headerCellsFixedColumn.remove(cell);
                }
                helperService.getWrapper().trigger("fixedColumnsCellsChanged");
            }
        }

        function processAddedBodyCell(cell) {
            if (cell.closest("table")[0] == table[0]) {
                var index = getVirtualColumnCount(cell.prevAll("td, th"));
                if (index < helperService.getSettings().fixedColumns) {
                    cell.addClass("fixed-column");
                    memoryElements.bodyCellsFixedColumn = memoryElements.bodyCellsFixedColumn.add(cell);
                }
            }
        }

        function processRemovedBodyCell(cell) {
            memoryElements.bodyCellsFixedColumn = memoryElements.bodyCellsFixedColumn.remove(cell);
        }

        function updatePositions(positionX, positionY) {
            if (helperService.isCustomScrollEnabled()) {
                updateTablePosition(positionX);
            }
            updateCellsPosition(positionX, positionY);
        }

        function updateTablePosition(positionX) {
            table.css({ "margin-left": -1 * positionX });
        }

        function updateCellsPosition(positionX, positionY) {
            updateHeaderCellPositions(positionX, positionY);
            updateBodyCellPositions(positionX);
        }

        function updateHeaderCellPositions(positionX, positionY) {
            if (helperService.getSettings().fixedColumns > 0) {
                memoryElements.headerCellsFixedColumn.css({
                    left: positionX,
                    top: positionY
                });

                memoryElements.headerCells.css({ top: positionY });
            }
            else {
                memoryElements.headerCells.stop().animate({ top: positionY }, 100);
            }
        }

        function updateBodyCellPositions(positionX) {
            if (helperService.getSettings().fixedColumns > 0) {
                memoryElements.bodyCellsFixedColumn.css({
                    left: positionX
                });
            }
        }

        function updateFixedColumns() {
            if (lastFixedColumns != helperService.getSettings().fixedColumns) {
                table.children("thead").children("tr").children("th, td").removeClass("fixed-column").addClass("fixed-header").each(function () {
                    processAddedHeaderCell($(this));
                });

                table.children("tbody").children("tr").children("th, td").removeClass("fixed-column").each(function () {
                    processAddedBodyCell($(this));
                });
                lastFixedColumns = helperService.getSettings().fixedColumns;
            }
        }

        function getVirtualColumnCount(cells) {
            var virtualColumnCount = 0;
            cells.each(function (index, cell) {
                var colspan = $(cell).attr("colspan");
                if (colspan) {
                    virtualColumnCount += parseInt(colspan, 10);
                }
                else {
                    virtualColumnCount++;
                }
            });
            return virtualColumnCount;
        }

        processInitialTableCells();

        this.updatePositions = updatePositions;
        this.updateFixedColumns = updateFixedColumns;
    }

    return FixedTablePositionUpdaterService;
}]);