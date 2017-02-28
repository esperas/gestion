sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "../model/formatter",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, formatter, JSONModel) {
    "use strict";
    return Controller.extend("ecole.gestion.controller.Import", {

        _updateRunning : false,



        handleFiles: function(oEvent)
        {
            var oFileToRead = oEvent.getParameters().files["0"];
            var reader = new FileReader();
            // Read file into memory as UTF-8
            reader.readAsText(oFileToRead);
            // Handle errors load
            reader.onload = loadHandler;
            reader.onerror = errorHandler;

            function loadHandler(event) {
                var csv = event.target.result;
                 window.oModels["params"].oData.ui_importArea = csv;
                 window.oModels["params"].refresh();

            }

            function errorHandler(evt) {
                if(evt.target.error.name == "NotReadableError") {
                    alert("Cannot read file !");
                }
            }
        },



        isValidJson : function (json) {
            try {
                JSON.parse(json);
                return true;
            } catch (e) {
                return false;
            }
        },


         onInit : function () {

             // attach handlers for validation errors
			sap.ui.getCore().attachValidationError(function (evt) {
				var control = evt.getParameter("element");
				if (control && control.setValueState) {
					control.setValueState("Error");
				}
			});
			sap.ui.getCore().attachValidationSuccess(function (evt) {
				var control = evt.getParameter("element");
				if (control && control.setValueState) {
					control.setValueState("None");
				}
			});

		},

        callAPI : function (obj,url) {
            return new Promise(function(resolve, reject) {
                var api = $.ajax({
                    url: url,
                    type: "POST",
                    data: JSON.stringify(obj),
                    //crossDomain: true,
                    headers:  { 'Accept' : 'application/json' ,
                               'Content-Type': 'application/json' }
                              ,
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader ("Authorization", "Basic " + btoa(window.oModels["params"].oData._username + ":" + window.oModels["params"].oData._password));
                    },
                    xhrFields: {
                        withCredentials: true
                        },
                    success: function (data, status, jqXHR) {
                        //console.log("OK : ", data);
                        window.oModels["params"].oData.nbOK += 1;
                        window.oModels["params"].refresh();
                        resolve(data);
                        },
                    error: function (jqXHR, status, err) {
                        window.failed.push(this.data) ;
                        console.log("POST Error",err, this.data);
                        window.oModels["params"].oData.nbKO += 1;
                        window.oModels["params"].refresh();
                        resolve(this.data);
                        },
                    complete: function (jqXHR, status) {
                        //console.log(window.failed);
                        window.oModels["params"].oData.nbTodo -= 1;
                        window.oModels["params"].refresh();
                        }
                    });
            })

        },


        onImportSuivi : function (evt) {

            var flag = window.oModels["params"].oData._updateRunning;
            if (flag) {return;};

            window.failed = [];
            var texteArea = this.byId('importArea');
            var value = texteArea.getValue();

            // Remise a zero du control in-line
            texteArea.setValueState("None");

            if (!this.isValidJson(value)) {
                //obj.setValueStateText("Argggggg");
                texteArea.setValueState("Error");
                return;
            };

            var url = evt.oSource.data("url");


            window.failed = [];
            var obj = JSON.parse(value);

            if (obj.length>0){
                window.oModels["params"].oData._updateRunning = true;
            };

            window.oModels["params"].oData.nbTab = obj.length;
            window.oModels["params"].oData.nbTodo = obj.length;
            window.oModels["params"].oData.nbKO = 0;
            window.oModels["params"].oData.nbOK = 0;
            window.oModels["params"].refresh();
            texteArea.setBusy(true);

            var promises = [];
            var i;
            for (i = 0; i < obj.length; i++) {
                promises.push(this.callAPI(obj[i], url)); // push the Promises to our array
            };

            Promise.all(promises).then(function(dataArr) {
                console.log(window.failed);
                texteArea.setValue("[" + window.failed + "]");
                texteArea.setBusy(false);
                window.oModels["params"].oData._updateRunning = false;
                var maj = { "maj" : new Date().toISOString().slice(0, 10)};
                console.log(maj);
                $.ajax({
                    url: window.oModels["params"].oData._url_maj,
                    type: "PATCH",
                    data: JSON.stringify(maj),
                    //crossDomain: true,
                    headers:  { 'Accept' : 'application/json' ,
                               'Content-Type': 'application/json' }
                              ,
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader ("Authorization", "Basic " + btoa(window.oModels["params"].oData._username + ":" + window.oModels["params"].oData._password));
                    },
                    xhrFields: {
                        withCredentials: true
                        },
                    success: function (data, status, jqXHR) {
                        console.log("Date de MAJ OK");
                    },
                    error: function (jqXHR, status, err) {
                        },
                    complete: function (jqXHR, status) {
                        //console.log(window.failed);
                        }
                    });



            }).catch(function(err) {
                console.log(err);
            });

        },
        onNavBack : function (oEvent) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("appHome");
        }
    });
});
