sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "../model/formatter",
        "../model/file",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, formatter, file, JSONModel) {
    "use strict";
    return Controller.extend("ecole.gestion.controller.Home", {

        file : file,

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
            //Stockage du résultat en local
            jQuery.sap.require("jquery.sap.storage");
            var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
            var oParams = sap.ui.getCore().getModel('params');
            var logon = { 'username' : oParams.getProperty('/_username'), "password" : oParams.getProperty('/_password')};
            if ((logon.username)&&(logon.password)) {
                oStorage.put("logon", logon);
            }
            this.file.setPassword();
            this.file.loadData();


        },

        press : function (evt) {

            var target = evt.oSource.data("target");

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

            oRouter.navTo(target, {}, false);
        }
    });
});
