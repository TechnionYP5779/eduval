import React from "react";
import history from '../history';
import {
  Card,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Form,
  FormInput,
  FormTextarea,
  Button,
  Container,
  CardBody
} from "shards-react";

import Modal from 'react-modal';
import PageTitle from "../components/common/PageTitle";
import TimeoutAlert from "../components/common/TimeoutAlert";
import server from "../Server/Server";
import TagsInput from 'react-tagsinput';

Modal.setAppElement('#root');

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-40%, -40%)',
    maxHeight            : '85vh'
  }
};

class CourseDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

      students: [],

      new_students: [],

      tag : '',

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

      modalDeleteIsOpen: false,

      student: {},
      showDeleteCourseModal: false
    };

    this.updateName = this.updateName.bind(this);
    this.updateDescription = this.updateDescription.bind(this);
    this.updateLocation = this.updateLocation.bind(this);
    this.updateStartDate = this.updateStartDate.bind(this);
    this.updateEndDate = this.updateEndDate.bind(this);
    this.update = this.update.bind(this);

    this.handleStudentsChange = this.handleStudentsChange.bind(this);
    this.handleChangeTagInput = this.handleChangeTagInput.bind(this);
    this.updateStudents = this.updateStudents.bind(this);

    this.closeDeleteModal = this.closeDeleteModal.bind(this);
    this.showDeleteItemModal = this.showDeleteItemModal.bind(this);
    this.deleteCourseModal = this.deleteCourseModal.bind(this);
    this.closeDeleteCourseModal = this.closeDeleteCourseModal.bind(this);
  }

  handleChangeTagInput(tag){
    this.setState({tag: tag});
  }

  updateStudents(){
    let self = this;
    let students = this.state.new_students;
    //TODO add last
    if (this.state.tag && this.state.tag.trim() != ''){
      students += [this.state.tag];
    }
    if (students.length === 0)
      return;
    this.setState({disabled: true});
    server.addStudentsToCourse(function(response){
      window.location.reload();
    }, function(error){
      console.log("failed", error);
      self.setState({error: "An error has occured", success: false, disabled: false});
      window.scrollTo(0, 0);
    }, students, this.props.match.params.id);
  }

  update(){
    let self = this;
    this.setState({disabled: true});
    let checkFilled = (input) => (input === null || input === "" || !input);

    if (checkFilled(this.state.course.name) || checkFilled(this.state.course.description) ||
      checkFilled(this.state.course.location) || checkFilled(this.state.course.startDate) ||
      checkFilled(this.state.course.endDate)){
      this.setState({error: "Please fill all forms!", success: false, disabled: false});
      window.scrollTo(0, 0);
      return;
    }

    let course = this.state.course;

    delete course.status;

    server.updateCourse(function(response){
      self.setState({error: false, success: true, disabled: false});
      window.scrollTo(0, 0);
    }, function(error){
      console.log("failed", error);
      self.setState({error: "An error has occured", success: false, disabled: false});
      window.scrollTo(0, 0);
    }, this.state.course);
  }

  handleStudentsChange(new_students) {
    this.setState({new_students: new_students})
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
      self.setState({course: response.data});
    }, function(error){
    }, this.props.match.params.id);

    server.getStudents(function(response){
      self.setState({students: response.data});
    }, function(error){
    }, this.props.match.params.id);

    server.getActiveLesson(function(response){
      if (response.data)
        self.setState({activeLesson: response.data});
    }, (err)=>{console.log("err", err);});
  }

  showDeleteItemModal(student) {
    this.setState({modalDeleteIsOpen: true,
      student: student});
  }

  closeDeleteModal() {
    this.setState({modalDeleteIsOpen: false});
  }
  closeDeleteCourseModal() {
    this.setState({showDeleteCourseModal: false});
  }

  deleteCourseModal(){
    this.setState({showDeleteCourseModal: true});
  }

  render(){
    let self = this;
    let showDeleteItemModal = this.showDeleteItemModal;
    let closeDeleteModal = this.closeDeleteModal;
    let closeDeleteCourseModal = this.closeDeleteCourseModal;
    const{
      students
    } = this.state;
    return(
      <div>

      <Modal
        isOpen={this.state.showDeleteCourseModal}
        onRequestClose={this.closeDeleteCourseModal}
        style={customStyles}
      >
      <p>Are you sure you want to delete the course "{this.state.course.name}"?</p>

      <Button disabled={this.state.disabled} theme="success" onClick={()=>{
        self.setState({disabled: true});
        server.deleteCourse((response)=>{history.push("/my-courses");},
        (err)=>{self.setState({disabled: false, error: "An error has occured"}); window.scrollTo(0, 0);},
        self.props.match.params.id);
      }}>Yes</Button>
      <Button theme="danger" disabled={this.state.disabled} style={{float: "right"}} onClick={closeDeleteCourseModal}>No</Button>
      </Modal>

      <Modal
        isOpen={this.state.modalDeleteIsOpen}
        onRequestClose={this.closeDeleteModal}
        style={customStyles}
      >
      <p>Are you sure you want to remove {this.state.student.name} from the course?</p>

      <Button disabled={this.state.disabled} theme="success" onClick={()=>{
        self.setState({disabled: true});
        server.deleteStudent((response)=>{window.location.reload();},
        (err)=>{self.setState({disabled: false, error: "An error has occured"}); window.scrollTo(0, 0);},
        self.props.match.params.id,
        self.state.student.id);
      }}>Yes</Button>
      <Button theme="danger" disabled={this.state.disabled} style={{float: "right"}} onClick={closeDeleteModal}>No</Button>
      </Modal>

      {this.state.error &&
      <TimeoutAlert className="mb-0" theme="danger" msg={this.state.error} time={10000}/>
      }
      {this.state.success &&
      <TimeoutAlert className="mb-0" theme="success" msg={"Success! Your course has been updated!"} time={10000}/>
      }
      <Container fluid className="main-content-container px-4 pb-4">

      {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title={this.state.course.name} subtitle="Course Details" className="text-sm-left" />
          </Row>

          <Row>
          <Col lg="6">
          {/* Editor */}
          <Card style = {{height:"auto",width:"100%",marginLeft:"16px"}} className="mb-4">
            <CardHeader className="border-bottom">
            <Row><Col><h6 className="m-0">Details</h6></Col>
            {// <Col><Button outline style={{padding:"0px", float: "right"}} theme="danger" onClick={this.deleteCourseModal}>
            //   <i className="material-icons" style={{fontSize:"2em"}}>delete</i>
            // </Button></Col>
          }
            </Row>
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
                    <Button theme="success" disabled={this.state.disabled || (this.state.activeLesson && this.state.activeLesson != this.props.match.params.id)} onClick={()=>{
                      this.setState({disabled: true});
                      if(this.state.activeLesson == this.props.match.params.id){
                        history.push("/lesson/" + this.props.match.params.id);
                        return;
                      }
                      let self = this;
                      server.changeLessonStatus(function(response){
                        history.push("/lesson/" + self.props.match.params.id);
                      }, function(error){
                        self.setState({disabled: false, error: "An error has occured"}); window.scrollTo(0, 0);
                      }, this.props.match.params.id, "LESSON_START");
                    }} style={{float:"right"}}>{(this.state.activeLesson != this.props.match.params.id && "Start lesson") || (this.state.activeLesson == this.props.match.params.id && "Resume lesson")}</Button>
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
                      <th scope="col" className="border-0">
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
                      <td><Button pill outline style={{padding:"0px"}} theme="danger" onClick={()=>{showDeleteItemModal(student);}}>
                        <i className="material-icons" style={{fontSize:"26px"}}>clear</i>
                      </Button></td>
                    </tr>))}
                  </tbody>
                </table>
                <hr style={{backgroundColor: "#a4a4a4", width: "95%"}} />
                <Row>
                <Col>
                <label style={{marginLeft: "20px", fontSize: "16px"}}>Add students to course</label>
                </Col>
                <Col>
                <Button theme="primary" disabled={this.state.disabled} style={{marginRight: "20px", float: "right"}} onClick={this.updateStudents}>Add</Button>
                </Col>
                </Row>
                <TagsInput onlyUnique
                inputProps={{placeholder: "Add students by Email"}}
                addKeys={[9, 13, 32, 186, 188]}
                value={this.state.new_students}
                inputValue={this.state.tag}
                onChangeInput={this.handleChangeTagInput}
                onChange={this.handleStudentsChange} />
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
