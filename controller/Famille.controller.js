sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";
    return Controller.extend("ecole.gestion.controller.Famille", {

        onInit: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("detail").attachPatternMatched(this._onObjectMatched, this);
            oRouter.getRoute("new").attachPatternMatched(this._onObjectMatched, this);

		},
    });
});
