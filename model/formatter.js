sap.ui.define([], function () {
	"use strict";

	return {
        formatButton: function (sPiece) {
            if (sPiece) { return true};
            return false;

        },

        formatFile : function(sType, sValue) {

        jQuery.sap.require("sap.ui.core.format.FileSizeFormat");
            if (sType=='size'){

				return sap.ui.core.format.FileSizeFormat.getInstance({
					binaryFilesize : false,
					maxFractionDigits : 1,
					maxIntegerDigits : 3
				}).format(sValue);

			} else {
				return sValue;
			}
        },

        isNotEmpty: function (sValue) {
            if (sValue) { return true};
            return false;
        },
        isPayable: function (sType, sStatus) {
            if ((sType=="F")&&(sStatus!="X")) { return true};
            return false;
        },
        isFactureRegle: function (sMode, sRefid) {
            if ((sMode=="new")&&(sRefid)) { return true};
            return false;
        }
	};
});
