sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "../model/formatter",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, formatter, JSONModel) {
    "use strict";
    return Controller.extend("ecole.gestion.controller.Detail", {

        formatter : formatter,

        onChangeFamille : function(oEvent) {
            var oBinding = oEvent.getParameter("selectedItem").getBindingContext("users").getPath();
            var oNom1 = this.getView().byId("nomFamille");
            oNom1.bindProperty("text","users>"+oBinding+"/nom");
 /*           var oNom = this.getView().byId("nomFamille").bindElement({
				path: "/users/0/nom" });*/

        },

        ok : function () {
            console.log("init de users OK");
        },

      	onInit: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            window.Router = oRouter;
			oRouter.getRoute("detail").attachPatternMatched(this._onObjectMatched, this);
            oRouter.getRoute("new").attachPatternMatched(this._onObjectMatched, this);

            window.controller = this
            window.oComp = this.getOwnerComponent()
            window.oComp.file.cachedModel( "users", window.oModels["params"].oData._url_users, this.ok);

		},

        onDelete: function (oEvent) {

            var oView = this.getView();
            var oDialog = oView.byId("Confirm");
            // create dialog lazily
            if (!oDialog) {
                // create dialog via fragment factory
                oDialog = sap.ui.xmlfragment(oView.getId(), "ecole.gestion.view.Confirm", this);
                oView.addDependent(oDialog);
            }


            oDialog.open();
        },

        onCancel: function (oEvent) {

            this.getView().byId("Confirm").close();
        },

        onConfirm: function (oEvent) {
            // Confirmation de la suppression de l'entrée
            this.getView().byId("Confirm").close();
            var oModel = this.getView().getModel(oModel) ;
            var jqxhr = $.ajax({
                    url: window.oModels["params"].oData._url_suivi + '/' + oModel.getProperty('/id'),
                    type: "DELETE",
                    headers: { 'Accept': 'application/json', 'Content-Type' : 'application/json' },
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader ("Authorization", "Basic " + btoa(window.oModels["params"].oData._username + ":" + window.oModels["params"].oData._password));
                    },
                    xhrFields: {
                        withCredentials: true
                        },
                    success: function (data, status, jqXHR) {
                        console.log("DELETE success.");
                        delete window.cachedScriptPromises.suivi;
                        window.oComp.file.cachedModel( "suivi", window.oModels["params"].oData._url_suivi, this.ok);

                    },
                    error: function (jqXHR, status, err) {
                        console.log("Erreur pendant le DELETE de la nouvelle entrée", err);
                        },
                    complete: function (jqXHR, status) {
                        //console.log(key, "Local completion callback.");
                        sap.ui.core.BusyIndicator.hide();
                        //that.getRouter().navTo("suivi")
                        }
                    });
            window.Router.navTo("suivi");
        },

        onSave: function (oEvent) {

            var oModel = this.getView().getModel(oModel) ;
            var oSuivi = {};
            if (oModel.getProperty('/paiement')) {
                oSuivi.paiement = oModel.getProperty('/paiement');
            } else {
                oSuivi.paiement = null;
            }
            if (oModel.getProperty('/libelle')) {
                oSuivi.libelle = oModel.getProperty('/libelle');
            }
            if (oModel.getProperty('/date')) {
                oSuivi.date = oModel.getProperty('/date');
            }
            if (oModel.getProperty('/famille')) {
                oSuivi.famille = oModel.getProperty('/famille');
            }
            if (oModel.getProperty('/facture')) {
                oSuivi.facture = oModel.getProperty('/facture');
            } else {
                oSuivi.facture = null;
            }
            if (oModel.getProperty('/status')) {
                oSuivi.status = oModel.getProperty('/status');
            }
            if (oModel.getProperty('/status')) {
                oSuivi.status = oModel.getProperty('/status');
            }
            if (oModel.getProperty('/piece')) {
                oSuivi.piece = oModel.getProperty('/piece');
            }
            if (oModel.getProperty('/periode')) {
                oSuivi.periode = oModel.getProperty('/periode');
            }
            if (oModel.getProperty('/typedoc')) {
                oSuivi.typedoc = oModel.getProperty('/typedoc');
            }
            sap.ui.core.BusyIndicator.show();
            if (oModel.getProperty('/mode')=="new") {
                oSuivi.asso = 'dauna';
                oSuivi.annee = '2016';
                var jqxhr = $.ajax({
                    url: window.oModels["params"].oData._url_suivi,
                    type: "POST",
                    headers: { 'Accept': 'application/json', 'Content-Type' : 'application/json' },
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader ("Authorization", "Basic " + btoa(window.oModels["params"].oData._username + ":" + window.oModels["params"].oData._password));
                    },
                    xhrFields: {
                        withCredentials: true
                        },
                    data : JSON.stringify(oSuivi),
                    success: function (data, status, jqXHR) {
                        console.log("POST success.", data);
                        delete window.cachedScriptPromises.suivi;
                        window.oComp.file.cachedModel( "suivi", window.oModels["params"].oData._url_suivi, this.ok);
                    },
                    error: function (jqXHR, status, err) {
                        console.log("Erreur pendant le PSOT de la nouvelle entrée", err);
                        },
                    complete: function (jqXHR, status) {
                        //console.log(key, "Local completion callback.");
                        sap.ui.core.BusyIndicator.hide();
                        //that.getRouter().navTo("suivi")

                        }
                    });
                // Mise à jour de la facture lié si nécessaire
                if ((oModel.getProperty('/flpaye')==true)&&(oModel.getProperty('/id'))) {
                    oSuivi = {};
                    oSuivi.status = "X";
                    jqxhr = $.ajax({
                    url: window.oModels["params"].oData._url_suivi + '/' + oModel.getProperty('/id'),
                    type: "PATCH",
                    headers: { 'Accept': 'application/json', 'Content-Type' : 'application/json' },
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader ("Authorization", "Basic " + btoa(window.oModels["params"].oData._username + ":" + window.oModels["params"].oData._password));
                    },
                    xhrFields: {
                        withCredentials: true
                        },
                    data : JSON.stringify(oSuivi),
                    success: function (data, status, jqXHR) {
                        console.log("Cached Model ", " Patch success.");
                        delete window.cachedScriptPromises.suivi;
                        window.oComp.file.cachedModel( "suivi", window.oModels["params"].oData._url_suivi, this.ok);
                    },
                    error: function (jqXHR, status, err) {
                        console.log("Erreur pendant le PATCH", err);
                        },
                    complete: function (jqXHR, status) {
                        //console.log(key, "Local completion callback.");
                        sap.ui.core.BusyIndicator.hide();
                        //that.getRouter().navTo("suivi")

                        }
                    });

                }


            } else {

             var jqxhr = $.ajax({
                    url: window.oModels["params"].oData._url_suivi + '/' + oModel.getProperty('/id'),
                    type: "PATCH",
                    headers: { 'Accept': 'application/json', 'Content-Type' : 'application/json' },
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader ("Authorization", "Basic " + btoa(window.oModels["params"].oData._username + ":" + window.oModels["params"].oData._password));
                    },
                    xhrFields: {
                        withCredentials: true
                        },
                    data : JSON.stringify(oSuivi),
                    success: function (data, status, jqXHR) {
                        console.log("Cached Model ", " Patch success.");
                        delete window.cachedScriptPromises.suivi;
                        window.oComp.file.cachedModel( "suivi", window.oModels["params"].oData._url_suivi, this.ok);
                    },
                    error: function (jqXHR, status, err) {
                        console.log("Erreur pendant le PATCH", err);
                        },
                    complete: function (jqXHR, status) {
                        //console.log(key, "Local completion callback.");
                        sap.ui.core.BusyIndicator.hide();
                        //that.getRouter().navTo("suivi")
                        }
                    });
                };
            window.Router.navTo("suivi");
        },

		_onObjectMatched: function (oEvent) {

            var sRouteName = oEvent.getParameter("name");
            var oArgs = oEvent.getParameter("arguments");

            var oModel=new sap.ui.model.json.JSONModel();
            var toto = {};

            if (oArgs.id) {
                toto = window.oModels["suivi"].getProperty("/suivi/"+oEvent.getParameter("arguments").id);
            };

            // Mode création d'un paiement a partir d'une entrée existante
            if ((sRouteName == "new") && (oArgs.id)) {
                toto.paiement = toto.facture;
                toto.facture = null;
                toto.typedoc = null;
                toto.periode = null;
                toto.piece = null;
                toto.status = null;
                toto.libelle = "Règlement";
            }

            if (oArgs.id) {
                toto.refid = oArgs.id;
                toto.mode = sRouteName;
            } else {
                toto = {};
                toto["mode"] = sRouteName;
            };

            toto.ListeTypeDoc = [ { "name" : "CHQ", "libelle" : "Chèque"},
                                  { "name" : "F", "libelle" : "Facture"},
                                  { "name" : "NDF", "libelle" : "Note de frais"},
                                  { "name" : "A", "libelle" : "Avoir"}];
            oModel.setData(toto);
            this.getView().setModel(oModel) ;

            var idUser;
            if (toto.famille) {
                idUser = window.oModels["users"].oData.users.findIndex((e1)=>(e1.famille==toto.famille));
                var oNom1 = this.getView().byId("nomFamille");
                oNom1.bindProperty("text","users>/users/"+idUser+"/nom");
            }


        },
        onNavBack : function (oEvent) {
            window.Router.navTo("suivi");
        }
    });
});
