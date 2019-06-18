import { IOT_CONFIG } from './iotClient-variables';

const awsIot = require('aws-iot-device-sdk');
const axios = require('axios');

class iotClient {


  constructor(topic){
    this.iotTopic = topic;
  }

  config = {
    headers: {'X-Api-Key': IOT_CONFIG.xApiKey}
  };

  iotKeys = {};

  client = {};

  iotTopic = "";

  getKeys(callback, callbackError){
    let self = this;
    axios.get(IOT_CONFIG.domain)
    .then(function(response){
      self.iotKeys = response.data; // save the keys
      callback(response);
    })
    .catch(function(error){
      console.log(error);
      callbackError(error);
    });
  }

  connect(courseId, connectCallback, messageCallback, offlineCallback){
    this.iotTopic = this.iotTopic(courseId);
    this.client = awsIot.device({
      region: this.iotKeys.region,
      protocol: 'wss',
      accessKeyId: this.iotKeys.accessKey,
      secretKey: this.iotKeys.secretKey,
      sessionToken: this.iotKeys.sessionToken,
      port: 443,
      host: this.iotKeys.iotEndpoint
    });
    const onConnect = () => {
        this.client.subscribe(this.iotTopic);
        connectCallback();
    };

    const onMessage = (topic, message) => {
        message = new TextDecoder("utf-8").decode(message);
        messageCallback();
    };

    const onError = (error) => {
      console.log("onError", error);
      offlineCallback();
    };
    const onReconnect = () => {
      connectCallback();
    };
    const onOffline = () => {
      offlineCallback();
    };

    const onClose = () => {
    };


    this.client.on('connect', onConnect);
    this.client.on('message', onMessage);
    this.client.on('error', onError);
    this.client.on('reconnect', onReconnect);
    this.client.on('offline', onOffline);
    this.client.on('close', onClose);

  }

}

let iotPresent = new iotClient(IOT_CONFIG.topicPresent);
let iotMessages = new iotClient(IOT_CONFIG.topicMessages);

// export default iotPresent;
export {iotPresent, iotMessages};
