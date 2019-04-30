import React from "react";
import PropTypes from "prop-types";
import history from '../history';
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
  CardBody,
  Alert
} from "shards-react";
import PageTitle from "../components/common/PageTitle";
import server from "../Server/Server";
class CourseDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

      students: [],

      course: {id: "", name: "", location: "", description: "", startDate: "", endDate: ""},

      // Third list of posts.
      PostsListThree: [
        {
          id:"1",
          FirstName: "Stud1",
          LastName:"Sixth grade",
          Phone:"123456789",
        }
      ],
    };

    this.updateName = this.updateName.bind(this);
    this.updateDescription = this.updateDescription.bind(this);
    this.updateLocation = this.updateLocation.bind(this);
    this.updateStartDate = this.updateStartDate.bind(this);
    this.updateEndDate = this.updateEndDate.bind(this);
    this.update = this.update.bind(this);
  }

  update(){
    let self = this;
    this.setState({disabled: true});
    let checkFilled = (input) => (input == null || input == "" || !input);

    if (checkFilled(this.state.course.name) || checkFilled(this.state.course.description) ||
      checkFilled(this.state.course.location) || checkFilled(this.state.course.startDate) ||
      checkFilled(this.state.course.endDate)){
      this.setState({error: "Please fill all forms!", success: false, disabled: false});
      window.scrollTo(0, 0);
      return;
    }

    server.updateCourse(function(response){
      console.log("worked", response);
      self.setState({error: false, success: true, disabled: false});
      window.scrollTo(0, 0);
    }, function(error){
      console.log("failed", error);
      self.setState({error: "An error has occured", success: false, disabled: false});
      window.scrollTo(0, 0);
    }, this.state.course);
  }


    updateName(evnt){
      let course = this.state.course;
      course.name = evnt.target.value;
      this.setState({course: course});
    }

    updateDescription(evnt){
      let course = this.state.course;
      course.description = evnt.target.value;
      this.setState({course: course});
    }

    updateLocation(evnt){
      let course = this.state.course;
      course.location = evnt.target.value;
      this.setState({course: course});
    }

    updateStartDate(evnt){
      let course = this.state.course;
      course.startDate = evnt.target.value;
      this.setState({course: course});
    }

    updateEndDate(evnt){
      let course = this.state.course;
      course.endDate = evnt.target.value;
      this.setState({course: course});
    }


  componentDidMount() {
    var self = this;
    server.getCourse(function(response){
      console.log(response);
      self.setState({course: response.data});
    }, function(error){
    }, this.props.match.params.id);

    server.getStudents(function(response){
      console.log(response);
      self.setState({students: response.data});
    }, function(error){
    }, this.props.match.params.id);
  }

  render(){
    const{
      students
    } = this.state;
    return(
      <div>
      {this.state.error &&
      <Container fluid className="px-0">
        <Alert className="mb-0" theme="danger">
          <i className="fa fa-info mx-2"></i> {this.state.error}
        </Alert>
      </Container>
      }
      {this.state.success &&
      <Container fluid className="px-0">
        <Alert className="mb-0" theme="success">
          <i className="fa fa-info mx-2"></i> Success! Your course has been updated!
        </Alert>
      </Container>
      }
      <Container fluid className="main-content-container px-4 pb-4">

      {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title={this.state.course.name} subtitle="Course Details" className="text-sm-left" />
          </Row>

          <Row>
          <Col lg="6">
          {/* Editor */}
          <Card style = {{height:"100%",width:"100%",marginLeft:"16px"}} className="mb-4">
            <CardHeader className="border-bottom">
            <h6 className="m-0">Details</h6>
            </CardHeader>
            <ListGroup flush>
            <ListGroupItem className="p-3">
              <Row>
                <Col>
                  <Form>
                    <Row form>
                    {/* Course Name */}
                      <Col md="6" className="form-group">
                        <label htmlFor="feFirstName">Course Name</label>
                        <FormInput
                        id="feFirstName"
                        placeholder="Course Name"
                        value={this.state.course.name}
                        onChange={this.updateName}
                        />
                      </Col>
                    </Row>
                    <Row form>
                      {/* Start */}
                      <Col md="6" className="form-group">
                        <label htmlFor="feLastName">Start Date</label>
                        <FormInput
                        type="date"
                        id="feLastName"
                        value={this.state.course.startDate}
                        onChange={this.updateStartDate}
                        />
                      </Col>

                      {/* End */}
                      <Col md="6" className="form-group">
                        <label htmlFor="feEmail">End Date</label>
                        <FormInput
                        type="date"
                        id="feEmail"
                        value={this.state.course.endDate}
                        onChange={this.updateEndDate}
                        />
                      </Col>
                      {/* Course Location */}
                      <Col md="6" className="form-group">
                        <label htmlFor="feZipCode">Class Room</label>
                        <FormInput
                        id="feZipCode"
                        value={this.state.course.location}
                        onChange={this.updateLocation}
                        />
                      </Col>
                    </Row>
                    <Row form>
                    {/* Description */}
                      <Col md="12" className="form-group">
                        <label htmlFor="feDescription">Course Description</label>
                        <FormTextarea id="feDescription" rows="5" value={this.state.course.description} onChange={this.updateDescription}/>
                      </Col>
                    </Row>
                    <Button outline disabled={this.state.disabled} onClick={this.update} theme="accent">Update Course</Button>
                    <Button theme="success" disabled={this.state.disabled} onClick={()=>{
                      this.setState({disabled: true});
                      let self = this;
                      server.changeLessonStatus(function(response){
                        history.push("/lesson/" + self.props.match.params.id);
                      }, function(error){
                        self.setState({disabled: false, error: "An error has occured"});
                      }, this.props.match.params.id, "LESSON_END");
                    }} style={{float:"right"}}>Start lesson</Button>
                  </Form>
                </Col>
              </Row>
            </ListGroupItem>
            </ListGroup>
          </Card>
          </Col>
          <Col lg="6">
            <Card small className="mb-4">
              <CardHeader className="border-bottom">
                <h6 className="m-0">Registered Students</h6>
              </CardHeader>
              <CardBody className="p-0 pb-3">
                <table className="table mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th scope="col" className="border-0">
                      #
                      </th>
                      <th scope="col" className="border-0">
                      Name
                      </th>
                      <th scope="col" className="border-0">
                      Email
                      </th>
                      <th scope="col" className="border-0">
                      Phone
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.phoneNum}</td>
                    </tr>))}
                  </tbody>
                </table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        </div>
      );
    }
  }



  export default CourseDetails;
