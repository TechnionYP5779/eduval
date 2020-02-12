import { IOT_CONFIG } from './iotClient-variables';

const awsIot = require('aws-iot-device-sdk');
const axios = require('axios');

class iotClient {


  constructor(topic){
    this.iotTopicPresent = IOT_CONFIG.topicPresent;
    this.iotTopicMessage = IOT_CONFIG.topicMessages;
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
      console.log("Error in getKeys in iotClient.js", error);
      callbackError(error);
    });
  }

  connect(course_id, student_id, connectCallback, messageCallback, offlineCallback){
    this.messageTopic = this.iotTopicMessage(course_id, student_id);
    this.presentTopic = this.iotTopicPresent(course_id);
    this.client = awsIot.device({
      region: this.iotKeys.region,
      protocol: 'wss',
      accessKeyId: this.iotKeys.accessKey,
      secretKey: this.iotKeys.secretKey,
      sessionToken: this.iotKeys.sessionToken,
      port: 443,
      host: this.iotKeys.iotEndpoint,
      connectTimeout: 10*1000,
      maximumReconnectTimeMs: 15*1000,
    });
    const onConnect = () => {
      this.client.subscribe(this.messageTopic);
      this.client.subscribe(this.presentTopic);
      console.log("On Connect")
      connectCallback();
    };

    const onMessage = (topic, message) => {
        message = new TextDecoder("utf-8").decode(message);
        messageCallback(topic,message);
    };

    const onError = (error) => {
      console.log("Error in connect in iotClient.js", error);
      offlineCallback();
    };
    const onReconnect = () => {
      console.log("On reconnect");
    };
    const onOffline = () => {
      console.log("On offline");
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
// export default iotPresent;

let iotclient = new iotClient();

export default iotclient;
