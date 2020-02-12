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
import Badge from '@material-ui/core/Badge';


var QRCode = require('qrcode.react');

const LightTooltip = withStyles(theme => ({
  tooltip: {
    boxShadow: theme.shadows[1],
    fontSize: 20,
  },
}))(Tooltip);

const styles = theme => ({
  button: {
    borderWidth: "medium",
    borderStyle: "solid",
    textTransform: "none",
    padding: " 5px 15px",
    overflow:"hidden",
    textOverflow:"ellipsis",
    whiteSpace:"nowrap"
  },

  margin: {
    margin: theme.spacing(2),
    marginBottom: "1em"
  },




  regularUnChosen:{
    color: "#108782",
    backgroundColor: "white",
    borderColor: "#108782",
  },
  regularChosen:{
    backgroundColor: "#108782",
    color: "white",
    borderColor: "white",
  },
  tomatoUnChosen:{
    color: "Tomato",
    backgroundColor: "white",
    borderColor: "Tomato",
  },
  tomatoChosen:{
    backgroundColor: "Tomato",
    color: "white",
    borderColor: "white",
  },
  orangeUnChosen:{
    color: "Orange",
    backgroundColor: "white",
    borderColor: "Orange",
  },
  orangeChosen:{
    backgroundColor: "Orange",
    color: "white",
    borderColor: "white",
  },
  greenUnChosen:{
    color: "LimeGreen",
    backgroundColor: "white",
    borderColor: "LimeGreen",
  },
  greenChosen:{
    backgroundColor: "LimeGreen",
    color: "white",
    borderColor: "white",
  },
  violetUnChosen:{
    color: "#A55FA5",
    backgroundColor: "white",
    borderColor: "#A55FA5",
  },
  violetChosen:{
    backgroundColor: "#A55FA5",
    color: "white",
    borderColor: "white",
  },
  blueslateUnChosen:{
    color: "#000000",
    backgroundColor: "white",
    borderColor: "#000000",
  },
  blueslateChosen:{
    backgroundColor: "#000000",
    color: "white",
    borderColor: "white",
  },

});


class StudentButton extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state =
    {
      student: this.props.student,
      color: this.props.color
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.student!=this.props.student)
    {
      console.log("New Student", this.props.student)
      this.setState({student: this.props.student});
    }

  }

  render()
  {
    const classes = this.props.classes;
    return(
      <div style={{
          display: "inline-block",
          marginLeft: "1em", 
          marginRight:"2em", 
          marginBottom: "2em ",
          maxWidth:"30%",
         }}>
        <Badge color="primary"
        badgeContent={"#" + this.state.student.desk}
        overlap="rectangle"
        anchorOrigin={{
          horizontal:"left",
          vertical:"top",
        }}
        style={{
          maxWidth:"100%",}}
        >
          <Badge color="secondary"
          badgeContent={"Emons:" + this.state.student.emons}
          overlap="rectangle"
          anchorOrigin={{
            horizontal:"right",
            vertical:"bottom",
          }}
          style={{
            maxWidth:"100%",}}
          >

            <Button
            color="Green"
            variant={this.props.isChosen(this.state.student.id)? "contained" :"outlined"}
            className={clsx([classes.button, classes.regularUnChosen],
                          {
                            [ classes.regularChosen]:
                            this.props.isChosen(this.state.student.id),
                          },
                          {
                            [ classes.tomatoUnChosen]:
                            !this.props.isChosen(this.state.student.id)
                            &&this.props.isMessaged(this.state.student.id)
                            &&this.props.messageColored()=="Tomato",
                          },
                          {
                            [ classes.tomatoChosen]:
                            this.props.isChosen(this.state.student.id)
                            &&this.props.isMessaged(this.state.student.id)
                            &&this.props.messageColored()=="Tomato",
                          },
                          {
                            [ classes.orangeUnChosen]:
                            !this.props.isChosen(this.state.student.id)
                            &&this.props.isMessaged(this.state.student.id)
                            &&this.props.messageColored()=="Orange",
                          },
                          {
                            [ classes.orangeChosen]:
                            this.props.isChosen(this.state.student.id)
                            &&this.props.isMessaged(this.state.student.id)
                            &&this.props.messageColored()=="Orange",
                          },
                          {
                            [ classes.greenUnChosen]:
                            !this.props.isChosen(this.state.student.id)
                            &&this.props.isMessaged(this.state.student.id)
                            &&this.props.messageColored()=="MediumSeaGreen",
                          },
                          {
                            [ classes.greenChosen]:
                            this.props.isChosen(this.state.student.id)
                            &&this.props.isMessaged(this.state.student.id)
                            &&this.props.messageColored()=="MediumSeaGreen",
                          },
                          {
                            [ classes.violetUnChosen]:
                            (!this.props.isChosen(this.state.student.id))
                            &&this.props.isMessaged(this.state.student.id)
                            &&this.props.messageColored()=="Violet",
                          },
                          {
                            [ classes.violetChosen]:
                            this.props.isChosen(this.state.student.id)
                            &&this.props.isMessaged(this.state.student.id)
                            &&this.props.messageColored()=="Violet",
                          },
                          {
                            [ classes.blueslateUnChosen]:
                            !this.props.isChosen(this.state.student.id)
                            &&this.props.isMessaged(this.state.student.id)
                            &&this.props.messageColored()=="SlateBlue",
                          },
                          {
                            [ classes.blueslateChosen]:
                            this.props.isChosen(this.state.student.id)
                            &&this.props.isMessaged(this.state.student.id)
                            &&this.props.messageColored()=="SlateBlue",
                          },


                        )
            }
            onClick={() =>
              {
                this.props.buttonClick(this.state.student.id);
              }}
              >
                <div style={{
                  overflow:"hidden",
                  textOverflow:"ellipsis",
                  whiteSpace:"nowrap"}}
                >
                {
                this.state.student.name
                }
                </div>
            </Button>
          </Badge>
        </Badge>
      </div>
    )
  }
}

StudentButton.propTypes = {
  classes:PropTypes.object.isRequired,
};


export default withStyles(styles)(StudentButton);
