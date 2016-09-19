sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "../model/formatter",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, formatter, JSONModel) {
    "use strict";
    return Controller.extend("ecole.gestion.controller.Suivi", {
        formatter : formatter,

        onPDF : function(evt) {
            var obj = evt.getSource().getBindingContext("famille").getObject();
            console.log(obj);
            var url = "./json/facture/" + jQuery.sap.getUriParameters().get("parent") + "-" + obj.piece + ".pdf";
            window.open(url);
        }
    });
});
