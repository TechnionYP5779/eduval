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

import PageTitle from "../components/common/PageTitle";
import {iotPresent, iotMessages} from "../iotClient/iotClient";
import server from "../Server/Server";


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

      course_name: ""
    };

    this.unchooseStudent = this.unchooseStudent.bind(this);
    this.handleShowUpdate = this.handleShowUpdate.bind(this);
  }

  handleShowUpdate(type, color){
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

  componentDidMount() {

    let self = this;

    let courseId = this.props.match.params.id;

    let onConnectPresent = ()=>{
      server.getAttendingStudents(function(response){
        response.data.sort(function(a,b){
          return parseInt(a.desk)-parseInt(b.desk);
        });
        self.setState({students: response.data});
      }, (error)=>{}, courseId);
      if (!self.state.connected)
        self.setState({connected: true});
    }

    let onConnectMessages = ()=>{
      server.getMessagesFromStudents(function(response){
        self.setState({messages: response.data});
      }, (error)=>{
        console.log(error);
      }, courseId);
      if (!self.state.connected)
        self.setState({connected: true});
    }

    let onOffline = ()=>{
      if (self.state.connected)
        self.setState({connected: false});
    }


    iotPresent.getKeys(function(response){
      iotPresent.connect(courseId, onConnectPresent, onConnectPresent, onOffline);
    }, (error)=>{});

    iotMessages.getKeys(function(response){
      iotMessages.connect(courseId, onConnectMessages, onConnectMessages, onOffline);
    }, (error)=>{});

    server.getCourse(function(response){
      self.setState({course_name: response.data.name});
    }, (error)=>{}, courseId);

  }


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

    return (
      <div>
      {this.state.error &&
      <TimeoutAlert className="mb-0" theme="danger" msg={"An error has occured!"} time={10000}/>
      }
      {this.state.success &&
      <TimeoutAlert className="mb-0" theme="success" msg={"Messages sent successfully!"} time={10000}/>
      }
      <Container fluid className="main-content-container px-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title={this.state.course_name} subtitle="Lesson View" className="text-sm-left" />
        </Row>
        {/* First Row of Posts */}
        <Row>
          <Col lg="8" className="mb-4">
            <Card small className="mb-4">
              <CardHeader className="border-bottom">
                <Row>
                  <Col sm="11">
                    <h5 className="m-0">Attending Students</h5>
                    <h6 style={{fontSize:"12px"}}>Pick the students you want to send E-Money too</h6>
                  </Col>
                  <Col sm="1">
                    <Button style={{padding:"0px"}} onClick={()=>{this.setState({showing_student:!this.state.showing_student});}}>
                      {this.state.showing_student && <i className="material-icons" style={{fontSize:"26px"}}>&#xE5CE;</i>}
                      {!this.state.showing_student && <i className="material-icons" style={{fontSize:"26px"}}>&#xE5CF;</i>}
                    </Button>
                  </Col>
                </Row>
              </CardHeader>

              {this.state.showing_student && <ListGroup flush>
                <ListGroupItem className="p-0 px-3 pt-3">
                  <Row>

                      {this.state.students.map((student, idx) => {
                        let color = "#007bff";
                        if (messaged_students.has(student.id))
                          color = show_messaged_color;
                        return (<Col xs="3" key={idx}>
                        {
                          this.state.chosen_students.indexOf(student.id) >= 0 &&
                          <Button disabled={this.state.disabled} style={{margin:"6px", fontWeight: "600", fontSize: "0.9em", width: "100%", "--mess-color" : color}} className="mb-2 mr-1 badge1 custom-active" data-badge={"Desk #" + student.desk} onClick={()=>{
                            unchooseStudent(student.id);
                          }}>
                            {student.name}
                          </Button>
                        }
                        {
                          this.state.chosen_students.indexOf(student.id) < 0 &&
                          <Button outline disabled={this.state.disabled} style={{margin:"6px", fontWeight: "600", fontSize: "0.9em", borderWidth:"2px", width: "100%", "--mess-color" : color}} className="mb-2 mr-1 badge1 custom-button" data-badge={"desk #" + student.desk} onClick={()=>{
                            let tmp_chosen = this.state.chosen_students;
                            tmp_chosen.push(student.id);
                            this.setState({chosen_students : tmp_chosen, success: false, error: false});
                          }}>
                            {student.name}
                          </Button>
                        }
                        </Col>
                    )})}

                  </Row>
                </ListGroupItem>
              </ListGroup>}
            </Card>

            <Card small className="mb-4">
              <CardHeader className="border-bottom">
                <Row>
                  <Col sm="11">
                    <h5 className="m-0">Messages from Students</h5>
                    <h6 style={{fontSize:"12px"}}>Click <i className="material-icons">&#xE8F4;</i> to see students who sent messages or <i className="material-icons">&#xE8F5;</i> to hide them.</h6>
                  </Col>
                  <Col sm="1">
                    <Button style={{padding:"0px"}} onClick={()=>{this.setState({showing_messages:!this.state.showing_messages});}}>
                      {this.state.showing_messages && <i className="material-icons" style={{fontSize:"26px"}}>&#xE5CE;</i>}
                      {!this.state.showing_messages && <i className="material-icons" style={{fontSize:"26px"}}>&#xE5CF;</i>}
                    </Button>
                  </Col>
                </Row>
              </CardHeader>

              {this.state.showing_messages && <table className="table mb-0">
                <thead className="bg-light" style={{color:"#485170", borderBottom: "solid 1px #eceeef"}}>
                  <tr>
                    <th scope="col" className="border-0" style={{fontWeight:"600", textAlign: "end"}}>#</th>
                    <th scope="col" className="border-0" style={{fontWeight:"600", textAlign: "center"}}>Show Senders</th>
                    <th scope="col" className="border-0" style={{fontWeight:"600", width: "45%"}}>Message Type</th>
                    <th scope="col" className="border-0" style={{fontWeight:"600"}}>
                    <Button onClick={()=>{
                      this.setState({show_messaged: false});
                      messaged_students.clear();
                      server.deleteLessonMessages(()=>{
                        server.getMessagesFromStudents((response)=>{
                          self.setState({messages: response.data});
                        }, (error)=>{}, this.props.match.params.id);
                      }, ()=>{}, this.props.match.params.id)
                    }}>
                    Clear Messages
                    </Button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                {this.state.message_types.map((messtype, idx) => {
                  var count = 0;
                  for (var i in this.state.messages){
                    if (this.state.messages[i].content == messtype.content)
                      count ++;
                  }
                  return (
                  <tr style={{color:messtype.color, "--mess-color" : messtype.color, borderBottom: "solid 1px #eceeef"}} key={idx}>

                    <td scope="col" className="border-0" style={{fontWeight:"600", textAlign: "end"}}>{count}</td>
                    <td scope="col" className="border-0" style={{fontWeight:"600", textAlign: "center"}}>
                      {show_messaged != messtype.content && <Button className="mb-2 mr-1 custom-button" onClick={()=>{handleShowUpdate(messtype.content, messtype.color);}}>
                        <i className="material-icons">&#xE8F4;</i>
                      </Button>}
                      {show_messaged == messtype.content && <Button className="mb-2 mr-1 custom-active" onClick={()=>{handleShowUpdate(messtype.content, messtype.color);}}>
                        <i className="material-icons">&#xE8F5;</i>
                      </Button>}
                    </td>
                    <td scope="col" className="border-0" style={{fontWeight:"600"}}>{messtype.text}</td>
                  </tr>
                );}
              )}
              </tbody>
              </table>}
            </Card>

          </Col>

          <Col lg="4" className="mb-4">
            {/* Sliders & Progress Bars */}
            <Card small className="mb-4">
              <CardHeader className="border-bottom">
                <h6 className="m-0">Rewards & Emojis</h6>
              </CardHeader>
              <ListGroup flush>
              <div className="mb-2 pb-1" style={{margin:"10px"}}>
                <h6 style={{fontSize:"12px"}}>Choose an emoji to send</h6>
                </div>
                <Row style={{margin:"2px"}}>
                {smileys.map((smile, idx) => (
                  <Col xs="3" key={idx}>
                    <Button outline disabled={this.state.disabled} style={{fontSize:"1.3em"}} theme={smile.type} className="mb-2 mr-1" onClick={()=>{
                      if (this.state.chosen_students.length === 0)
                        return;
                      this.setState({disabled: true});
                      let counter = 0;
                      let success = true;
                      let error = false;
                      let self = this;
                      server.sendEmoji(function(response){
                        counter ++;
                        if (counter === self.state.chosen_students.length){
                          self.setState({chosen_students: [], success: success, error: error, disabled: false});
                          window.scrollTo(0, 0);
                        }
                      }, function(error){
                        success = false;
                        error = true;
                        counter ++;
                        if (counter === self.state.chosen_students.length){
                          self.setState({chosen_students: [], success: success, error: error, disabled: false});
                          window.scrollTo(0, 0);
                        }
                        console.log("error", error);
                      }, smile.name, this.state.chosen_students, this.props.match.params.id);
                    }}>
                      {smile.smile}
                    </Button>

                </Col>))}
                </Row>
                <hr style={{backgroundColor: "#a4a4a4", width: "95%"}} />

                <div className="mb-2 pb-1" style={{margin:"10px"}}>
                  <h6 style={{fontSize:"12px"}}>Or choose amount of E-Money to send</h6>
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
                        let error = false;
                        let self = this;
                        server.sendEMoney(function(response){
                          counter ++;
                          if (counter === self.state.chosen_students.length){
                            self.setState({chosen_students: [], success: success, error: error, disabled: false});
                            window.scrollTo(0, 0);
                          }
                        }, function(error){
                          success = false;
                          error = true;
                          counter ++;
                          if (counter === self.state.chosen_students.length){
                            self.setState({chosen_students: [], success: success, error: error, disabled: false});
                            window.scrollTo(0, 0);
                          }
                          console.log("error", error);
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
                  <Button theme="primary" disabled={this.state.disabled} style={{float:"right"}} className="mb-2 mr-1" onClick={()=>{
                    this.setState({disabled: true});
                    let self = this;
                    server.changeLessonStatus(function(response){
                      server.deleteLessonMessages(()=>{
                        history.replace('/');
                      }, ()=>{
                      }, self.props.match.params.id);
                    }, function(error){
                      console.log(error);
                      self.setState({disabled: false, error: true});
                    }, this.props.match.params.id, "LESSON_END");
                  }}>
                    End Class
                  </Button>
                  </div>

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
