import React from "react";
import PropTypes from "prop-types";
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

import server from "../../Server/Server"

class UserAccountDetails extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      details:
      {
        id: "",
        name: "",
        password: "",
        email: "",
        phoneNum: ""
      }
    };

    this.updateName = this.updateName.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
    this.updatePhoneNumber = this.updatePhoneNumber.bind(this);
    this.update = this.update.bind(this);


  }

  update(){
    let self = this;
    this.setState({disabled: true});
    //Theoretically we might want to check whether anything was changed at all?
    console.log("Hello");
    server.updateTeacher(function(response)
    {
      console.log("worked", response);
      self.setState({error: false, success: true, disabled: false});
      window.scrollTo(0, 0);
    }, function(error){
      console.log("failed", error);
      self.setState({error: "An error has occured", success: false, disabled: false});
      window.scrollTo(0, 0);
    }, this.state.details);
  }

  updateName(evnt){
    let dets = this.state.details;
    dets.name = evnt.target.value;
    this.setState({details: dets})
  }

  updatePassword(evnt){
    this.setState({password: evnt.target.value})
  }

  updateEmail(evnt){
    let dets = this.state.details;
    dets.email = evnt.target.value;
    this.setState({details: dets})
  }

  updatePhoneNumber(evnt){
    let dets = this.state.details;
    dets.phoneNum = evnt.target.value;
    this.setState({details: dets})
  }

  componentDidMount() {
    var self = this;
    server.getTeacherProfile(function(response){
      console.log(response);
      self.setState({details: response.data});
    }, function(error){
    });

    console.log(self.state)
  }


  render()
  {
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
        <i className="fa fa-info mx-2"></i> Success! Your details have been updated!
      </Alert>
    </Container>
    }

    <Card small className="mb-4">
      <CardHeader className="border-bottom">
        <h6 className="m-0">Account Details</h6>
      </CardHeader>
      <ListGroup flush>
        <ListGroupItem className="p-3">
          <Row>
            <Col>
              <Form>
                <FormGroup>
                  <label htmlFor="feUsername">Username</label>
                  <FormInput
                    type="username  "
                    id="feUsername"
                    placeholder="Username"
                    value = {this.state.details.name}
                    onChange={()=>{}}
                  />
                </FormGroup>

                <FormGroup>
                  <label htmlFor="feEmail">Email</label>
                  <FormInput
                    type="email"
                    id="feEmail"
                    placeholder="Email"
                    value = {this.state.details.email}
                    onChange={this.updateEmail}
                  />
                </FormGroup>
                <FormGroup>
                  <label htmlFor="fePhoneNumber">Phone Number</label>
                  <FormInput
                    type="tel"
                    id="fePhoneNumber"
                    placeholder="Phone Number"
                    value = {this.state.details.phoneNum}
                    onChange={this.updatePhoneNumber}
                  />
                </FormGroup>
                <Button outline disabled={this.state.disabled} onClick={this.update} theme="accent">Update Account</Button>
              </Form>
            </Col>
          </Row>
        </ListGroupItem>
      </ListGroup>
    </Card>
    </div>
  );
}
}
//   UserAccountDetails.propTypes = {
//     /**
//      * The component's title.
//      */
//     title: PropTypes.string
//   };
//
//   UserAccountDetails.defaultProps = {
//     title: "Account Details"
//   };
// }
//
// <Row form>
//   {/* Description */}
//   <Col md="12" className="form-group">
//     <label htmlFor="feDescription">Description</label>
//     <FormTextarea id="feDescription" rows="5" />
//   </Col>
// </Row>

export default UserAccountDetails;
