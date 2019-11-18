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
import { Row, Form,FormInput,FormGroup, Col} from 'shards-react';
import {Line} from 'react-chartjs-2';

const initialState = {
  labels: ['08/09/2019', '', '', '','',
          '09/09/2019', '', '', '','',
          '10/09/2019', '', '', '','',
          '11/09/2019', '', '', '','',
          '12/09/2019', '', '', '','',],
  datasets: [
    {
      label: 'Emon Per Lesson',
      fill: true,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [12.55, 4.98, 2.63, 60.98, 60.98,
            60.98, 50.64, 50.64, 40.37, 40.37,
            40.37, 32.88, 32.88, 2.21, 2.21,
            2.21, 10.21, 20.21, 2.62, 2.62, 2.62]

    },
    {
      label: 'Emoj Per Lesson',
      fill: true,
      lineTension: 0.1,
      backgroundColor: 'rgba(191,191,63,0.4)',
      borderColor: 'Lime',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'Yellow',
      pointBackgroundColor: 'Yellow',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [12.55, 4.98, 2.63, 60.98, 60.98,
            60.98, 50.64, 50.64, 40.37, 40.37,
            40.37, 32.88, 32.88, 2.21, 2.21,
            2.21, 10.21, 20.21, 2.62, 2.62, 2.62]
    }

  ]
};

class StudentLessonGraph extends React.Component {
  constructor(props)
  {
    super(props)
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAA " + this.props.condensed)
    this.state = {
      courseName:this.props.courseName,
      condensed: this.props.condensed
    };
  };

  componentWillMount(){

    this.setState(initialState);


	};

  componentDidMount(){

    console.log(this.state);
    var tmp = this.state.datasets;
    tmp[0].label="Emons Per Lesson";
    var lbl = []
    var arr = []
    var arr2 = []
    var j = 0
    for (j=0 ; j<this.state.condensed.length; j++)
    {
      lbl.push(j+1);
      arr.push(this.state.condensed[j].emons);
      arr2.push(this.state.condensed[j].emojis.length);
      console.log("PUSHING EMONS");
      console.log(this.state.condensed[j].emons);
    }
    tmp[0].data = arr;
    tmp[1].data = arr2;
    console.log("TMP");
    console.log(tmp);
    this.setState({datasets: tmp})
    this.setState({labels: lbl});
  };


  render() {
		return (
      <div style = {{margin:"5px 10px"}}>
        <h4 style = {{margin:"10px"}}> Emons and Emoji per Lesson in {this.state.courseName}</h4>
		    <Line data={this.state}/>
      </div>
		);
	};
};



export default StudentLessonGraph;
