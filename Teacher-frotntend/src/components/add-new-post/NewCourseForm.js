import React from "react";
import {
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Form,
  FormInput,
  FormGroup,
  Button
} from "shards-react";
import server from "../../Server/Server";


export default class NewCourseForm extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      name: "",
      location: "",
      description: "",
      startDate: "",
      endDate: "",
      disabled: false
    };
    this.updateName = this.updateName.bind(this);
    this.updateDescription = this.updateDescription.bind(this);
    this.updateLocation = this.updateLocation.bind(this);
    this.updateStartDate = this.updateStartDate.bind(this);
    this.updateEndDate = this.updateEndDate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  updateName(evnt){
    this.setState({name: evnt.target.value});
  }

  updateDescription(evnt){
    this.setState({description: evnt.target.value});
  }

  updateLocation(evnt){
    this.setState({location: evnt.target.value});
  }

  updateStartDate(evnt){
    this.setState({startDate: evnt.target.value});
  }

  updateEndDate(evnt){
    this.setState({endDate: evnt.target.value});
  }

  handleSubmit(){
    let checkFilled = (input) => (input == null || input == "" || !input);


    let self = this;
    this.setState({disabled: true});
    let handler  =   this.props.handler;
    if (checkFilled(this.state.name) || checkFilled(this.state.description) ||
      checkFilled(this.state.location) || checkFilled(this.state.startDate) ||
      checkFilled(this.state.endDate)){
      handler("Please fill all forms!");
      self.setState({disabled: false});
      return;
    }
    server.createNewCourse(function(response){
      handler(null);
      self.setState({disabled: false});
    }, function(error){
      console.log(error);
      handler("An error has occured");
      self.setState({disabled: false});
    }, {name: this.state.name, location: this.state.location,
      description: this.state.description, startDate: this.state.startDate,
      endDate: this.state.endDate
    });
  }

  render(){
    return (
      <ListGroup flush>
        <ListGroupItem className="p-3">
          <Row>
            <Col>
              <Form>
                <FormGroup>
                  <label htmlFor="feInputAddress">Course Name</label>
                  <FormInput id="feInputAddress" placeholder="A name that your students will recognize" value={this.state.name} onChange={this.updateName} />
                </FormGroup>

                <FormGroup>
                  <label htmlFor="feInputAddress">Course Description</label>
                  <FormInput id="feInputAddress" placeholder="A short explanation of the course" value={this.state.description} onChange={this.updateDescription} />
                </FormGroup>

                <Row form>
                  <Col md="6" className="form-group">
                    <label htmlFor="feEmailAddress">Start Date</label>
                    <FormInput
                      id="feEmailAddress"
                      type="date"
                      value={this.state.startDate} onChange={this.updateStartDate}
                    />
                  </Col>
                  <Col md="6">
                    <label htmlFor="fePassword">End Date</label>
                    <FormInput
                      id="fePassword"
                      type="date"
                      value={this.state.endDate} onChange={this.updateEndDate}
                    />
                  </Col>
                </Row>

                <FormGroup>
                  <label htmlFor="feInputAddress2">Class Room</label>
                  <FormInput
                    id="feInputAddress2"
                    placeholder="Help your students find the class room"
                    value={this.state.location} onChange={this.updateLocation}
                  />
                </FormGroup>
                <Button disabled={this.state.disabled} onClick={this.handleSubmit}>Create New Course</Button>              </Form>
            </Col>
          </Row>
        </ListGroupItem>
      </ListGroup>
    );
  }
}
