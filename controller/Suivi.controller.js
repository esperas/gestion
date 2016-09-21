sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "../model/formatter",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, formatter, JSONModel) {
    "use strict";
    return Controller.extend("ecole.gestion.controller.Suivi", {
        formatter : formatter,

        onMail : function(evt) {
            this.getOwnerComponent().ConfirmMail.open(this.getView());
        },
        onGoto : function(evt) {
            var obj = evt.getSource().getBindingContext("parents").getObject();
            console.log(obj);
            var url = "../moncompte/index.html?parent=" + obj.id;
            window.open(url);
        },
        onCheck : function(evt) {
            // Ajoute ou décrémente le compteur global "nBselected"
            // Ce paramètre sert ensuite dans les pop-up de confirmation
            var obj = evt.getSource().getBindingContext("parents").getObject();
            var oModel = this.getView().getModel("params");
            if (obj.selected) { oModel.oData.nBselected = parseInt(oModel.oData.nBselected) + 1}
            else
                { oModel.oData.nBselected = parseInt(oModel.oData.nBselected) - 1};
            oModel.refresh();
        },
        onSelectAll : function(evt) {
            var oModel = this.getView().getModel("params");
            var oParents = this.getView().getModel("parents");
            var i;
            for (i = 0; i < oParents.oData.length; i++) {
                if (oParents.oData[i].mail) {
                    if (!oParents.oData[i].selected) {
                        oParents.oData[i].selected = true;
                        oModel.oData.nBselected = parseInt(oModel.oData.nBselected) + 1;
                    }

                }
            }
            oModel.oData.mailTemplate="facture";
            oModel.refresh();
            oParents.refresh();
        },
        onUnselectAll : function(evt) {
            var oModel = this.getView().getModel("params");
            var oParents = this.getView().getModel("parents");
            var i;
            for (i = 0; i < oParents.oData.length; i++) {
                if (oParents.oData[i].mail) {
                    if (oParents.oData[i].selected) {
                        oParents.oData[i].selected = false;
                        oModel.oData.nBselected = parseInt(oModel.oData.nBselected) - 1;
                    }

                }
            }
            oModel.oData.mailTemplate="password";
            oModel.refresh();
            oParents.refresh();
        },
        onSelectDeb : function(evt) {
            var oModel = this.getView().getModel("params");
            var oParents = this.getView().getModel("parents");
            var i;
            for (i = 0; i < oParents.oData.length; i++) {
                if (oParents.oData[i].solde<0) {
                    if (!oParents.oData[i].selected) {
                        oParents.oData[i].selected = true;
                        oModel.oData.nBselected = parseInt(oModel.oData.nBselected) + 1;
                    }
                }
                else
                {
                    if (oParents.oData[i].selected) {
                        oParents.oData[i].selected = false;
                        oModel.oData.nBselected = parseInt(oModel.oData.nBselected) - 1;
                    }
                }


            }
            oModel.oData.mailTemplate="retard";
            oModel.refresh();
            oParents.refresh();
        }
    });
});
