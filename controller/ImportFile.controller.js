sap.ui.define([
    'sap/m/MessageBox',
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    "sap/ui/core/routing/History",
    "../model/formatter"

], function (MessageBox, Controller, JSONModel, MessageToast, Filter, FilterOperator, History, formatter) {
    "use strict";
    return Controller.extend("ecole.gestion.controller.ImportFile", {

        formatter : formatter,

        onChangePeriode : function(oEvent) {
            // build filter array
			var aFilter = [];
			var sPeriode = this.getView().byId("tri").getValue();
            var sType = this.getView().byId("typedoc").getValue();
            var cpt = 0;
			if (sPeriode) {
				aFilter.push(new sap.ui.model.Filter("periode", sap.ui.model.FilterOperator.EQ, sPeriode));
                cpt += 1;
			}
			if (sType) {
				aFilter.push(new sap.ui.model.Filter("typedoc", sap.ui.model.FilterOperator.EQ, sType));
                cpt += 1;
			}
			// filter binding
			var oList = this.getView().byId("files");
			var oBinding = oList.getBinding("items");

			oBinding.filter(aFilter);

            var sUpload = this.getView().byId("files");
            sUpload.setUploadEnabled(cpt>1);


        },

        onChangeType : function (oEvent) {
            this.onChangePeriode(oEvent);

        },

        _upload : function (fichier, tri, typedoc) {

            return new Promise(function(resolve, reject) {
                var fd = new FormData();
                fd.append('0', fichier);
                fd.append('tri', tri );
                fd.append('typedoc', typedoc );
                var oParams = sap.ui.getCore().getModel('params');
                var url = oParams.getProperty('/_url_fichiers');
                var user = oParams.getProperty('/_username');
                var password = oParams.getProperty('/_password');
                var api = jQuery.ajax({
                    url : url,
                    type : 'POST',              // Assuming creation of an entity
                    contentType : false,        // To force multipart/form-data
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader ("Authorization", "Basic " + btoa(user + ":" + password));
                    },
                    xhrFields: {
                        withCredentials: true
                    },
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
            // L'ojbet Upload Collection est mal utilisé dans le cas présent
            // Nous accédons à des méthodes et attributs privés donc susceptible de changer sur la prochaine version
            var test = oUploadCollection._getFileUploader();
            var cool;
            var x, i;
            var fichier;
			var oTri = this.getView().byId("tri");
            var oTypeDoc = this.getView().byId("typedoc");
            var promises = [];
            var oParams = sap.ui.getCore().getModel('params');
            var url = oParams.getProperty('/_url_fichiers');
            var files = [];
            var oModelIntern = this.getView().getModel();
            if (!oModelIntern) {
                oModelIntern = new sap.ui.model.json.JSONModel;
                this.getView().setModel(oModelIntern);
            }
            // Initialisation si nécessaire
            if (!oModelIntern.getProperty('/files')){
                oModelIntern.setProperty('/files', files);
            } else {
                files = oModelIntern.getProperty('/files');
            }
            var j, found1;

            for (i = 0; i < test._aXhr.length; i++) {
                 cool = test._aXhr[i];
                for (x in cool) {
                    fichier = cool[x];
                    if (fichier instanceof File) {
                        found1 = null;
                        for (j = 0; j < files.length; j++) {
                            if (files[j]==fichier){
                                found1 = 'X';
                            }
                        }
                        if (!found1) {
                            promises.push(this._upload(fichier, oTri.getValue(), oTypeDoc.getValue()));
                            files.push(fichier);
                        }
                    }
                }
            }
            oModelIntern.setProperty('/files', files);
            oModelIntern.refresh();
            Promise.all(promises).then(function() {
                delete window.cachedScriptPromises.files;
                window.controller.getOwnerComponent().file.cachedModel( "files", url, function(){console.log("Relecture des fichiers effectués")});
            });
		},

        done : function() {
            console.log("Demande CachedModel terminé")
        },
        callok : function () {
          console.log("call from cached ok")
        },
        ok : function () {
            var oParams = sap.ui.getCore().getModel('params');
            var url = oParams.getProperty('/_url_fichiers');
            window.oComp.file.cachedModel( "files", url, this.callok);
            console.log("init de Files OK");
        },

        fin : function(){
            this.onStartUpload();
        },

        _refresh_files : function(sChannel, sEvent, oData) {

        },

        _fileDeleted : function(sChannel, sEvent, oData) {
			var oList = this.getView().byId("files");
			var oItems = oList.getItems();
            var i, fileToDelete = 0, binding;
            var promises = [];
            var oParams = sap.ui.getCore().getModel('params');
            var url = oParams.getProperty('/_url_fichiers');
            var user = oParams.getProperty('/_username');
            var password = oParams.getProperty('/_password');

            for (i = 0; i < oItems.length; i++) {
                if (oItems[i].getProperty('selected')) {
                    fileToDelete += 1;
                    oItems[i].setProperty('selected', null);
                    binding = oItems[i].getBinding('documentId').getValue();

                    promises.push(
                         $.ajax({
                            url: url + '/' + binding,
                            type: "DELETE",
                            headers: { 'Accept': 'application/json' },
                            beforeSend: function (xhr) {
                                xhr.setRequestHeader ("Authorization", "Basic " + btoa(user + ":" + password));
                            },
                            xhrFields: {
                                withCredentials: true
                            },
                            success: function (data, status, jqXHR) {
                                console.log("Fichier supprimé");
                            },
                            error: function (jqXHR, status, err) {
                            },
                            complete: function (jqXHR, status) {
                            }
                        }));
                }

            }
            Promise.all(promises).then(function() {
                delete window.cachedScriptPromises.files;
                window.controller.getOwnerComponent().file.cachedModel( "files", url, function(){console.log("Relecture des fichiers effectués")});
            })
        },



		onFileDeleted: function(oEvent, bis) {
			var oList = this.getView().byId("files");
			var oItems = oList.getItems();
            var i, fileToDelete = 0, binding;
            for (i = 0; i < oItems.length; i++) {
                if (oItems[i].getProperty('selected')) {
                    fileToDelete += 1;
                    binding = oItems[i].getBinding('documentId').getValue();
                }
            }
            if (fileToDelete>0) {
                var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			    MessageBox.confirm( "Vous allez supprimer " + fileToDelete + " fichiers", {
				    icon: MessageBox.Icon.INFORMATION,
				    title: "Attention",
				    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				    id: "messageBoxId1",
				    defaultAction: MessageBox.Action.NO,
				    //details: "oModelTemp.details",
				    styleClass: bCompact? "sapUiSizeCompact" : "",
                    onClose: function(oAction) {
                        if (oAction=='YES'){
                            var oEventBus = sap.ui.getCore().getEventBus();
                            oEventBus.publish('files','delete', null );
                        }
                    }
                })
            }
		},

        getRouter : function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
        onInit : function () {
            console.log("Démarage controller Files")
            this.periode = "toto";
            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.subscribe('files' ,'delete' ,this._fileDeleted ,this);
            oEventBus.subscribe('files' ,'refresh' ,this._refresh_files ,this);

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
