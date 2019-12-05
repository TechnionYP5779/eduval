import React from "react";
import clsx from 'clsx';
import {Pie} from 'react-chartjs-2';

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
    marginBottom: "28px",
    width: "45%",
  },
  instruction: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(2),
  },

  button:{
    width:"50%",
    marginBottom: '28px ',
    textTransform: "none",
  }
});

const initState =
{
  labels: [
    'Tomatoes',
    'Cucumbersadasdasdasdas',
    'Onions'
  ],
  datasets: [{
    data: [153, 77, 44],
    backgroundColor: [
    '#CCC',
    '#36A2EB',
    '#FFCE56'
    ],
    hoverBackgroundColor: [
    '#FF6384',
    '#36A2EB',
    '#FFCE56'
    ]
  }]
}

class TeacherPie extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.pieData,
      amount: 5,
      isNumber:true,
    }
    this.setNumber = this.setNumber.bind(this);
    this.handleNumberChange = this.handleNumberChange.bind(this);
  }

  componentDidUpdate(prevProps, prevState)
  {
    if(prevProps.pieData!=this.props.pieData)
    {
      this.setState({data:this.props.pieData});
    }
  }

  setNumber(value)
  {
    this.setState({amount: value});
  }
  handleNumberChange(evnt)
  {
    this.setNumber(evnt.target.value);
  }


  render(){
    const classes = this.props.classes;
    const { t } = this.props;
    const options = {
      legend: {
          display: true,
          position: 'right',
          labels:
          {
          }
      },
    };
    return(
      <div>

        <form className={classes.container} action="#" onSubmit={()=>{
          this.props.getData(this.state.amount);
          console.log(this.state.amount);
        }}>
          <TextField
            required
            error={!this.state.isNumber}
            id="standard-required"
            label={t("Number of Top Students")}
            type="number"
            InputProps={{ inputProps: { min: 0} }}
            onChange={this.handleNumberChange}
            value={this.state.amount}
            className={classes.textField}
            margin="normal"
          />

          <Button
          className={classes.button}
          variant="contained"
          color="primary"
          type="submit"
          >
            {t('Generate Graph')}
          </Button>
        </form>
        <Pie data={this.state.data} options={options}  />
      </div>
    )
  }
}


TeacherPie.propTypes = {
  classes:PropTypes.object.isRequired,
};


export default withTranslation()(withStyles(styles)(TeacherPie));
