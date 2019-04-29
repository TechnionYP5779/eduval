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
      id:res,

      // Third list of posts.
      PostsListThree: [
        // {
        //   title: "Math Course #1",
        //   body:"Number of students: 5",
        //   id: 1
        // },
        // {
        //   title: "Math Course #1",
        //   body:"Number of students: 6",
        //   id: 2
        // },
        // {
        //   title: "Math Course #1",
        //   body:"Number of students: 8",
        //   id: 3
        // },
        // {
        //   title: "Math Course #1",
        //   body:"Number of students: 10",
        //   id: 4
        // },
        // {
        //   title: "Math Course #1",
        //   body:"Number of students: 10",
        //   id: 5
        // },
        // {
        //   title: "Math Course #1",
        //   body:"Number of students: 10",
        //   id: 6
        // }
      ],

    };
    console.log("props for MyCourses is ", this.props.match.params.id);
    let headers = {
        'X-Api-Key': 'BXGK1t57pTgLKxmReo869MWY2qQey4U4n7fsHjii'
    }
    let sub=new Buffer( localStorage.getItem('sub')).toString('base64');
    axios.get('https://xycqr0g9ra.execute-api.eu-central-1.amazonaws.com/dev/student/byToken/'+sub,
     {headers: headers})
      .then(response =>localStorage.setItem('student_id', response.data.id) );
      let res=[];

      axios.get('https://xycqr0g9ra.execute-api.eu-central-1.amazonaws.com/dev/course/byStudent/'+localStorage.getItem('student_id'),
     {headers: headers})
     .then((response) => {
     this.setState({PostsListThree: response.data});

     console.log(this.state.PostsListThree);
   })
  .catch((error)=>{
     console.log(error);
  });



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
                    <a href={"/lesson/" + post.id}><Button size="sm" theme="white">
                      <i className="far fa-bookmark mr-1" /> Start lesson
                    </Button></a>
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
