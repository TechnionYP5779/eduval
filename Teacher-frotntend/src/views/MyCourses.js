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
  Button
} from "shards-react";

import server from "../Server/Server";

import PageTitle from "../components/common/PageTitle";
import TimeoutAlert from "../components/common/TimeoutAlert"

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
        self.setState({courses: response.data});
      }, function(error){
    });
    server.getActiveLesson(function(response){
      if (response.data)
        self.setState({activeLesson: response.data});
    }, (err)=>{console.log("err", err);});
  }


  render() {
    const {
      courses
    } = this.state;

    return (
      <div class="main-content container-fluid">
      {this.state.error &&
      <TimeoutAlert className="mb-0" theme="danger" msg={this.state.error} time={10000}/>
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
            courses.length === 0 &&
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
                <CardFooter className="border-top d-flex" style={{padding: "16px"}}>
                  <div className="card-post__author d-flex">
                    <div className="d-flex flex-column justify-content-center ml-1">
                    <a href={"/course-details/" + course.id}><Button disabled={this.state.disabled} size="sm" theme="white" style={{padding: "6px"}}>
                      <i className="far fa-edit mr-1" /> <br/>View more
                    </Button></a>
                    </div>
                  </div>
                  <div className="card-post__author d-flex">
                    <div className="d-flex flex-column justify-content-center ml-1">
                    <a href={"/manage-store/" + course.id}><Button disabled={this.state.disabled} size="sm" theme="white" style={{padding: "6px"}}>
                      <i className="material-icons mr-1">store</i> <br/>Manage Store
                    </Button></a>
                    </div>
                  </div>
                  <div className="my-auto ml-auto">
                    <Button disabled={this.state.disabled || (this.state.activeLesson && this.state.activeLesson !== course.id)} style={{padding: "6px"}} size="sm" theme={(this.state.activeLesson !== course.id && "white") || (this.state.activeLesson === course.id && "primary")}
                      onClick={()=>{
                        this.setState({disabled: true});
                        if (this.state.activeLesson === course.id){
                          history.push("/lesson/" + course.id);
                          return;
                        }
                        let self = this;
                        server.changeLessonStatus(function(response){
                          history.push("/lesson/" + course.id);
                        }, function(error){
                          console.log("error" ,error);
                          self.setState({disabled: false, error: "An error has occured"});
                        }, course.id, "LESSON_START");
                      }}>
                      <i className="far fa-bookmark mr-1" /> <br/>{this.state.activeLesson !== course.id && "Start lesson"} {this.state.activeLesson === course.id && "Resume lesson"}
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
