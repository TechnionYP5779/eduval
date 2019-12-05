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

import server from "../../Server/Server";

import StudentPie from "./StudentPie";

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

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

class UserGraphsCard extends React.Component
{
  constructor(props) {
    super(props);

    this.state =
    {
    }
    this.getPieStudentPieData = this.getPieStudentPieData.bind(this);
  }

  getPieStudentPieData(top)
  {
    console.log("Top", top);
    var self=this;
    server.getStudentEmonPie(function(response){
      console.log("Get Pie", response);
      var data = response.data;
      var sum_others=data.totalEmons;
      var courses=data.courses.sort(function(a,b){
        return b.emons - a.emons;
      });;
      console.log("Courses", courses);
      var index = 0;
      var newlabels=[];
      var newdata=[];
      var colors = [];
      var hover_colors = [];
      for (index=0; index<Math.min(top,courses.length); index++)
      {
          newlabels.push(courses[index].name);
          newdata.push(courses[index].emons);
          colors.push(getRandomColor());
          hover_colors.push(getRandomColor());
          sum_others -=courses[index].emons;
      }
      if(sum_others>0)
      {
        newlabels.push(self.props.t("Other Courses"));
        newdata.push(sum_others);
        colors.push(getRandomColor());
        hover_colors.push(getRandomColor());
      }
      var final_result =
      {
        labels: newlabels,
        datasets: [{
          data: newdata,
          backgroundColor: colors,
          hoverBackgroundColor: hover_colors,
        }]
      };
      self.setState({piedata:final_result})
      console.log("Changed piedata", self.state )
    }, function(error){
      console.log("getTeacherEmonPie in getPieStudentPieData in UserGraphsCard.js",error);
    })
  }

  componentDidMount(){
    this.getPieStudentPieData(5);
  }
  render(){
    const classes = this.props.classes;
    const { t } = this.props;

    return(
      <Card className={classes.card}>
        <CardHeader
          className={classes.title}
          title={t("General Course Graphs")}
        />
        <CardContent>
          {!this.state.piedata &&
            <div>
              {t("Loading")}...
            </div>
          }
          {this.state.piedata &&
            <div>
              <Typography variant="h5" gutterBottom>
                {t("Emon Division between Courses for this Student")}
              </Typography>
              <StudentPie
                pieData={this.state.piedata}
                getData={(val)=>(this.getPieStudentPieData(val))}
               />
              </div>
          }
        </CardContent>
      </Card>
    )
  }
}


UserGraphsCard.propTypes = {
  classes:PropTypes.object.isRequired,
};


export default withTranslation()(withStyles(styles)(UserGraphsCard));
