sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    "sap/ui/core/routing/History",
    "../model/formatter",
    "sap/m/MessageBox"

], function (Controller, JSONModel, MessageToast, Filter, FilterOperator, History, formatter, MessageBox) {
    "use strict";
    return Controller.extend("ecole.gestion.controller.ImportFacture", {

        formatter : formatter,

        onChangePDF : function(oEvent) {

        },

        onChangePeriode : function(oEvent) {
            // build filter array
			var sQuery = this.getView().byId("tri").getValue();

        },
        _upload : function (fichier, tri, typedoc) {
                var fd = new FormData();
                fd.append('0', fichier);
                fd.append('tri', tri );
                fd.append('typedoc', typedoc );
            return  sap.ui.getCore().getModel('files').create(null, fd);
        },

        onStartUpload : function(sChannel, sEvent, oData) {
			var oUploadCollection = this.getView().byId(oData.id);
			var cFiles = oUploadCollection.getItems();

            var i, cFile, toto;
            var promises = [];

            for (i = 0; i < cFiles.length; i++) {
                cFile = cFiles[i].getFileUploader();

                if (!cFiles[i].getUrl() && (this.tmp_upload.indexOf(cFile)===-1) ) {
                    this.tmp_upload.push(cFile);
                    toto = sap.ui.getCore().byId(cFile);
                    // Pour chaque objet FileUploader, on transfert les fichers 1 par un (a cause de la limitation PHP OVH)
                    var x;
                    var fichier;
                    for (x in toto.FUEl.files) {
                        fichier = toto.FUEl.files[x];
                        if (fichier instanceof File) {
                            promises.push(this._upload(fichier, oData.periode, oData.typedoc));
                        };
                    }
                }
                if (!cFiles[i].getUrl()){
                    oUploadCollection.removeItem(cFiles[i]);
                }

            }
            Promise.all(promises).then(function() {
                sap.ui.getCore().getModel("files").loadDataFromPath();
            })
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

        wizardCompletedHandler : function () {
            var oModel = sap.ui.getCore().getModel('importFactures');
            var oPdf = this.getView().byId('fileFactures');
            var oJustif = this.getView().byId('fileJustifs');
            oModel.setProperty('/totalPDF', oPdf.getItems().length);
            oModel.setProperty('/totalJUSTIF', oJustif.getItems().length);
            if (oModel.getProperty('/json')){
                oModel.setProperty('/totalJSON', oModel.getProperty('/json').length);
            }
			this._oNavContainer.to(this._oWizardReviewPage);
		},

        handleFiles: function(oEvent)
        {
            var oFileToRead = oEvent.getParameters().files["0"];
            var reader = new FileReader();
            // Read file into memory as UTF-8
            reader.readAsText(oFileToRead);
            // Handle errors load
            reader.onload = loadHandler;
            reader.onerror = errorHandler;

            function loadHandler(event) {
                var csv = event.target.result;

                var oModel = sap.ui.getCore().getModel("importFactures");
                var json = JSON.parse(csv);
                oModel.setProperty('/json', json);
            }

            function errorHandler(evt) {
                if(evt.target.error.name == "NotReadableError") {
                    alert("Cannot read file !");
                }
            }
        },

        onInit : function () {
            console.log("Démarage controller Files")
            this.periode = "toto";

            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.subscribe('test','test2',this.onStartUpload,this);
            oEventBus.subscribe('test','back',this._navBack,this);

            this.tmp_upload = [];  // Stockage temporaire du fileUpload

            window.oComp = this.getOwnerComponent()

            //var oRouter = this.getRouter();
            //var oRouter = sap.ui.core.routing.Router.getRouter("router");
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            if (oRouter) {
			     oRouter.getRoute("files").attachMatched(this._onRouteMatched, this);
            }

            this._wizard = this.getView().byId("importFacture");
			this._oNavContainer = this.getView().byId("wizardNavContainer");
			this._oWizardContentPage = this.getView().byId("wizardContentPage");
			this._oWizardReviewPage = sap.ui.xmlfragment("ecole.gestion.view.ReviewImportFacture", this);

			this._oNavContainer.addPage(this._oWizardReviewPage);

        },
        _onRouteMatched : function (oEvent) {

		},

        handleWizardSubmit : function(oEvent) {
        },

		_onBindingChange : function (oEvent) {
			// No data for the binding
			if (!this.getView().getBindingContext()) {
				this.getRouter().getTargets().display("notFound");
			}
		},

        _navBack : function(sChannel, sEvent, oData) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				oRouter.navTo("Suivi", {}, true /*no history*/);
			}
        },

        navBack : function(oEvent) {
            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.publish('test','back', null );
        },
		backToWizardContent : function () {
			this._oNavContainer.backToPage(this._oWizardContentPage.getId());
		},
		editStepOne : function () {
			this._handleNavigationToStep(0);
		},
		editStepTwo : function () {
			this._handleNavigationToStep(1);
		},
		editStepThree : function () {
			this._handleNavigationToStep(2);
		},
		editStepFour : function () {
			this._handleNavigationToStep(3);
		},
		_handleNavigationToStep : function (iStepNumber) {
			var that = this;
			function fnAfterNavigate () {
				that._wizard.goToStep(that._wizard.getSteps()[iStepNumber]);
				that._oNavContainer.detachAfterNavigate(fnAfterNavigate);
			}

			this._oNavContainer.attachAfterNavigate(fnAfterNavigate);
			this.backToWizardContent();
		},
		handleWizardCancel : function () {
			this._handleMessageBoxOpen("Etes-vous sur de vouloir annuler ?", "warning");
		},
		handleWizardSubmit : function () {
			this._handleMessageBoxOpen("Valider l'importation des données ?", "confirm");
		},
        _handleMessageBoxOpen : function (sMessage, sMessageBoxType) {
			var that = this;
			MessageBox[sMessageBoxType](sMessage, {
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				onClose: function (oAction) {
					if (oAction === MessageBox.Action.YES) {
                        if (sMessageBoxType=='warning') {
                          that._handleNavigationToStep(0);
						  that._wizard.discardProgress(that._wizard.getSteps()[0]);
                        }
                        if (sMessageBoxType=='confirm') {
                            // Mise à jour des données
                            console.log(sMessageBoxType)
                            // Mettre à jour la table de suivi

                            var promises = [];
                            var oModel = sap.ui.getCore().getModel('importFactures');
                            var i;
                            var obj = oModel.getProperty('/json');
                            var oEventBus = sap.ui.getCore().getEventBus();
                            var miniObj;
                            var sUrl = sap.ui.getCore().getModel('suivi').getUrl();
                            that._handleNavigationToStep(0);
						    that._wizard.discardProgress(that._wizard.getSteps()[0]);
                            sap.ui.core.BusyIndicator.show('0');
                            if (obj){
                                var totalJson = obj.length;
                            }
                            for (i = 0; i < totalJson; i++) {
                                miniObj = obj[i];
                                promises.push(sap.ui.getCore().getModel('suivi').create(null,obj[i]));
                            };

                            Promise.all(promises).then(function(dataArr) {
                                var maj = { "maj" : new Date().toISOString().slice(0, 10)};
                                sap.ui.getCore().getModel('divers').update(null, maj);
                            }).then(oEventBus.publish('test','test2', { 'id' : 'fileFactures', 'periode' : oModel.getProperty('/periode'), 'typedoc' : 'F'})).then(
                                oEventBus.publish('test','test2', { 'id' : 'fileJustifs', 'periode' : oModel.getProperty('/periode'), 'typedoc' : 'JUSTIF'})
                                ).then(
                                function(){
                                    oModel.setProperty('/periode', null);
                                    oModel.setProperty('/jsonUpload', null);
                                    sap.ui.core.BusyIndicator.hide();
                                    oEventBus.publish('test','back', null );
                                }  ).catch(function(err) {
                                    console.log(err);
                                })


                        }

					}
				}
			});
		}

    });
});
