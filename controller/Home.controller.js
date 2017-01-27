sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "../model/formatter",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, formatter, JSONModel) {
    "use strict";
    return Controller.extend("ecole.gestion.controller.Home", {

        onConnect : function (oEvent) {
            var oView = this.getView();
            var oDialog = oView.byId("Login");
            // create dialog lazily
            if (!oDialog) {
                // create dialog via fragment factory
                oDialog = sap.ui.xmlfragment(oView.getId(), "ecole.gestion.view.Login", this);
                oView.addDependent(oDialog);
            }
            oDialog.open();
        },

        onLogin : function (oEvent) {
            this.getView().byId("Login").close();
        },

        press : function (evt) {

            var target = evt.oSource.data("target");

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

            oRouter.navTo(target, {}, false);
        }
    });
});
