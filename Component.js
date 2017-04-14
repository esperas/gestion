sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel",
    "./controller/ConfirmMail",
    "./model/file",
    "ecole/shared/model/JSONModel"
], function (UIComponent, JSONModel, ResourceModel, ConfirmMail, file, API) {
    "use strict";
    return UIComponent.extend("ecole.gestion.Component", {
        metadata : {
            manifest: "json"
        },
        file : file,

        errorCallback : function() {
            console.log("Chargement Model component raté")
        },

        youpi : function(){
          alert('youpi')
        },

        done : function(){
          console.log('Promise done');
        },

        loadData : function() {
            sap.ui.getCore().getModel("suivi").loadDataFromPath();
            sap.ui.getCore().getModel("users").loadDataFromPath();
            sap.ui.getCore().getModel("parents").loadDataFromPath();
            sap.ui.getCore().getModel("files").loadDataFromPath();
        },

        init : function () {
            // call the init function of the parent
            //sap.ui.getCore().loadLibrary("JSONModelAPI", "/model/JSONModelAPI.js");

            UIComponent.prototype.init.apply(this, arguments);

            //var test = new API('http://api:8080/suivi', 'params');
            //test.setUrl('http://api:8080/suivi', 'params');
            //test.getAPI();

            //$.when(test.mPromise).then(this.youpi);

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

            sap.ui.getCore().setModel(this.getModel("importFactures"), "importFactures");
            sap.ui.getCore().setModel(this.getModel("parents"), "parents");
            sap.ui.getCore().setModel(this.getModel("suivi"), "suivi");
            sap.ui.getCore().setModel(this.getModel("params"), "params");
            sap.ui.getCore().setModel(this.getModel("users"), "users");
            sap.ui.getCore().setModel(this.getModel("files"), "files");
            sap.ui.getCore().setModel(this.getModel("divers"), "divers");

            //Chargement des paramètres de l'application
            var oParams = this.getModel("params");
            oParams.loadDataFromPath(this.file.successCallback);

            var oSuivi = this.getModel("suivi");
            oSuivi.setFnAfterLoad(this.file.calculTotalSuivi);
            var toto = oParams.getPromise();
            console.log('Promise en attente');
            //Chargement du mot de passe s'il est en local, sinon, tant pis
            oParams.mPromise.done(this.file.setPassword);

            oParams.mPromise.done(this.file.loadData);

            // create the views based on the url/hash
            this.getRouter().initialize();
        }
    });
});
