import React from "react";
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
import server from "../../Server/Server"

import { withTranslation } from 'react-i18next'

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
  subheader:{
    color: "LimeGreen",
    align: "center",
    fontWeight: "bold",
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
      disabled: false,
    }

    this.updateStudentName = this.updateStudentName.bind(this);
    this.updateStudentSeat = this.updateStudentSeat.bind(this);
    this.startDemoLesson = this.startDemoLesson.bind(this);


    var self = this;
    server.getTrialLessonByHash(function(response) {
        localStorage.setItem('lesson_id', response.data.id);
        self.setState(
          {
            lesson_id : response.data.id,         
            lessonName : response.data.name
          })
    },
    function(error){
      console.log("Error in getTrialLessonByHash in constructor of DemoStudentLogin in DemoStudentLogin.js", error);
    }, self.state.lessonHash);

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
    var self = this;
    var student_details =
    {
      nickname: self.state.student_name,
      seatNumber: self.state.student_seat
    };
    server.postStudentToTrial(function(response){
      console.log("Posted Student!");
      console.log(response);
      self.setState(
        {
          authIdToken : response.data.idToken
        });
      console.log(self.state.authIdToken);


      let expiresAt = (response.data.expiresIn * 1000) + new Date().getTime();
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('expiresAt', expiresAt);
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('idToken', response.data.idToken);
      localStorage.setItem('sub', response.data.sub);
      localStorage.setItem('student_id', response.data.studentId);
      localStorage.setItem('payload', JSON.stringify(response.data.payload));

      localStorage.removeItem('lessonHash');

      Auth.accessToken = response.data.accessToken;
      Auth.idToken = response.idToken;
      Auth.expiresAt = expiresAt;
      Auth.sub = response.data.sub;
      console.log("PUSH?");
      history.push("/lesson/" + self.state.lesson_id);
      console.log("PUSH!");
  }, function(error){
    console.log("Error in postStudentToTrial in startDemoLesson in DemoStudentLogin", error);
    if(error.response)
    {
      if(error.response.status==409)
      {      console.log(error.response.data.error);
            if(error.response.data.error=="COURSE_NOT_STARTED")
            {
              self.setState({lessonNotStarted: true});
            }
            else
            {

              if(error.response.data.error=="DESK_TAKEN"){
                self.setState({studentSeatTaken: true})
              }
              else {
                self.setState({studentNameTaken: true})
              }
              self.setState({lessonNotStarted: false});
            }
      }
      else
      {
        self.setState({errored: true});
      }
    }
    self.setState({disabled: false});
  },self.state.lessonHash, student_details);
}

render(){
    const classes = this.props.classes;
    const { t } = this.props;
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
          subheader: classes.subheader
          }}
          title={"Join "+this.state.lessonName}
          subheader={"Notice! If you already have a registered user, you can simply click on 'Login' in the top right corner."}
        />
        <CardContent>
          <form className={classes.container}
            onSubmit={(event)=>{
              event.preventDefault();
              this.startDemoLesson();
            }}>
              <div>

                <TextField
                  required
                  error={this.state.emptyName || this.state.studentNameTaken}
                  id="standard-required"
                  label={t("Student Name")}
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
                  disabled={ this.state.studentSeatTaken || this.state.emptySeat
                    || this.state.emptyName || this.state.disabled}
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  endIcon={<Icon>send</Icon>}
                  type="submit"
                >
                  {this.state.student_name=="Drunkadiy" ? "Drunkadiy is not Allowed" : t("Enter Lesson")}
                </Button>
              </div>
          </form>       
        </CardContent>
      </Card>
    );
  }
}


export default withTranslation()(withStyles(styles)(DemoStudentLogin));
