sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast"
], function (BaseController,MessageToast) {

  "use strict";
    
  var firebase;
  var firestore; 
  var auth;

  return BaseController.extend("dccstravelrequests.controller.LogInView", {
    
    onInit: function () {
     // Initialize firebase
     firebase = this.getOwnerComponent().getModel("firebase")
     firestore = firebase.getData().firestore;
     auth = firebase.getData().auth;
    },
    
    /**
    * Button for login user 
    */
    onLoginClick: function () {
      let email = this.getView().byId("email").getValue();
      let password = this.getView().byId("password").getValue();
      auth.signInWithEmailAndPassword(email, password).then(userCredential => {
        let user = userCredential.user;
        let roleDocument = firestore.collection("roles").doc(user.uid);
        roleDocument.get().then(doc => {
          if (doc.exists) {
            if (doc.data().role == "admin") {
              this.getOwnerComponent().getTargets().display("TargetMainViewContainerAdmin", {
                fromTarget: "mainviewcontaineradmin",
              });
            } else if (doc.data().role == "editor") {
              this.getOwnerComponent().getTargets().display("TargetMainViewContainerEditor", {
                fromTarget: "mainviewcontainereditor",
              });
            } else  {
              this.getOwnerComponent().getTargets().display("TargetMainViewContainerUser", {
                fromTarget: "mainviewcontaineruser",
              });
            }
          } else {
            MessageToast.show("Sign in failed");
          } 
        })
      }).catch(error => {
        MessageToast.show("Sign in failed");
      });
    },
  });
});