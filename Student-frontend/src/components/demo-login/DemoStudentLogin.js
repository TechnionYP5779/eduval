import React from "react";
import axios from 'axios';
import Auth from "../../Auth/Auth"
import history from '../../history';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import AccountCircle from '@material-ui/icons/AccountCircle';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';

import Alert from 'react-bootstrap/Alert'


const styles = theme => ({
  card: {
    maxWidth: "90%",
    marginBottom: '30px ',
    margin: "15px auto",
  },

  title:{
    color: "DarkBlue",
    align: "center"
  },

  textField: {
    margin: "auto",
    width: "100%",
    marginBottom: '15px ',
  },

  button: {
    marginBottom: '10px ',
    marginTop: '10px ',
    margin: "auto",
    width: "100%"
  },
});

class DemoStudentLogin extends React.Component {
  constructor(props){
    super(props);
    console.log(props);
    this.state = {
      student_name:"",
      student_seat:-1,
      lessonName: "Lesson",
      lessonHash: this.props.lessonHash,
      lesson_id:-1,
      studentSeatTaken: false,
      studentNameTaken: false,
      lessonNotStarted: false,
      emptySeat: true,
      emptyName: true,
      errored: false,
    }

    axios.get('https://api.emon-teach.com/demo/'+this.state.lessonHash)
      .then((response) => {
        console.log("Got for hash!");
        console.log(response);
        this.setState(
          {
            lesson_id : response.data.id});
        this.setState(
          {
            lessonName : response.data.name});
        console.log("STUDENTLOGINPROPS");
        console.log(this.state.lesson_id);
        console.log(this.state.lessonName);

    })
    .catch((error)=>{
      console.log("ask with hash got error");
      console.log(error);
    });

    this.updateStudentName = this.updateStudentName.bind(this);
    this.updateStudentSeat = this.updateStudentSeat.bind(this);
    this.startDemoLesson = this.startDemoLesson.bind(this);

  }


  updateStudentName(evnt){
    if(evnt.target.value=="" || evnt.target.value=="Drunkadiy")
    {
      this.setState({emptyName: true});
    }
    else {
      this.setState({emptyName: false})
    }
    this.setState({student_name: evnt.target.value});
    this.setState({studentNameTaken: false})

  }

  updateStudentSeat(evnt){
    if(evnt.target.value==""  )
    {
      this.setState({emptySeat: true});
    }
    else {
      this.setState({emptySeat: false})
    }
    this.setState({student_seat: evnt.target.value});
    this.setState({studentSeatTaken: false})
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
      localStorage.setItem('student_id', response.data.studentId);
      Auth.accessToken = response.data.accessToken;
      Auth.idToken = response.idToken;
      Auth.expiresAt = expiresAt;
      Auth.sub = response.data.sub;
      Auth.registerstudent()
      console.log("PUSH?");
      history.push("/lesson/" + this.state.lesson_id);
      console.log("PUSH!");
  })
  .catch((error)=>{
    console.log("Posting Student didn't work");
    console.log(error.response);
    if(error.response)
    {
      if(error.response.status==409)
      {      console.log(error.response.data.error);
            if(error.response.data.error=="COURSE_NOT_STARTED")
            {
              this.setState({lessonNotStarted: true});
            }
            else
            {

              if(error.response.data.error=="DESK_TAKEN"){
                this.setState({studentSeatTaken: true})
              }
              else {
                this.setState({studentNameTaken: true})
              }
              this.setState({lessonNotStarted: false});
            }
      }
      else
      {
        this.setState({errored: true});
      }
    }
    this.setState({disabled: false});
  });
}

render(){
    const classes = this.props.classes;
    return (
      <Card className={classes.card}>
        {(this.state.studentSeatTaken || this.state.studentNameTaken) &&
          <Alert variant = "warning">
            <Alert.Heading style={{color:"white"} }>This {this.state.studentSeatTaken ? "Seat" : "Name"} is Taken!</Alert.Heading>
            <p>
              Select another {this.state.studentSeatTaken ? "seat" : "name"} if you want to proceed. <br/> Contact the teacher in case of further problems.
            </p>
          </Alert>
        }
        {this.state.lessonNotStarted &&
          <Alert variant = "danger">
            <Alert.Heading style={{color:"white"}}>The Lesson is Yet to Start!</Alert.Heading>
              <p> Unfortunately the lesson you're trying to log-in to didn't start yet. <br />
              Please contact the teacher for further information.</p>
          </Alert>
        }
        {this.state.errored &&
          <Alert variant = "dark">
            <Alert.Heading style={{color:"white"}}>An unexpected error happened!</Alert.Heading>
              <p> Please contact system administrator</p>
          </Alert>
        }
        <CardHeader
          classes={{
          title: classes.title,
          }}
          title={"Join "+this.state.lessonName}
        />
        <CardContent>
          <TextField
            required
            error={this.state.emptyName || this.state.studentNameTaken}
            id="standard-required"
            label="Student Name"
            className={classes.textField}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
            onChange={this.updateStudentName}
          />
          <TextField
            error={this.state.studentSeatTaken || this.state.emptySeat}
            required
            id="standard-number"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            label="Seat Number"
            className={classes.textField}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FormatListNumberedIcon />
                </InputAdornment>
              ),
            }}
            onChange={this.updateStudentSeat}
          />
          <Button
            disabled={ this.state.studentSeatTaken || this.state.emptySeat || this.state.emptyName}
            variant="contained"
            color="primary"
            className={classes.button}
            endIcon={<Icon>send</Icon>}
            onClick={this.startDemoLesson}
          >
            {this.state.student_name=="Drunkadiy" ? "Drunkadiy is not Allowed" : "Enter Lesson"}
          </Button>
        </CardContent>

      </Card>
    );
  }
}


export default withStyles(styles)(DemoStudentLogin);
