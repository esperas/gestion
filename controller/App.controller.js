sap.ui.define([
    'jquery.sap.global',
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel'
], function(jQuery, Controller, JSONModel) {
    "use strict";

    var TableController = Controller.extend("ecole.famille.controller.App", {

        onInit: function () {
            // set explored app's demo model on this sample
            var oModel = new sap.ui.model.json.JSONModel("./json/data.json");  //use path relative to the Root

            sap.ui.getCore().setModel(oModel);


        }
    });


    return TableController;

});
