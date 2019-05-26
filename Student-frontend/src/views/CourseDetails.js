import React from "react";
import PropTypes from "prop-types";

import axios from 'axios';
import SmallStats from "./../components/common/SmallStats";
import { SERVER_CONFIG } from '../Server/server-variables';
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
import "./CourseDetails.css"
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
class CourseDetails extends React.Component {
    constructor(props) {
        super(props);



        this.state = {
          balance:555,
          courseName:'',



          // Third list of posts.
          PostsListThree: [

          ],
        };
        let config = {
          headers: {'X-Api-Key' : 'ZrcWSl3ESR4T3cATxz7qN1NONPWx5SSea4s6bnR6'}
        };
        let headers = {
            'X-Api-Key': 'ZrcWSl3ESR4T3cATxz7qN1NONPWx5SSea4s6bnR6'
        }
        var student=localStorage.getItem('student_id');
        var course =this.props.match.params.id;


        axios.get('https://api.emon-teach.com/student/'+
        student+
        '/emonBalance/byCourse/'+course,
       {headers: headers})
       .then((response) => {
       this.setState({balance: response.data ? response.data : 0});
     });

        axios.get('https://api.emon-teach.com/course/'+
             course,
            {headers: headers})
            .then((response) => {
            this.setState({courseName: response.data.name});
          });

          axios.get('https://api.emon-teach.com/log/ofStudent/'
          + student+'/byCourse/'+course,
              {headers: headers})
              .then((response) => {
                this.setState({PostsListThree: response.data});
              console.log(response);
            });



      }
    render(){
        const{
        PostsListThree
        } = this.state;
        return(
            <Container fluid className="main-content-container px-4 pb-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title={this.state.courseName} subtitle="Course Details" className="text-sm-left" />
        </Row>


        <Row>
          {/* Editor */}
  <Card style = {{height:"100%",width:"50%",marginLeft:"16px"}} className="mb-3">
    <CardHeader className="border-bottom">
      <h6 className="m-0">Details</h6>
    </CardHeader>
    <ListGroup flush>
      <ListGroupItem className="p-3">
        <Row>
            <Col >
            <div style={{fontWeight: 600}}>
            You have a Balance of <span style={{fontWeight: 800}}>{this.state.balance} Emons</span> in this course.<br /><br />
            Keep up the good work!
            </div>
            </Col>


        </Row>
      </ListGroupItem>
    </ListGroup>
  </Card>

      <Col>
        <Card small className="mb-4">
          <CardHeader className="border-bottom">
            <h6 className="m-0">Recent Activity</h6>
          </CardHeader>
          <CardBody className="p-0 pb-3">
            <table className="table mb-0">
              <thead className="bg-light">

                <tr>

                  <th scope="col" className="border-0">
                    Day
                  </th>
                  <th scope="col" className="border-0">
                    Hour
                  </th>
                  <th scope="col" className="border-0">
                    Got
                  </th>

                </tr>
              </thead>
              <tbody>
              {PostsListThree.map((post, idx) => (

                <tr>
                  <td>{new Date(post.time).getDate().toString().padStart(2,'0') + '/' + new Date(post.time).getMonth().toString().padStart(2,'0') + '/' + new Date(post.time).getFullYear() }</td>
                  <td>{new Date(post.time).getHours().toString().padStart(2,'0') + ':' + new Date(post.time).getMinutes().toString().padStart(2,'0')}</td>
                  <td>{post.messageType === "EMON" ? post.value + ' Emons' : EmojiEnum[post.emojiType]}</td>
                </tr>))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </Col>
    </Row>
      </Container>
    );
   }
}


export default CourseDetails;
