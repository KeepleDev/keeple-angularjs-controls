angular.module('keeple.controls.fixed-table').factory('fixed-table.factory.position-updater', [
    'table-monitor.service',
    function (tableMonitorService) {

        function FixedTablePositionUpdaterService(helperService) {
            /// <param name="helperService" type="Object"></param>

            var table = helperService.getTable();

            var lastFixedColumns = helperService.getSettings().fixedColumns;

            var fixedColumnsCellsChangedTimeoutId;
            var addedHeaderRowListToProcess = [];
            var bodyRowListToProcess = [];
            var removedHeaderCellListToProcess = [];

            var memoryElements = {
                headerCells: $(),
                headerCellsFixedColumn: $(),
                bodyCellsFixedColumn: $()
            };

            tableMonitorService.monitorTable(table.attr('id')).onThrottledUpdate(function (notificationObject) {
                var target,
                    length,
                    row;
                if (notificationObject.thead.insertedCellList.length > 0 || notificationObject.thead.insertedRowList.length > 0) {
                    length = notificationObject.thead.insertedCellList.length;
                    while (length--) {
                        target = notificationObject.thead.insertedCellList[length];
                        row = $(target).parent()[0];
                        if (row && addedHeaderRowListToProcess.indexOf(row) < 0) {
                            addedHeaderRowListToProcess.push(row);
                        }
                    }

                    length = notificationObject.thead.insertedRowList.length;
                    while (length--) {
                        target = notificationObject.thead.insertedRowList[length];
                        if (target && addedHeaderRowListToProcess.indexOf(target) < 0) {
                            addedHeaderRowListToProcess.push(target);
                        }
                    }
                }
                if (notificationObject.tbody.insertedCellList.length > 0 || notificationObject.tbody.insertedRowList.length > 0) {
                    length = notificationObject.tbody.insertedCellList.length;
                    while (length--) {
                        target = notificationObject.tbody.insertedCellList[length];
                        row = $(target).parent()[0];
                        if (row && bodyRowListToProcess.indexOf(row) < 0) {
                            bodyRowListToProcess.push(row);
                        }
                    }

                    length = notificationObject.tbody.insertedRowList.length;
                    while (length--) {
                        target = notificationObject.tbody.insertedRowList[length];
                        if (target && bodyRowListToProcess.indexOf(target) < 0) {
                            bodyRowListToProcess.push(target);
                        }
                    }
                }

                if (notificationObject.thead.removedCellList.length > 0 || notificationObject.thead.removedRowList.length > 0) {
                    length = notificationObject.thead.removedCellList.length;
                    while (length--) {
                        target = notificationObject.thead.removedCellList[length];
                        if (target && removedHeaderCellListToProcess.indexOf(target) < 0) {
                            removedHeaderCellListToProcess.push(target);
                        }
                    }

                    length = notificationObject.thead.removedRowList.length;
                    while (length--) {
                        target = notificationObject.thead.removedRowList[length];
                        $(target).children('td, th').each(function (index, cell) {
                            if (removedHeaderCellListToProcess.indexOf(cell) < 0) {
                                removedHeaderCellListToProcess.push(cell);
                            }
                        });
                    }
                }
                if (notificationObject.tbody.removedCellList.length > 0 || notificationObject.tbody.removedRowList.length > 0) {
                    length = notificationObject.tbody.removedCellList.length;
                    while (length--) {
                        target = notificationObject.tbody.removedCellList[length];
                        row = $(target).parent()[0];
                        if (row && bodyRowListToProcess.indexOf(row) < 0) {
                            bodyRowListToProcess.push(row);
                        }
                    }

                    length = notificationObject.tbody.removedRowList.length;
                    while (length--) {
                        target = notificationObject.tbody.removedRowList[length];
                        if (target && bodyRowListToProcess.indexOf(target) < 0) {
                            bodyRowListToProcess.push(target);
                        }
                    }
                }

                processChangedRowList();
            });

            function processInitialTableCells() {
                addedHeaderRowListToProcess = table.children('thead').children('tr').toArray();
                bodyRowListToProcess = table.children('tbody').children('tr').toArray();

                processChangedRowList();
            }

            function processChangedRowList() {
                processAddedHeaderRowList();
                processRemovedHeaderCellList();

                processBodyRowList();

                emitFixedColumnsCellsChangedEvent();
                helperService.getWrapper().trigger('fixedColumnsHeaderCellsProcessed');
            }

            function processAddedHeaderRowList() {
                var fixedColumnsCount = helperService.getSettings().fixedColumns;
                $(addedHeaderRowListToProcess).children('td, th').removeClass('fixed-column').addClass('fixed-header');
                $(addedHeaderRowListToProcess).each(function () {
                    var row = $(this);
                    var lastIndex = 0;
                    row.children('td, th').each(function () {
                        var cell = $(this);
                        if (cell.closest('table')[0] == table[0]) {
                            if (lastIndex < fixedColumnsCount) {
                                lastIndex = getVirtualColumnCount(cell.prevAll('td, th'));
                                if (lastIndex < fixedColumnsCount) {
                                    cell.removeClass('fixed-header').addClass('fixed-column');
                                    memoryElements.headerCellsFixedColumn = memoryElements.headerCellsFixedColumn.add(cell);
                                }
                            }
                            if (lastIndex >= fixedColumnsCount) {
                                memoryElements.headerCells = memoryElements.headerCells.add(cell);
                            }
                        }
                    });
                });

                addedHeaderRowListToProcess = [];
            }

            function processRemovedHeaderCellList() {
                $(removedHeaderCellListToProcess).each(function () {
                    var cell = $(this);
                    var headerCellIndex = memoryElements.headerCells.index(cell);
                    if (headerCellIndex >= 0) {
                        memoryElements.headerCells = memoryElements.headerCells.not(':eq(' + headerCellIndex + ')');
                    } else {
                        var headerCellFixedColumnIndex = memoryElements.headerCellsFixedColumn.index(cell);
                        if (headerCellFixedColumnIndex >= 0) {
                            memoryElements.headerCellsFixedColumn = memoryElements.headerCellsFixedColumn.not(':eq(' + headerCellFixedColumnIndex + ')');
                        }
                    }
                });

                removedHeaderCellListToProcess = [];
            }

            function processBodyRowList() {
                var fixedColumnsCount = helperService.getSettings().fixedColumns;
                $(bodyRowListToProcess).children('td, th').removeClass('fixed-column');
                //var bodyRowList = $(bodyRowListToProcess).toArray();
                //var intervalId = setInterval(function () {
                //    var row = $(bodyRowList.pop());
                //    if (bodyRowList.length === 0) {
                //        clearInterval(intervalId);
                //    }
                //    processBodyRow(fixedColumnsCount, row);
                //}, 50);
                var jqueryListToProcess = $(bodyRowListToProcess);
                jqueryListToProcess.each(function () {
                    processBodyRow(fixedColumnsCount, $(this));
                });

                bodyRowListToProcess = [];
            }

            function processBodyRow(fixedColumnsCount, row) {
                var lastIndex = 0;
                row.children('td, th').each(function () {
                    var cell = $(this);
                    if (cell.closest('table')[0] == table[0]) {
                        if (lastIndex < fixedColumnsCount) {
                            lastIndex = getVirtualColumnCount(cell.prevAll('td, th'));
                            if (lastIndex < fixedColumnsCount) {
                                cell.addClass('fixed-column');
                                memoryElements.bodyCellsFixedColumn = memoryElements.bodyCellsFixedColumn.add(cell);
                            }
                        }
                        if (lastIndex >= fixedColumnsCount) {
                            var cellIndexToRemove = memoryElements.bodyCellsFixedColumn.index(cell);
                            if (cellIndexToRemove >= 0) {
                                memoryElements.bodyCellsFixedColumn = memoryElements.bodyCellsFixedColumn.not(':eq(' + cellIndexToRemove + ')');
                            }
                        }
                    }
                });
            }

            function updatePositions(positionX, positionY) {
                updateCellsPosition(positionX, positionY);
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
                    addedHeaderRowListToProcess = table.children('thead').children('tr').toArray();
                    bodyRowListToProcess = table.children('tbody').children('tr').toArray();

                    lastFixedColumns = helperService.getSettings().fixedColumns;

                    processChangedRowList();
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
                    } else {
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