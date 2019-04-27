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
  Button
} from "shards-react";

import server from "../Server/Server";

import PageTitle from "../components/common/PageTitle";

class MyCourses extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

      courses: [],

      // Third list of posts.
      PostsListThree: [
        {
          title: "Math Course #1",
          body:"Number of students: 5",
          id: 1
        },
        {
          title: "Math Course #1",
          body:"Number of students: 6",
          id: 2
        },
        {
          title: "Math Course #1",
          body:"Number of students: 8",
          id: 3
        },
        {
          title: "Math Course #1",
          body:"Number of students: 10",
          id: 4
        },
        {
          title: "Math Course #1",
          body:"Number of students: 10",
          id: 5
        },
        {
          title: "Math Course #1",
          body:"Number of students: 10",
          id: 6
        }
      ],
    };
  }

  componentDidMount() {
    var self = this;
    server.getAllCourses(function(response){
        console.log(response);
        self.setState({courses: response.data});
      }, function(error){
    });
  }


  render() {
    const {
      courses
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
            courses.length == 0 &&
            <Card small className="card-post mb-4">
              <CardBody>
                <h4 className="card-title">No Courses?</h4>
                <p className="card-text text-muted">Create a new course right now!</p>
              </CardBody>
              <CardFooter className="border-top d-flex">
                <div className="card-post__author d-flex" style={{width:"100%"}}>
                  <a href="/add-new-course" style={{width:"100%"}}><Button style={{width:"100%"}}>
                    <i className="far fa-edit mr-1" /> Try here
                  </Button></a>
                </div>
              </CardFooter>
            </Card>
          }
          {courses.map((course, idx) => (
            <Col lg="4" key={idx}>
              <Card small className="card-post mb-4">
                <CardBody>
                  <h4 className="card-title">{course.name}</h4>
                  <p className="card-text text-muted">{course.description}</p>
                </CardBody>
                <CardFooter className="border-top d-flex">
                  <div className="card-post__author d-flex">
                    <div className="d-flex flex-column justify-content-center ml-3">
                    <a href={"/course-details/" + course.id}><Button size="sm" theme="white">
                      <i className="far fa-edit mr-1" /> View more
                    </Button></a>
                    </div>
                  </div>
                  <div className="my-auto ml-auto">
                    <a href={"/lesson/" + course.id}><Button size="sm" theme="white">
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
