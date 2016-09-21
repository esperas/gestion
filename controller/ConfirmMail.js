sap.ui.define([
	"sap/ui/base/Object"
], function (Object) {
	"use strict";
	return Object.extend("ecole.gestion.controller.ConfirmMail", {
		_getDialog : function () {
			// create dialog lazily
			if (!this._oDialog) {
				// create dialog via fragment factory
				this._oDialog = sap.ui.xmlfragment("ecole.gestion.view.ConfirmMail", this);
			}
			return this._oDialog;
		},
		open : function (oView) {
			var oDialog = this._getDialog();
			// connect dialog to view (models, lifecycle)
			oView.addDependent(oDialog);
			// open dialog
			oDialog.open();
		},
       	onCancel : function () {
			this._getDialog().close();
		},
        onSendMail : function (evt) {


            //console.log("Mail envoyé");
            var oContext = evt.getParameter("selectedItem");
            var number = 123.0000;
            //console.log(number.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }));

            var oParents = this._oDialog.getParent().getModel("parents");
            var oParams = this._oDialog.getParent().getModel("params");
            console.log(oParams.oData.mailTemplate);

            // Envoi des mails
            var i;
            for (i = 0; i < oParents.oData.length; i++) {
                if (oParents.oData[i].selected) {
                    console.log(oParents.oData[i].mail);
                    var solde = parseFloat(oParents.oData[i].solde);

                    emailjs.send("smtp_server", oParams.oData.mailTemplate , {"mail":oParents.oData[i].mail, "famille":oParents.oData[i].famille, "id":oParents.oData[i].id, "solde":solde.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })})

                }
            }

            // Désélection des coches
            for (i = 0; i < oParents.oData.length; i++) {
                if (oParents.oData[i].mail) {
                    if (oParents.oData[i].selected) {
                        oParents.oData[i].selected = false;
                        oParams.oData.nBselected = parseInt(oParams.oData.nBselected) - 1;
                    }

                }
            }
            oParents.refresh();
            oParams.refresh();

            this._getDialog().close();

        }
	});
});
