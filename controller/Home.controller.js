sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "../model/formatter",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, formatter, JSONModel) {
    "use strict";
    return Controller.extend("ecole.gestion.controller.Home", {



        press : function (evt) {

            var target = evt.oSource.data("target");

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

            oRouter.navTo(target, {}, false);
        }
    });
});
