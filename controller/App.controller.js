sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast, JSONModel, ResourceModel) {
    "use strict";
    return Controller.extend("ecole.famille.controller.App", {

        onShowHello : function () {
            // show a native JavaScript alert
            MessageToast.show("{recipient.name}");
        }
    });
});
