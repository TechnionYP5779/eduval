import React from "react";
import PropTypes from "prop-types";
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
import "./CourseSummery.css"
class CourseSummery extends React.Component {
    constructor(props) {
      super(props);
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

        
  console.log(this.props.match.params.currentEmojis);
        this.state = {

          total_reward_money : this.props.match.params.total_money,
          lesson_id : this.props.match.params.id,
          student_id : localStorage.getItem('student_id'),
          chosen_smile : -1,
          chosen_message : -1,
          
          PostsListThree: [...this.props.match.params.currentEmojis]
          

        };

      }
    render(){
        const{
        PostsListThree
        } = this.state;
        return(
            <Container fluid className="main-content-container px-4 pb-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title={"Physics " + this.props.match.params.id + " - 114051"} subtitle="Course Summery" className="text-sm-left" />
        </Row>

        <Row>
          {/* Editor */}
  <Card style = {{height:"100%",width:"60%",marginLeft:"16px"}} className="mb-4">
    <CardHeader className="border-bottom">
      <h6 className="m-0">Summery</h6>
    </CardHeader>
    <ListGroup flush>
      <ListGroupItem className="p-3">
        <Row>
          <Col>
            <Form>
              <Row form>
                {/* Course Name */}
                <Col md="6" className="form-group">
                  <p>Class Name: name</p>
                </Col>
                </Row>

                <Row form>
                {/* Topic Name */}
                <Col md="6" className="form-group">
                  <p>Lesson's Topic: topic</p>
                </Col>
                </Row>

                <Row form>
                {/* Date */}
                <Col md="6" className="form-group">
                  <p>Date: date</p>
                </Col>
                </Row>

               <Row form>
                 {/* Course Location */}
                <Col md="6" className="form-group">
                  <p>Location: location</p>
                </Col>
                </Row>

                <Row form>
                 {/* E-Mony earned */}
                <Col md="6" className="form-group">
                  <p>Total E-Mony: 200</p>
                </Col>
                </Row>
                
              <a href={"/Overview"}>
              <Button theme="success" onClick={()=>{}} style={{float:"left"}}>Finish</Button>
              </a>
            </Form>
          </Col>
        </Row>
      </ListGroupItem>
    </ListGroup>
  </Card>

      <Col>
        <Card small className="mb-4">
          <CardHeader className="border-bottom">
            <h6 className="m-0">Lesson Summery</h6>
          </CardHeader>
          <CardBody className="p-0 pb-3">
            <table className="table mb-0">
              <thead className="bg-light">

                <tr>
                  <th scope="col" className="border-0">
                    Emon Earned
                  </th>
                  <th scope="col" className="border-0">
                    Emojis Earned
                  </th>
                </tr>
              </thead>
              <tbody>
              {PostsListThree.map((post, idx) => (
                <tr>
                  <td>{post.Sum}</td>
                  <td><ul >{post.Smileys.map((smile,type ,id) => (<li>{smile}</li>))}</ul></td>

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


export default CourseSummery;
