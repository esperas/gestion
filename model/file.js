sap.ui.define([], function () {
    "use strict";

    return {

        isUploadVisible : function(sIdFile, sTypeDoc){
          if ((!sIdFile)&&(sTypeDoc=='F'||sTypeDoc=='A'||sTypeDoc=='NDF')){
              return true;
          }
          return false;
        },

        isDeleteButton : function(sIdfile, sTypeDoc){
            if (sTypeDoc=='F'||sTypeDoc=='A'||sTypeDoc=='NDF'){
                return true;
            }
            return false;
        },

        setPassword : function() {
            var oParams = sap.ui.getCore().getModel("params");
            var oSuivi = sap.ui.getCore().getModel("suivi");
            oSuivi.setLogon({"username" : oParams.getProperty('/_username'),
                             "password" : oParams.getProperty('/_password')});
            console.log(oParams.getProperty('/_username'), 'Password set to Suivi')

        },

        invalidateSolde : function(){
          sap.ui.getCore().getModel('parents').setProperty('/invalid', true);
        },

        successCallback : function(oData){
            console.log("Chargement Model component OK, set password from LocalStorage")
            // Après lecture des données params, vérification du logon, si aucune valeur, on vérifie dans le sotckage local
            jQuery.sap.require("jquery.sap.storage");
            var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
            //var oParams = sap.ui.getCore().getModel('params');
            var logon = { 'username' : oData['_username'], "password" : oData['_password']};
            if ((!logon.username)&&(!logon.password)) {
                logon = oStorage.get("logon");
                if (logon){
                    oData['_username'] = logon.username;
                    oData['_password'] = logon.password;
                }
            }
            return oData;
        },

      reloadSuivi : function() {
          sap.ui.getCore().getModel("suivi").loadDataFromPath();
      },

      calculTotalSuivi : function(oData){
          var total = 0, i=0;
          for (i=0; i<oData.suivi.length ; i++) {
              if ((oData.suivi[i].typedoc=='F')&&(oData.suivi[i].status!='X')){
                  total += 1;
              }
          }
          oData['totalImpayer'] = total;
          return oData;
      },


      loadData : function() {

         var oParams = sap.ui.getCore().getModel("params");
         if ((oParams.getProperty('/_username'))&&(oParams.getProperty('/_password'))) {
             sap.ui.getCore().getModel("suivi").loadDataFromPath();
             sap.ui.getCore().getModel("users").loadDataFromPath();
             sap.ui.getCore().getModel("parents").loadDataFromPath();
             sap.ui.getCore().getModel("files").loadDataFromPath();
             sap.ui.getCore().getModel("divers").loadDataFromPath();
         }
      },

        cachedModel : function( key, url, callback ) {
            console.log("cachedModel ", key, "demandé" )
            if ( !window.cachedScriptPromises[ key ] ) {
                window.cachedScriptPromises[ key ] = $.Deferred(function( defer ) {
                    console.log("Executer script : ", key, "url:", url)
                    url += "?=unique" + new Date().getTime();
                var jqxhr = $.ajax({
                    url: url,
                    type: "GET",
                    headers: { 'Accept': 'application/json' },
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader ("Authorization", "Basic " + btoa(window.oModels["params"].oData._username + ":" + window.oModels["params"].oData._password));
                    },
                    xhrFields: {
                        withCredentials: true
                        },
                    success: function (data, status, jqXHR) {
                        console.log("Cached Model ", key, " Read success.");
                        if (data._embedded) {
                           window.oModels[key].setData(data._embedded);
                        } else {
                            window.oModels[key].setData(data);
                        }
                        window.oModels[key].refresh();
                        defer.resolve()
                        },
                    error: function (jqXHR, status, err) {
                        defer.reject()
                        console.log(key, "Local error callback.");
                        },
                    complete: function (jqXHR, status) {
                        //console.log(key, "Local completion callback.");
                        }
                    });
                });
            }
            return window.cachedScriptPromises[ key ].done( callback );
        },

         checkFile : function ( address ) {
            console.log("Vérification Fichier Parent : ",address)
            var href = window.location.origin + window.location.pathname;  // On retirer la chaine de recherche
            if (href.search("index.html")!=-1) {
                href = href.slice(0, href.search("index.html"));
            }
            address =  href + address;
            var client = new XMLHttpRequest();
            client.addEventListener("load", this.returnStatus);
            client.open( "GET", address );
            client.send();
        },
        returnStatus : function ( oEvent ) {
            if ( oEvent.currentTarget.status === 200 ) {
                console.log( 'file exists!' );
            }
            else {
                console.log( 'file does not exist! status: ' + status );
                window.router.navTo("nologin");
            }
        },


    };
});
