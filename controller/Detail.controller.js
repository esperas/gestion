sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "../model/formatter",
    "../model/file",
    "sap/ui/model/Filter",
	"sap/ui/model/Sorter",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, formatter, file, Filter, Sorter, JSONModel) {
    "use strict";
    return Controller.extend("ecole.gestion.controller.Detail", {

        formatter : formatter,

        file : file,

        _oParams : null,

        onPJ : function(oEvent){
            var toto = this.getView().getModel();
            //window.open(this._oParams.getProperty('/_url_fichiers')+'/'+toto.getProperty('/idFile'));
            window.open(sap.ui.getCore().getModel('files').getUrl()+'/'+toto.getProperty('/idFile'));
        },

        onDeletePJ : function(oEvent){
          // Delete le idFile du model
          var oModel = this.getView().getModel();
          oModel.setProperty('/idFile', null);
          // Delete le fichier du FileUploader
          var up = this.getView().byId('addFileDetail');
            up.clear();
        },

        _set_type : function(type) {
            var oField1, oField2, oButton;
            var oChoice = this.getView().byId('moyenPaiement');

            if (type=='facture'){
                oChoice.bindItems("params>/typeDoc/facture/" , oChoice.getItems()[0].clone() );
                oField1 = this.getView().byId("inputFacture");
                oField1.setVisible(true);
                oField2 = this.getView().byId("inputPaiement");
                oField2.setVisible(false);
                if (oField2.getValue()){
                    oField1.setValue(oField2.getValue());
                    oField2.setValue(null);
                }
            }
            if (type=='paiement'){
                oChoice.bindItems("params>/typeDoc/paiement/" , oChoice.getItems()[0].clone() );
                oField1 = this.getView().byId("inputFacture");
                oField1.setVisible(false);
                oField2 = this.getView().byId("inputPaiement");
                oField2.setVisible(true);
                if (oField1.getValue()){
                    oField2.setValue(oField1.getValue());
                    oField1.setValue(null);
                }
            }
            oButton = this.getView().byId("type");
            oButton.setSelectedKey(type);



        },

        _set_payment : function(payment) {
            var oButton = this.getView().byId("moyenPaiement");

            var oStatus = this.getView().byId("statusChoice");
            var oStatusfilter= new Filter('type',
                                           sap.ui.model.FilterOperator.EQ,
                                           payment);
            oStatus.getBinding("items").filter(oStatusfilter);

            oButton.setSelectedKey(payment);


        },

        onChangeType : function(oEvent) {
            var choix = oEvent.getParameters("key");
            var oModel = this.getView().getModel();

            this._set_type(choix.key);

            switch (choix.key) {
                case 'facture':
                    oModel.setProperty('/typedoc', 'F');
                    oModel.setProperty('/status', 'N');
                    this._set_payment('F');
                    break;
                case 'paiement':
                    oModel.setProperty('/typedoc', 'V');
                    oModel.setProperty('/status', null);
                    oModel.setProperty('/libelle', 'Règlement par virement');
                    this._set_payment('V');
                    break;

            }
            oModel.refresh();


        },

        onChangePaiement : function(oEvent) {
            var choix = oEvent.getParameters("key");

            var oModel = this.getView().getModel();

            //Définition des valeurs par défaut du statut en cas de changement du moyen de paiement/facture
            switch (choix.key) {
                case 'NDF':
                    oModel.setProperty('/status', 'RA');
                    oModel.setProperty('/libelle', 'Remboursement note de frais');
                    break;
                case 'CHQ':
                    oModel.setProperty('/status', 'R');
                    oModel.setProperty('/libelle', 'Règlement par chèque');
                    break;
                case 'F':
                    oModel.setProperty('/status', 'N');

                    break;
                case 'V':
                    oModel.setProperty('/libelle', 'Règlement par virement');
                    break;
                case 'ESP':
                    oModel.setProperty('/libelle', 'Règlement par espèces');
                    break;
                case 'A':
                    oModel.setProperty('/libelle', 'Avoir');
                    break;

                default:
                    oModel.setProperty('/status', null);
            }
            oModel.refresh();
            this._set_payment(choix.key);

            var oStatus = this.getView().byId("statusChoice");

            var items = oStatus.getItems();
             for (var i = 0; i < items.length - 1; i++) {
                if (items[i].getProperty('key')==oModel.getProperty('/status')) {
                    oStatus.setSelectedItem(items[i]);
                }
            }

            oStatus.synchronizeSelection();


        },


        onChangeFamille : function(oEvent) {
            var oBinding = oEvent.getParameter("selectedItem").getBindingContext("users").getPath();
            var oNom1 = this.getView().byId("nomFamille");
            oNom1.bindProperty("text","users>"+oBinding+"/nom");

        },

        ok : function () {
            console.log("init de users OK");
        },

      	onInit: function (oEvent) {
            // attach handlers for validation errors
			sap.ui.getCore().attachValidationError(function (evt) {
				var control = evt.getParameter("element");
				if (control && control.setValueState) {
					control.setValueState("Error");
				}
			});
			sap.ui.getCore().attachValidationSuccess(function (evt) {
				var control = evt.getParameter("element");
				if (control && control.setValueState) {
					control.setValueState("None");
				}
			});



            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            window.Router = oRouter;
			oRouter.getRoute("detail").attachPatternMatched(this._onObjectMatched, this);
            oRouter.getRoute("new").attachPatternMatched(this._onObjectMatched, this);

            window.controller = this
            window.oComp = this.getOwnerComponent()
            window.oComp.file.cachedModel( "users", window.oModels["params"].oData._url_users, this.ok);

            this._oParams = sap.ui.getCore().getModel('params');

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
            sap.ui.getCore().getModel('suivi').remove(oModel.getProperty('/id'));
            sap.ui.getCore().getModel('suivi').setFnPromisesAll(this.file.reloadSuivi);
            //$.when(sap.ui.getCore().getModel('suivi').getPromise())
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
            } else {
                oSuivi.status = null;
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
            if (oModel.getProperty('/idFile')) {
                oSuivi.idFile = oModel.getProperty('/idFile');
            } else {
                oSuivi.idFile = null;
            }
            sap.ui.core.BusyIndicator.show();
            if (oModel.getProperty('/mode')=="new") {
                oSuivi.asso = 'dauna';
                oSuivi.annee = '2016';
                sap.ui.getCore().getModel('suivi').create(null, oSuivi);
                // Mise à jour de la facture lié si nécessaire
                if ((oModel.getProperty('/flpaye')==true)&&(oModel.getProperty('/id'))) {
                    oSuivi = {};
                    oSuivi.status = "X";
                    sap.ui.getCore().getModel('suivi').update(oModel.getProperty('/id'), oSuivi);
                }

            } else {
                // Sauvegarde des données modiféis
                sap.ui.getCore().getModel('suivi').update(oModel.getProperty('/id'), oSuivi);

            };
            sap.ui.getCore().getModel('suivi').setFnPromisesAll(this.file.reloadSuivi);
            this.file.invalidateSolde();
            sap.ui.core.BusyIndicator.hide();
            var up = this.getView().byId('addFileDetail');
            var x;
            var fichier;
            var fd = new FormData();
            if (up.FUEl){
                for (x in up.FUEl.files) {
                    fichier = up.FUEl.files[x];
                    if (fichier instanceof File) {
                    //promises.push(this._upload(fichier, oData.periode, oData.typedoc));
                        fd.append('0', fichier);
                        fd.append('tri', this.getView().getModel().getProperty('/periode'));
                        fd.append('typedoc', this.getView().getModel().getProperty('/typedoc'));
                        fd.append('nodocument', this.getView().getModel().getProperty('/piece'));

                        sap.ui.getCore().getModel('files').create(null, fd);
                    };
                }
            }


            window.Router.navTo("suivi");
        },

		_onObjectMatched: function (oEvent) {

            var sRouteName = oEvent.getParameter("name");
            var oArgs = oEvent.getParameter("arguments");

            var oModel=new sap.ui.model.json.JSONModel();
            var toto = {};

            if (oArgs.id) {
                toto.facture = null;
                toto.paiement = null;
                // Recherche de l'index dans le tableau oData pour l'id passé en paramètre
                var index = window.oModels["suivi"].oData.suivi.findIndex(function(element){return element.id == oArgs.id });
                toto = window.oModels["suivi"].getProperty("/suivi/"+index);
            };

            // Mode création d'un paiement a partir d'une entrée existante
            if ((sRouteName == "new") && (oArgs.id)) {
                this._set_type('paiement');
                toto.paiement = toto.facture;
                toto.date = null;
                toto.facture = null;
                toto.typedoc = 'V';
                toto.periode = null;
                toto.piece = null;
                toto.status = null;
                toto.libelle = "Règlement";
                toto.idFile = null;
                toto.flpaye = true;
            }

            if (oArgs.id) {
                toto.refid = oArgs.id;
                toto.mode = sRouteName;
            } else {
                toto = {};
                toto["mode"] = sRouteName;
                toto["refid"] = null;
                toto.idFile = null;
                //toto.typedoc = 'F';
                //toto.status = 'N';
            };

            if (toto.facture){
                this._set_type('facture');
                toto.type = 'facture';
            } else {
                this._set_type('paiement');
                toto.type = 'paiement';
            }

            this._set_payment(toto.typedoc);
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
