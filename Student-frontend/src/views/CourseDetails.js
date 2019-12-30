import React from "react";
import PropTypes from "prop-types";

import axios from 'axios';
import SmallStats from "../components/common/SmallStats";
import { SERVER_CONFIG } from '../Server/server-variables';
import {
  Card,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Form,
  FormGroup,
  FormInput,
  FormSelect,
  FormTextarea,
  Button,
  Container,
  CardBody
} from "shards-react";
import PageTitle from "../components/common/PageTitle";
import StudentLessonGraph from "../components/Graphs/StudentLessonGraph";
import { Trans, withTranslation }  from "react-i18next";

import CoinImage from "../images/midEcoin.png"
import "./CourseDetails.css"
import server from "../Server/Server";
const EmojiEnum = {
      "EMOJI_HAPPY": "🙂",
      "EMOJI_THUMBS_UP" : "👍",
      "EMOJI_ANGEL": "👼",
      "EMOJI_GRIN":"😄",
      "EMOJI_SHUSH":"🤐",
      "EMOJI_ZZZ":"😴",
      "EMOJI_ANGRY":"😠",
      "EMOJI_THUMBS_DOWN":"👎"
    };

   function TableEntry(props) {
        console.log("TableEntryProps", props);
        const messageType = props.messageType;
        if(messageType === "EMON") {
          return <div>{props.value} <img alt="Emons" style={{width:"1.5em", marginLeft:"0.2em", marginBottom:"0.2em"}} src={CoinImage} /></div>;
        }else {
          return <div style={{fontSize:'1.3em'}}>
            {EmojiEnum[props.emojiType]}
            {props.emojis.map((emoji, idx) => (
              EmojiEnum[emoji]
            ))
            }
            </div>
        }
      }
class CourseDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          balance:'',
          courseName:'',

          // Third list of posts.
          PostsListThree: [],

          ItemsListThree: [],

          //condensed: []
        };

        var course =this.props.match.params.id;

        server.getEmonBalanceByCourse((response) => {
          this.setState({balance: response.data ? response.data : 0});
        }, null, course);

        server.getCourse((response) => {
            this.setState({courseName: response.data.name});

            server.getCondensedLog((response) => {
              this.setState({condensed: response.data});
            }, 
            function(error){
              console.log("Error in getCondensedLog in constuctor", error)
            }
            , course);
        }, 
        function(error){
          console.log("Error in getEmonBalanceByCourse in constuctor", error)
        }
        , course);

        server.getLog((response) => {
          this.setState({ItemsListThree: response.data.filter((elem) => elem.messageType === "PURCHASE")});
          this.setState ({PostsListThree: response.data.filter((elem) => elem.messageType !== "PURCHASE")});
        }, null, course);
      }

    render(){
      const { t } = this.props;
      const { balance } = this.state;

      return(
        <Container fluid className="main-content-container px-4 pb-4">
          {/* Page Header */}
          <Row noGutters className="page-header py-4">
            <PageTitle sm="4" title={this.state.courseName} subtitle={t("Course Details")} className="text-sm-left" />
          </Row>

          <Row>
            <Col>
              <Row>
                {/* Editor */}
                <Card style = {{height:"100%",width:"100%",marginLeft:"16px"}} className="mb-4">
                  <CardHeader className="border-bottom">
                    <h6 className="m-0">{t("Details")}</h6>
                  </CardHeader>
                  
                  <ListGroup flush>
                    <ListGroupItem className="p-3">
                      <Row>
                        <Col>
                          <Trans i18nKey="emonBalance" count={{balance}}>
                            You have a Balance of <strong>{{balance}}</strong><img alt="Emons" style={{width:"1.5em", marginLeft:"0.2em", marginBottom:"0.2em"}} src={CoinImage} /> in this course.<br /><br />
                            Keep up the good work!
                          </Trans>
                        </Col>
                      </Row>
                    </ListGroupItem>
                  </ListGroup>
                </Card>
              </Row>

              <Row>
                <Card style = {{height:"100%",width:"100%",marginLeft:"16px"}} className="mb-4">
                  <CardHeader className="border-bottom">
                    <h6 className="m-0">{t("Items bought")}</h6>
                  </CardHeader>

                  <CardBody className="p-0 pb-3">
                    <table className="table mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th scope="col" className="border-0">
                            {t("Item")}
                          </th>
                          <th scope="col" className="border-0">
                            {t("Purchase date")}
                          </th>
                          <th scope="col" className="border-0">
                            {t("Price")}
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {Array.from(this.state.ItemsListThree).map((post, idx) => (
                          <tr>
                            <td>{post.item.name}</td>
                            <td>{post.time.padStart(2,'0').split('T')[0] }</td>
                            <td>{post.item.cost}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardBody>
                </Card>
              </Row>
              
              <Row>
              <Card style = {{height:"100%",width:"100%",marginLeft:"16px"}} className="mb-4">
            <   CardHeader className="border-bottom">
                  <h6 className="m-0">{t("Course Activity Graph")}</h6>
                </CardHeader>
                {
                  !this.state.condensed &&
                  <h2 style = {{textAlign:"center"}}>{t("Waiting For Graph")}</h2>
                }
                {
                  this.state.condensed &&
                    <CardBody className="p-0 pb-3">
                      <StudentLessonGraph style = {{margin:"auto"}} condensed={this.state.condensed} courseName={this.state.courseName} />
                    </CardBody>
                }
                </Card>
              </Row>
            </Col>
      
            <Col>
              <Card small className="mb-4">
                <CardHeader className="border-bottom">
                  <h6 className="m-0">{t("Recent Activity")}</h6>
                </CardHeader>

                <CardBody className="p-0 pb-3">
                  {
                    !this.state.condensed &&
                    <h2 style = {{margin:"auto", textAlign:"center"}}>{t("Waiting For Activity")}</h2>
                  }
                  { 
                    this.state.condensed &&
                    <div>
                      <table className="table mb-0">
                        <thead className="bg-light">
                          <tr>
                            <th style={{textAlign:"center"}} scope="col" className="border-0">
                              {t("Lesson Number")}
                            </th>
                            <th style={{textAlign:"center"}} scope="col" className="border-0">
                              {t("Day")}
                            </th>
                            <th style={{textAlign:"center"}} scope="col" className="border-0">
                              {t("Emons")}
                            </th>
                            <th style={{textAlign:"center"}} scope="col" className="border-0">
                              {t("Emoji")}
                            </th>
                          </tr>
                        </thead>
                        <tbody>

                                { this.state.condensed.slice().reverse().map((lesson, idx) => (
                                    <tr>
                                      <td style={{textAlign:"center"}}>{this.state.condensed.length - idx}</td>
                                      <td style={{textAlign:"center"}}>{lesson.date }</td>
                                      <td style={{textAlign:"center"}}><TableEntry messageType={"EMON"} value={lesson.emons} emojis={[]}/></td>
                                      <td style={{textAlign:"center"}}><TableEntry messageType={"NOTEMON"} value={-5} emojis={lesson.emojis}/></td>
                                    </tr>
                                  ))}
                        </tbody>
                      </table>
                    </div>
                  }

                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
    );
   }
}


export default withTranslation()(CourseDetails);
