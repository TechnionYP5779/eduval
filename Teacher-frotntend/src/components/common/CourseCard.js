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

var QRCode = require('qrcode.react');

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
  qr: {
    margin: "auto",
    display: "block",
    maxWidth: "20%"
  }

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
      demoLink: this.props.demoLink
    };

    this.handlePlayClick = this.handlePlayClick.bind(this);
    this.handleDeleteCourse = this.handleDeleteCourse.bind(this);
    this.setDeleteModalChange = this.setDeleteModalChange.bind(this)
    this.handleDeleteModalOpen = this.handleDeleteModalOpen.bind(this)
    this.handleDeleteModalClose = this.handleDeleteModalClose.bind(this)
  }

  handlePlayClick()
  {
    this.props.playClicked();
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

  render(){
    const classes = this.props.classes;
    return(
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={this.state.delete_modal_open}
          onClose={this.handleDeleteModalClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={this.state.delete_modal_open}>
            <div className={classes.paper}>
              <h3 id="transition-modal-title">Are you sure you want to delete {this.state.name}?</h3>
              <Button
                variant="contained"
                color="primary"
                className={classes.delete_confirmation}
                endIcon={<ClearIcon />}
                onClick={this.handleDeleteModalClose}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="secondary"
                className={classes.delete_confirmation}
                endIcon={<Delete />}
                onClick={this.handleDeleteCourse}
              >
                Delete
              </Button>
            </div>
          </Fade>
        </Modal>
        <Card className={this.state.play_pushed? classes.card_in_lesson : classes.card} >
          <CardHeader
          classes={{
            title: classes.title,
          }}
          title={this.state.name + (this.state.play_pushed? " [In Progress!]" : "")}
          action={
            <LightTooltip title="Delete Course" placement="top-start" className={classes.tooltip}>
              <IconButton aria-label="delete"
              className={classes.delete}
              disabled={this.state.play_pushed}
              onClick={this.handleDeleteModalOpen}
              >
                <Delete  />
              </IconButton>
            </LightTooltip>
          }
          />
          { this.state.description!="" &&
            <CardContent>
              <Typography paragraph>Course Description: {this.state.description}</Typography>
            </CardContent>
          }

          { this.state.demoLink!=null &&
            <CardContent>
              <Typography paragraph>Trial Lesson Invite Link: <br/> {this.state.demoLink}</Typography>
              <QRCode size="200" value={this.state.demoLink} className={classes.qr}/>

            </CardContent>
          }


          <CardActions disableSpacing>
            <LightTooltip title="Course Details" placement="bottom-end">
              <IconButton>
                <a href={"/course-details/" + this.state.id}>
                <MenuBookIcon />
                </a>
              </IconButton>
            </LightTooltip>
            <LightTooltip title="Manage Store" placement="bottom-end">
              <IconButton>
                <a href={"/manage-store/" + this.state.id}>
                <ShoppingCartIcon />
                </a>
              </IconButton>
            </LightTooltip>

            <LightTooltip title={this.state.play_pushed? "Resume Lesson" : "Start Lesson"}
              placement="bottom-end">
              <IconButton
              disabled={ this.state.disabled_play}
              className=
                {
                  this.state.disabled_play? classes.play_disabled :
                  (this.state.play_pushed ? classes.play_pushed : classes.play )
                }
                aria-label="start"
                onClick={this.handlePlayClick}
              >
                {!this.state.play_pushed && <PlayArrowIcon />}
                {this.state.play_pushed && <PlayCircleFilledWhiteRoundedIcon fontSize="large" />}
              </IconButton>
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


export default withStyles(styles)(CourseCard);
