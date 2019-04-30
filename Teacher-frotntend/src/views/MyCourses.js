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
  Alert
} from "shards-react";

import server from "../Server/Server";

import PageTitle from "../components/common/PageTitle";

class MyCourses extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

      courses: [],

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
      <div>
      {this.state.error &&
      <Container fluid className="px-0">
        <Alert className="mb-0" theme="danger">
          <i className="fa fa-info mx-2"></i> {this.state.error}
        </Alert>
      </Container>
      }
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
                    <a href={"/course-details/" + course.id}><Button disabled={this.state.disabled} size="sm" theme="white">
                      <i className="far fa-edit mr-1" /> View more
                    </Button></a>
                    </div>
                  </div>
                  <div className="my-auto ml-auto">
                    <Button disabled={this.state.disabled} size="sm" theme="white"
                      onClick={()=>{
                        console.log("click!");
                        this.setState({disabled: true});
                        let self = this;
                        server.changeLessonStatus(function(response){
                          history.push("/lesson/" + course.id);
                        }, function(error){
                          console.log("error" ,error);
                          self.setState({disabled: false, error: "An error has occured"});
                        }, course.id, "LESSON_START");
                      }}>
                      <i className="far fa-bookmark mr-1" /> Start lesson
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </Col>
          ))}
        </Row>

      </Container>
      </div>
    );
  }
}

export default MyCourses;
