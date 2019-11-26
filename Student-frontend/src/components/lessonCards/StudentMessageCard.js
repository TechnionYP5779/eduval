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
import Delete from '@material-ui/icons/Delete';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Tooltip from '@material-ui/core/Tooltip';
import PlayCircleFilledWhiteRoundedIcon from '@material-ui/icons/PlayCircleFilledWhiteRounded';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import ClearIcon from '@material-ui/icons/Clear';
import VisibilityIcon from '@material-ui/icons/Visibility';
import HelpIcon from '@material-ui/icons/Help';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';

import {
  Row,
  Col,
} from "shards-react";

const styles = theme => ({
  card: {
    width: "100%",
    marginBottom: '30px ',
  },

  title:{
    color: "DarkBlue",
  },

  content:{
    padding:"5%",
  },
  delete:{
    color: "red"
  },

  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  tableRoot: {
    width: '100%',
  },
  tableWrapper: {
    maxHeight: 440,
    overflow: 'auto',
  },

  columns:
  {
    marginRight: "2%",
    padding: 0,
  },

  icon:
  {
    margin: "10px auto ",
    display: "block",
    textTransform: "none",
    width: "7em",
    borderWidth: "medium",
    borderStyle: "solid",

  },
  delete_icon:
  {
    margin: "auto",
    display: "block",
  },

  text:
  {
    paddingTop: "5px",
    marginBottom: "-5px",
    textAlign: "center",
  },

  disabled:{
    backgroundColor: "Grey !important",
    color: "white",
    borderColor: "white",
  },


  tomatoChosen:{
    backgroundColor: "Tomato",
    color: "white",
    borderColor: "white",
  },

  tomatoUnChosen:{
    color: "Tomato",
    backgroundColor: "white",
    borderColor: "Tomato",
  },

  orangeChosen:{
    backgroundColor: "Orange",
    color: "white",
    borderColor: "white",
  },

  orangeUnChosen:{
    color: "Orange",
    backgroundColor: "white",
    borderColor: "Orange",
  },

  greenChosen:{
    backgroundColor: "LimeGreen",
    color: "white",
    borderColor: "white",
  },

  greenUnChosen:{
    color: "LimeGreen",
    backgroundColor: "white",
    borderColor: "LimeGreen",
  },

  violetChosen:{
    backgroundColor: "#A55FA5",
    color: "white",
    borderColor: "white",
  },

  violetUnChosen:{
    color: "#A55FA5",
    backgroundColor: "white",
    borderColor: "#A55FA5",
  },

  blueslateChosen:{
    backgroundColor: "#000000",
    color: "white",
    borderColor: "white",
  },

  blueslateUnChosen:{
    color: "#000000",
    backgroundColor: "white",
    borderColor: "#000000",
  },

});

class StudentMessageCard extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state =
    {
      title: this.props.title,
      subtitle: this.props.subtitle,

      expanded:false,

      question_clicked: false,
      go_out_clicked: false,
      answer_clicked: false,
      confused_clicked: false,
      louder_clicked: false,

      buttons_disabled: false,
    }

    this.setQuestionClick = this.setQuestionClick.bind(this);
    this.handleQuestionClick = this.handleQuestionClick.bind(this);

    this.setGoOutClick = this.setGoOutClick.bind(this);
    this.handleGoOutClick = this.handleGoOutClick.bind(this);

    this.setAnswerClick = this.setAnswerClick.bind(this);
    this.handleAnswerClick = this.handleAnswerClick.bind(this);

    this.setConfusedClick = this.setConfusedClick.bind(this);
    this.handleConfusedClick = this.handleConfusedClick.bind(this);

    this.setLouderClick = this.setLouderClick.bind(this);
    this.handleLouderClick = this.handleLouderClick.bind(this);

    this.setExpanded = this.setExpanded.bind(this);
    this.handleExpandClick = this.handleExpandClick.bind(this);

    this.unClickAll = this.unClickAll.bind(this);
  }

  unClickAll()
  {
    this.setState({
      question_clicked: false,
      go_out_clicked: false,
      answer_clicked: false,
      confused_clicked: false,
      louder_clicked: false,
    });
  }



  setQuestionClick(value)
  {
    this.setState({question_clicked: value});
  }


  handleQuestionClick()
  {
    this.setQuestionClick(!this.state.question_clicked);
  }


  setGoOutClick(value)
  {
    this.setState({go_out_clicked: value});
  }


  handleGoOutClick()
  {
    this.setGoOutClick(!this.state.go_out_clicked);
  }

  setAnswerClick(value)
  {
    this.setState({answer_clicked: value});
  }


  handleAnswerClick()
  {
    this.setAnswerClick(!this.state.answer_clicked);
  }

  setConfusedClick(value)
  {
    this.setState({confused_clicked: value});
  }


  handleConfusedClick()
  {
    this.setConfusedClick(!this.state.confused_clicked);
  }

  setLouderClick(value)
  {
    this.setState({louder_clicked: value});
  }


  handleLouderClick()
  {
    this.setLouderClick(!this.state.louder_clicked);
  }

  setExpanded(value)
  {
    this.setState({expanded: value});
  }

  handleExpandClick()
  {
    this.setExpanded(!this.state.expanded);
  }



  render()
  {
    const classes = this.props.classes;
    return(
      <Card className={classes.card}>
        <CardHeader
        title={this.state.title}
        subheader={this.state.subtitle}
        classes={{
          title: classes.title,
        }}
        action={
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: this.state.expanded,
            })}
            onClick={this.handleExpandClick}
            aria-expanded={this.state.expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon  />
          </IconButton>
        }
        />
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent className={classes.content}>
            <Row>
              <Button className={clsx([classes.icon, classes.tomatoChosen]
                ,
                  {
                    [ classes.tomatoUnChosen]:
                    this.state.question_clicked,
                    [classes.disabled]: this.state.buttons_disabled
                  }
              )}
              onClick={()=>
              {
                this.unClickAll();
                this.handleQuestionClick();
                this.props.send_questions();
                setTimeout(function(){
                  this.unClickAll();
                }.bind(this),2000);
              }
              }

              disabled={this.state.question_clicked}
              >
                <HelpIcon />
                <br/>
                Questions
              </Button>
              <Button className={clsx([classes.icon, classes.orangeChosen]
                ,
                  {
                    [ classes.orangeUnChosen]:
                    this.state.go_out_clicked,
                    [classes.disabled]: this.state.buttons_disabled
                  }
              )}
              onClick={()=>
              {
                this.unClickAll();
                this.handleGoOutClick();
                this.props.send_go_out();
                setTimeout(function(){
                  this.unClickAll();
                }.bind(this),2000);
              }}
              disabled={this.state.go_out_clicked}

              >
                <MeetingRoomIcon  />
                <br/>
                Go Out
              </Button>
              <Button className={clsx([classes.icon, classes.greenChosen]
                ,
                  {
                    [ classes.greenUnChosen]:
                    this.state.answer_clicked,
                    [classes.disabled]: this.state.buttons_disabled
                  }
              )}
              onClick={()=>
              {
                this.unClickAll();
                this.handleAnswerClick();
                this.props.send_answer();
                setTimeout(function(){
                  this.unClickAll();
                }.bind(this),2000);
              }}
              disabled={this.state.answer_clicked}
              >
                <RecordVoiceOverIcon  />
                <br/>
                Answer!
              </Button>
              <Button className={clsx([classes.icon, classes.violetChosen]
                ,
                  {
                    [ classes.violetUnChosen]:
                    this.state.confused_clicked,
                    [classes.disabled]: this.state.buttons_disabled

                  }
              )}
              onClick={()=>
              {
                this.unClickAll();
                this.handleConfusedClick();
                this.props.send_confused();
                setTimeout(function(){
                  this.unClickAll();
                }.bind(this),2000);
              }}
              disabled={this.state.confused_clicked}

              >
                <SentimentDissatisfiedIcon  />
                <br/>
                Confused
              </Button>
              <Button className={clsx([classes.icon, classes.blueslateChosen]
                ,
                  {
                    [ classes.blueslateUnChosen]:
                    this.state.louder_clicked,
                    [classes.disabled]: this.state.louder_clicked
                  }
              )}
              onClick={()=>
              {
                this.unClickAll();
                this.handleLouderClick();
                this.props.send_louder();
                setTimeout(function(){
                  this.unClickAll();
                }.bind(this),2000);

              }}
              disabled={this.state.buttons_disabled}
              >
                <VolumeUpIcon  />
                <br/>
                Louder
              </Button>
            </Row>
          </CardContent>
        </Collapse>
      </Card>
    );
  }

}

StudentMessageCard.propTypes = {
  classes:PropTypes.object.isRequired,
};


export default withStyles(styles)(StudentMessageCard);
