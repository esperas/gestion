sap.ui.define([
   "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
   "use strict";
   return Controller.extend("ui5.template.controller.App", {
      onShowHello : function () {
         // show a popup with Toast
          MessageToast.show("Hello World");
      }
   });
});
