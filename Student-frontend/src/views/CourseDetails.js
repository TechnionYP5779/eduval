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
        console.log("AASFASFASASfas");
        const messageType = props.messageType;
        if(messageType === "EMON") {
          return <div>{props.value} <img alt="Emons" style={{width:"1.5em", marginLeft:"0.2em", marginBottom:"0.2em"}} src={CoinImage} /></div>;
        }else {
          return <div style={{fontSize:'1.3em'}}>{EmojiEnum[props.emojiType]}</div>
        }
      }
class CourseDetails extends React.Component {
    constructor(props) {
        super(props);



        this.state = {
          balance:'',
          courseName:'',



          // Third list of posts.
          PostsListThree: [

          ],

          ItemsListThree: [

          ],

          //condensed: []

        };
        let config = {
          headers: {'Authorization': 'Bearer ' + localStorage.getItem('idToken')}
        };
        let headers = {
            'Authorization': 'Bearer ' + localStorage.getItem('idToken')
        }
        var student=localStorage.getItem('student_id');
        var course =this.props.match.params.id;


        axios.get('https://api.emon-teach.com/student/'+
        student+
        '/emonBalance/byCourse/'+course,
       {headers: headers})
       .then((response) => {
       this.setState({balance: response.data ? response.data : 0});
     });

        axios.get('https://api.emon-teach.com/course/'+
             course,
            {headers: headers})
            .then((response) => {
            this.setState({courseName: response.data.name});
          })
          .then(()=>
        {
          axios.get('https://api.emon-teach.com/log/condensed/'
          + student+'/byCourse/'+course,
              {headers: headers})
              .then((response) => {
                console.log("condensed");
                console.log(response)
                 this.setState({condensed: response.data});
            });

        })

          axios.get('https://api.emon-teach.com/log/ofStudent/'
          + student+'/byCourse/'+course,
              {headers: headers})
              .then((response) => {
                 this.setState({ItemsListThree: response.data.filter((elem) => elem.messageType === "PURCHASE")});
                 this.setState ({PostsListThree: response.data.filter((elem) => elem.messageType != "PURCHASE")});
            });




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
              {  Array.from(this.state.ItemsListThree).map((post, idx) => (

                <tr>
                  <td>{post.item.name}</td>
                  <td>{post.time.padStart(2,'0').split('T')[0] }</td>
                  <td>{post.item.cost}</td>
                </tr>))}
              </tbody>
            </table>
          </CardBody>
  </Card>
</Row>
<Row>
{
  !this.state.condensed &&
  <h2 style = {{margin:"auto"}}>{t("Waiting For Graph")}</h2>
}
{
  this.state.condensed &&
  <Card style = {{height:"100%",width:"100%",marginLeft:"16px"}} className="mb-4">
    <CardBody className="p-0 pb-3">
      <StudentLessonGraph style = {{margin:"auto"}} condensed={this.state.condensed} courseName={this.state.courseName} />
    </CardBody>
  </Card>
}</Row>
</Col>
      <Col>
        <Card small className="mb-4">
          <CardHeader className="border-bottom">
            <h6 className="m-0">{t("Recent Activity")}</h6>
          </CardHeader>
          <CardBody className="p-0 pb-3">
            <table className="table mb-0">
              <thead className="bg-light">

                <tr>

                  <th scope="col" className="border-0">
                    {t("Day")}
                  </th>
                  <th scope="col" className="border-0">
                    {t("Hour")}
                  </th>
                  <th scope="col" className="border-0">
                    {t("Got")}
                  </th>

                </tr>
              </thead>
              <tbody>
              {  Array.from(this.state.PostsListThree).map((post, idx) => (

                <tr>
                  <td>{post.time.padStart(2,'0').split('T')[0] }</td>
                  <td>{new Date(post.time).getHours().toString().padStart(2,'0') + ':' + new Date(post.time).getMinutes().toString().padStart(2,'0')}</td>
                  <td><TableEntry messageType={post.messageType} value={post.value} emojiType={post.emojiType}/></td>
                </tr>))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </Col>
    </Row>

      </Container>
    );
   }
}


export default withTranslation()(CourseDetails);
