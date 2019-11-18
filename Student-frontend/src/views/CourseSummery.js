import React from "react";
import PropTypes from "prop-types";
import axios from 'axios';
import {
  Card,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Form,
  FormGroup,
  FormInput,
  FormSelect,
  FormTextarea,
  Button,
  Container,
  CardBody
} from "shards-react";
import PageTitle from "../components/common/PageTitle";
import "./CourseSummery.css"
class CourseSummery extends React.Component {
    constructor(props) {
      super(props);
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



        var res=JSON.parse(this.props.match.params.id);
        this.state = {

          total_reward_money : 0,
          lesson_id : -1,
          course_name: "",
          course_location: "",
          course_start_date: "",
          course_end_date: "",
          course_description: "",
          student_id : localStorage.getItem('student_id'),
          chosen_smile : -1,
          chosen_message : -1,

          Emojis: []


        };
          this.state.total_reward_money = res.reward_money;
          this.state.lesson_id = res.id;
          this.state.Emojis = [...res.emojis];


          let headers = {
            'Authorization': 'Bearer ' + localStorage.getItem('idToken')
            };
            axios.get('https://api.emon-teach.com/course/'+this.state.lesson_id,
              {headers: headers})
              .then((response) => {
              this.setState(
                {course_name: response.data.name ,
                  course_description : response.data.description,
                  course_location: response.data.location,
                  course_start_date: response.data.startDate.substring(0,10),
                  course_end_date: response.data.endDate.substring(0,10)});
            })
            .catch((error)=>{
              console.log(error);
            });
      }
    render(){
        return(
            <Container fluid className="main-content-container px-4 pb-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title={this.state.course_name}
          subtitle="Course Summary" className="text-sm-left" />
        </Row>

        <Row>
          {/* Editor */}
  <Card style = {{height:"100%",width:"60%",marginLeft:"16px"}} className="mb-4">
    <CardHeader className="border-bottom">
      <h6 className="m-0">Summary</h6>
    </CardHeader>
    <ListGroup flush>
      <ListGroupItem className="p-3">
        <Row>
          <Col>
            <Form>
              <Row form>
                {/* Course Name */}
                  <p>Class Name: {this.state.course_name}</p>
                </Row>

                <Row form>
                {/* Lesson description */}
                  <p>Lesson's description: {this.state.course_description}</p>
                </Row>


              <Row form>
                 {/* Course Location */}
                  <p>Location: {this.state.course_location}</p>
                </Row>

                <Row form>
                 {/* E-Mony earned */}
                  <p>Total E-Money: {this.state.total_reward_money}</p>
                </Row>

              <a href={"/Overview"}>
              <Button theme="success" onClick={()=>{}} style={{float:"left"}}>Finish</Button>
              </a>
            </Form>
          </Col>
        </Row>
      </ListGroupItem>
    </ListGroup>
  </Card>

      <Col>
         <Card small className="mb-4">
           <ListGroup flush>
                <ListGroupItem className="p-0 px-3 pt-3">
              <CardHeader className="border-bottom">
                <h5 className="m-0">All the Emojis from this lesson</h5><br/>
                <ul className='rows' style={{textAlign:'center', padding:'0'}}>
                {this.state.Emojis.map((emoji) => (<li style={{display:'inline', margin:'5px', fontSize:'1.6em'}} className='row'>{emoji}</li>))}
                </ul>

              </CardHeader>
            </ListGroupItem>
         </ListGroup>
       </Card>
      </Col>
    </Row>
      </Container>
    );
   }
}


export default CourseSummery;
