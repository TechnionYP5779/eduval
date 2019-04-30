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
import iot from "../iotClient/iotClient";
import server from "../Server/Server";


class Lesson extends React.Component {


  constructor(props) {
    super(props);

    this.money_input_ref = React.createRef();
    this.money_slide_ref = React.createRef();

    this.state = {

      disabled: false,

      connected: false,

      reward_money : 5,

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

      chosen_students: [],

      students: [],

      course_name: ""
    };

    this.unchooseStudent = this.unchooseStudent.bind(this);
  }

  unchooseStudent(id){
    let tmp_chosen = this.state.chosen_students;
    tmp_chosen.splice(tmp_chosen.indexOf(id), 1);
    this.setState({chosen_students : tmp_chosen});
  }

  componentDidMount() {

    let self = this;
    let onConnect = ()=>{
      server.getAttendingStudents(function(response){
        response.data.sort(function(a,b){
          return parseInt(a.desk)-parseInt(b.desk);
        });
        self.setState({students: response.data});
        console.log("============Attending============");
        console.log(response);
      }, (error)=>{}, courseId);
      if (!self.state.connected)
        self.setState({connected: true});
    }

    let onOffline = ()=>{
      if (self.state.connected)
        self.setState({connected: false});
    }

    let courseId = this.props.match.params.id;
    iot.getKeys(function(response){
      iot.connect(courseId, onConnect, onConnect, onOffline);
    }, (error)=>{});

    server.getCourse(function(response){
      self.setState({course_name: response.data.name});
    }, (error)=>{}, courseId);

  }


  render() {

    const onSlideChange = (val) =>{
      console.log("this is val1", val[0]);
      this.setState({reward_money : val[0]});
    }


    const onInputChange = (val) => {
      console.log("this is val2", val.target.value);
      this.setState({reward_money : val.target.value});
    }

    console.log("props for MyCourses is ", this.props.match.params.id);

    const {students, smileys} = this.state;


// TODO: add offline indicator (this works meh~)
    // {!this.state.connected &&
    // <Container fluid className="px-0">
    //   <Alert className="mb-0" theme="warning">
    //     <i className="fa fa-info mx-2"></i> You might be offline!
    //   </Alert>
    // </Container>
    // }
    let unchooseStudent = this.unchooseStudent;

    return (
      <div>
      {this.state.error &&
      <Container fluid className="px-0">
        <Alert className="mb-0" theme="danger">
          <i className="fa fa-info mx-2"></i> An error has occured!
        </Alert>
      </Container>
      }
      {this.state.success &&
      <Container fluid className="px-0">
        <Alert className="mb-0" theme="success">
          <i className="fa fa-info mx-2"></i> Messages sent successfully
        </Alert>
      </Container>
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
                <h5 className="m-0">Attending Students</h5>
                <h6 style={{fontSize:"12px"}}>Pick the students you want to send E-Money too</h6>
              </CardHeader>

              <ListGroup flush>
                <ListGroupItem className="p-0 px-3 pt-3">
                  <Row>

                      {students.map((student, idx) => (<Col xs="2" >
                        {
                          this.state.chosen_students.indexOf(student.id) >= 0 &&
                          <Button disabled={this.state.disabled} style={{margin:"6px"}} theme="primary" className="mb-2 mr-1 badge1" data-badge={"desk #" + student.desk} onClick={()=>{
                            unchooseStudent(student.id);
                          }}>
                            {student.name}
                          </Button>
                        }
                        {
                          this.state.chosen_students.indexOf(student.id) < 0 &&
                          <Button outline disabled={this.state.disabled} style={{margin:"6px"}} theme="primary" className="mb-2 mr-1 badge1" data-badge={"desk #" + student.desk} onClick={()=>{
                            let tmp_chosen = this.state.chosen_students;
                            tmp_chosen.push(student.id);
                            this.setState({chosen_students : tmp_chosen, success: false, error: false});
                          }}>
                            {student.name}
                          </Button>
                        }
                        </Col>
                    ))}

                  </Row>
                </ListGroupItem>
              </ListGroup>
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
                <h7 style={{fontSize:"12px"}}>Choose an emoji to send</h7>
                </div>
                <Row style={{margin:"2px"}}>
                {smileys.map((smile, idx) => (
                  <Col xs="3">
                    <Button outline disabled={this.state.disabled} style={{fontSize:"20px"}} theme={smile.type} className="mb-2 mr-1" onClick={()=>{
                      if (this.state.chosen_students.length == 0)
                        return;
                      this.setState({disabled: true});
                      console.log("chosing", smile.id);
                      console.log(smile.name);
                      let counter = 0;
                      let success = true;
                      let error = false;
                      let self = this;
                      server.sendEmoji(function(response){
                        console.log("sent");
                        counter ++;
                        if (counter == self.state.chosen_students.length){
                          self.setState({chosen_students: [], success: success, error: error, disabled: false});
                          window.scrollTo(0, 0);
                        }
                      }, function(error){
                        success = false;
                        error = true;
                        counter ++;
                        if (counter == self.state.chosen_students.length){
                          self.setState({chosen_students: [], success: success, error: error, disabled: false});
                          window.scrollTo(0, 0);
                        }
                        console.log("error", error);
                      }, smile.name, this.state.chosen_students, this.props.match.params.id);
                      console.log(this.state.chosen_students);
                    }}>
                      {smile.smile}
                    </Button>

                </Col>))}
                </Row>
                <hr style={{backgroundColor: "#a4a4a4", width: "95%"}} />

                <div className="mb-2 pb-1" style={{margin:"10px"}}>
                  <h7 style={{fontSize:"12px"}}>Or choose amount of E-Money to send</h7>
                  </div>
              <div className="mb-2 pb-1" style={{margin:"10px"}}>

                <Slider
                  ref = {this.money_slide_ref}
                  id="money_slider"
                  theme="primary"
                  className="my-4"
                  connect={[true, false]}
                  start={[this.state.reward_money]}
                  value={[this.state.reward_money]}
                  step={1}
                  range={{ min: 0, max: 10 }}
                  tooltips
                  onChange={onSlideChange}
                />
              </div>
              <div className="mb-2 pb-1" style={{margin:"10px"}}>
                  <FormInput
                    id = "money_input"
                    type="number"
                    value={this.state.reward_money}
                    ref = {this.money_input_ref}
                    onChange={onInputChange}
                  />
                  </div>
                    <div className="mb-2 pb-1" style={{margin:"10px"}}>
                  <Button theme="primary" disabled={this.state.disabled} className="mb-2 mr-1" onClick={()=>{
                    if (this.state.chosen_students.length == 0)
                      return;
                    this.setState({disabled: true});
                    console.log("AWARD!");
                    console.log(this.state.reward_money);
                    let counter = 0;
                    let success = true;
                    let error = false;
                    let self = this;
                    server.sendEMoney(function(response){
                      console.log("sent");
                      counter ++;
                      if (counter == self.state.chosen_students.length){
                        self.setState({chosen_students: [], success: success, error: error, disabled: false});
                        window.scrollTo(0, 0);
                      }
                    }, function(error){
                      success = false;
                      error = true;
                      counter ++;
                      if (counter == self.state.chosen_students.length){
                        self.setState({chosen_students: [], success: success, error: error, disabled: false});
                        window.scrollTo(0, 0);
                      }
                      console.log("error", error);
                    }, parseInt(this.state.reward_money), "participation", this.state.chosen_students, this.props.match.params.id);
                    console.log(this.state.chosen_students);
                  }}>
                    Award!
                  </Button>
                  <Button theme="primary" disabled={this.state.disabled} style={{float:"right"}} className="mb-2 mr-1" onClick={()=>{
                    this.setState({disabled: true});
                    let self = this;
                    server.changeLessonStatus(function(response){
                      history.replace('/');
                    }, function(error){
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
