sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast"
], function (Controller, MessageToast) {
   "use strict";
   return Controller.extend("ecole.famille.controller.Suivi", {
    init : function(){

    },
      onShowHello : function () {
         // read msg from i18n model
         var oBundle = this.getView().getModel("i18n").getResourceBundle();


         // show message
          var oData = sap.ui.getCore().getModel("famille");
        console.log("Init suivi",oData);
          oData.refresh();

      }
   });
});
