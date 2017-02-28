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
        _upload : function (fichier, tri, typedoc) {

            return new Promise(function(resolve, reject) {
                var fd = new FormData();
                fd.append('0', fichier);
                fd.append('tri', tri );
                fd.append('typedoc', typedoc );
                var api = jQuery.ajax({
                    url : 'http://api:8080/fichiers?XDEBUG_SESSION_START=xdebug', // Specify the path to your API service
                    type : 'POST',              // Assuming creation of an entity
                    contentType : false,        // To force multipart/form-data
                    mimeType: "multipart/form-data",
                    data : fd,
                    processData : false,
                    success : function(data) {
                        resolve(data);// Handle the response on success
                            // alert(JSON.stringify(data));
                    }
                });
            });
        },

        onStartUpload : function(oEvent) {
			var oUploadCollection = this.getView().byId("files");
			var oTri = this.getView().byId("tri");
            var oTypeDoc = this.getView().byId("typedoc");
			var cFiles = oUploadCollection.getItems();

            var i;
            var cFile;
            var toto;
            var tmp_upload = [];  // Stockage temporaire du fileUpload
            var promises = [];

            for (i = 0; i < cFiles.length; i++) {
                cFile = cFiles[i].getFileUploader();

                if (!cFiles[i].getUrl() && (tmp_upload.indexOf(cFile)===-1) ) {
                    tmp_upload.push(cFile);
                    toto = sap.ui.getCore().byId(cFile);
                    // Pour chaque objet FileUploader, on transfert les fichers 1 par un (a cause de la limitation PHP OVH)
                    var x;
                    var fichier;
                    for (x in toto.FUEl.files) {
                        fichier = toto.FUEl.files[x];
                        if (fichier instanceof File) {
                            promises.push(this._upload(fichier, oTri.getValue(), oTypeDoc.getValue()));
                        };
                    }
                }
                if (!cFiles[i].getUrl()){
                    oUploadCollection.removeItem(cFiles[i]);
                }

            };
            Promise.all(promises).then(function() {
                delete window.cachedScriptPromises.files;
                window.controller.getOwnerComponent().file.cachedModel( "files", "http://api:8080/fichiers", function(){console.log("Relecture des fichiers effectués")});
            });
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
