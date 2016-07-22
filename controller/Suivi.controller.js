sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, JSONModel) {
    "use strict";
    return Controller.extend("ecole.famille.controller.Suivi", {
        onInit : function () {
            // set data model on view
            /*    var oModel = new sap.ui.model.json.JSONModel("json/data2.json")
            .attachRequestCompleted( function() {
                console.log("Load Json local 2 - Suivi ", oModel);
                sap.ui.getCore().getView().setModel(oModel, "famille");
                return oModel;
            } );*/

        },
        onShowHello : function () {
            // read msg from i18n model
            var oBundle = this.getView().getModel("i18n").getResourceBundle();

            var oModel = this.getView().getModel("coucou");
            //oModel = new sap.ui.model.json.JSONModel("json/data2.json")
            oModel.loadData("json/data2.json");
            //.attachRequestCompleted( function() {
            /*    var oData = oModel.getData();
                console.log("Load Json local 2 - Suivi ", oData);
                // Lecture du modèle interne
                var sapModel = sap.ui.getCore().getModel("coucou");
                console.log("Model interne : ",sapModel);

                sapModel.setData(oData);
                sapModel.refresh();
                console.log("Famille : ",sapModel);*/
              //  oModel.refresh();
              //  return oModel;
            //} );

            // show message
            var oMode/*l = this.getView().getModel("coucou");
            var oData = oModel.getData();
            oData.famille = "ONHELLO";
            oModel.setData(oData);
            oModel.refresh();
            console.log("Famille : ",oModel);*/


        }
    });
});
