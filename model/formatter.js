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
        }
	};
});
