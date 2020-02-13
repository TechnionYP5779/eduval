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
import { withTranslation } from 'react-i18next';
import LinkIcon from '@material-ui/icons/Link';

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
  },
  qr2: {
    margin: "auto",
    display: "block",
    maxWidth: "60%"
  },

  link:{
    color: "#2A5DB0"
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
      demoLink: this.props.demoLink,
      demo_course: this.props.demoLink? true : false,
    };

    this.handlePlayClick = this.handlePlayClick.bind(this);
    this.handleDeleteCourse = this.handleDeleteCourse.bind(this);
    this.setDeleteModalChange = this.setDeleteModalChange.bind(this);
    this.handleDeleteModalOpen = this.handleDeleteModalOpen.bind(this);
    this.handleDeleteModalClose = this.handleDeleteModalClose.bind(this);

    this.setLinkModalChange = this.setLinkModalChange.bind(this)
    this.handleLinkModalOpen = this.handleLinkModalOpen.bind(this)
    this.handleLinkModalClose = this.handleLinkModalClose.bind(this)

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
  setLinkModalChange(value)
  {
    this.setState({link_modal_open: value})
  }

  handleLinkModalOpen = () => {
    this.setLinkModalChange(true);
  };

  handleLinkModalClose = () => {
    this.setLinkModalChange(false);
  };


  render(){
    const classes = this.props.classes;
    const { t } = this.props;

    return(
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={this.state.link_modal_open}
          onClose={this.handleLinkModalClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={this.state.link_modal_open}
          style={{maxWidth: "60%"}}>
            <div className={classes.paper}>
              <h2 
                id="transition-modal-title" 
                style={{
                  textAlign:"center",
                  color:"#2A5DB0",
                  textDecorationLine: 'underline',
                }}
              >{this.state.name + " Invite Link and QR Code"}</h2>
              <h1 
                style={{
                  textAlign:"center",
                  fontFamily: "monospace"
                }}
              > {this.state.demoLink}</h1>
              <QRCode size="2000" value={this.state.demoLink} className={classes.qr2}/>
            </div>
          </Fade>
        </Modal>

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
              <h3 id="transition-modal-title">{t('deleteConfirm', {name: this.state.name})}</h3>
              <Button
                variant="contained"
                color="primary"
                className={classes.delete_confirmation}
                endIcon={<ClearIcon />}
                onClick={this.handleDeleteModalClose}
              >
                {t('Cancel')}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                className={classes.delete_confirmation}
                endIcon={<Delete />}
                onClick={this.handleDeleteCourse}
              >
                {t('Delete')}
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
          action={
            <LightTooltip title={t("Delete Course")} placement="top-start" className={classes.tooltip}>
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
          { this.state.description!=="" &&
            <CardContent>
              <Typography paragraph>{t('Course Description')}: {this.state.description}</Typography>
            </CardContent>
          }

          { this.state.demoLink!=null &&
            <CardContent>
              <Typography paragraph>{t('Trial Lesson Invite Link')}: <br/> 
                <h6 
                  style={{
                    textAlign:"center",
                    fontFamily: "monospace"
                  }}
                > {this.state.demoLink}</h6>
              </Typography>
              <QRCode size="200" value={this.state.demoLink} className={classes.qr}/>

            </CardContent>
          }


          <CardActions disableSpacing>
            <LightTooltip title={t("Course Details")} placement="bottom-end">
              <IconButton>
                <a href={"/course-details/" + this.state.id}>
                <MenuBookIcon />
                </a>
              </IconButton>
            </LightTooltip>
            <LightTooltip title={t("Manage Store")} placement="bottom-end">
              <IconButton>
                <a href={"/manage-store/" + this.state.id}>
                <ShoppingCartIcon />
                </a>
              </IconButton>
            </LightTooltip>

            { this.state.demo_course && 
              <LightTooltip title={t("Show Invite Link and QR Code")} placement="bottom-end">
                <IconButton aria-label="links"
                  className={classes.link}
                  disabled={!this.state.demo_course}
                  onClick={this.handleLinkModalOpen}
                >
                  <LinkIcon style={{ fontSize: 36 }}/>
                </IconButton>
              </LightTooltip>
            }
            <LightTooltip title={this.state.play_pushed? t("Resume Lesson") : t("Start Lesson")}
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


export default withTranslation()(withStyles(styles)(CourseCard));
