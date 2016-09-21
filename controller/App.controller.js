sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast, ConfirmMail) {
    "use strict";
    return Controller.extend("ecole.gestion.controller.App", {
        // set dialog


        onMail : function () {
			this.getOwnerComponent().ConfirmMail.open(this.getView());
		}

    });
});
