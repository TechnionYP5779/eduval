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

import Alert from 'react-bootstrap/Alert'

import TextField from '@material-ui/core/TextField';



import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';

import InputAdornment from '@material-ui/core/InputAdornment';

import SendIcon from '@material-ui/icons/Send';
import { withTranslation } from 'react-i18next';


const LightTooltip = withStyles(theme => ({
  tooltip: {
    boxShadow: theme.shadows[1],
    fontSize: 20,
  },
}))(Tooltip);

const styles = theme => ({
  card: {
    maxWidth: 345,
    marginBottom: '30px ',
  },

  card_in_lesson: {
    maxWidth: 345,
    marginBottom: '30px ',
    backgroundColor: "#77dd77"
  },

  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  play: {
    color: "#77dd77",
    // transform: 'scale(1) translate(0%, 5%)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  play_pushed: {
    color: "Gold",
    marginLeft: 'auto',
    // transform: 'scale(1.2) translate(-10%, 5%)',
  },

  play_disabled:{
    color: "Silver",
    marginLeft: 'auto'
  },

  avatar: {
    backgroundColor: red[500],
  },
  title:{
    color: "DarkBlue",
  },

  delete:{
    color: "red"
  },

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

  delete_confirmation:
  {
    width: "50%",
    position: 'relative',
  },

  regularLesson:
  {
    marginLeft: 'auto',
    borderWidth: "medium",
    borderStyle: "solid",
    display: "inline-block"
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

});

class CourseCard extends React.Component
{
  constructor(props) {
    super(props);

    this.state = {
      name: this.props.name,
      description: this.props.description,
      id: this.props.id,
      play_pushed: this.props.play_pushed,
      disabled_play: this.props.disabled_play,
      delete_modal_open: false,

      student_seat: -1,
      studentSeatTaken: this.props.studentSeatTaken,
      emptySeat: this.props.emptySeat,

      desk_modal_open: false,
      desk_button_disabled: false,
      errored: this.props.errored,

    };

    this.handlePlayClick = this.handlePlayClick.bind(this);
    this.handleDeleteCourse = this.handleDeleteCourse.bind(this);
    this.setDeleteModalChange = this.setDeleteModalChange.bind(this);
    this.handleDeleteModalOpen = this.handleDeleteModalOpen.bind(this);
    this.handleDeleteModalClose = this.handleDeleteModalClose.bind(this);


    this.setDeskModalChange = this.setDeskModalChange.bind(this)
    this.handleDeskModalOpen = this.handleDeskModalOpen.bind(this)
    this.handleDeskModalClose = this.handleDeskModalClose.bind(this)
    this.updateStudentSeat = this.updateStudentSeat.bind(this);
    this.enterLesson = this.enterLesson.bind(this);
  }

  handlePlayClick()
  {
    if(this.props.play_pushed)
      this.props.playClicked();
    else
    {
      this.handleDeskModalOpen()
    }
  }

  setDeleteModalChange(value)
  {
    this.setState({delete_modal_open: value})
  }

  handleDeleteModalOpen = () => {
    this.setDeleteModalChange(true);
  };

  handleDeleteModalClose = () => {
    this.setDeleteModalChange(false);
  };

  handleDeleteCourse()
  {
    this.props.deleteCourse();
  }

  setDeskModalChange(value)
   {
     this.setState({desk_modal_open: value})
   }

   handleDeskModalOpen = (id) =>
   {
     this.props.setPostWhenModalOpen();
     this.setDeskModalChange(true);
   };

   handleDeskModalClose = () => {
     this.setDeskModalChange(false);
   };

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
     console.log(this.state.student_seat);
   }
   enterLesson()
   {
     this.setState({desk_button_disabled: true});
     var self = this;
     console.log(self.state)
     self.props.insertDeskNumber(this.state.student_seat, this.bla);
     self.setState({desk_button_disabled: false});
   }

   componentDidUpdate(prevProps, prevState) {
     if(prevProps.studentSeatTaken!=this.props.studentSeatTaken ||
       prevProps.emptySeat!=this.props.emptySeat ||
       prevProps.play_pushed!=this.props.play_pushed ||
       prevProps.disabled_play!=this.props.disabled_play ||
       prevProps.play_text!=this.props.play_text ||
       prevProps.errored!=this.props.errored)
       {
         this.setState({
           studentSeatTaken:this.props.studentSeatTaken,
           emptySeat: this.props.emptySeat,
           errored: this.props.errored,
           play_pushed: this.props.play_pushed,
           play_text: this.props.play_text,
           disabled_play: this.props.disabled_play,

         })
       }
   }

  render(){
    const classes = this.props.classes;
    const { t } = this.props;

    return(
      <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={this.state.desk_modal_open}
        onClose={this.handleDeskModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={this.state.desk_modal_open}>
          <div className={classes.paper}>

            {(this.state.studentSeatTaken) &&
              <Alert variant = "warning">
                <Alert.Heading style={{color:"white"} }>{t(this.state.studentSeatTaken ? "seatIsTaken" : "nameIsTaken")}</Alert.Heading>
                <p>
                  {t(this.state.studentSeatTaken ? "selectAnotherSeat" : "selectAnotherName")} <br/> {t("Contact the teacher in case of further problems.")}
                </p>
              </Alert>
            }

            {this.state.errored &&
              <Alert variant = "dark">
                <Alert.Heading style={{color:"white"}}>{t("An error has occured")+"!"}</Alert.Heading>
                  <p>{t("Please contact system administrator")}</p>
              </Alert>
            }
            <h3 style={{textAlign:"center"}} id="transition-modal-title">{t("Enter Desk Number")}</h3>
            <TextField
              error={this.state.studentSeatTaken || this.state.emptySeat}
              required
              id="standard-number"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              label={t("Desk Number")}
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
              variant="contained"
              color="primary"
              className={classes.buttonModal}
              endIcon={<ClearIcon />}
              onClick={this.handleDeskModalClose}
            >
              {t("Cancel")}
            </Button>
            <Button
              variant="contained"
              className={clsx([classes.buttonModal, classes.sendDesk])}
              endIcon={<SendIcon />}
              onClick={this.enterLesson}
              disabled={this.state.desk_button_disabled || this.state.emptySeat || this.state.studentSeatTaken}
            >
              {t("Enter Lesson")}
            </Button>
          </div>
        </Fade>
      </Modal>

        <Card className={this.state.play_pushed? classes.card_in_lesson : classes.card} >
          <CardHeader
          classes={{
            title: classes.title,
          }}
          title={this.state.name + (this.state.play_pushed? " " + t("[In Progress!]") : "")}
          />
          <CardContent>
            <Typography paragraph>{this.state.description}</Typography>
          </CardContent>


          <CardActions disableSpacing>
            <LightTooltip title={t("Course Details")} placement="bottom-end">
              <IconButton>
                <a href={"/course-details/" + this.state.id}>
                <MenuBookIcon />
                </a>
              </IconButton>
            </LightTooltip>
            <LightTooltip title={t("Enter Store")} placement="bottom-end">
              <IconButton>
                <a href={"/store/" + this.state.id}>
                <ShoppingCartIcon />
                </a>
              </IconButton>
            </LightTooltip>

            <LightTooltip title={this.state.play_pushed? t("Resume Lesson") : t("Join Lesson")}
              placement="bottom-end">
              <Button
              disabled={ this.state.disabled_play}
              className=
                  {clsx([classes.regularLesson],
                    {
                      [classes.joinLesson]:
                      !this.state.disabled_play
                      && !this.state.play_pushed,

                      [classes.resumeLesson]:
                      !this.state.disabled_play
                      && this.state.play_pushed,
                    }
                    )}
                aria-label="start"
                onClick={this.handlePlayClick}
              >
                {this.props.play_text}
                {!this.state.play_pushed && <PlayArrowIcon />}
                {this.state.play_pushed && <PlayCircleFilledWhiteRoundedIcon fontSize="large" />}
              </Button>
            </LightTooltip>
          </CardActions>
        </Card>
      </div>
    )
  }

}

CourseCard.propTypes = {
  classes:PropTypes.object.isRequired,
};


export default withTranslation()(withStyles(styles)(CourseCard));
