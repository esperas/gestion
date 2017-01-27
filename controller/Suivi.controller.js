sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "../model/formatter",
    "sap/ui/table/library",
    "sap/ui/model/Filter",
		'sap/ui/model/Sorter',
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, formatter, uiTable, Filter, Sorter, JSONModel) {
    "use strict";
    return Controller.extend("ecole.gestion.controller.Suivi", {

        _oDialog: null,

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
        callok : function () {
            var jqxhr = $.ajax({
                    url: window.oModels["params"].oData._url_maj,
                    type: "GET",
                    headers: { 'Accept': 'application/json' },
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader ("Authorization", "Basic " + btoa(window.oModels["params"].oData._username + ":" + window.oModels["params"].oData._password));
                    },
                    xhrFields: {
                        withCredentials: true
                        },
                    success: function (data, status, jqXHR) {
                       window.oModels["params"].oData.dateMAJ = data.maj;
                       window.oModels["params"].refresh();

                        }
                    });

        },
        ok : function () {
            //var oComp = this.getOwnerComponent();
            window.oComp.file.cachedModel( "suivi", window.oModels["params"].oData._url_suivi, this.callok);
 window.oComp.file.cachedModel( "users", window.oModels["params"].oData._url_users, this.callok);
            console.log("init de Suivi OK");
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

            window.view = this.getView();
            window.controller = this
            window.oComp = this.getOwnerComponent()
            $.when(window.oComp.file.cachedModel("params", "json/param.json", this.callok))
                .done(this.ok);




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
            var maj = { "maj" : window.oModels["params"].oData.dateMAJ };
            $.ajax({
                    url: window.oModels["params"].oData._url_maj,
                    type: "PATCH",
                    data: JSON.stringify(maj),
                    //crossDomain: true,
                    headers:  { 'Accept' : 'application/json' ,
                               'Content-Type': 'application/json' }
                              ,
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader ("Authorization", "Basic " + btoa(window.oModels["params"].oData._username + ":" + window.oModels["params"].oData._password));
                    },
                    xhrFields: {
                        withCredentials: true
                        },
                    success: function (data, status, jqXHR) {
                        console.log("Date de MAJ OK");
                    },
                    error: function (jqXHR, status, err) {
                        },
                    complete: function (jqXHR, status) {
                        //console.log(window.failed);
                        }
                    });
        },

        onDetail : function(oEvent) {
            var oItem = oEvent.getSource();
            var path = oItem.getBindingContext("suivi").getPath();
            //alert(path);
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("detail", {
				id: oItem.getBindingContext("suivi").getPath().substr(7)
			});
        },

        onPaiement : function(oEvent) {
            var oItem = oEvent.getSource();
            var path = oItem.getBindingContext("suivi").getPath();
            //alert(path);
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("new", {
				id: oItem.getBindingContext("suivi").getPath().substr(7)
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

            delete window.cachedScriptPromises.suivi;
            window.oComp.file.cachedModel( "suivi", window.oModels["params"].oData._url_suivi, this.callok);
        },
        onNavBack : function (oEvent) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("appHome");
        },

        formatter : formatter
    });
});
