import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";

export default ({ store, Vue }) => {
  const config = process.env.FIREBASE_CONFIG;
  firebase.initializeApp(config);
  firebase.analytics();
  Vue.prototype.$firebase = firebase;

  return new Promise(resolve => {
    firebase.auth().onAuthStateChanged(user => {
      store.commit(
        "auth/setUser",
        user && user.emailVerified
          ? {
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
              photoURL: user.photoURL
            }
          : null
      );
      resolve();
    });
  });
};
