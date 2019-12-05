import React from "react";
import clsx from 'clsx';

import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';
import Alert from 'react-bootstrap/Alert';

import { withTranslation } from 'react-i18next';

import {
  Row,
  Col,
} from "shards-react";

import server from "../../Server/Server";

const styles = theme => ({
  card: {
    marginBottom: '30px ',
  },

  title:{
    color: "DarkBlue",
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "40%",
  },
  instruction: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(2),
  },

  button:{
    width:"45%",
    marginTop: '28px ',

  }
});

class UserAccountCard extends React.Component
{
  constructor(props) {
    super(props);
    this.state =
    {
      title: this.props.title,
      details:
      {
        username: "",
        firstName: "",
        lastName: "",
        newPassword: "",
        email: "",
        phoneNum: "",
        oldPassword: "",
      },
      wrongPassword:this.props.wrongPassword,
      usernameTaken:this.props.usernameTaken,
      emailTaken: this.props.emailTaken,
      tooMany:this.props.tooMany,
      isPhoneNumber:false,
      isEmail: false,
      fieldError: false,
    }
    this.setState({details:  this.props.details});

    this.setUsername = this.setUsername.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);

    this.setEmail = this.setEmail.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.checkEmail = this.checkEmail.bind(this);

    this.setFirstName = this.setFirstName.bind(this);
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);

    this.setLastName = this.setLastName.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);

    this.setNewPassword = this.setNewPassword.bind(this);
    this.handleNewPasswordChange = this.handleNewPasswordChange.bind(this);

    this.setConfirmPassword = this.setConfirmPassword.bind(this);
    this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(this);

    this.setPhoneNumber = this.setPhoneNumber.bind(this);
    this.handlePhoneNumberChange = this.handlePhoneNumberChange.bind(this);
    this.checkPhoneNumber = this.checkPhoneNumber.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentDidUpdate(prevProps, prevState)
  {
    if(prevProps.details!=this.props.details)
    {
      this.setState({details: this.props.details});
      this.checkPhoneNumber(this.props.details.phoneNum);
      this.checkEmail(this.props.details.email);
      console.log("New Details", this.props.details);
    }
    if(prevProps.wrongPassword!=this.props.wrongPassword)
    {
      this.setState({wrongPassword: this.props.wrongPassword});
    }
    if(prevProps.usernameTaken!=this.props.usernameTaken)
    {
      this.setState({usernameTaken: this.props.usernameTaken});
      this.setState({fieldError:true})
    }
    if(prevProps.emailTaken!=this.props.emailTaken)
    {
      this.setState({emailTaken: this.props.emailTaken});
      this.setState({fieldError:true})
    }
    if(prevProps.tooMany!=this.props.tooMany)
    {
      this.setState({tooMany: this.props.tooMany});
    }
  }

  setUsername(value)
  {
    this.setState({fieldError:false})
    var dets = this.state.details;
    dets.username = value;
    this.setState({details: dets});
  }
  handleUsernameChange(evnt)
  {
    this.props.changedUsername();
    this.setState({usernameTaken:false})
    this.setUsername(evnt.target.value);
  }

  setEmail(value)
  {
    var dets = this.state.details;
    dets.email = value;
    this.setState({details: dets});
  }
  handleEmailChange(evnt)
  {
    this.props.changedEmail();
    this.setState({emailTaken:false})
    this.setState({fieldError:false})
    this.checkEmail(evnt.target.value);
    this.setEmail(evnt.target.value);
  }

  checkEmail(value)
  {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    var arr_result = re.exec(value);
    console.log("Arr_Result", arr_result);
    if(!arr_result )
    {
      this.setState({isEmail: false})
    }
    else {
      this.setState({isEmail: true})
    }
  }


  setFirstName(value)
  {
    var dets = this.state.details;
    dets.firstName = value;
    this.setState({details: dets});
  }
  handleFirstNameChange(evnt)
  {
    this.setFirstName(evnt.target.value);
  }

  setLastName(value)
  {
    var dets = this.state.details;
    dets.lastName = value;
    this.setState({details: dets});
  }
  handleLastNameChange(evnt)
  {
    this.setLastName(evnt.target.value);
  }

  setNewPassword(value)
  {
    var dets = this.state.details;
    dets.newPassword = value;
    this.setState({details: dets});
  }
  handleNewPasswordChange(evnt)
  {
    this.setNewPassword(evnt.target.value);
  }

  setConfirmPassword(value)
  {
    var dets = this.state.details;
    dets.oldPassword = value;
    this.setState({details: dets});
  }
  handleConfirmPasswordChange(evnt)
  {
    this.setState({fieldError:false})
    this.setState({wrongPassword:false});
    this.props.changedOldPassword();
    this.setConfirmPassword(evnt.target.value);
  }

  setPhoneNumber(value)
  {
    var dets = this.state.details;
    dets.phoneNum = value;
    this.setState({details: dets});
  }
  handlePhoneNumberChange(evnt)
  {
    this.setState({fieldError:false})
    this.checkPhoneNumber(evnt.target.value);
    this.setPhoneNumber(evnt.target.value);
  }

  checkPhoneNumber(value)
  {
    var re = RegExp('^(0|(\\+[0-9]{3}))[0-9]{9}$','g');
    var arr_result = re.exec(value);
    console.log("Arr_Result", arr_result);
    if(!arr_result && value!="")
    {
      this.setState({isPhoneNumber: false})
    }
    else {
      this.setState({isPhoneNumber: true})
    }
  }

  submit()
  {
    if (!this.state.isPhoneNumber || this.state.oldPassword==""
          || !this.state.isEmail || this.state.usernameTaken || this.state.emailTaken)
    {
      this.setState({fieldError:true})
      return
    }
    this.props.updateTeacher(this.state.details);
  }

  render(){
    const classes = this.props.classes;
    const { t } = this.props;

    return(
      <Card className={classes.card}>
      {(this.state.details.demoStudent) &&
        <Alert variant = "warning">
          <Alert.Heading style={{color:"white"} }>{t("Welcome to the System!")}</Alert.Heading>
          <p>
            {t("This is your first time in the system")}. <br/>
            {t("In order to keep all the Emons you've accumulated, you need to set a new password!")} <br/>
            {t("ADVICE: You might want to change the username and email as you're required to enter them when you log in")}.
          </p>
        </Alert>
      }
      {(this.state.tooMany) &&
        <Alert variant = "warning">
          <Alert.Heading style={{color:"white"} }>{t("Your Account is blocked!")}</Alert.Heading>
          <p>
            {t("You've accessed your account too many times")}. <br/>
            {t("Contact system administrator or look for instructions in your mail for further instructions")}.
          </p>
        </Alert>
      }
      {this.state.wrongPassword &&
        <Alert variant = "danger">
          <Alert.Heading style={{color:"white"}}>{t("Wrong Confirmation Password!")}</Alert.Heading>
            <p> {t("The password near the button has to be your correct one")}. <br />
            {t("Please contact administrator for further information")}.</p>
        </Alert>
      }
      {this.state.fieldError &&
        <Alert variant = "dark">
          <Alert.Heading style={{color:"white"}}>{t("One of the Fields filled is wrong!")}</Alert.Heading>
            <p> {t("Check which field is marked with red or consult an administrator")}</p>
        </Alert>
      }

        <CardHeader
        classes={{
          title: classes.title,
        }}
        title={this.state.title}
        />
        <CardContent>
          <form className={classes.container} action="#" onSubmit={this.submit}>
            <div>
              <TextField
                required
                error={this.state.usernameTaken}
                id="standard-required"
                label={t("Username")}
                value={this.props.details.username}
                className={classes.textField}
                onChange={this.handleUsernameChange}
                margin="normal"
              />
              <TextField
                required
                error={!this.state.isEmail || this.state.emailTaken}
                id="standard-required"
                label={t("Email")}
                type="email"
                value={this.props.details.email}
                onChange={this.handleEmailChange}
                className={classes.textField}
                margin="normal"
              />
              <TextField
                id="standard-required"
                label={t("First Name")}
                value={this.props.details.firstName}
                onChange={this.handleFirstNameChange}

                className={classes.textField}
                margin="normal"
              />
              <TextField
                id="standard-required"
                label={t("Last Name")}
                value={this.props.details.lastName}
                onChange={this.handleLastNameChange}
                className={classes.textField}
                margin="normal"
              />

              <TextField
                id="standard-required"
                type="password"
                label={t("New Password")}
                onChange={this.handleNewPasswordChange}
                value={this.state.details.newPassword}
                className={classes.textField}
                margin="normal"
              />
              <TextField
                error={!this.state.isPhoneNumber}
                id="standard-required"
                label={t("Phone Number")}
                onChange={this.handlePhoneNumberChange}
                value={this.props.details.phoneNum}
                className={classes.textField}
                margin="normal"
              />
              <Typography className={classes.instruction}>
                Enter Current Password and Press the Button in Order to Complete the action.
              </Typography>
              <TextField
                error={this.state.wrongPassword}
                required={!this.state.details.demoStudent}
                id="standard-required"
                type="password"
                label={t("Password")}
                value={this.state.details.old_password}
                onChange={this.handleConfirmPasswordChange}
                className={classes.textField}
                margin="normal"
              />
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  type="submit"
                  endIcon={<SendIcon/>}
                >
                  {t("Send")}
                </Button>

            </div>
          </form>
        </CardContent>
        <CardContent>
          <Row>
          </Row>
          <Row>
            <Col>
              <form >
                <div>
                </div>
              </form>
            </Col>
          </Row>
        </CardContent>
      </Card >
    );
  }
}

UserAccountCard.propTypes = {
  classes:PropTypes.object.isRequired,
};


export default withTranslation()(withStyles(styles)(UserAccountCard));
