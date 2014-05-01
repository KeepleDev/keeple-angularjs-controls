angular.module('keeple.controls.table-monitor').service('table-monitor.service', [
    function TableMonitorService() {
        var tableIdList = [];
        var tableChangeList = {};

        var _this = this;

        this.TABLE_REGION_TYPE = { TBODY: 'tbody', THEAD: 'thead' };
        this.EVENT_TYPE = { INSERTED: 'inserted', REMOVED: 'removed' };

        this.monitorTable = function (tableId) {
            if (tableIdList.indexOf(tableId) < 0) {
                tableIdList.push(tableId);
                setupTableChangeObject(tableId);
                subscribeToChangeList(tableId);
            }

            return {
                onUpdate: tableChangeList[tableId].onUpdate,
                onThrottledUpdate: tableChangeList[tableId].onThrottledUpdate
            };
        };

        function setupTableChangeObject(tableId) {
            var tableChangeObject = {};

            tableChangeObject[_this.TABLE_REGION_TYPE.THEAD] = {
                insertedCellList: [],
                insertedRowList: [],
                removedCellList: [],
                removedRowList: []
            };

            tableChangeObject[_this.TABLE_REGION_TYPE.TBODY] = {
                insertedCellList: [],
                insertedRowList: [],
                removedCellList: [],
                removedRowList: []
            };

            tableChangeObject.updateHandlerList = [];
            tableChangeObject.throttledUpdateHandlerList = [];

            tableChangeObject.onUpdate = function (updateHandler) {
                tableChangeObject.updateHandlerList.unshift(updateHandler);
                return function () {
                    var index = tableChangeObject.updateHandlerList.indexOf(updateHandler);
                    if (index >= 0) {
                        tableChangeObject.updateHandlerList.splice(index, 1);
                    }
                };
            };

            tableChangeObject.onThrottledUpdate = function (updateHandler) {
                tableChangeObject.throttledUpdateHandlerList.unshift(updateHandler);
                return function () {
                    var index = tableChangeObject.throttledUpdateHandlerList.indexOf(updateHandler);
                    if (index >= 0) {
                        tableChangeObject.throttledUpdateHandlerList.splice(index, 1);
                    }
                };
            };

            tableChangeObject.createNotificationObject = function () {
                var notificationObject = {};
                notificationObject[_this.TABLE_REGION_TYPE.THEAD] = {
                    insertedCellList: tableChangeObject[_this.TABLE_REGION_TYPE.THEAD].insertedCellList,
                    insertedRowList: tableChangeObject[_this.TABLE_REGION_TYPE.THEAD].insertedRowList,
                    removedCellList: tableChangeObject[_this.TABLE_REGION_TYPE.THEAD].removedCellList,
                    removedRowList: tableChangeObject[_this.TABLE_REGION_TYPE.THEAD].removedRowList
                };
                notificationObject[_this.TABLE_REGION_TYPE.TBODY] = {
                    insertedCellList: tableChangeObject[_this.TABLE_REGION_TYPE.TBODY].insertedCellList,
                    insertedRowList: tableChangeObject[_this.TABLE_REGION_TYPE.TBODY].insertedRowList,
                    removedCellList: tableChangeObject[_this.TABLE_REGION_TYPE.TBODY].removedCellList,
                    removedRowList: tableChangeObject[_this.TABLE_REGION_TYPE.TBODY].removedRowList
                };
                return notificationObject;
            };

            tableChangeObject.throttleEventUpdate = function () {
                if (tableChangeObject.throttleTimeoutId) {
                    clearTimeout(tableChangeObject.throttleTimeoutId);
                }
                tableChangeObject.throttleTimeoutId = setTimeout(function () {
                    var index = tableChangeObject.throttledUpdateHandlerList.length;
                    var notificationObject = tableChangeObject.createNotificationObject();
                    while (index--) {
                        tableChangeObject.throttledUpdateHandlerList[index](notificationObject);
                    }
                    tableChangeObject.clearChangeList();
                }, 100);
            };

            tableChangeObject.dispatchEventUpdate = function (evt) {
                var index = tableChangeObject.updateHandlerList.length;
                while (index--) {
                    tableChangeObject.updateHandlerList[index](evt);
                }
            };

            tableChangeObject.clearChangeList = function () {
                tableChangeObject[_this.TABLE_REGION_TYPE.THEAD] = {
                    insertedCellList: [],
                    insertedRowList: [],
                    removedCellList: [],
                    removedRowList: []
                };
                tableChangeObject[_this.TABLE_REGION_TYPE.TBODY] = {
                    insertedCellList: [],
                    insertedRowList: [],
                    removedCellList: [],
                    removedRowList: []
                };
            };

            tableChangeList[tableId] = tableChangeObject;
        }

        function subscribeToChangeList(tableId) {
            var tableChangeObject = tableChangeList[tableId];
            document.addEventListener('DOMNodeInserted', function (evt) {
                tableChangeObject.dispatchEventUpdate(evt);
                addEventToChangeList(evt, tableId, _this.EVENT_TYPE.INSERTED);
            });

            document.addEventListener('DOMNodeRemoved', function (evt) {
                tableChangeObject.dispatchEventUpdate(evt);
                addEventToChangeList(evt, tableId, _this.EVENT_TYPE.REMOVED);
            });
        }

        function addEventToChangeList(evt, tableId, type) {
            var target = evt.target;
            if (target instanceof Element) {
                if (target.matchesSelector('#' + tableId + ' thead *, #' + tableId + ' tbody *')) {
                    var isCell = target.nodeName.toUpperCase() === 'TH' || target.nodeName.toUpperCase() === 'TD';
                    var isRow = !isCell && target.nodeName.toUpperCase() === 'TR';
                    var tableChangeObject = tableChangeList[tableId];
                    var region = target.matchesSelector('#' + tableId + ' thead *') ? _this.TABLE_REGION_TYPE.THEAD : _this.TABLE_REGION_TYPE.TBODY;
                    if (isCell) {
                        tableChangeObject[region][type + 'CellList'].push(event.target);
                    } else if (isRow) {
                        tableChangeObject[region][type + 'RowList'].push(event.target);
                    }
                    if (isCell || isRow) {
                        tableChangeObject.throttleEventUpdate();
                    }
                }
            }
        }

        function setupElementMatchesSelectorPolyfill() {
            this.Element && function (elementPrototype) {
                elementPrototype.matchesSelector = elementPrototype.matchesSelector ||
                    elementPrototype.mozMatchesSelector ||
                    elementPrototype.msMatchesSelector ||
                    elementPrototype.oMatchesSelector ||
                    elementPrototype.webkitMatchesSelector ||
                    elementPrototype.matches ||
                    function (selector) {
                        var node = this, nodes = (node.parentNode || node.document).querySelectorAll(selector), i = -1;

                        while (nodes[++i] && nodes[i] != node);

                        return !!nodes[i];
                    };
            }(Element.prototype);
        }

        setupElementMatchesSelectorPolyfill();
    }
]);