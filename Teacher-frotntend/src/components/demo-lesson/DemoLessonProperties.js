import React from "react";
import Alert from 'react-bootstrap/Alert'

import {
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Form,
  FormInput,
  FormGroup
} from "shards-react";

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
import InputAdornment from '@material-ui/core/InputAdornment';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import SchoolIcon from '@material-ui/icons/School';
import PublicIcon from '@material-ui/icons/Public';
import SubjectIcon from '@material-ui/icons/Subject';
import LinkIcon from '@material-ui/icons/Link';
import { withTranslation } from 'react-i18next';


import server from "../../Server/Server";
var QRCode = require('qrcode.react');

const styles = theme => ({
  card: {
    width: "90%",
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

  qr: {
    margin: "auto",
    display: "block",
    maxWidth: "85%"
  }
});


class DemoLessonProperties extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      disabled:false,
      invite_link: "",
      activeLessonId: -1,
      course: {id: "", name: "", location: "", description: "", startDate: "", endDate: ""}
    };
    this.startDemoLesson = this.startDemoLesson.bind(this);
    this.updateCourseName = this.updateCourseName.bind(this);
    this.updateCourseLocation = this.updateCourseLocation.bind(this);
    this.updateCourseDescription = this.updateCourseDescription.bind(this);
  }

  // componentDidMount() {
  //   var self = this;
  //   server.getActiveLesson(function(response){
  //     console.log(response);
  //     console.log("GETACTIVE");
  //     if (response.status==200){
  //       self.setState({activeLessonId: response.data});
  //       server.getCourse(function(response){
  //         console.log(response.data);
  //         console.log("GOTCOURSE");
  //         self.setState({course: response.data});
  //       }, function(error){
  //       }, self.state.activeLessonId);
  //     }
  //   }, (err)=>{console.log("err", err);});
  //
  // }


  updateCourseName(evnt){
    this.state.course.name =  evnt.target.value;
  }

  updateCourseLocation(evnt){
    this.state.course.location = evnt.target.value;
  }

  updateCourseDescription(evnt){
    this.state.course.description =  evnt.target.value;
  }


  startDemoLesson(evnt){
    let self = this;
    this.setState({disabled: true});

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;

    server.createNewDemo(function(response){
      console.log(response);
      self.setState({disabled: false});
      self.setState({invite_link: response.data});
    }, function(error){
      console.log(error);
      console.log("Error in createNewDemo in startDemoLesson in DemoLessonProperties.js");
      self.setState({disabled: false});
    }, {name: this.state.course.name=="" ? "Trial Lesson" : this.state.course.name,
        location: this.state.course.location == "" ? "" : this.state.course.location,
      description: this.state.course.description=="" ? "" : this.state.course.description, startDate: today,
      endDate: today
    });



  }

  render(){
    const classes = this.props.classes;
    const { t } = this.props;

    return (
      <ListGroup flush>
        <Card className={classes.card}>
          <CardHeader
            classes={{
            title: classes.title,
            }}
            title={t("Create a Trial Lesson")}
          />
          <CardContent>
            <TextField
              id="standard-required"
              label={t("Lesson Name (OPTIONAL)")}
              className={classes.textField}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SchoolIcon />
                  </InputAdornment>
                ),
              }}
              onChange={this.updateCourseName}
            />
            <TextField
              id="standard-required"
              label={t("Location (OPTIONAL)")}
              className={classes.textField}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PublicIcon />
                  </InputAdornment>
                ),
              }}
              onChange={this.updateCourseLocation}
            />

            <TextField
              multiline
              rowsMax="4"
              id="standard-multiline-flexible"
              label={t("Course Description (OPTIONAL)")}
              className={classes.textField}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SubjectIcon />
                  </InputAdornment>
                ),
              }}
              onChange={this.updateCourseDescription}
            />

            <Button
              disabled={this.state.disabled}
              variant="contained"
              color="primary"
              className={classes.button}
              endIcon={<Icon>send</Icon>}
              onClick={this.startDemoLesson}
            >
              {t("Create Trial Lesson")}
            </Button>
            {
              this.state.invite_link != "" &&
              <h1 
                style={{
                  textAlign:"center",
                  fontFamily: "monospace"
                }}
              > {this.state.invite_link}</h1>
            }
            {
              this.state.invite_link != "" &&
              <QRCode size="200" value={this.state.invite_link} className={classes.qr}/>
            }
          </CardContent>
        </Card>
      </ListGroup>
    )
  }
}

export default withTranslation()(withStyles(styles)(DemoLessonProperties));
