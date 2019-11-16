import React from "react";
import history from '../history';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert'
import {
  Button,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Form,
  FormInput,
  FormGroup
} from "shards-react";


import server from "../Server/Server";
import Auth from "../Auth/Auth"


export default class DemoLesson extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      student_name:"",
      student_seat:-1,
      lessonHash : props.location.search.substring(4),
      lesson_id: -1,
      lesson_name:"",
      authIdToken:"",
      disabled: false,
      student_seat_taken: false
    };


    let headers = {
      'Authorization': 'Bearer ' + localStorage.getItem('idToken')
      };
      axios.get('https://api.emon-teach.com/demo/'+this.state.lessonHash)
        .then((response) => {
          console.log("Got for hash!");
          console.log(response);
        this.setState(
          {
            lesson_id : response.data.id});
          console.log(this.state.lesson_id);
      })
      .catch((error)=>{
        console.log("ask with hash got error");
        console.log(error);
      });
      this.updateStudentName = this.updateStudentName.bind(this);
      this.updateStudentSeat = this.updateStudentSeat.bind(this);
      this.startDemoLesson = this.startDemoLesson.bind(this);

  }
  componentDidMount(){
      // Remove tokens and expiry time
      Auth.accessToken = null;
      Auth.idToken = null;
      Auth.expiresAt = 0;

      // Remove isLoggedIn flag from localStorage
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('expiresAt');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('idToken');
      localStorage.removeItem('sub');
      localStorage.removeItem('student_id');
  }


  updateStudentName(evnt){
    this.setState({student_name: evnt.target.value});
  }

  updateStudentSeat(evnt){
    this.setState({student_seat: evnt.target.value});
  }

  startDemoLesson(){

    this.setState({disabled: true});
    console.log(this.state.student_name);
    console.log(this.state.student_seat);
    axios.post('https://api.emon-teach.com/demo/'+this.state.lessonHash+'/students',
      {
        nickname: this.state.student_name,
        seatNumber: this.state.student_seat
      }
    )
      .then((response) => {
        console.log("Posted Student!");
        console.log(response);
      this.setState(
        {
          authIdToken : response.data.idToken
        });
        console.log(this.state.authIdToken);


          let expiresAt = (response.data.expiresIn * 1000) + new Date().getTime();
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('expiresAt', expiresAt);
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('idToken', response.data.idToken);
        localStorage.setItem('sub', response.data.sub);
        Auth.accessToken = response.data.accessToken;
        Auth.idToken = response.idToken;
        Auth.expiresAt = expiresAt;
        Auth.registerstudent()
        console.log("PUSH?");
        history.push("/lesson/" + this.state.lesson_id);
        console.log("PUSH!");
    })
    .catch((error)=>{
      console.log("Posting Student didn't work");
      console.log(error.response.status);
      if(error.response.status==409)
      {
        this.setState({student_seat_taken: true})
      }
      this.setState({disabled: false});
    });
  }


  render(){
    return (
      <ListGroup flush>
      {this.state.student_seat_taken &&
        <Alert variant = "danger">
          <Alert.Heading style={{color:"white"}}>This Seat is Taken!</Alert.Heading>
          <p>
            Select another seat if you want to proceed. Contact the teacher in case of further problems.
          </p>
        </Alert>
      }
        <Form>
            <Col md="6" className="form-group">
              <FormGroup>
                <label htmlFor="fName">Enter Name</label>
                <FormInput
                  id="name"
                  type="namestring"
                  value={this.student_name}
                  onChange={this.updateStudentName}
                />
              </FormGroup>
              <FormGroup>
                <label htmlFor="fSeat">Your Seat Number</label>
                <FormInput
                  id="seat"
                  type="seatint"
                  value={this.student_seat}
                  onChange={this.updateStudentSeat}
                />
              </FormGroup>
            </Col>
          </Form>
          <Button disabled={this.state.disabled} onClick={this.startDemoLesson}>Enter Lesson</Button>
      </ListGroup>
    )
  }
}
