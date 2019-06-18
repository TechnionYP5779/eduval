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
  Container,
  Button,
  Alert
} from "shards-react";

import server from "../../Server/Server";

import axios from 'axios';

class UserAccountDetails extends React.Component {

  constructor(props) {
  super(props);

  this.state = {
    details:
    {
      id: localStorage.getItem('student_id'),
      authIdToken: "",
      name: "",
      password: "",
      email: "",
      phoneNum: ""
    }
  };

  this.updateName = this.updateName.bind(this);
  this.updateEmail = this.updateEmail.bind(this);
  this.updatePhoneNumber = this.updatePhoneNumber.bind(this);
  this.update = this.update.bind(this);
}

updateName(evnt){
  let dets = this.state.details;
  dets.name = evnt.target.value;
  this.setState({details: dets})
}


update(){
  let self = this;
  let config = {
    headers: {'Authorization': 'Bearer ' + localStorage.getItem('idToken')}
  };
  axios.put('https://api.emon-teach.com/student', {
    id:  this.state.details.id,
    // authIdToken: this.state.details.authIdToken,
    // name: this.state.details.name,
    // email: this.state.details.email,
    phoneNum: this.state.details.phoneNum
  }, config)
  .then((response) => {
      self.setState({error: false, success: true, disabled: false});
      window.scrollTo(0, 0);})
      .catch((error) => {console.log("failed", error);
      self.setState({error: "An error has occured", success: false, disabled: false});
      window.scrollTo(0, 0);});
}

updateEmail(evnt){
  var dets = this.state.details;
  dets.email = evnt.target.value;
  this.setState({details: dets})
}

updatePhoneNumber(evnt){
  var dets = this.state.details;
  dets.phoneNum = evnt.target.value;
  this.setState({details: dets})
}
componentDidMount() {
  var self = this;
  server.getStudentProfile(function(response){
    
    self.setState({details: response.data});
  }, function(error){
  });

  
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
        <i className="fa fa-info mx-2"></i> Success! Your profile has been updated!
      </Alert>
    </Container>
    }



   <Card small className="mb-4">
     <CardHeader className="border-bottom">
       <h6 className="m-0">Change Details</h6>
     </CardHeader>
     <ListGroup flush>
       <ListGroupItem className="p-3">
         <Row>
           <Col>
             <Form onSubmit={e => this.handleSubmit(e)}>
               <Row form>
                 {/* First Name */}
                 <Col md="6" className="form-group">
                   <label htmlFor="feFirstName">Name</label>
                   <FormInput
                     id="Name"
                     placeholder="Name"
                     disabled={true}
                     value = {this.state.details.name}
                     onChange={this.updateName}
                   />
                 </Col>
                 {/* Last Name */}
               </Row>
               <Row form>
                 {/* Email */}
                 <Col md="6" className="form-group">
                   <label htmlFor="feEmail">Email</label>
                   <FormInput
                     type="email"
                     disabled={true}
                     id="feEmail"
                     placeholder="Email Address"
                     value = {this.state.details.email}
                      onChange={this.updateEmail}
                   />
                 </Col>
               </Row>
               <FormGroup>
                 <label htmlFor="feAddress">Phone Number</label>
                 <FormInput
                   type="tel"
                   id="feAddress"
                   value = {this.state.details.phoneNum}
                   onChange={this.updatePhoneNumber}
                 />
               </FormGroup>
               <Button theme="accent" onClick={this.update} >Update Account</Button>
             </Form>
           </Col>
         </Row>
       </ListGroupItem>
     </ListGroup>
   </Card>

      </div>);
}
};


export default UserAccountDetails;
