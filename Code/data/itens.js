{
    "itens": [
		{
		    "id": 1,
		    "parentId": null,
		    "level": 1,
		    "isParent": true,
		    "columns": [{
		        "colspan": 4,
		        "value": "Motorola"
		    }],
		    "children":[
                {
                    "id": 2,
                    "parentId": 1,
                    "level": 2,
                    "columns": [{
                        "colspan": 1,
                        "value": "Moto X™",
                        "hasTemplate": true,
                        "template":"<span ng-bind='itemColumn.value'></span>"
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
		            "id": 3,
		            "parentId": 1,
		            "level": 2,
		            "columns": [{
		                "colspan": 1,
		                "value": "Moto G",
		                "hasTemplate": true,
		                "template":"<a ng-bind='itemColumn.value'></a>"
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
		            "id": 7,
		            "parentId": 1,
		            "level": 2,
		            "columns": [{
		                "colspan": 1,
		                "value": "Motorola RAZR XT910",
		                "hasTemplate": true,
		                "template":"<a ng-bind='itemColumn.value'></a>"
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
            "id": 4,
            "parentId": null,
            "level": 1,
            "isParent": true,
            "columns": [{
                "colspan": 4,
                "value": "Samsung"
            }],
            "children":[
                {
                    "id": 5,
                    "parentId": 4,
                    "level": 2,
                    "columns": [{
                        "colspan": 1,
                        "value": "Samsung Galaxy Note 3",
                        "hasTemplate": true,
                        "template":"<span ng-bind='itemColumn.value'></span>"
                    }, {
                        "colspan": 1,
                        "value": "2013"
                    }, {
                        "colspan": 1,
                        "value": "Quad-core 2.3 GHz Krait 400"
                    }, {
                        "colspan": 1,
                        "value": "3Gb"
                    }]
                },
		        {
		            "id": 6,
		            "parentId": 4,
		            "level": 2,
		            "columns": [{
		                "padding": "30px",
		                "colspan": 1,
		                "value": "Samsung I9500 Galaxy S4",
		                "hasTemplate": true,
		                "template":"<a ng-bind='itemColumn.value'></a>"
		            }, {
		                "colspan": 1,
		                "value": "2013"
		            }, {
		                "colspan": 1,
		                "value": "Quad-core 1.6 GHz Cortex-A15",
		                "hasTemplate": true,
		                "template":"<ng-image-button data-btn-class=\"'btn-info'\" data-text=\"'Snapdragon 2'\" >Teste</ng-image-button>"
		            }, {
		                "colspan": 1,
		                "value": "2Gb"
		            }]
		        }
            ]
        }
    ]
}