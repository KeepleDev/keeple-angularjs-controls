angular.module('keeple.controls.fixed-table').factory('fixed-table.factory.position-updater', [
    function () {

        function FixedTablePositionUpdaterService(helperService) {
            /// <param name="helperService" type="Object"></param>

            var table = helperService.getTable();

            var lastFixedColumns = helperService.getSettings().fixedColumns;

            var fixedColumnsCellsChangedTimeoutId;
            var addedHeaderRowListToProcess = [];

            var memoryElements = {
                headerCells: $(),
                headerCellsFixedColumn: $(),
                bodyCellsFixedColumn: $()
            };

            table.children('thead').children('tr').children('td, th').each(function () { processAddedBodyCell($(this)); });

            table.children('tbody').children('tr').children('td, th').each(function () { processAddedBodyCell($(this)); });

            table.children('thead').on('DOMNodeInserted', function addHeaderCell(evt) {
                setTimeout(function () {
                    var target = evt.originalEvent.target;
                    if (target.nodeName.toUpperCase() === 'TH' || target.nodeName.toUpperCase() === 'TD') {
                        if (addedHeaderRowListToProcess.indexOf($(target).parent()[0]) < 0) {
                            addedHeaderRowListToProcess.push($(target).parent()[0]);
                        }
                    } else if (target.nodeName.toUpperCase() === 'TR') {
                        if (addedHeaderRowListToProcess.indexOf(target) < 0) {
                            addedHeaderRowListToProcess.push(target);
                        }
                    }
                    processAddedHeaderRowList();
                }, 1);
            });

            table.children('thead').on('DOMNodeRemoved', function remvoeHeaderCell(evt) {
                setTimeout(function () {
                    var target = evt.originalEvent.target;
                    if (target.nodeName.toUpperCase() === 'TH' || target.nodeName.toUpperCase() === 'TD') {
                        processRemovedHeaderCell($(target));
                    } else if (target.nodeName.toUpperCase() === 'TR') {
                        $(target).children('td, th').each(function () {
                            processRemovedHeaderCell($(this));
                        });
                    }
                }, 1);
            });

            table.children('tbody').on('DOMNodeInserted', function addBodyCell(evt) {
                setTimeout(function () {
                    var target = evt.originalEvent.target;
                    if (target.nodeName.toUpperCase() === 'TH' || target.nodeName.toUpperCase() === 'TD') {
                        processAddedBodyCell($(target));
                    } else if (target.nodeName.toUpperCase() === 'TR') {
                        $(target).children('td, th').each(function () {
                            processAddedBodyCell($(this));
                        });
                    }
                }, 1);
            });

            table.children('tbody').on('DOMNodeRemoved', function removeBodyCell(evt) {
                setTimeout(function () {
                    var target = evt.originalEvent.target;
                    if (target.nodeName.toUpperCase() === 'TH' || target.nodeName.toUpperCase() === 'TD') {
                        processRemovedBodyCell($(target));
                    } else if (target.nodeName.toUpperCase() === 'TR') {
                        $(target).children('td, th').each(function () {
                            processRemovedBodyCell($(this));
                        });
                    }
                }, 1);
            });

            function processInitialTableCells() {
                table.children('thead').children('tr').each(function () {
                    addedHeaderRowListToProcess.push(this);
                    processAddedHeaderRowList();
                });

                table.children('tbody').children('tr').children('td, th').each(function () {
                    processAddedBodyCell($(this));
                });
            }

            var isProcessingAddedHeaderRowList = false;
            function processAddedHeaderRowList() {
                if (!isProcessingAddedHeaderRowList) {
                    isProcessingAddedHeaderRowList = true;
                    setTimeout(function () {
                        var length = addedHeaderRowListToProcess.length;
                        while (length--) {
                            $(addedHeaderRowListToProcess[length]).children('td, th').each(function () {
                                var cell = $(this);
                                cell.removeClass('fixed-column');
                                cell.addClass('fixed-header');
                                processAddedHeaderCell(cell);
                            });
                        }
                        isProcessingAddedHeaderRowList = false;
                        helperService.getWrapper().trigger('fixedColumnsHeaderCellsProcessed');
                    }, 10);
                }
            }

            function processAddedHeaderCell(cell) {
                /// <param name="cell" type="jQuery"></param>
                if (cell.closest('table')[0] == table[0]) {
                    var index = getVirtualColumnCount(cell.prevAll('td, th'));
                    if (index < helperService.getSettings().fixedColumns) {
                        cell.removeClass('fixed-header');
                        cell.addClass('fixed-column');
                        memoryElements.headerCellsFixedColumn = memoryElements.headerCellsFixedColumn.add(cell);
                    }
                    else {
                        memoryElements.headerCells = memoryElements.headerCells.add(cell);
                    }

                    emitFixedColumnsCellsChangedEvent();
                }
            }

            function processRemovedHeaderCell(cell) {
                if (cell.closest('table')[0] == table[0]) {
                    var headerCellIndex = memoryElements.headerCells.index(cell);
                    if (headerCellIndex >= 0) {
                        memoryElements.headerCells = memoryElements.headerCells.not(':eq(' + headerCellIndex + ')');
                    }
                    else {
                        var headerCellFixedColumnIndex = memoryElements.headerCellsFixedColumn.index(cell);
                        if (headerCellFixedColumnIndex >= 0) {
                            memoryElements.headerCellsFixedColumn = memoryElements.headerCellsFixedColumn.not(':eq(' + headerCellFixedColumnIndex + ')');
                        }
                    }

                    var index = getVirtualColumnCount(cell.prevAll('td, th'));
                    if (index < helperService.getSettings().fixedColumns) {
                        processAffectedHeaderCells(cell);
                    }

                    emitFixedColumnsCellsChangedEvent();
                }
            }

            function processAddedBodyCell(cell) {
                if (cell.closest('table')[0] == table[0]) {
                    var index = getVirtualColumnCount(cell.prevAll('td, th'));
                    if (index < helperService.getSettings().fixedColumns) {
                        cell.addClass('fixed-column');
                        memoryElements.bodyCellsFixedColumn = memoryElements.bodyCellsFixedColumn.add(cell);
                    }
                    else {
                        cell.removeClass('fixed-column');
                    }

                    index = getVirtualColumnCount(cell.prevAll('td, th'));
                    if (index < helperService.getSettings().fixedColumns) {
                        processAffectedBodyCells(cell);
                    }

                    emitFixedColumnsCellsChangedEvent();
                }
            }

            function processRemovedBodyCell(cell) {
                if (cell.closest('table')[0] == table[0]) {
                    var index = memoryElements.bodyCellsFixedColumn.index(cell);
                    if (index >= 0) {
                        memoryElements.bodyCellsFixedColumn = memoryElements.bodyCellsFixedColumn.not(':eq(' + index + ')');
                    }

                    var virtualIndex = getVirtualColumnCount(cell.prevAll('td, th'));
                    if (virtualIndex < helperService.getSettings().fixedColumns) {
                        processAffectedBodyCells(cell);
                    }

                    emitFixedColumnsCellsChangedEvent();
                }
            }

            function processAffectedBodyCells(cell) {
                var changedCells = cell.nextAll('td, th');
                if (changedCells.length > 0) {
                    changedCells.each(function () {
                        var virtualIndex = getVirtualColumnCount($(this).prevAll('td, th'));
                        if (virtualIndex < helperService.getSettings().fixedColumns) {
                            memoryElements.bodyCellsFixedColumn = memoryElements.bodyCellsFixedColumn.add($(this));
                            $(this).addClass('fixed-column');
                        }
                        else {
                            var index = memoryElements.bodyCellsFixedColumn.index($(this));
                            if (index >= 0) {
                                $(this).removeClass('fixed-column');
                                memoryElements.bodyCellsFixedColumn = memoryElements.bodyCellsFixedColumn.not(':eq(' + index + ')');
                            }
                        }
                    });
                }
            }

            function updatePositions(positionX, positionY) {
                if (helperService.isCustomScrollEnabled()) {
                    updateTablePosition(positionX);
                }
                updateCellsPosition(positionX, positionY);
            }

            function updateTablePosition(positionX) {
                table.css({ 'margin-left': -1 * positionX });
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
                }
                memoryElements.headerCells.css({ top: positionY });
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
                    table.children('thead').children('tr').children('th, td').removeClass('fixed-column').addClass('fixed-header').each(function () {
                        processAddedHeaderCell($(this));
                    });

                    table.children('tbody').children('tr').children('th, td').removeClass('fixed-column').each(function () {
                        processAddedBodyCell($(this));
                    });
                    lastFixedColumns = helperService.getSettings().fixedColumns;
                }
            }

            function emitFixedColumnsCellsChangedEvent() {
                if (fixedColumnsCellsChangedTimeoutId) {
                    clearTimeout(fixedColumnsCellsChangedTimeoutId);
                }
                fixedColumnsCellsChangedTimeoutId = setTimeout(function () {
                    helperService.getWrapper().trigger('fixedColumnsCellsChanged');
                }, 30);
            }

            function getVirtualColumnCount(cells) {
                var virtualColumnCount = 0;
                cells.each(function (index, cell) {
                    var colspan = $(cell).attr('colspan');
                    if (colspan) {
                        virtualColumnCount += parseInt(colspan, 10) || 1;
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
    }
]);