/* eslint jsx-a11y/anchor-is-valid: 0 */
import history from '../history';
import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button
} from "shards-react";

import Card2 from '@material-ui/core/Card';
import CardHeader2 from '@material-ui/core/CardHeader';
import CardMedia2 from '@material-ui/core/CardMedia';
import CardContent2 from '@material-ui/core/CardContent';
import CardACtions2 from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import Delete from '@material-ui/icons/Delete';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import { withTranslation } from 'react-i18next'
import { capitalize } from '../utils/strings';

import CourseCard from "../components/common/CourseCard";

import server from "../Server/Server";

import PageTitle from "../components/common/PageTitle";
import TimeoutAlert from "../components/common/TimeoutAlert"

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
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
  avatar: {
    backgroundColor: red[500],
  },
}));


class MyCourses extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      courses: [],

    };
  }

  componentDidMount() {
    var self = this;
    server.getActiveLesson(function(response){
      console.log("Getting Active Lesson");
      console.log(response);
      if (response.data)
      {
        self.setState({activeLesson: response.data});
      }
      else
      {
        self.setState({activeLesson: -1})
      }
      server.getAllCourses(function(response){
        console.log(response);
          self.setState({courses: response.data});
        }, function(error){
      });
        }, (err)=>{console.log("err", err);});
  }


  render() {
    const {
      courses
    } = this.state;
    const { t } = this.props;

    return (
      <div class="main-content container-fluid">
      {this.state.error &&
      <TimeoutAlert className="mb-0" theme="danger" msg={this.state.error} time={10000}/>
      }
      <Container fluid className="main-content-container px-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title={capitalize(t("My Courses"))} subtitle={t("Manage eveyrthing in one place")}
                     className="text-sm-left" />
        </Row>


        {/* First Row of Posts */}
        <Row>
          {
            courses.length === 0 &&
            <Card small className="card-post mb-4">
              <CardBody>
                <h4 className="card-title">{t("No Courses?")}</h4>
                <p className="card-text text-muted">{t("Create a new course right now!")}</p>
              </CardBody>
              <CardFooter className="border-top d-flex">
                <div className="card-post__author d-flex" style={{width:"100%"}}>
                  <a href="/add-new-course" style={{width:"100%"}}><Button style={{width:"100%"}}>
                    <i className="far fa-edit mr-1" /> {t("Try here")}
                  </Button></a>
                </div>
              </CardFooter>
            </Card>
          }
          {courses.map((course, idx) => (
            <Col sm="6" lg="4" key={idx}>
              <CourseCard

              demoLink={course.demoLink}
              name={course.name}
              description={course.description}
              disabled_play={this.state.disabled ||
                (this.state.activeLesson!=-1 && this.state.activeLesson !== course.id)}
              play_pushed={this.state.activeLesson === course.id}
              id={course.id}
              playClicked=
              {()=>{
                this.setState({disabled: true});
                if (this.state.activeLesson === course.id){
                  history.push("/lesson/" + course.id);
                  return;
                }
                let self = this;
                server.changeLessonStatus(function(response){
                  history.push("/lesson/" + course.id);
                }, function(error){
                  console.log("error" ,error);
                  self.setState({disabled: false, error: "An error has occured while starting a lesson"});
                }, course.id, "LESSON_START");
              }}

              deleteCourse=
              {() =>{

                this.setState({disabled: true});
                if (this.state.activeLesson === course.id){
                  console.log("I don't know how but you're somehow trying to delete a live course");
                  return;
                }
                let self = this;
                server.deleteCourse(function(response){
                  history.push("/my-courses");
                }, function(error){
                  console.log("error" ,error);
                  self.setState({disabled: false, error: "An error has occured while deleing a course "});
                }, course.id);
              }

              }

              />
            </Col>
          ))}
        </Row>

      </Container>
      </div>
    );
  }
}

export default withTranslation()(MyCourses);
