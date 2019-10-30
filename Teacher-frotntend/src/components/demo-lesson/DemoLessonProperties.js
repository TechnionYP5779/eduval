import React from "react";
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
      invite_link: ""
    };
    this.startDemoLesson = this.startDemoLesson.bind(this);
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
