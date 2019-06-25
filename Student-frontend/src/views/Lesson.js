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
  FormCheckbox,
  Alert
} from "shards-react";
import axios from 'axios';
import TimeoutAlert from "../components/common/TimeoutAlert";
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
import CoinImage from "../images/midEcoin.png"
import PageTitle from "../components/common/PageTitle";


import awsIot  from 'aws-iot-device-sdk';
import "./Lesson.css";

const headers = {
    'Authorization': 'Bearer ' + localStorage.getItem('idToken')
};
const EmojiEnum = {
      "EMOJI_HAPPY": "🙂",
      "EMOJI_THUMBS_UP" : "👍",
      "EMOJI_ANGEL": "👼",
      "EMOJI_GRIN":"😄",
      "EMOJI_SHUSH":"🤐",
      "EMOJI_ZZZ":"😴",
      "EMOJI_ANGRY":"😠",
      "EMOJI_THUMBS_DOWN":"👎"
};

var client;




class Lesson extends React.Component {

  constructor(props) {
      super(props);

  this.state = {

      reward_money : 0,
      lesson_id : props.match.params.id,
      student_id : localStorage.getItem('student_id'),
      chosen_smile : -1,
      chosen_message : -1,

    name: "string",
    teacherId: 0,
    location: "string",
    description: "string",

      messageRows: [[{
          message: "I have a question",
          enum: "MESSAGE_QUESTION",
          color:"Tomato",
          id: 0
      },
      {
          message: "I didn't understand",
          enum: "MESSAGE_CONFUSED",
          color:"Violet",
          id: 2
      }],
      [{
          message: "May I go out?",
          enum: "MESSAGE_NEED_TO_LEAVE",
          color:"Orange",
          id: 3
      },
      {
          message: "I know the answer!",
          enum: "MESSAGE_ANSWER",
          color:"MediumSeaGreen",
          id: 4
      }],
      [{
          message: "Speak louder please",
          enum: "MESSAGE_LOUDER",
          color:"SlateBlue",
          id: 5
      }]
    ],currentEmojis: [],
   };
   const getHistory=() =>{
    var LessonsMessageURL='lesson/'+this.state.lesson_id+'/messages/'+localStorage.getItem('student_id');
    var LessonsStatusURL = 'lesson/'+this.state.lesson_id+'/status';
    this.setState(prevState => ({
    reward_money : 0
      }));
      this.setState(prevState => ({
      currentEmojis : []
    }));
    axios.get('https://api.emon-teach.com/'+LessonsMessageURL,
     {headers: headers})
     .then((response) =>
     {

       //iterating over the recieved messages
      var data=response.data;
      for(var res of data){
        //if got an emoji
        if(res.messageType != "EMON"){
            this.setState(prevState => ({
            currentEmojis : [...this.state.currentEmojis, EmojiEnum[res.emojiType]]
          }));
        }else
        {
          //if got an emoji
          var updated_reward_money = this.state.reward_money ? this.state.reward_money : 0;
          updated_reward_money +=res.value

          this.setState(prevState => ({
          reward_money : updated_reward_money
        }));
      }
   }})
   .catch((error)=>{
     console.log(error);
   });

   }




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


    var connect = async () => {
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
    var LessonsMessageURL='lesson/'+this.state.lesson_id+'/messages/'+localStorage.getItem('student_id');
    var LessonsStatusURL = 'lesson/'+this.state.lesson_id+'/status';
    let counter=0;
    connect().then(() => {

      client.subscribe(LessonsMessageURL);
      client.subscribe(LessonsStatusURL);
      //checking if a message was sent
      getHistory();

      const onReconnect = () => {
        getHistory();
      };
      client.on('reconnect', onReconnect);



      client.on('message', (topic, message) => {
        if(topic === LessonsMessageURL){
            var res=JSON.parse(message);
            if(res.messageType === "EMOJI"){
                this.setState(prevState => ({
                currentEmojis : [...this.state.currentEmojis, EmojiEnum[res.emojiType]]
              }));
              this.setState({message: "You got an Emoji from your teacher: "+ EmojiEnum[res.emojiType], success: true});
              window.scrollTo(0, 0);
            }else{
              let updated_reward_money = +this.state.reward_money + +res.value
              this.setState(prevState => ({
              reward_money : updated_reward_money
            }));
            this.setState({message: "You got "+ res.value+" Emons from your teacher!", success: true});
              window.scrollTo(0, 0);
            }

        }else{

              axios.delete('https://api.emon-teach.com/'+LessonsMessageURL,
               {headers: headers});

              this.setState({message: "The lesson ended", success: false});
              window.scrollTo(0, 0);
              window.location.href = "/course-summery/" + JSON.stringify( {
                  id: this.state.lesson_id,
                  reward_money: this.state.reward_money,
                  emojis: this.state.currentEmojis
                })

            }


      })
    });
   axios.get('https://api.emon-teach.com/course/'+this.state.lesson_id,
    {headers: headers})
    .then((response) => {
    this.setState(
      {name: response.data.name ,description : response.data.description,location: response.data.location});
  })
  .catch((error)=>{
    console.log(error);
  });


}





  render() {

   const {messageRows, smileys} = this.state;


    return (
      <div>
        {this.state.error &&
    <Container fluid className="px-0" >
      <TimeoutAlert className="mb-0" theme="danger" msg={this.state.message} time={3000} />
    </Container>
    }
    {this.state.success &&
    <Container fluid className="px-0">
    <TimeoutAlert className="mb-0" theme="success" msg={this.state.message} time={3000} />
    </Container>
    }
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
                  <p style={{fontSize:"20px" ,textAlign:"center"}}> Current E-Money Earned: {this.state.reward_money} <img style={{width:"2em", marginLeft:"0.2em", marginBottom:"0.2em"}} src={CoinImage} /></p>
                </div>
              </CardHeader>

            </Card>
            <Card small className="p-0 px-3 pt-3">
              <CardHeader className="border-bottom">
                <h5 className="m-0">Teacher's Messages</h5>
                <h7 style={{fontSize:"17px"}}>Emojis from Teacher:</h7><br /><br />
                <ul className='rows' style={{textAlign:'center', padding:'0'}}>
                {this.state.currentEmojis.map((smile) => (<li style={{display:'inline', margin:'5px', fontSize:'2em'}} className='row'>{smile}</li>))}
                </ul>
              </CardHeader>


            </Card>
          </Col>

          <Col lg="4" className="mb-4" >
            {/* Sliders & Progress Bars */}
            <Card small className="mb-4" >
              <CardHeader className="border-bottom">
                <h5 className="m-0">Send message to the teacher</h5>
              </CardHeader>
              <ListGroup flush>
                  <div className="mb-2 pb-1" style={{margin:"10px"}}>
                <h7 style={{fontSize:"17px"}}>Choose a message to send</h7>
                </div>
                {messageRows.map((messages, idx) => (
                <Row style={{margin:"2px"}}>
                {messages.map((message, idx) => (
                  <Col>
                  {
                    (this.state.chosen_message == message.id) &&
                    <Button outline="none" style={{fontSize:"13px", borderColor:message.color ,color:message.color, background:'white'}} className="mb-2 mr-1" onClick={()=>{
                      this.setState({chosen_message : -1});
                    }}>
                      {message.message}
                    </Button>
                  }
                  {
                    (this.state.chosen_message != message.id) &&
                    <Button outline style={{fontSize:"13px", borderColor:message.color ,color:message.color, background:'white'}} className="mb-2 mr-1" onClick={()=>{;
                      this.setState({chosen_message : message.id});
                      axios.post(
                      'https://api.emon-teach.com' + "/lesson/" + this.state.lesson_id + "/teacherMessages" ,
                      {messageType: "MESSAGE", studentId:  this.state.student_id, content: message.enum},
                      {headers: headers})
                    .then( (response) =>{
                        this.setState({message: "Your message sent to your teacher!", success: true});
                        window.scrollTo(0, 0)});
                    }} >
                      {message.message}
                    </Button>
                  }

                </Col>))}
                </Row>
                ))}
              </ListGroup>

            </Card>

          </Col>
        </Row>

      </Container>
      </div>
    );
  }
}

export default Lesson;
