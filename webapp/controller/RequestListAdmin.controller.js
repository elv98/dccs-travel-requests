sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
 
],function (Controller,JSONModel,) {
    
  "use strict";

  var firebase;
  var firestore; 
  var auth;
  var unsubscribe;

  return Controller.extend("dccstravelrequests.controller.RequestList", {

    onInit: function () {
      // Initialize firebase
      firebase = this.getOwnerComponent().getModel("firebase")
      firestore = firebase.getData().firestore;
      auth = firebase.getData().auth;

      // Start observing auth state    
      auth.onAuthStateChanged(admin => {
        if (admin) {
          unsubscribe= firestore.collection("travel-requests").orderBy("approved", "desc").onSnapshot((querySnapshot) => {
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
    * Button for Approve new request 
    */
    onApproveButton: function(oEvent){
      let  travelRequest = oEvent.getSource().getBindingContext().getObject();
      this.detailTravelRequestDialog.close();
      firestore.collection("travel-requests").doc(travelRequest.id).update({
        approved: "Approved",
      });
      let email = {
        to: "dccstravelrequesteditor@gmail.com",
        message: {
          subject: "Travel request confirmation mail.",
          text: `Approved travel request for employee ${travelRequest.data.name}. `+
          'You need to reserve hotel and travel transportation. '+
          'Buy travel insurance, prepare documentation and make all payments for hotel and transportation.'
        },
      }
      firestore.collection("mail").add(email)
    },
   
    /**
    * Button for Denied new request user
    */
    onDeniedButton: function(oEvent){
      var travelRequest= oEvent.getSource().getBindingContext().getObject();
      this.detailTravelRequestDialog.close();
      firestore.collection("travel-requests").doc(travelRequest.id).update({
      approved: "Denied",
      })
    },
   
    /**
    * Close view travel request button
    */
    onCloseDetailView: function () {
     this.detailTravelRequestDialog.close();
    },
   

    onCloseStatusView :function () {
      this.dialogStatus.close();
    },

    /**
    * Open travel request detail view
    */
    openTravelRequestDetailView: function (oEvent) {
      var oSelectedItemBinding = oEvent.getSource().getBindingContext();
      if (!this.detailTravelRequestDialog) {
         this.detailTravelRequestDialog = sap.ui.xmlfragment(
          "dccstravelrequests.view.DetailViewAdmin",
          this
        );
      }
      this.detailTravelRequestDialog.setBindingContext(oSelectedItemBinding);
      this.getView().addDependent(this.detailTravelRequestDialog) 
      this.detailTravelRequestDialog.open();
    },
  });
});