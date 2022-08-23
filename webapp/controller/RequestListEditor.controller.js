sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
], function (Controller, JSONModel) {
  
  "use strict";
  
  var firebase;
  var firestore; 
  var auth;
  var unsubscribe;

  return Controller.extend("dccstravelrequests.controller.RequestListEditor", {
      
    onInit: function(){
      // Initialize firebase
      firebase = this.getOwnerComponent().getModel("firebase")
      firestore = firebase.getData().firestore;
      auth = firebase.getData().auth;

      // Start observing auth state    
      auth.onAuthStateChanged(editor => {
        if (editor) {
          unsubscribe= firestore.collection("travel-requests").where("approved","==","Approved").onSnapshot((querySnapshot) => {
            let requests = []
            querySnapshot.forEach((doc) => {
              let travelRequest = {
                id: doc.id,
                data: doc.data()
              }
              requests.push(travelRequest)
          });
            let data = {
              requests: requests
            }
            let oModel = new JSONModel(data);
            this.getView().setModel(oModel);
          });
        } else {
          if (unsubscribe) {
            unsubscribe()
          }
          unsubscribe = null;
        }
      })
    },  

    /**
    * Open to edit travel request
    */
    openTravelRequestEditView: function (oEvent) {
      var oSelectedItemBinding = oEvent.getSource().getBindingContext()
      if (!this.detailTravelRequestDialog) {
        this.detailTravelRequestDialog = sap.ui.xmlfragment(
          "dccstravelrequests.view.DetailViewEditor",
          this
        );
      }
      this.detailTravelRequestDialog.setBindingContext(oSelectedItemBinding);
      this.getView().addDependent(this.detailTravelRequestDialog);
      this.detailTravelRequestDialog.open();
    },

    /**
    * Save edited travel request
    */
    onSaveButtonPress: function (oEvent) {
      let oCurrentRequest = oEvent.getSource().getBindingContext().getObject().data;
      firestore.collection("travel-requests").doc(oCurrentRequest.id).update(oCurrentRequest);
      this.detailTravelRequestDialog.close();
    },
      
    /**
    * Close edit travel request button
    */
    onCloseEditView: function () {
      this.detailTravelRequestDialog.close();
    },
  });
});
  