sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast",
], function (Controller, JSONModel, MessageToast) {

  "use strict";

  var firebase;
  var firestore; 
  var auth;

  return Controller.extend("dccstravelrequests.controller.RequestListUser", {

    onInit: function () {
      
      // Initialize firebase
      firebase = this.getOwnerComponent().getModel("firebase")
      firestore = firebase.getData().firestore;
      auth = firebase.getData().auth;

      // Start observing auth state
      auth.onAuthStateChanged(user => {
        if (user) {
          // User is logged in start observing travel requests collection
          var unsubscribe = firestore.collection("travel-requests").where("uid", "==", user.uid).onSnapshot((querySnapshot) => {
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
          // User logged out stop observing collection and clear list
          if (unsubscribe) {
            unsubscribe()
          }
          unsubscribe = null
        }
      })
    },

    /**
    * Open new request dialog
    */
    onOpenDialogNewRequest: function () {
      if (!this.newRequestDialog) {
        this.newRequestDialog = sap.ui.xmlfragment(
          "dccstravelrequests.view.NewRequest",
          this
        );
        let oModel = new JSONModel(
          sap.ui.require.toUrl("dccstravelrequests/model/TravelRequest.json")
        );
        this.newRequestDialog.setModel(oModel);
      }
      let oModel = new JSONModel(
        sap.ui.require.toUrl("dccstravelrequests/model/TravelRequest.json")
      );
      this.newRequestDialog.getModel().setData(oModel)
      this.newRequestDialog.open();
    },
      
    /**
    * Save new travel request
    */
    onSaveButtonPress: function (oEvent) {
      let newRequestData = oEvent.getSource().getModel().getData().data;
      if (newRequestData.name && newRequestData.place && newRequestData.startDate && newRequestData.endDate) {
        newRequestData.uid = auth.currentUser.uid
        firestore.collection("travel-requests").add(newRequestData).then(() => {
          MessageToast.show("Save succesful");
          this.newRequestDialog.close();
        }).catch(() => {
          MessageToast.show("Save failed");
        });
      } else {
        MessageToast.show("New travel request form incomplete!")
      }
    },

    /**
    * Close new travel request button
    */
    onCancelButtonPress: function () {
      this.newRequestDialog.close();
    },

    /**
    * Delete travel request
    */
    deleteTravelRequest: function (oEvent) {  
      let travelRequest = oEvent.getSource().getBindingContext().getObject();
      firestore.collection("travel-requests").doc(travelRequest.id).delete().then(() => {
        MessageToast.show("Delete succesful");
      }).catch(() => {
       MessageToast.show("Delete failed");
      });
    },

    /**
    * Open travel request detail view
    */
    openTravelRequestDetailView: function (oEvent) {
      let selectedItemBinding = oEvent.getSource().getBindingContext();
      if (!this.detailTravelRequestDialog) {
        this.detailTravelRequestDialog = sap.ui.xmlfragment(
            "dccstravelrequests.view.DetailViewUser",
            this
        );
      }
      this.detailTravelRequestDialog.setBindingContext(selectedItemBinding);
      this.getView().addDependent(this.detailTravelRequestDialog); 
      this.detailTravelRequestDialog.open();
    },

    /**
    * Close travel request detail view
    */
    onCloseDetailView: function () {
      this.detailTravelRequestDialog.close();
    },
  });
});