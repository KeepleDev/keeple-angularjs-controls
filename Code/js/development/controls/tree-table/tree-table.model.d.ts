/// <reference path="../../3rd/angular.d.ts" />
declare module KeepleControls.TreeTable {

    interface ITreeTableMainController extends ng.IScope {
        treeTable: ITreeTable;
    }

    interface ITreeTableRowController extends ng.IScope {
        toggleRow: Function;
        item: ITreeTableItem;
    }

    interface ITreeTable {
        itens: ITreeTableItem[];
        options: ITreeTableOptions;
        loadChildren: Function;
        preProcessedItens: ITreeTableItem[];
        processedItens: ITreeTableItem[];
    }

    export interface ITreeTableOptions {
        lazyLoad: boolean;
    }

    export interface ITreeTableItem {
        nodeId: string;
        isExpanded?: boolean;
        children: ITreeTableItem[];
        isVisible?: boolean;
        level?: number;
        isParent: boolean;
        isLoaded?: boolean;
        isLoading?: boolean;
    }

}