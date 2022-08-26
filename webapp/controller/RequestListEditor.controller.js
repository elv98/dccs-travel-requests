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
      let oCurrentRequest = oEvent.getSource().getBindingContext().getObject();
      let oCurrentRequestData = oCurrentRequest.data;
      firestore.collection("travel-requests").doc(oCurrentRequest.id).update(oCurrentRequest.data);
      if(oCurrentRequestData.documentation 
        && oCurrentRequestData.hotelAddress 
        && oCurrentRequestData.hotelName 
        && oCurrentRequestData.transportation 
        && oCurrentRequestData.insurance
      ){
        let hotelPaidForString = "You need to pay for the hotel.";
        if(oCurrentRequestData.hotelPaid){
          hotelPaidForString = "Hotel is payed.";
        }
        let email = {
          to: "dccstravelrequestsuser@gmail.com",
          message: {
            subject: "Travel request confirmation mail.",
            text: `Hotel name and address: ${oCurrentRequestData.hotelName} ${oCurrentRequestData.hotelAddress}.\n`
            +`Transportation: ${oCurrentRequestData.transportation}.\n`
            +`${hotelPaidForString}`
          },
        }
        firestore.collection("mail").add(email).then((docRef) => {
          console.log("Sending email success!");
        })
        .catch((error) => {
          console.error("Sending email failed!", error);
        });
      }
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
  