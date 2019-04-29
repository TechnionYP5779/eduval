/* eslint jsx-a11y/anchor-is-valid: 0 */
import history from '../history';
import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardFooter,
  Badge,
  Button,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Form,
  Slider,
  FormInput,
  FormCheckbox
} from "shards-react";
import axios from 'axios';

import Colors from "../components/components-overview/Colors";
import Checkboxes from "../components/components-overview/Checkboxes";
import RadioButtons from "../components/components-overview/RadioButtons";
import ToggleButtons from "../components/components-overview/ToggleButtons";
import SmallButtons from "../components/components-overview/SmallButtons";
import SmallOutlineButtons from "../components/components-overview/SmallOutlineButtons";
import NormalButtons from "../components/components-overview/NormalButtons";
import NormalOutlineButtons from "../components/components-overview/NormalOutlineButtons";
import Forms from "../components/components-overview/Forms";
import FormValidation from "../components/components-overview/FormValidation";
import CompleteFormExample from "../components/components-overview/CompleteFormExample";
import ProgressBars from "../components/components-overview/ProgressBars";
import ButtonGroups from "../components/components-overview/ButtonGroups";
import InputGroups from "../components/components-overview/InputGroups";
import SeamlessInputGroups from "../components/components-overview/SeamlessInputGroups";
import CustomFileUpload from "../components/components-overview/CustomFileUpload";
import DropdownInputGroups from "../components/components-overview/DropdownInputGroups";
import CustomSelect from "../components/components-overview/CustomSelect";

import PageTitle from "../components/common/PageTitle";


import awsIot  from 'aws-iot-device-sdk';





class Lesson extends React.Component {


  constructor(props) {


        super(props);

    const getContent = function(url) {
      return new Promise((resolve, reject) => {
    	    const lib = url.startsWith('https') ? require('https') : require('http');
    	    const request = lib.get(url, (response) => {
    	      if (response.statusCode < 200 || response.statusCode > 299) {
    	         reject(new Error('Failed to load page, status code: ' + response.statusCode));
    	       }

    	      const body = [];
    	      response.on('data', (chunk) => body.push(chunk));
    	      response.on('end', () => resolve(body.join('')));
    	    });
    	    request.on('error', (err) => reject(err))
        })
    };
    let client;

    let connect = async () => {
    	return getContent('https://qh6vsuof2f.execute-api.eu-central-1.amazonaws.com/dev/iot/keys').then((res) => {
    		res = JSON.parse(res)
    		client = awsIot.device({
                region: res.region,
                protocol: 'wss',
                accessKeyId: res.accessKey,
                secretKey: res.secretKey,
                sessionToken: res.sessionToken,
                port: 443,
                host: res.iotEndpoint
            });
    	})

    }
    var url='lesson/'+this.props.match.params.id+'/messages/'+localStorage.getItem('student_id');

    let counter=0;
    connect().then(() => {

      client.subscribe(url);

      client.publish(url,JSON.stringify( {
        value: 0,
        messageReason: "blabla",
        messageType: "EMON"
      }));
      client.on('message', (topic, message) => {
        console.log("topic: " + topic);
        var res=JSON.parse(message);
        console.log("message: " + res.value)
      })
    });





    this.state = {

      reward_money : 5,
      lesson_id : 5,
      student_id : 6,
      chosen_smile : -1,
      chosen_message : -1,

    name: "string",
    teacherId: 0,
    location: "string",
    description: "string",
    startDate: "2019-04-27",
    endDate: "2019-04-27",

      messages: [{
          message: "I have a question",
          id: 1
      },
      {
          message: "I didn't understand",
          id: 2
      },
      {
          message: "I need to leave the class",
          id: 3
      }
    ],
      smileys: [{
          smile: "🙂",
          type: "success",
          id: 1
        },
        {
          smile: "👍",
          type: "success",
          id: 2
        },
        {
          smile: "☝",
          type: "success",
          id: 3
        },
        {
          smile: "✌",
          type: "success",
          id: 4
        },
        {
          smile: "😐",
          type: "warning",
          id: 5
        },
        {
          smile: "🙁",
          type: "warning",
          id: 6
        },
        {
          smile: "😰",
          type: "danger",
          id: 7
        },
        {
          smile: "👎",
          type: "danger",
          id: 8
        }
      ],

   };
   let headers = {
       'X-Api-Key': 'BXGK1t57pTgLKxmReo869MWY2qQey4U4n7fsHjii'
   };
   axios.get('https://xycqr0g9ra.execute-api.eu-central-1.amazonaws.com/dev/course/'+this.props.match.params.id,
    {headers: headers})
    .then((response) => {
    this.setState(
      {name: response.data.name ,description : response.data.description,location: response.data.location});

    console.log(this.state.name);
  })
  .catch((error)=>{
    console.log(error);
  });


}




  render() {

   const {messages, smileys} = this.state;
    return (
      <Container fluid className="main-content-container px-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title={this.state.name} subtitle="Lesson View" className="text-sm-left" />
        </Row>
        {/* First Row of Posts */}
        <Row>
          <Col lg="8" className="mb-4">
          <Card small className="mb-4 p-0 px-3 pt-1">
              <CardHeader >
                <h5 className="m-0">Information </h5>

                <div className="mt-2">
                <p></p>
                  <p style={{fontSize:"20px" ,textAlign:"center"}}> Current E-Money Earned: {this.state.reward_money} </p>
                </div>
              </CardHeader>

            </Card>
            <Card small className="mb-4">
              <CardHeader className="border-bottom">
                <h5 className="m-0">Teacher's Messages</h5>
                <h7 style={{fontSize:"12px"}}>Emojis and messages from the teacher will appear here</h7>
              </CardHeader>

              <ListGroup flush>
                <ListGroupItem className="p-0 px-3 pt-3">
                  <Row>

                  </Row>
                </ListGroupItem>
              </ListGroup>
            </Card>
            <a href={"/course-summery/" + this.state.lesson_id}><Button style={{fontSize:"17px"}}  className="mb-4 mr-4" onClick={()=>{

                    }}>
                     Leave Lesson
                    </Button></a>
          </Col>

          <Col lg="4" className="mb-4">
            {/* Sliders & Progress Bars */}
            <Card small className="mb-4">
              <CardHeader className="border-bottom">
                <h6 className="m-0">Send To Teacher</h6>
              </CardHeader>
              <ListGroup flush>
              <div className="mb-2 pb-1" style={{margin:"10px"}}>
                <h7 style={{fontSize:"12px"}}>Choose an emoji to send</h7>
                </div>
                <Row style={{margin:"2px"}}>
                {smileys.map((smile, idx) => (
                  <Col xs="3">
                  {
                    (this.state.chosen_smile == smile.id) &&
                    <Button style={{fontSize:"20px"}} theme={smile.type} className="mb-2 mr-1" onClick={()=>{
                      console.log("unchosing", smile.id);
                      this.setState({chosen_smile : -1});
                    }}>
                      {smile.smile}
                    </Button>
                  }
                  {
                    (this.state.chosen_smile != smile.id) &&
                    <Button outline style={{fontSize:"20px"}} theme={smile.type} className="mb-2 mr-1" onClick={()=>{
                      console.log("chosing", smile.id);
                      console.log("current", this.state.chosen_smile);
                      this.setState({chosen_smile : smile.id});
                    }}>
                      {smile.smile}
                    </Button>
                  }

                </Col>))}
                </Row>
                  <div className="mb-2 pb-1" style={{margin:"10px"}}>
                <h7 style={{fontSize:"12px"}}>Choose a message to send</h7>
                </div>
                <Row style={{margin:"2px"}}>
                {messages.map((message, idx) => (
                  <Col xs="8">
                  {
                    (this.state.chosen_message == message.id) &&
                    <Button style={{fontSize:"13px"}} className="mb-2 mr-1" onClick={()=>{
                      console.log("unchosing", message.id);
                      this.setState({chosen_message : -1});
                    }}>
                      {message.message}
                    </Button>
                  }
                  {
                    (this.state.chosen_message != message.id) &&
                    <Button outline style={{fontSize:"13px"}} className="mb-2 mr-1" onClick={()=>{
                      console.log("chosing", message.id);
                      console.log("current", this.state.chosen_message);
                      this.setState({chosen_message : message.id});
                    }}>
                      {message.message}
                    </Button>
                  }

                </Col>))}
                </Row>
              </ListGroup>
            </Card>

          </Col>
        </Row>

      </Container>
    );
  }
}

export default Lesson;
