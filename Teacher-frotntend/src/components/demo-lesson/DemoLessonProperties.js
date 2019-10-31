import React from "react";
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


import server from "../../Server/Server";

export default class DemoLessonProperties extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      disabled:false,
      invite_link: "",
      activeLessonId: -1,
      course: {id: "", name: "", location: "", description: "", startDate: "", endDate: ""}
    };
    this.startDemoLesson = this.startDemoLesson.bind(this);
  }

  componentDidMount() {
    var self = this;
    server.getActiveLesson(function(response){
      console.log(response);
      console.log("GETACTIVE");
      if (response.status==200){
        self.setState({activeLessonId: response.data});
        server.getCourse(function(response){
          console.log(response.data);
          console.log("GOTCOURSE");
          self.setState({course: response.data});
        }, function(error){
        }, self.state.activeLessonId);
      }
    }, (err)=>{console.log("err", err);});

  }


  updateName(evnt){
    this.setState({name: evnt.target.value});
  }

  startDemoLesson(evnt){
    let self = this;
    this.setState({disabled: true});
    let handler  =   this.props.handler;

    server.createNewDemo(function(response){
      handler(null);
      self.setState({disabled: false});
      self.setState({invite_link: response.data});
    }, function(error){
      console.log(error);
      console.log("Demo error");
      handler("An error has occured");
      self.setState({disabled: false});
    }, {name: "Trial Lesson", location: "111",
      description: "", startDate: "2019-10-29",
      endDate: "2019-10-29"
    });



  }

  render(){
    return (


      <ListGroup flush>
          {this.state.activeLessonId!=-1 &&
            <Alert variant = "danger" dismissible>
              <Alert.Heading style={{color:"white"}}>Warning! A lesson is still active!</Alert.Heading>
              <p>
                Your course {this.state.course.name} is in active lesson currently.
                If you start a new trial, all active lesson will be closed.
              </p>
            </Alert>
          }
          <Button disabled={this.state.disabled} onClick={this.startDemoLesson}>Start Trial Lesson</Button>
          <Col md="6" className="form-group">
            <label htmlFor="feEmailAddress">Invite Link</label>
            <FormInput
              id="invite_link"
              type="link"
              value={this.state.invite_link}
            />
          </Col>
      </ListGroup>
    )
  }
}
