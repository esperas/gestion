sap.ui.define([], function () {
    "use strict";

    return {

        createURL : function( piece ) {

        },

        cachedModel : function( key, url, callback ) {
            console.log("cachedModel ", key, "demandé" )
            if ( !window.cachedScriptPromises[ key ] ) {
                window.cachedScriptPromises[ key ] = $.Deferred(function( defer ) {
                    console.log("Executer script : ", key, "url:", url)
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
                        if (key=="parents"){
                            window.oModels[key].setData(data._embedded);
                        } else if ((key=="suivi")||(key=="users")){
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
