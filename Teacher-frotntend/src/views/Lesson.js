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

class Lesson extends React.Component {


  constructor(props) {
    super(props);

    this.money_input_ref = React.createRef();
    this.money_slide_ref = React.createRef();

    this.state = {

      reward_money : 5,

      chosen_smile : -1,

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
          smile: "😇",
          type: "success",
          id: 3
        },
        {
          smile: "😁",
          type: "success",
          id: 4
        },
        {
          smile: "🤐",
          type: "warning",
          id: 5
        },
        {
          smile: "😴",
          type: "warning",
          id: 6
        },
        {
          smile: "😠",
          type: "danger",
          id: 7
        },
        {
          smile: "👎",
          type: "danger",
          id: 8
        }
      ],

      // Third list of posts.
      students: [
        {
          name: "Rraany1",
          id: 1,
          earned_points: 0,
          chosen: false
        },
        {
          name: "Rrany2",
          id: 2,
          earned_points: 1,
          chosen: false
        },
        {
          name: "Rani Rany Ran",
          id: 3,
          earned_points: 20,
          chosen: false
        },
        {
          name: "Raani4",
          id: 4,
          earned_points: 8,
          chosen: false
        },
        {
          name: "Raani4",
          id: 4,
          earned_points: 8,
          chosen: false
        },
        {
          name: "Raany5",
          id: 5,
          earned_points: 4,
          chosen: false
        },
        {
          name: "Raany5",
          id: 5,
          earned_points: 1,
          chosen: false
        },
        {
          name: "Raany5",
          id: 5,
          earned_points: 0,
          chosen: false
        },
        {
          name: "Ranni6",
          id: 6,
          earned_points: 0,
          chosen: false
        }
      ],
    };
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

    return (
      <Container fluid className="main-content-container px-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title="Physics 101" subtitle="Lesson View" className="text-sm-left" />
        </Row>
        {/* First Row of Posts */}
        <Row>
          <Col lg="8" className="mb-4">
            <Card small className="mb-4">
              <CardHeader className="border-bottom">
                <h5 className="m-0">Attending Students</h5>
                <h7 style={{fontSize:"12px"}}>Pick the students you want to send E-Money too</h7>
              </CardHeader>

              <ListGroup flush>
                <ListGroupItem className="p-0 px-3 pt-3">
                  <Row>

                      {students.map((student, idx) => (<Col xs="2" >
                        {
                          student.chosen &&
                          <Button theme="primary" className="mb-2 mr-1"  onClick={()=>{
                            let tmp = this.state.students;
                            tmp[idx].chosen = false;
                            this.setState({students : tmp});
                          }}>
                            {student.name} <br/><br/> {student.earned_points}
                          </Button>
                        }
                        {
                          !student.chosen &&
                          <Button outline theme="primary" className="mb-2 mr-1" onClick={()=>{
                            let tmp = this.state.students;
                            tmp[idx].chosen = true;
                            this.setState({students : tmp});
                          }}>
                            {student.name} <br/><br/> {student.earned_points}
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
                  <h7 style={{fontSize:"12px"}}>Choose amount of E-Money to send</h7>
                  </div>
              <div className="mb-2 pb-1" style={{margin:"10px"}}>

                <Slider
                  ref = {this.money_slide_ref}
                  id="money_slider"
                  theme="success"
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
                  <Button theme="success" className="mb-2 mr-1">
                    Award!
                  </Button>
                  </div>

              </ListGroup>
            </Card>
          </Col>
        </Row>

      </Container>
    );
  }
}

export default Lesson;
