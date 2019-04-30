/* eslint jsx-a11y/anchor-is-valid: 0 */
import history from '../history';
import React from "react";
import axios from 'axios';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardFooter,
  Badge,
  Button
} from "shards-react";

import PageTitle from "../components/common/PageTitle";

class MyCourses extends React.Component {
  constructor(props) {
    super(props);



    this.state = {
      id: res,
      // Third list of posts.
      PostsListThree: [],
      lessons_status: []
    };
    console.log("props for MyCourses is ", this.props.match.params.id);
    let headers = {
        'X-Api-Key': 'ZrcWSl3ESR4T3cATxz7qN1NONPWx5SSea4s6bnR6'
    }
    let sub=new Buffer( localStorage.getItem('sub')).toString('base64');
    axios.get('https://m7zourdxta.execute-api.eu-central-1.amazonaws.com/dev/student/byToken/'+sub,
     {headers: headers})
      .then(response =>localStorage.setItem('student_id', response.data.id) );
      let res=[];

      axios.get('https://m7zourdxta.execute-api.eu-central-1.amazonaws.com/dev/course/byStudent/'+localStorage.getItem('student_id'),
     {headers: headers})
     .then((response) => {
     this.setState({PostsListThree: response.data});
     console.log(this.state.PostsListThree);
     
  
     var i;
    for (i = 0; i < this.state.PostsListThree.length; i++) { 
      console.log("number" + i);
        axios.get('https://m7zourdxta.execute-api.eu-central-1.amazonaws.com/dev/lesson/'+ this.state.PostsListThree[i].id +'/status',
          {headers: headers})
          .then((response) => {
          this.setState({state: response.data});
          if(response.data == "LESSON_START"){
            this.setState({lessons_status: [...this.state.lessons_status,false]});
          }else{
             this.setState({lessons_status: [...this.state.lessons_status,true]});
          }
          console.log(this.state.lessons_status);
        }) .catch((error)=>{
          console.log(error);
        });
  }

   })
  .catch((error)=>{
     console.log(error);
  });
  
  }
  

  insertDeskNumber(id) {
    console.log("id" + id);
    console.log(localStorage.getItem('student_id'));
      let config = {
          headers: {'X-Api-Key' : 'ZrcWSl3ESR4T3cATxz7qN1NONPWx5SSea4s6bnR6'}
      };
      var txt;
      var deskNumber = prompt("Please enter your desk number:", "");
      if (deskNumber == null || deskNumber == "") {
        txt = "User cancelled the prompt.";
      } else {
        axios.post('https://m7zourdxta.execute-api.eu-central-1.amazonaws.com/dev/lesson/'+ id +'/present',{
          id:  parseInt(localStorage.getItem('student_id')),
          desk: deskNumber}, config)
      }
     }

  render() {
    const {
      PostsListOne,
      PostsListTwo,
      PostsListThree,
      PostsListFour
    } = this.state;



    return (


      <Container fluid className="main-content-container px-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title="My Courses" subtitle="Manage eveyrthing in one place"
                     className="text-sm-left" />
        </Row>




        {/* First Row of Posts */}
        <Row>
          {
            PostsListThree.map((post, idx) => (
            <Col lg="4" key={idx}>
              <Card small className="card-post mb-4">
                <CardBody>
                  <h4 className="card-title">{post.name}</h4>
                  <p className="card-text text-muted">{post.description}</p>
                </CardBody>
                <CardFooter className="border-top d-flex">
                  <div className="card-post__author d-flex">
                    <div className="d-flex flex-column justify-content-center ml-3">
                    <a href={"/course-details/" + post.id}><Button size="sm" theme="white">
                      <i className="far fa-edit mr-1" /> View more
                    </Button></a>
                    </div>
                  </div>
                  <div className="my-auto ml-auto">
                    <Button disabled = {this.state.lessons_status[idx]} size="sm" theme="white" onClick={() => {this.insertDeskNumber(post.id)}}>
                      <i className="far fa-bookmark mr-1" /> Start lesson
                    </Button>            
                  
                  </div>
                </CardFooter>
              </Card>
            </Col>
          ))}
        </Row>

      </Container>


    );
    
  }
    
}

export default MyCourses;
