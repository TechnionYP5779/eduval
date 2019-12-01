/* eslint jsx-a11y/anchor-is-valid: 0 */
import history from '../history';
import React from "react";
import axios from 'axios';
import clsx from 'clsx';

import Alert from 'react-bootstrap/Alert'

import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardFooter,
  Form,
  FormGroup,
  FormInput,
  Badge,
} from "shards-react";
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import PageTitle from "../components/common/PageTitle";
import CourseCard from "../components/common/CourseCard";
import server from "../Server/Server";

import awsIot  from 'aws-iot-device-sdk';

import PlayCircleFilledWhiteRoundedIcon from '@material-ui/icons/PlayCircleFilledWhiteRounded';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import ClearIcon from '@material-ui/icons/Clear';
import Delete from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';

import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import InputAdornment from '@material-ui/core/InputAdornment';
import SendIcon from '@material-ui/icons/Send';


const customStyles = {
  content : {
    top                   : '50%',
    left                  : '40%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-40%, -40%)',
    maxHeight            : '45vh'
  }
};

const styles = theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },

  buttonModal:
  {
    width: "50%",
    position: 'relative',
  },

  sendDesk:
  {
    backgroundColor: "LimeGreen",
    color: "white",
    borderColor: "white",
  },

  qr: {
    margin: "auto",
    display: "block",
    maxWidth: "20%"
  },
  regularLesson:
  {
    borderWidth: "medium",
    borderStyle: "solid",
  },

  resumeLesson:
  {
    backgroundColor: "#77dd77"
  },

  joinLesson:
  {
    backgroundColor:"Orange",
  },
  textField: {
    margin: "auto",
    width: "100%",
    marginBottom: '15px ',
  },
  title:{
    color: "DarkBlue",
    align: "center"
  },


});

class MyCourses extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: res,
      // Third list of posts.
      PostsListThree: [],
      lessons_status: {},
      lessons_student_status: {},
      modalIsOpen: false,
      post_id:-1,
      student_seat: -1,
      studentSeatTaken: false,
      emptySeat: true,

      desk_modal_open: false,
      desk_button_disabled: false,
      errored: false,
    };

    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.setDeskModalChange = this.setDeskModalChange.bind(this)
    this.handleDeskModalOpen = this.handleDeskModalOpen.bind(this)
    this.handleDeskModalClose = this.handleDeskModalClose.bind(this)
    this.updateStudentSeat = this.updateStudentSeat.bind(this);



    let headers = {
        'Authorization': 'Bearer ' + localStorage.getItem('idToken')
    }
    let sub=new Buffer( localStorage.getItem('sub')).toString('base64');
   
      let res=[];

      server.getStudentCourses((response) => {
        this.setState({PostsListThree: response.data});

        const getContent = function(url) {
          return new Promise((resolve, reject) => {
            const lib = url.startsWith('https') ? require('https') : require('http');
            const request = lib.get(url, (response) => {
              if (response.statusCode < 200 || response.statusCode > 299) {
                  reject(new Error('Failed to load page, status code: ' + response.statusCode));
                }

              const body = [];
              response.on('data', (chunk) => body.push(chunk));
              response.on('end', () => resolve(body.join('')));
            });
            request.on('error', (err) => reject(err))
          })
        };        
        
        let client;

        let connect = async () => {
    	return getContent('https://qh6vsuof2f.execute-api.eu-central-1.amazonaws.com/dev/iot/keys').then((res) => {
    		res = JSON.parse(res)
    		client = awsIot.device({
                region: res.region,
                protocol: 'wss',
                accessKeyId: res.accessKey,
                secretKey: res.secretKey,
                sessionToken: res.sessionToken,
                port: 443,
                host: res.iotEndpoint
            });
    	})

        }

        var j;
        for (j = 0; j < this.state.PostsListThree.length; j++) {
          server.getLessonStatus((response) => {
            var current_id = ((response.request.responseURL).split('lesson')[1]).split('/')[1];
            
            if(response.data === "LESSON_START") {
              var insert = this.state.lessons_status;
              var insert_student_status = this.state.lessons_student_status
              insert[current_id] = false;
              this.setState({lessons_status: insert});

              server.getLessonPresentStudents((response) => {
                var Student_id = parseInt(localStorage.getItem('student_id'));
                for (var student of response.data){
                  if(student.id == Student_id){

                    insert_student_status[current_id] = true;
                    this.setState({lessons_student_status: insert_student_status});
                    break;
                  }
                }
              }, null, current_id);
            } else {
              this.state.lessons_status[current_id] = true;
              this.setState({lessons_status: this.state.lessons_status});
            }

          }, (error)=>{
            console.log(error);
          }, this.state.PostsListThree[j].id);
        }

        var i;
        for (i = 0; i < this.state.PostsListThree.length; i++) {
          let LessonsStatusURL = 'lesson/'+ this.state.PostsListThree[i].id +'/status';
          connect().then(() => {
            client.subscribe(LessonsStatusURL);
            client.on('message', (topic, message) => {

            var current_id = ((topic).split('lesson')[1]).split('/')[1];
            if(message == "LESSON_START"){
                var insert = this.state.lessons_status;
                insert[current_id] = false;
                this.setState({lessons_status: insert});
              }else{
                var insert = this.state.lessons_status;
                  insert[current_id] = true;
                this.setState({lessons_status: insert});
              }
            })
          });
        }
      }, (error)=>{
        console.log(error);
     });

  }

  setDeskModalChange(value)
  {
    this.setState({desk_modal_open: value})
  }

  handleDeskModalOpen = (id) =>
  {
    this.setState({post_id: id});
    this.setDeskModalChange(true);
  };

  handleDeskModalClose = () => {
    this.setDeskModalChange(false);
  };


  insertDeskNumber(seatNumber, errorCallback) {
    var Student_id = parseInt(localStorage.getItem('student_id'));
    console.log(this.state);
    console.log(errorCallback)
    var lesson_id = this.state.post_id;
    console.log("I got lesson id " + lesson_id);
    let config = {
        headers: {'Authorization': 'Bearer ' + localStorage.getItem('idToken')}
    };
    var txt;
    this.showModal(lesson_id);
    if(seatNumber<0)
    {
      this.setState({errored:true});
      return;
    }
    console.log("SEAT NUMBER");
    console.log(seatNumber);
    this.setState({
      studentSeatTaken:false,
      emptySeat: false,
      errored: false
    })

    var self = this;
    server.lessonRegisterPresentStudent(() =>
    {
      history.push("/lesson/" + lesson_id);
    }, (error) =>
    {
        console.log(error);
        console.log("Failed presenting maself");
        if(error.response)
        {
          if(error.response.status === 409)
          {
            self.setState({studentSeatTaken: true})
          }
          else
          {
            self.setState({errored: true});
          }
        }
        else
        {
          self.setState({errored: true});
        }
        self.setState({desk_button_disabled: false});
    }, lesson_id, seatNumber);
  }

  showModal(id) {
    this.setState({modalIsOpen: true, titleModal: "Enter your desk number " , desk_num: "767"});
    this.setState({post_id: id});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  updateStudentSeat(evnt){
    if(evnt.target.value === "")
    {
      this.setState({emptySeat: true});
    }
    else {
      this.setState({emptySeat: false})
    }
    this.setState({student_seat: evnt.target.value});
    this.setState({studentSeatTaken: false})
  }
  render() {
    const classes = this.props.classes;
    const {
      PostsListOne,
      PostsListTwo,
      PostsListThree,
      PostsListFour
    } = this.state;
    let showModal = this.showModal;
    let closeModal = this.closeModal;


    return (
    <div>


      <Container fluid className="main-content-container px-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title="My Courses" subtitle="Manage eveyrthing in one place"
                     className="text-sm-left" />
        </Row>




        {/* First Row of Posts */}
        <Row>
          {
            PostsListThree.map((post, idx) => (
            <Col lg="4" key={idx}>
              <CourseCard

              demoLink={post.demoLink}
              name={post.name}
              description={post.description}
              disabled_play={this.state.lessons_status[post.id]}
              play_text={this.state.lessons_student_status[post.id] ? "Resume" : "Join" }
              play_pushed={this.state.lessons_student_status[post.id]}
              id={post.id}
              play_errored={this.state.errored}
              studentSeatTaken={this.state.studentSeatTaken}
              emptySeat={this.state.emptySeat}
              setPostWhenModalOpen={()=>
              {
                this.setState({post_id: post.id});
              }}
              insertDeskNumber={(seatNumber)=>
                {
                  this.insertDeskNumber(seatNumber);
                }
              }
              playClicked=
              {()=>{history.push("/lesson/" + post.id);}}

              />

            </Col>
          ))}
        </Row>

      </Container>

</div>
    );

  }

}

MyCourses.propTypes = {
  classes:PropTypes.object.isRequired,
};


export default withStyles(styles)(MyCourses);

// <CourseCard
//   name={post.name}
//   description={post.description}
//   id={post.id}
//   play_pushed={this.state.lessons_student_status[post.id]}
// />
