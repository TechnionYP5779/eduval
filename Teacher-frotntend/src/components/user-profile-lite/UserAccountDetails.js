import React from "react";
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
  Button
} from "shards-react";

import server from "../../Server/Server"
import TimeoutAlert from "../../components/common/TimeoutAlert"

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
    server.updateTeacher(function(response)
    {
      self.setState({error: false, success: true, disabled: false});
      window.scrollTo(0, 0);
    }, function(error){
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
      self.setState({details: response.data});
    }, function(error){
    });

  }


  render()
  {
  return(
    <div>
    {this.state.error &&
      <TimeoutAlert className="mb-0" theme="danger" msg={this.state.error} time={10000}/>
    }
    {this.state.success &&
      <TimeoutAlert className="mb-0" theme="success" msg={"Success! Your details have been updated!"} time={10000}/>
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
                    disabled={true}
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
                    disabled={true}
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


export default UserAccountDetails;
