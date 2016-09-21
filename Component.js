sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel",
    "./controller/ConfirmMail"
], function (UIComponent, JSONModel, ResourceModel, ConfirmMail) {
    "use strict";
    return UIComponent.extend("ecole.gestion.Component", {
        metadata : {
            manifest: "json"
        },
        init : function () {
            // call the init function of the parent
            UIComponent.prototype.init.apply(this, arguments);

            // set i18n model
            var i18nModel = new ResourceModel({
                bundleName : "ecole.gestion.i18n.i18n"
            });
            this.setModel(i18nModel, "i18n");
            // set dialog
			this.ConfirmMail = new ConfirmMail();
        }
    });
});
