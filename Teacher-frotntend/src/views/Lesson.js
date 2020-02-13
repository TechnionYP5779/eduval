/* eslint jsx-a11y/anchor-is-valid: 0 */
import history from '../history';
import React from "react";
import Badge from 'react-bootstrap/Alert'

import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardFooter,
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
import PropTypes from 'prop-types';
import TimeoutAlert from "../components/common/TimeoutAlert"
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
import Sliders from "../components/components-overview/Sliders";
import ProgressBars from "../components/components-overview/ProgressBars";
import ButtonGroups from "../components/components-overview/ButtonGroups";
import InputGroups from "../components/components-overview/InputGroups";
import SeamlessInputGroups from "../components/components-overview/SeamlessInputGroups";
import CustomFileUpload from "../components/components-overview/CustomFileUpload";
import DropdownInputGroups from "../components/components-overview/DropdownInputGroups";
import CustomSelect from "../components/components-overview/CustomSelect";
import LinkIcon from '@material-ui/icons/Link';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';

import PageTitle from "../components/common/PageTitle";
import AttendStudentCard from "../components/lessonCards/AttendStudentCard";
import RegisteredStudentsCard from "../components/lessonCards/RegisteredStudentsCard";
import StudentMessageCard from "../components/lessonCards/StudentMessageCard";
import { withTranslation } from "react-i18next";

import iotclient from "../iotClient/iotClient";
import server from "../Server/Server";

var QRCode = require('qrcode.react');

const LightTooltip = withStyles(theme => ({
  tooltip: {
    boxShadow: theme.shadows[1],
    fontSize: 20,
    marginTop: "-0.5em"
  },
}))(Tooltip);

const styles = theme => ({
  delete:{
    color: "#2A5DB0"
  },

  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflowWrap:"break-word",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  qr: {
    margin: "auto",
    display: "block",
    maxWidth: "60%"
  }

});



class Lesson extends React.Component {


  constructor(props) {
    super(props);

    this.money_input_ref = React.createRef();
    this.money_slide_ref = React.createRef();

    this.state = {
      // =========== for testing UI =================
      demi_students: [
        {id: 1, name: "anny", desk: "3"},
        {id: 2, name: "danny", desk: "8"},
        {id: 3, name: "roye", desk: "10"}
      ],

      demi_messages: [
        {content: "MESSAGE_QUESTION", studentId: 1},
        {content: "MESSAGE_NEED_TO_GO", studentId: 3},
        {content: "MESSAGE_QUESTION", studentId: 2}
      ],
      // ============================================

      // =========== coins definitions ==============

      coins: [
        {
          value: 1,
          src: require("./../images/coins/1coin.png")
        },
        {
          value: 2,
          src: require("./../images/coins/2coin.png")
        },
        {
          value: 5,
          src: require("./../images/coins/5coin.png")
        },
        {
          value: 10,
          src: require("./../images/coins/10coin.png")
        }
      ],

      // ============================================

      // ========= messages definitions =============

      smileys: [
        {
          smile: "🙂",
          type: "success",
          id: 1,
          name: "EMOJI_HAPPY"
        },
        {
          smile: "👍",
          type: "success",
          id: 2,
          name: "EMOJI_THUMBS_UP"
        },
        {
          smile: "😇",
          type: "success",
          id: 3,
          name: "EMOJI_ANGEL"
        },
        {
          smile: "😁",
          type: "success",
          id: 4,
          name: "EMOJI_GRIN"
        },
        {
          smile: "🤐",
          type: "warning",
          id: 5,
          name: "EMOJI_SHUSH"
        },
        {
          smile: "😴",
          type: "warning",
          id: 6,
          name: "EMOJI_ZZZ"
        },
        {
          smile: "😠",
          type: "danger",
          id: 7,
          name: "EMOJI_ANGRY"
        },
        {
          smile: "👎",
          type: "danger",
          id: 8,
          name: "EMOJI_THUMBS_DOWN"
        }
      ],

      message_types: [
        {text:"I have a question.", color:"Tomato", content: "MESSAGE_QUESTION"},
        {text: "May I go out?", color:"Orange", content: "MESSAGE_NEED_TO_LEAVE"},
        {text:"I know the answer!", color:"MediumSeaGreen", content: "MESSAGE_ANSWER"},
        {text:"I didn't understand.", color:"Violet", content: "MESSAGE_CONFUSED"},
        {text:"Could you speak louder, please?", color:"SlateBlue", content: "MESSAGE_LOUDER"}
      ],

      // ============================================

      messages: [],

      show_messaged: false,

      show_messaged_color: false,

      messaged_students: new Set([]),

      showing_student: true,

      showing_messages: true,

      disabled: false,

      connected: false,

      reward_money : 5,

      chosen_students: [],

      students: [],

      registered_students:[],

      course_id:this.props.match.params.id,

      course_name: "",

      student_message_counter: [0,0,0,0,0],

      link_modal_open: false,

      demo_course: false,

      demo_link: "",
    };

    this.unchooseStudent = this.unchooseStudent.bind(this);
    this.handleShowUpdate = this.handleShowUpdate.bind(this);
    this.handleSuccessTrue = this.handleSuccessTrue.bind(this);

    this.setLinkModalChange = this.setLinkModalChange.bind(this)
    this.handleLinkModalOpen = this.handleLinkModalOpen.bind(this)
    this.handleLinkModalClose = this.handleLinkModalClose.bind(this)

  }

  handleShowUpdate(obj){
    console.log("messages", this.state.messages);
    var type = obj.content;
    var color = obj.color;
    let messaged_students = new Set([]);
    if (this.state.show_messaged == type){
      this.setState({show_messaged: false, messaged_students: messaged_students});
    }
    else{
      let messages = this.state.messages;

      for (var j in messages){
        if (messages[j].content == type)
          messaged_students.add(messages[j].studentId);
      }
      this.setState({show_messaged: type, show_messaged_color: color, messaged_students: messaged_students});
    }
  }

  unchooseStudent(id){
    let tmp_chosen = this.state.chosen_students;
    tmp_chosen.splice(tmp_chosen.indexOf(id), 1);
    this.setState({chosen_students : tmp_chosen});
  }

  handleSuccessTrue = () => {
    this.setState({success:true});

    if(this.state.success==true) {
        setTimeout(function(){
             this.setState({success:false});
        }.bind(this),10000);  // wait 5 seconds, then reset to false
   }
  };


  componentDidMount() {

    let self = this;
    let courseId = this.props.match.params.id;



    server.getRegisteredStudents(function(responseReg){
      self.setState({registered_students: responseReg.data});
    }, (error)=>{console.log("Error in getRegisteredStudents in componentDidMount in Lessons.js", error)}, courseId);

    let onConnect = ()=>{

      server.getAttendingStudents(function(responseAtt){
        responseAtt.data.sort(function(a,b){
          return a.id.localeCompare(b.id);
        });

        server.getAttendingStudentsEmons(function(responseEmon){
          responseEmon.data.sort(function(a,b){
            return a.studentId.localeCompare(b.studentId);
          });
          var tmp = [];
          var index = 0;

          for (index = 0; index<responseEmon.data.length; index++){
            if((responseAtt.data[index]).id == (responseEmon.data[index]).studentId)
            {
              var newstud =
              {
                id: (responseAtt.data[index]).id,
                name: (responseAtt.data[index]).name,
                email: (responseAtt.data[index]).email,
                phoneNum: (responseAtt.data[index]).phoneNum,
                desk: (responseAtt.data[index]).desk,
                emons: (responseEmon.data[index]).emons
              }
              tmp.push(newstud);
            }
            else {
              console.log("ERROR THERE ARE DIFFERENT ID's IN THE RESPONSES");
            }
          }
          console.log("preSort", tmp);
          tmp.sort(function(a,b){
            return parseInt(a.desk)-parseInt(b.desk);
          });
          console.log("postSort", tmp);
          self.setState({students: tmp});

          }, function(error) {
            console.log("Error in getAttendingStudentsEmons in componentDidMount in Lessons.js", error)
          }, courseId)


      }, (error)=>{console.log("Error in getAttendingStudents in componentDidMount in Lessons.js", error)}, courseId);

      server.getMessagesFromStudents(function(response){
        self.setState({messages: response.data});

        var count = [0,0,0,0,0];
        for (var i in self.state.messages){
          for (var c in [...Array(5).keys()])
            {
              if (self.state.messages[i].content == self.state.message_types[c].content)
              count[c] ++;
            }
        }
        self.setState({student_message_counter: count})

      }, (error)=>{
        console.log("Error in getMessagesFromStudents in componentDidMount in Lessons.js", error);
      }, courseId);

      if (!self.state.connected)
        self.setState({connected: true});
    }

    let onMessages = (topic,message)=>
    {
      if(topic=="lesson/"+courseId+"/teacherMessages")
      {
        console.log(self.state.messages);
        var tmp = self.state.student_message_counter;
        console.log("new message");
        console.log(JSON.parse(message));
        for (var c in [...Array(5).keys()])
        {
          if (JSON.parse(message).content == self.state.message_types[c].content)
          {
            tmp[c]++;
          }
        }
        console.log(tmp);
        self.setState({student_message_counter: tmp});
        /*Updated counter, now update message log*/

        var tmpmessages = self.state.messages;
        tmpmessages.push(JSON.parse(message));
        self.setState({messages: tmpmessages});
      }
      else if (topic=="lesson/"+courseId+"/present")
      {
        var tmpstudents = self.state.students;
        var newstud =
        {
          id: JSON.parse(message).id,
          name:JSON.parse(message).name,
          email: JSON.parse(message).email,
          phoneNum: JSON.parse(message).phoneNum,
          desk: JSON.parse(message).desk,
        };
        newstud.emons=5;
        newstud.desk=JSON.parse(message).desk;
        tmpstudents.push(newstud);
        tmpstudents.sort(function(a,b){
          return parseInt(a.desk)-parseInt(b.desk);
        });

        self.setState({students:tmpstudents});
      }

      else {
        console.log("Got Unexpected Topic???");
      }
      if (!self.state.connected)
          self.setState({connected: true});
    }

    let onOffline = ()=>{
      if (self.state.connected)
        self.setState({connected: false});
    }


    iotclient.getKeys(function(response){
      iotclient.connect(courseId, onConnect, onMessages, onOffline);
    }, (error)=>{
        console.log("Error in getKeys in componentDidMount in Lessons.js", error);
      });

    server.getCourse(function(response){
      console.log("Get Course Response", response)
      if(response.data.demoLink){
        self.setState({
          demo_course:true,
          demo_link: response.data.demoLink
        })
      }
      self.setState({course_name: response.data.name});
    }, (error)=>
        {
          console.log("Error in getCourse in componentDidMount in Lessons.js", error);
        }, courseId);

  }
  setLinkModalChange(value)
  {
    this.setState({link_modal_open: value})
  }

  handleLinkModalOpen = () => {
    this.setLinkModalChange(true);
  };

  handleLinkModalClose = () => {
    this.setLinkModalChange(false);
  };

  render() {

    const onSlideChange = (val) =>{
      this.setState({reward_money : val[0]});
    }

    const onInputChange = (val) => {
      this.setState({reward_money : val.target.value});
    }

    const {students, smileys, show_messaged, messaged_students, show_messaged_color} = this.state;

    let unchooseStudent = this.unchooseStudent;
    let handleShowUpdate = this.handleShowUpdate;

    let self = this;
    const classes = this.props.classes;

    const { t } = this.props;

    return (
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={this.state.link_modal_open}
          onClose={this.handleLinkModalClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={this.state.link_modal_open}
          style={{maxWidth: "60%"}}>
            <div className={classes.paper}>
              <h2 
                id="transition-modal-title" 
                style={{
                  textAlign:"center",
                  color:"#2A5DB0",
                  textDecorationLine: 'underline',
                }}
              >Invite Link and QR Code</h2>
              <h1 
                style={{
                  textAlign:"center",
                  fontFamily: "monospace"
                }}
              > {this.state.demo_link}</h1>
              <QRCode size="2000" value={this.state.demo_link} className={classes.qr}/>
            </div>
          </Fade>
        </Modal>


      {this.state.error &&
      <TimeoutAlert className="mb-0" theme="danger" msg={t("An error has occured")+"!"} time={10000}/>
      }
      {this.state.success &&
      <TimeoutAlert className="mb-0" theme="success" msg={t("Messages sent successfully!")} time={10000}/>
      }
      <Container fluid className="main-content-container px-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <Col xs="10" sm="10" md="10" lg="10">
            <PageTitle sm="4" title={this.state.course_name} subtitle={t("Lesson View")} className="text-sm-left" />
          </Col>
          <Col xs="2" sm="2" md="2" lg="2" style={{textAlign: "right" }}>
            <LightTooltip title={t("Show Invite Link and QR Code")} placement="bottom-end" className={classes.tooltip}>
              <IconButton aria-label="links"
                className={classes.delete}
                disabled={!this.state.demo_course}
                onClick={this.handleLinkModalOpen}
                edge="end"
                size="small"
              >
                <LinkIcon style={{ fontSize: 60 }}/>
              </IconButton>

            </LightTooltip>
          </Col>
        </Row>
        {/* First Row of Posts */}
        <Row>
          <Col lg="8" className="mb-4">
            <AttendStudentCard
            title={t("Attending Students")}
            subtitle={t("Pick the students you want to send E-Money to")}
            students={this.state.students}
            isChosen = {(id) =>
            {
              return (this.state.chosen_students.indexOf(id) >= 0);
            }}
            buttonClick = {(id) =>
              {
                if (this.state.chosen_students.indexOf(id) >= 0)
                {
                  unchooseStudent(id);
                }
                else {
                  let tmp_chosen = this.state.chosen_students;
                  tmp_chosen.push(id);
                  this.setState({chosen_students : tmp_chosen, success: false, error: false});
                }
              }
            }


            isMessaged = {(id) =>
              {
                return(messaged_students.has(id));
              }
            }

            messageColored = {() => {
              return show_messaged_color;}}
            />
            <StudentMessageCard
            title={t("Messages from Students")}
            subtitle={t("Click button to see who sent the messages")}
            student_message_counter={self.state.student_message_counter}
            show_questions={()=>{handleShowUpdate(this.state.message_types[0]);}}
            show_go_out={()=>{handleShowUpdate(this.state.message_types[1])}}
            show_answer={()=>{handleShowUpdate(this.state.message_types[2]);}}
            show_confused={()=>{handleShowUpdate(this.state.message_types[3]);}}
            show_louder={()=>{handleShowUpdate(this.state.message_types[4]);}}

            clearMessages = {(num)  =>
              {
                if(this.state.show_messaged==this.state.message_types[num].content){
                  //If it's chosen currently, unchoose it
                  handleShowUpdate(this.state.message_types[num]);
                }
                server.deleteLessonMessages(
                  function(response){console.log("Deleted Messages "+ num)}, function(error)
                  {
                    console.log("Error in deleteLessonMessages in clearMessages passed to StudentMessageCard in Lessons.js", error);
                    console.log("Error clearing messages of type " + num);
                  }, this.state.course_id, this.state.message_types[num].content
                );
                var indexes_to_remove=[];
                for(var m in this.state.messages)
                {
                  if (this.state.messages[m].content == this.state.message_types[num].content)
                  {
                    indexes_to_remove.push(m);
                  }
                }
                var counter=0;
                var filtered_messages = this.state.messages;
                for (var i in [...Array(indexes_to_remove.length).keys()])
                {
                  filtered_messages.splice(i-counter,1);
                  counter++;
                }
                this.setState({messages:filtered_messages});
                var tmpcounter = this.state.student_message_counter;
                tmpcounter[num]=0;
                this.setState({student_message_counter: tmpcounter});
              }}

            />

          </Col>

          <Col lg="4" className="mb-4" >
            {/* Sliders & Progress Bars */}
            <Card small className="mb-4">
              <CardHeader className="border-bottom">
                <h6 className="m-0">{t("Rewards & Emojis")}</h6>
              </CardHeader>
              <ListGroup flush>
              <div className="mb-2 pb-1" style={{margin:"10px"}}>
                <h6 style={{fontSize:"12px"}}>{t("Choose an emoji to send")}</h6>
                </div>
                <Row style={{margin:"2px"}}>
                {smileys.map((smile, idx) => (
                  <Col xs="3" key={idx}>
                    <Button outline disabled={this.state.disabled} style={{fontSize:"1.3em"}} theme={smile.type} className="mb-2 mr-1"
                    onClick={()=>{
                      if (this.state.chosen_students.length === 0)
                        return;
                      this.setState({disabled: true});
                      let counter = 0;
                      let success = true;
                      let error_state = false;
                      let self = this;
                      server.sendEmoji(function(response){
                        counter ++;
                        if (counter === self.state.chosen_students.length){
                          self.handleSuccessTrue();
                          self.setState({chosen_students: [], error: error_state, disabled: false});
                          window.scrollTo(0, 0);
                        }
                      }, function(error){
                        success = false;
                        error_state = true;
                        counter ++;
                        if (counter === self.state.chosen_students.length){
                          self.setState({chosen_students: [], success: success, error: error_state, disabled: false});
                          window.scrollTo(0, 0);
                        }
                        console.log("Error in sendEmoji in onClick passed to Rewards & Emojis in Lessons.js", error);
                      }, smile.name, this.state.chosen_students, this.props.match.params.id);
                    }}>
                      {smile.smile}
                    </Button>

                </Col>))}
                </Row>
                <hr style={{backgroundColor: "#a4a4a4", width: "95%"}} />

                <div className="mb-2 pb-1" style={{margin:"10px"}}>
                  <h6 style={{fontSize:"12px"}}>{t("Or choose amount of E-Money to send")}</h6>
                  </div>
                  <Row style={{margin:"2px"}}>
                  {this.state.coins.map((coin, idx) => (
                    <Col xs="3" key={idx}>
                      <Button outline disabled={this.state.disabled} style={{padding:"0.5em"}} theme="warning" className="mb-2 mr-1" onClick={()=>{
                        if (this.state.chosen_students.length === 0)
                          return;
                        this.setState({disabled: true});
                        let counter = 0;
                        let success = true;
                        let error_state = false;
                        let self = this;
                        console.log("self.state.chosen_students");console.log(self.state.chosen_students);
                        var tmpstudents = self.state.students;
                        var index =  0;

                        for (index = 0; index<self.state.chosen_students.length; index++)
                        {
                          var currindex = tmpstudents.findIndex(
                            function(student, ind, array){
                              console.log("Looking for");
                              console.log(self.state.chosen_students[index]);
                              return student.id==self.state.chosen_students[index];
                          })
                          var currstud = tmpstudents[currindex];
                          console.log("currstud");
                          console.log(currstud);
                          currstud.emons += coin.value;
                          tmpstudents[currindex] = currstud;
                        }

                        server.sendEMoney(function(response){
                          counter ++;
                          if (counter === self.state.chosen_students.length){
                            self.handleSuccessTrue();
                            self.setState({chosen_students: [], error: error_state, disabled: false, students: tmpstudents});

                            window.scrollTo(0, 0);
                          }
                        }, function(error){
                          success = false;
                          error_state = true;
                          counter ++;
                          if (counter === self.state.chosen_students.length){
                            self.setState({chosen_students: [], success: success, error: error_state, disabled: false});
                            window.scrollTo(0, 0);
                          }
                          console.log("Error in sendEMoney in onClick passed to Rewards & Emojis in Lessons.js", error);
                        }, coin.value, "participation", this.state.chosen_students, this.props.match.params.id);
                      }}>
                      <img
                        className="user-avatar rounded-circle"
                        style={{width: "3em", height: "3em", marginRight: "0"}}
                        src={coin.src}
                        alt={coin.value + " E-Money"}
                      />
                      </Button>

                  </Col>))}
                  </Row>
              {// <div className="mb-2 pb-1" style={{margin:"10px"}}>
              //
              //   <Slider
              //     ref = {this.money_slide_ref}
              //     id="money_slider"
              //     theme="primary"
              //     className="my-4"
              //     connect={[true, false]}
              //     start={[this.state.reward_money]}
              //     value={[this.state.reward_money]}
              //     step={1}
              //     range={{ min: 0, max: 10 }}
              //     tooltips
              //     onChange={onSlideChange}
              //   />
              // </div>
            }
                    <div className="mb-2 pb-1" style={{margin:"10px"}}>
                  <Button theme="primary" disabled={this.state.disabled}
                  style={{float:"right"}}
                  className="mb-2 mr-1"
                  onClick={()=>{
                    this.setState({disabled: true});
                    let self = this;
                    server.changeLessonStatus(function(response){
                      server.deleteLessonMessages(()=>{
                        history.push("/my-courses");
                      }, (err)=>{
                        console.log("Error in deleteLessonMessages in onClick in End Class in Lessons.js", err);
                      }, self.props.match.params.id);
                    }, function(error){
                      console.log("Error in changeLessonStatus in onClick in End Class in Lessons.js", error);
                      self.setState({disabled: false, error: true});
                    }, this.props.match.params.id, "LESSON_END");
                  }}>
                    {t("End Class")}
                  </Button>
                  </div>

              </ListGroup>
            </Card>
          </Col>

        </Row>
        <Row>
          <RegisteredStudentsCard
          registered_students={this.state.registered_students}
          students={this.state.students}
          courseDetails={false}
          />
        </Row>
      </Container>
      </div>
    );
  }
}

Lesson.propTypes = {
  classes:PropTypes.object.isRequired,
};


export default withTranslation()(withStyles(styles)(Lesson));
