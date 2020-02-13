import auth0 from 'auth0-js';
import { AUTH_CONFIG } from './auth0-variables';
import history from '../history';
import { SERVER_CONFIG } from '../Server/server-variables';
const axios = require('axios');

class Auth {

  accessToken;
  idToken;
  expiresAt;
  sub;

  auth0 = new auth0.WebAuth({
    domain: AUTH_CONFIG.domain,
    clientID: AUTH_CONFIG.clientId,
    redirectUri: AUTH_CONFIG.callbackUrl,
    responseType: 'token id_token',
    sso: false,
    scope: 'openid  profile email user_metadata app_metadata'
  });

  constructor() {

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getIdToken = this.getIdToken.bind(this);
    this.renewSession = this.renewSession.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);

    let accessToken = localStorage.getItem('accessToken');
    let idToken = localStorage.getItem('idToken');
    let expiresAt = localStorage.getItem('expiresAt');
    let sub = localStorage.getItem('sub');
    let payload = localStorage.getItem('payload');

    if (accessToken != null)
      this.accessToken = accessToken;
    if (idToken != null)
      this.idToken = idToken;
    if (expiresAt != null)
      this.expiresAt = expiresAt;
    if (sub != null)
      this.sub = sub;
  }

  login(param) {
    var additional = param? ("?DemoLesson="+param) : "";
    this.auth0.authorize({redirectUri:AUTH_CONFIG.callbackUrl+additional});
  }
  

  handleAuthentication(callback) {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        history.replace('/');
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }

      callback();
    });
  }

  getAccessToken() {
    return this.accessToken;
  }

  getIdToken() {
    return this.idToken;
  }

  setSession(authResult) {
    // Set the time that the access token will expire at
    let expiresAt = (authResult.expiresIn * 1000) + new Date().getTime();
    this.accessToken = authResult.accessToken;
    this.idToken = authResult.idToken;
    this.expiresAt = expiresAt;
    this.sub = authResult.idTokenPayload.sub;

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('expiresAt', expiresAt);
    localStorage.setItem('accessToken', authResult.accessToken);
    localStorage.setItem('idToken', authResult.idToken);
    localStorage.setItem('sub', authResult.idTokenPayload.sub);
    localStorage.setItem('payload', JSON.stringify(authResult.idTokenPayload));

    // navigate to the home route
  }

  getUserInfo(callback){
    let access_token = this.accessToken;
    if(access_token != null){
      this.auth0.client.userInfo(access_token, callback);
    }
  }

  renewSession() {
    this.auth0.checkSession({}, (err, authResult) => {
       if (authResult && authResult.accessToken && authResult.idToken) {
         this.setSession(authResult);
       } else if (err) {
         this.logout();
         console.log(err);
         alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
       }
    });
  }

  logout() {
    // Remove tokens and expiry time
    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = 0;

    // Remove isLoggedIn flag from localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('expiresAt');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');
    localStorage.removeItem('sub');
    localStorage.removeItem('student_id');

    this.auth0.logout({
      returnTo: window.location.origin
    });

    // navigate to the home route
    // history.replace('/');
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = this.expiresAt;
    return new Date().getTime() < expiresAt;
  }

}


let auth = new Auth();

export default auth;
