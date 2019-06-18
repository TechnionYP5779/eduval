import Auth0Lock from 'auth0-lock';
import { AUTH_CONFIG } from './auth0-variables';
import history from '../history';
import { SERVER_CONFIG } from '../Server/server-variables';
const axios = require('axios');

class Auth {

  lock = new Auth0Lock(AUTH_CONFIG.clientId, AUTH_CONFIG.domain, {
    autoclose: true,
    auth: {
      redirectUrl: AUTH_CONFIG.callbackUrl,
      responseType: 'token id_token',
      params: {
        scope: 'openid profile email user_metadata app_metadata'
      }
    },
    languageDictionary: {
      title: "EMon Log-in"
    },
    theme: {
      logo: require('../images/shards-dashboards-logo.svg'),
      primaryColor: '#007bff'
    },
    allowShowPassword: true,
    additionalSignUpFields: [
      {
    name: "first_name",
    placeholder: "your first name",
    // icon: require('../phone_icon.png'),
    // The following properties are optional
    ariaLabel: "first_name",
    // prefill: "street 123",
    validator: function(first_name) {
      return {
         valid: first_name.length > 0,
         hint: "You're required to provide first name!" // optional
        };
      }
    },
    {
    name: "last_name",
    placeholder: "your last name",
    // icon: require('../phone_icon.png'),
    // The following properties are optional
    ariaLabel: "last_name",
    // prefill: "street 123",
    validator: function(last_name) {
      return {
         valid: last_name.length > 0,
         hint: "You're required to provide last name!" // optional
        };
      }
    }, {
    name: "phone_number",
    placeholder: "your phone number",
    // icon: require('../phone_icon.png'),
    // The following properties are optional
    ariaLabel: "Phone",
    // prefill: "street 123",
    validator: function(phone_number) {
      return {
         valid: phone_number.length === 10 || phone_number.length === 0,
         hint: "Must have 10 digits" // optional
        };
      }
    },]
  });


  constructor() {
    this.handleAuthentication();
    // binds functions to keep this context
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
  }

  login() {
    // Call the show method to display the widget.
    this.lock.show();
  }

  handleAuthentication() {
    // Add a callback for Lock's `authenticated` event
    this.lock.on('authenticated', this.setSession.bind(this));
    // Add a callback for Lock's `authorization_error` event
    this.lock.on('authorization_error', (err) => {
      console.log(err);
      alert(`Error: ${err.error}. Check the console for further details.`);
      history.replace('/');
    });
  }

  async setSession(authResult) {
    if (authResult && authResult.accessToken && authResult.idToken) {
      // Set the time that the access token will expire at
      let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
      localStorage.setItem('access_token', authResult.accessToken);
      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem('expires_at', expiresAt);
      localStorage.setItem('sub', authResult.idTokenPayload.sub);
      this.registerTeacher();
      // navigate to the home route

    }
  }

  logout() {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('sub');
    localStorage.removeItem('teacher_id');
    // navigate to the home route
    history.replace('/');
  }

  getUserInfo(callback){
    let access_token = localStorage.getItem('access_token');
    if(access_token != null){
      this.lock.getUserInfo(access_token, callback);
    }
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  registerTeacher(){
    let config = {
      headers: {'X-Api-Key': SERVER_CONFIG.xApiKey}
    };
    let teacher_id = localStorage.getItem('teacher_id');
    if (teacher_id != null){
      history.replace('/');
      return;
    }

    let sub = localStorage.getItem('sub');
    if(sub == null){
      history.replace('/');
      return;
    }
    axios.get(SERVER_CONFIG.domain + '/teacher/byToken/'+new Buffer(sub).toString('base64'), config)
    .then(function(response){
      localStorage.setItem('teacher_id', response.data.id);
      history.replace('/');
    })
    .catch(function(error){
      if (error.response === null || error.response.status !== 404){
        console.log(error);
        history.replace('/');
        return;
      }
      // lazy registration to EMON DB
      auth.getUserInfo(function(error, profile){
        if (error) {
          console.log(error);
          history.replace('/');
          return;
        }
        axios.post(SERVER_CONFIG.domain + '/teacher', {authIdToken: new Buffer(sub).toString('base64'),
          name: profile.nickname,
          email: profile.email,
          phoneNum: profile[SERVER_CONFIG.phone_number]}, config)
        .then(function(response){
          localStorage.setItem('teacher_id', response.data);
          history.replace('/');
        })
        .catch(function(error) {
          console.log(error);
          history.replace('/');
        });
      });
    });
  }

}


let auth = new Auth();

export default auth;
