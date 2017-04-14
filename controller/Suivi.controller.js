sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/MessageBox',
    "sap/m/MessageToast",
    "../model/formatter",
    "../model/file",
    "sap/ui/table/library",
    "sap/ui/model/Filter",
	"sap/ui/model/Sorter",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageBox, MessageToast, formatter, file, uiTable, Filter, Sorter, JSONModel) {
    "use strict";
    return Controller.extend("ecole.gestion.controller.Suivi", {

        file : file,

// Fonction de mise à jour des données comptable, à insérer après la création d'une nouvelle entrée
        onCompta : function() {
            var oPiece = { "date" : "2017-01-01", "asso" :"dauna", "annee" : "2016", "libelle" : "Test de Création Pièce comptable",
                           "idSuivi" : "3",
                           "ligne" : [ { "idLigne" : "1", "DC" : "D", "compte" : "512000", "montant" : "100.02" },
                                       { "idLigne" : "2", "DC" : "C", "compte" : "625000", "montant" : "100.02" } ]};

            var jqxhr = $.ajax({
                    url: window.oModels["params"].oData._url_compta,
                    type: "POST",
                    headers: { 'Accept': 'application/json', 'Content-Type' : 'application/json' },
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader ("Authorization", "Basic " + btoa(window.oModels["params"].oData._username + ":" + window.oModels["params"].oData._password));
                    },
                    xhrFields: {
                        withCredentials: true
                        },
                    data : JSON.stringify(oPiece),
                    success: function (data, status, jqXHR) {
                        console.log("POST Compta OK ", data);
                    },
                    error: function (jqXHR, status, err) {
                        console.log("Erreur pendant le POST COmpta", err);
                        }
                    });
        },

        _oDialog: null,

        _oSuivi: null,

        _oParams : null,

        _getTotalStatus : function(sStatus, sTypedoc){
            var sTotal = 0;
            var tData = this._oSuivi.getProperty('/suivi');
            var i;
             for (i=0; i<tData.length; i++){
                if ((tData[i].status==sStatus)&&(tData[i].typedoc==sTypedoc)){
                    sTotal += 1;
                }
            }
            return sTotal;
        },

        _setRetard : function(sChannel, sEvent, oData) {
            var tData = this._oSuivi.getProperty('/suivi');
            var i, factureR = 0;
             for (i=0; i<tData.length; i++){
                if ((tData[i].status=='N')&&(tData[i].typedoc=='F')){
                    factureR += 1;
                    if (factureR>2){
                        //break;
                    }
                // Sauvegarde des données modiféis
                   sap.ui.getCore().getModel('suivi').update(tData[i].id, {'status': 'R'});
                }
            }
            //factureR -= 1;
            var msg = factureR.toString() + ' factures mises à jour';
            MessageToast.show(msg);
            sap.ui.getCore().getModel('suivi').setFnPromisesAll(this.file.reloadSuivi);


        },

        onMenuAction : function(oEvent) {
          var key = oEvent.getParameter('item').getProperty('key');
          if (key=='AgateTheBLues') {
              var bTotal = this._getTotalStatus('N','F');
              var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
              MessageBox.confirm( bTotal + " factures Nouvelle seront mises au statut Retard", {
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
                          oEventBus.publish('suivi','retard', null );
                        }
                    }
                })

          }
        },

       FilterFamille : function (oEvent) {
            var oTable = this.getView().byId("tsuivi");
            var oCombo = this.getView().byId("filtreFamille");
            var key = oCombo.getProperty("selectedKey");
            var oBinding = this.getView().byId("tsuivi").getBinding("items"),
			sKey = oEvent.getParameter("key"),
			         oFilter, oFilter2;
            oFilter = new Filter("famille", "EQ", key);
            oBinding.filter(oFilter);
       },

       done : function() {
            console.log("Demande CachedModel terminé")
        },
        onPJ : function(oEvent){
            var toto = oEvent.oSource.data("id");
            window.open(sap.ui.getCore().getModel('files').getUrl()+'/'+toto);
        },

       onFilter : function (oEvent) {
            console.log(oEvent)
            var oTable = this.getView().byId("tsuivi");
            var oBinding = this.getView().byId("tsuivi").getBinding("items"),
			sKey = oEvent.getParameter("key"),
			         oFilter, oFilter2;
            oFilter = new Filter("typedoc", "EQ", "F");
            oFilter2 = new Filter("status", "NE", "X");
            oBinding.filter([oFilter, oFilter2]);
        },

        onInit : function () {

            sap.ui.getCore().getMessageManager().registerObject(this.getView(), true);

            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.subscribe('suivi' ,'retard' ,this._setRetard ,this);

            this._oSuivi = sap.ui.getCore().getModel('suivi');
            this._oParams = sap.ui.getCore().getModel('params');
		},

        onAfterRendering : function () {
            var oView = this.getView();
            var oTable = oView.byId("tsuivi");
            var oBinding = oTable.getBinding("items");

			// apply sorter to binding
			// (grouping comes before sorting)
			var aSorters = [];
            aSorters.push(new Sorter("date", "Descending"));

			oBinding.sort(aSorters);

        },

        onFilterOpen : function(){
             if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("ecole.gestion.view.Filter", this);
			}
			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oDialog.open();


		},

        changeDateMAJ : function (oEvent) {
            sap.ui.getCore().getModel('divers').update(null, {'maj': sap.ui.getCore().getModel('divers').getProperty('/maj')});
        },

        onDetail : function(oEvent) {
            var oItem = oEvent.getSource();
            var path = oItem.getBindingContext("suivi").getPath();
            //alert(path);
            var index = window.oModels["suivi"].getProperty(path);
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("detail", {
				//id: oItem.getBindingContext("suivi").getPath().substr(7)
                id: index.id
			});
        },

        onPaiement : function(oEvent) {
            var oItem = oEvent.getSource();
            var path = oItem.getBindingContext("suivi").getPath();
            //alert(path);
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            var index = window.oModels["suivi"].getProperty(path);
			oRouter.navTo("new", {
				//id: oItem.getBindingContext("suivi").getPath().substr(7)
                id: index.id
			});
        },
        onCreate : function(oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("new");
        },

        onRefresh : function(oEvent) {

            var oTable = this.getView().byId("tsuivi");
            var oBinding = this.getView().byId("tsuivi").getBinding("items");
            oBinding.filter(null);

            var oCombo = this.getView().byId("filtreFamille");
            var key = oCombo.setSelectedKey(null);

            sap.ui.getCore().getModel('suivi').loadDataFromPath();

        },
        onNavBack : function (oEvent) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("appHome");
        },

        formatter : formatter,

        handleIconTabBarSelect: function (oEvent) {
            var oTable = this.getView().byId("tsuivi");
			var oBinding = oTable.getBinding("items"),
				sKey = oEvent.getParameter("key"),
				oFilter;
			if (sKey === "Refresh") {
                this.onRefresh(oEvent);
			} else if (sKey === "Create") {
                this.onCreate(oEvent);
			} else if (sKey === "Impayer") {
				this.onFilter(oEvent);
			} else {
				oBinding.filter([]);
			}
		}



    });
});
