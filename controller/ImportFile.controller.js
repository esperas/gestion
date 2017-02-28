sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    "sap/ui/core/routing/History",
    "../model/formatter"

], function (Controller, JSONModel, MessageToast, Filter, FilterOperator, History, formatter) {
    "use strict";
    return Controller.extend("ecole.gestion.controller.ImportFile", {

        formatter : formatter,

        onChangePeriode : function(oEvent) {
            // build filter array
			var aFilter = [];
			var sQuery = this.getView().byId("tri").getValue();
			if (sQuery) {
				aFilter.push(new sap.ui.model.Filter("periode", sap.ui.model.FilterOperator.Contains, sQuery));
			}

			// filter binding
			var oList = this.getView().byId("files");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);

        },

        onStartUpload : function(oEvent) {
			var oUploadCollection = this.getView().byId("files");

			var cFiles = oUploadCollection.getItems();
            var newParam = new sap.ui.unified.FileUploaderParameter();
            newParam.setName('tri');
            newParam.setValue(this.getView().byId("tri").getValue());

            var i;
            var cFile;
            var toto;

            for (i = 0; i < cFiles.length; i++) {

                if (!cFiles[i].getUrl()) {
                    cFile = cFiles[i].getFileUploader();
                    toto = sap.ui.getCore().byId(cFile);
                    toto.setSendXHR(true);
                    toto.removeAllHeaderParameters();
                    toto.removeAllParameters();
                    toto.addParameter(newParam);
                    toto.setUseMultipart(true);
                    toto.upload();
                }
            }
		},

        onUploadComplete : function(oEvent) {
            delete window.cachedScriptPromises.files;
            this.getOwnerComponent().file.cachedModel( "files", "http://api:8080/fichiers", this.callok);
        },

        done : function() {
            console.log("Demande CachedModel terminé")
        },
        callok : function () {
          console.log("call from cached ok")
        },
        ok : function () {
            console.log("chargement des 2 terminé")
            console.log(this.periode)

        },
        getRouter : function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
        onInit : function () {
            console.log("Démarage controller Files")
            this.periode = "toto";

            window.oComp = this.getOwnerComponent()

            //var oRouter = this.getRouter();
            //var oRouter = sap.ui.core.routing.Router.getRouter("router");
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            if (oRouter) {
			     oRouter.getRoute("files").attachMatched(this._onRouteMatched, this);
            }

        },
        _onRouteMatched : function (oEvent) {
            window.controller = this
			console.log("route matched", this.periode)
            this.oArgs = oEvent.getParameter("arguments");
            var oComp = this.getOwnerComponent();
            var aFilter = [];
			var sQuery = this.getView().byId("tri").getValue();
			if (sQuery) {
				aFilter.push(new sap.ui.model.Filter("periode", sap.ui.model.FilterOperator.Contains, sQuery));
			}

			// filter binding
			var oList = this.getView().byId("files");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);

		},
		_onBindingChange : function (oEvent) {
			// No data for the binding
			if (!this.getView().getBindingContext()) {
				this.getRouter().getTargets().display("notFound");
			}
		},
        navBack : function(oEvent) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				oRouter.navTo("Suivi", {}, true /*no history*/);
			}
        }
    });
});
