sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, JSONModel) {
    "use strict";
    return Controller.extend("ui5.template.controller.App", {
        onInit : function () {
            // set data model on view
            var oData = {
                recipient : {
                    name : "World"
                }
            };
            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel);
        },
        onShowHello : function () {
            // show a popup with Toast
            MessageToast.show("Hello World");
        }
    });
});
