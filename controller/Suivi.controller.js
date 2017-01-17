sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "../model/formatter",
    "sap/ui/table/library",
    "sap/ui/model/Filter",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, formatter, uiTable, Filter, JSONModel) {
    "use strict";
    return Controller.extend("ecole.gestion.controller.Suivi", {

       done : function() {
            console.log("Demande CachedModel terminé")
        },
        callok : function () {
            console.log("call from cached ok");
            var oDateColumn = window.view.byId("colDate");
            var oTable = window.view.byId("tsuivi");
			if ((oDateColumn)&&(oTable)) {oTable.sort(oDateColumn, "Descending");}
          sap.ui.core.BusyIndicator.hide();
        },
        ok : function () {
            //var oComp = this.getOwnerComponent();
            window.oComp.file.cachedModel( "suivi", window.oModels["params"].oData._url_suivi, this.callok);

            console.log("init de Suivi OK");
        },

        onFilter : function (oEvent) {
            console.log(oEvent)
            var oTable = this.getView().byId("tsuivi");
            var oBinding = this.getView().byId("tsuivi").getBinding("rows"),
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
            sap.ui.core.BusyIndicator.show();
            var oTable = this.getView().byId("tsuivi");
            var oBinding = this.getView().byId("tsuivi").getBinding("rows");
            oBinding.filter(null);


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
