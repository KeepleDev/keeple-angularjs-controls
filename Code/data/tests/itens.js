//var item2: KeepleControls.TreeTable.ITreeTableItem = {
//    nodeId: "2",
//    parentNodeId: 1,
//    columns: [
//        {
//            value: "Moto X™",
//        }, {
//            value: 2013
//        }, {
//            value: "Dual - core 1.7 GHz Krait"
//        }, {
//            value: "2Gb"
//        }
//    ],
//    isParent: false,
//    children: null
//};
function getTestItens() {
    var parentItem1 = {
        nodeId: "1",
        parentNodeId: null,
        isParent: true,
        children: [
            {
                nodeId: "2",
                parentNodeId: 1,
                isParent: false,
                columns: [
                    { value: "Moto X™" },
                    { value: 2013 },
                    { value: "Dual - core 1.7 GHz Krait" },
                    { value: "2Gb" }
                ],
                children: []
            },
            {
                nodeId: "3",
                parentNodeId: 1,
                isParent: false,
                columns: [
                    { value: "Moto G" },
                    { value: "2013" },
                    { value: "Quad - core 1.2 GHz" },
                    { value: "1Gb" }
                ],
                children: []
            },
            {
                nodeId: "7",
                parentNodeId: 1,
                isParent: false,
                columns: [
                    { value: "Motorola RAZR XT910" },
                    { value: "2011" },
                    { value: "Dual - core 1.2 GHz Cortex-A9" },
                    { value: "1Gb" }
                ],
                children: []
            }
        ]
    };
    var parentItem2 = {
        nodeId: "4",
        parentNodeId: null,
        isParent: true,
        columns: [
            { value: "Samsung" }
        ],
        children: [
            {
                nodeId: "5",
                parentNodeId: 4,
                isParent: false,
                columns: [
                    { value: "Samsung Galaxy Note 3" },
                    { value: "2013" },
                    { value: "Quad - core 2.3 GHz Krait 400" },
                    { value: "3Gb" }
                ],
                children: []
            },
            {
                nodeId: "6",
                parentNodeId: 4,
                isParent: false,
                columns: [
                    { value: "Samsung I9500 Galaxy S4" },
                    { value: "2013" },
                    { value: "Quad - core 1.6 GHz Cortex-A15" },
                    { value: "2Gb" }
                ],
                children: []
            }
        ]
    };
    return [
        parentItem1,
        parentItem2
    ];
}
//# sourceMappingURL=itens.js.map
