sap.ui.define(["sap/ui/model/json/JSONModel"], function (JSONModel) {
  "use strict";

  // Firebase-config retrieved from the Firebase-console
  const firebaseConfig = {
    apiKey: "AIzaSyCv4QXX4DI1u8bdGDEMT6tHAWCtT3Qi3m8",
    authDomain: "dccs-travel-requests.firebaseapp.com",
    projectId: "dccs-travel-requests",
    storageBucket: "dccs-travel-requests.appspot.com",
    messagingSenderId: "929440664153",
    appId: "1:929440664153:web:3d6234a078ba184c597f48",
  };

  return {
    initializeFirebase: function () {
      // Initialize Firebase with the Firebase-config
      firebase.initializeApp(firebaseConfig);

      // Create a Firestore reference
      const firestore = firebase.firestore();
      const auth = firebase.auth();

      // Firebase services object
      const oFirebase = {
        firestore: firestore,
        auth: auth,
      };

      // Create a Firebase model out of the oFirebase service object which contains all required Firebase services
      var fbModel = new JSONModel(oFirebase);

      // Return the Firebase Model
      return fbModel;
    },
  };
});
