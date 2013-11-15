function getTestItens() {
    return [
        {
            "nodeId": 1,
            "parentNodeId": null,
            "isParent": true,
            "columns": [{
                "colspan": 4,
                "value": "Motorola"
            }],
            "children": [
                {
                    "nodeId": 2,
                    "parentNodeId": 1,
                    "columns": [{
                        "colspan": 1,
                        "value": "Moto X™",
                        "hasTemplate": true,
                        "template": "<span ng-bind='itemColumn.value'></span>"
                    }, {
                        "colspan": 1,
                        "value": "2013"
                    }, {
                        "colspan": 1,
                        "value": "Dual-core 1.7 GHz Krait"
                    }, {
                        "colspan": 1,
                        "value": "2Gb"
                    }]
                },
                {
                    "nodeId": 3,
                    "parentNodeId": 1,
                    "columns": [{
                        "colspan": 1,
                        "value": "Moto G",
                        "hasTemplate": true,
                        "template": "<a ng-bind='itemColumn.value'></a>"
                    }, {
                        "colspan": 1,
                        "value": "2013"
                    }, {
                        "colspan": 1,
                        "value": "Quad-core 1.2 GHz"
                    }, {
                        "colspan": 1,
                        "value": "1Gb"
                    }]
                },
                {
                    "nodeId": 7,
                    "parentNodeId": 1,
                    "columns": [{
                        "colspan": 1,
                        "value": "Motorola RAZR XT910",
                        "hasTemplate": true,
                        "template": "<a ng-bind='itemColumn.value'></a>"
                    }, {
                        "colspan": 1,
                        "value": "2011"
                    }, {
                        "colspan": 1,
                        "value": "Dual-core 1.2 GHz Cortex-A9"
                    }, {
                        "colspan": 1,
                        "value": "1Gb"
                    }]
                }
            ]
        },
            {
                "nodeId": 4,
                "parentNodeId": null,
                "isParent": true,
                "columns": [{
                    "colspan": 4,
                    "value": "Samsung"
                }],
                "children": [
                    {
                        "nodeId": 5,
                        "parentNodeId": 4,
                        "columns": [{
                            "colspan": 1,
                            "value": "Samsung Galaxy Note 3",
                            "hasTemplate": true,
                            "template": "<span ng-bind='itemColumn.value'></span>"
                        }, {
                            "colspan": 1,
                            "value": "2013"
                        }, {
                            "colspan": 1,
                            "value": "Quad-core 2.3 GHz Krait 400",
                            "hasTemplate": true,
                            "template": "<ng-image-button data-btn-class=\"'glyphicon-tasks'\" data-text=\"itemColumn.value\" data-identifier=\"5\" >Teste</ng-image-button>"
                        }, {
                            "colspan": 1,
                            "value": "3Gb"
                        }]
                    },
                    {
                        "nodeId": 6,
                        "parentNodeId": 4,
                        "columns": [{
                            "padding": "30px",
                            "colspan": 1,
                            "value": "Samsung I9500 Galaxy S4",
                            "hasTemplate": true,
                            "template": "<a ng-bind='itemColumn.value'></a>"
                        }, {
                            "colspan": 1,
                            "value": "2013"
                        }, {
                            "colspan": 1,
                            "value": "Quad-core 1.6 GHz Cortex-A15",
                            "hasTemplate": true,
                            "template": "<ng-image-button data-btn-class=\"'glyphicon-tasks'\" data-text=\"itemColumn.value\" data-identifier=\"6\" >Teste</ng-image-button>"
                        }, {
                            "colspan": 1,
                            "value": "2Gb"
                        }]
                    }
                ]
            }
    ];
}