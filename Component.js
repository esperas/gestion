sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel"
], function (UIComponent, JSONModel, ResourceModel) {
    "use strict";
    return UIComponent.extend("ecole.famille.Component", {
        metadata : {
            manifest: "json"
        },
        init : function () {
            // call the init function of the parent
            UIComponent.prototype.init.apply(this, arguments);
            // set data model
            /*var oModel = new sap.ui.model.json.JSONModel("json/data.json")
            .attachRequestCompleted( function() {
                console.log("Load Json local", oModel);
                sap.ui.getCore().setModel(oModel,"famille");
                oModel.refresh();
                return oModel;
            } );*/

            //Mise à jour du model avec les "vrai" données
            var oModel = this.getModel("famille");
            oModel.loadData("json/data2.json");


            // set i18n model
            var i18nModel = new ResourceModel({
                bundleName : "ecole.famille.i18n.i18n"
            });
            this.setModel(i18nModel, "i18n");
        }
    });
});
