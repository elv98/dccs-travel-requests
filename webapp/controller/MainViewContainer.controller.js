sap.ui.define([
  "sap/ui/core/mvc/Controller"
],function (Controller) {
  
  "use strict";
  
  return Controller.extend("dccstravelrequests.controller.StyleViewUser", {
        
    onInit: function () {},
      
    /**
    * logout user from page
    */
    logoutUser: function () {
      let auth = this.getOwnerComponent().getModel("firebase").getData().auth;            
      auth.signOut().then(() => {
        this.getOwnerComponent().getTargets().display("TargetLogInView", {
          fromTarget: "loginview",
        });
      }).catch(error => {});
    },
  });
});
  