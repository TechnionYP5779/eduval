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

import { withTranslation } from "react-i18next";
import RegisterStudentTable from "./RegisterStudentTable";


const styles = theme => ({
  card: {
    width: "100%",
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

});


class RegisteredStudentsCard extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      expanded: true,
      students: this.props.students,
    }
    this.setExpanded = this.setExpanded.bind(this)
    this.handleExpandClick = this.handleExpandClick.bind(this)

  }
  setExpanded(value)
  {
    this.setState({expanded: value})
  }


  handleExpandClick()
  {
    this.setExpanded(!this.state.expanded);
  }
  componentDidUpdate(prevProps, prevState) {
    if(prevProps.students!=this.props.students)
    {
      this.setState({students: this.props.students});
    }
  }

  render()
  {
    const classes = this.props.classes;
    const { t } = this.props;

    return (

      <Card className={classes.card}>
          <CardHeader
          classes={{title:classes.title}}
          title={t("Students Registered to this Course")}
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
            <CardContent>
               <RegisterStudentTable students={this.state.students} />
            </CardContent>
          </Collapse>

      </Card>
    )

  }
}

RegisteredStudentsCard.propTypes = {
  classes:PropTypes.object.isRequired,
};


export default withTranslation()(withStyles(styles)(RegisteredStudentsCard));
