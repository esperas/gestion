sap.ui.define([], function () {
	"use strict";

	return {
        formatButton: function (sPiece) {
            if (sPiece) { return true};
            return false;

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
