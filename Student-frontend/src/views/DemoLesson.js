import React from "react";
import {historyNoRefresh as history} from '../history';
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
import DemoStudentLogin from "../components/demo-login/DemoStudentLogin"

export default class DemoLesson extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      student_name:"",
      student_seat:-1,
      lessonHash : props.location.search.substring(4),
      lesson_id: -1,
      lessonName:"",
      authIdToken:"",
      disabled: false,
      student_seat_taken: false
    };


    let headers = {
      'Authorization': 'Bearer ' + localStorage.getItem('idToken')
      };
      this.updateStudentName = this.updateStudentName.bind(this);
      this.updateStudentSeat = this.updateStudentSeat.bind(this);

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

      if(this.state.lessonHash === '') {
        this.setState({ lessonHash: localStorage.getItem('lessonHash') });
        history.replace(`${this.props.location.pathname}?id=${localStorage.getItem('lessonHash')}`);
      }
      else {
        localStorage.setItem('lessonHash', this.state.lessonHash);
      }
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.location !== this.props.location) {
      console.log('updaaaaaate')
      this.setState({ lessonHash: localStorage.getItem('lessonHash') });
      history.replace(`${this.props.location.pathname}?id=${localStorage.getItem('lessonHash')}`);
    }
  }


  updateStudentName(evnt){
    this.setState({student_name: evnt.target.value});
  }

  updateStudentSeat(evnt){
    this.setState({student_seat: evnt.target.value});
  }




  render(){
    console.log(this.state.lessonName);
    console.log(this.state);
    return (
      <ListGroup flush>
        <DemoStudentLogin lessonHash={this.state.lessonHash}/>
      </ListGroup>
    )
  }
}
