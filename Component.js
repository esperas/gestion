sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel",
    "./controller/ConfirmMail",
    "./model/file"
], function (UIComponent, JSONModel, ResourceModel, ConfirmMail, file) {
    "use strict";
    return UIComponent.extend("ecole.gestion.Component", {
        metadata : {
            manifest: "json"
        },
        file : file,

        successCallback : function(){
            console.log("Chargement Model component OK")
            //console.log(window.models.famille)
        },
        errorCallback : function() {
            console.log("Chargement Model component raté")
        },
        init : function () {
            // call the init function of the parent
            UIComponent.prototype.init.apply(this, arguments);



            // set i18n model
            var i18nModel = new ResourceModel({
                bundleName : "ecole.gestion.i18n.i18n"
            });
            this.setModel(i18nModel, "i18n");
            // set dialog
			this.ConfirmMail = new ConfirmMail();

            // Stockage des Models pour partage simplifié (pb de porté des Modèles)

            window.oModels["parents"] = this.getModel("parents");
            window.oModels["suivi"] = this.getModel("suivi");
            window.oModels["params"] = this.getModel("params");
            window.oModels["users"] = this.getModel("users");
            window.oModels["files"] = this.getModel("files");
            //this.file.cachedModel( "parents", "http://api:8080/solde", this.successCallback);
            //this.file.cachedModel( "suivi", "http://api:8080/suivi", this.successCallback);
            console.log("Demande de chargement du model PARAMS depuis componet.js")
            this.file.cachedModel( "params", "json/param.json", this.successCallback);
            this.file.cachedModel( "files", "http://api:8080/fichiers", this.successCallback);

            // create the views based on the url/hash
            this.getRouter().initialize();
        }
    });
});
