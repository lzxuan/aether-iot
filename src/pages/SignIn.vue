<template>
  <q-page padding>
    <div id="firebaseui-auth-container"></div>
    <div
      class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-sign-in"
      v-if="card.show"
    >
      <div class="firebaseui-card-header">
        <h1 class="firebaseui-title">{{ card.title }}</h1>
      </div>
      <div class="firebaseui-card-content">
        <p class="firebaseui-text">
          {{ card.text }}
        </p>
      </div>
      <div class="firebaseui-card-actions">
        <div class="firebaseui-form-actions">
          <button
            @click="startSignInUI"
            class="firebaseui-button mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
            data-upgraded=",MaterialButton"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

const CARD_UI = {
  verification: {
    show: true,
    title: "Verification email sent",
    text: "Check your inbox for the instruction to verify your email"
  },
  tooManyRequests: {
    show: true,
    title: "Too many requests",
    text:
      "We have blocked all requests from this device due to unusual activity<br>try again later"
  },
  hide: {
    show: false,
    title: "",
    text: ""
  }
};

export default {
  name: "SignIn",
  data() {
    return {
      card: CARD_UI.hide
    };
  },
  methods: {
    startSignInUI() {
      let ui = firebaseui.auth.AuthUI.getInstance();
      if (!ui) {
        ui = new firebaseui.auth.AuthUI(firebase.auth());
      }
      let uiConfig = {
        callbacks: {
          signInSuccessWithAuthResult: (authResult, redirectUrl) => {
            if (!authResult.user.emailVerified) {
              authResult.user.sendEmailVerification();
              this.card = CARD_UI.verification;
              return false;
            }
            return true;
          },
          signInFailure: (error) => {
            if (error.code == "auth/too-many-requests") {
              this.card = CARD_UI.tooManyRequests;
            }
          }
        },
        signInSuccessUrl: "/",
        signInOptions: [
          // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
          // "microsoft.com",
          // firebase.auth.GithubAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID
        ]
      };
      ui.start("#firebaseui-auth-container", uiConfig);
    }
  },
  mounted() {
    this.startSignInUI();
  }
};
</script>
