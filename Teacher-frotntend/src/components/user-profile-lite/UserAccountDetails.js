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
import UserAccountCard from "./UserAccountCard";

import { withTranslation } from 'react-i18next';

class UserAccountDetails extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      details:{
        username: "",
        firstName: "",
        lastName: "",
        newPassword: "",
        oldPassword:"",
        email: "",
        phoneNum: ""
      },
      wrong_password:false,
      too_many_attempts:false,
      username_taken: false,
      email_taken: false,
      weak_password: false,
    };


    this.update = this.update.bind(this);
  }

  update(teacher_details){
    let self = this;
    this.setState({disabled: true});

    var tmp_dets=teacher_details;

    if(tmp_dets.newPassword=="")
    {
      delete tmp_dets.newPassword;
    }
    //Theoretically we might want to check whether anything was changed at all?
    server.updateTeacher(function(response)
    {
      var payload = JSON.parse(localStorage.getItem('payload'));
      payload["https://emon-teach.com/phone_number"]=tmp_dets.phoneNum;
      payload["https://emon-teach.com/first_name"]=tmp_dets.firstName;
      payload["https://emon-teach.com/last_name"]=tmp_dets.lastName;
      payload["https://emon-teach.com/username"]=tmp_dets.username;
      payload["email"]=tmp_dets.email;
      console.log("New Payload", payload);
      localStorage.setItem('payload', JSON.stringify(payload));

      self.setState({error: false, success: true, disabled: false});
      window.scrollTo(0, 0);
      window.location.reload(true);
    }, function(error){
      if(error.response)
      {
        console.log("Error", error);
        if(error.response.status==403){
          self.setState({wrong_password:true});
        }
        else if(error.response.status==429){
          self.setState({too_many_attempts:true});
        }
        else if(error.response.status==400){
          if(error.response.data.error=="USERNAME_TAKEN")
          {
            self.setState({username_taken:true});
          }
          else if(error.response.data.error=="EMAIL_TAKEN")
          {
            self.setState({email_taken:true});
          }
          else if(error.response.data.error=="WEAK_PASSWORD")
          {
            self.setState({weak_password:true});
          }

        }

        else
        {
          console.log("Error in updateTeacher in update in UserAccountDetails", error);
          self.setState({error: "An error has occured", success: false, disabled: false});
          window.scrollTo(0, 0);
        }
      }
    }, tmp_dets);
  }


  componentDidMount() {
    var self = this;

    var teacher_payload = server.getTeacherProfile( function(error){
        console.log("Error in getting Teacher Profile for Nav Bar");
        console.log(error);
    });
    if (teacher_payload)
    {
      var new_dets = {
        username: teacher_payload["https://emon-teach.com/username"],
        firstName: teacher_payload["https://emon-teach.com/first_name"],
        lastName: teacher_payload["https://emon-teach.com/last_name"],
        newPassword: "",
        oldPassword: "",
        email: teacher_payload["email"],
        phoneNum: teacher_payload["https://emon-teach.com/phone_number"]
    }
      self.setState({details: new_dets});
    }
    else
    {
      console.log("Problem at componentDidMount at UserAccountDetails.js!");
    }
  }


  render()
  {
    const { t } = this.props;
  return(
    <div>
      {this.state.error &&
      <TimeoutAlert className="mb-0" theme="danger" msg={this.state.error} time={10000}/>
      }
      {this.state.success &&
      <TimeoutAlert className="mb-0" theme="success" msg={t("Success! Your profile has been updated!")} time={10000}/>
      }
      <UserAccountCard
      title={t("Account Details")}
      details={this.state.details}
      updateTeacher={this.update}
      wrongPassword={this.state.wrong_password}
      changedOldPassword={()=>{this.setState({wrong_password:false})}}
      tooMany={this.state.too_many_attempts}
      usernameTaken={this.state.username_taken}
      changedUsername={()=>{this.setState({username_taken:false})}}
      emailTaken={this.state.email_taken}
      changedEmail={()=>{this.setState({email_taken:false})}}
      weakPassword={this.state.weak_password}
      changedWeakPassword={()=>{this.setState({weak_password:false})}}
      />
    </div>
    );
  }
}


export default withTranslation()(UserAccountDetails);
