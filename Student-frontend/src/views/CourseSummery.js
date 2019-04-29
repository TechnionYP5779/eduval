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

        this.state = {

          smileys: [{
              smile: "🙂",
              type: "success",
              id: 1
            },
            {
              smile: "👍",
              type: "success",
              id: 2
            },
            {
              smile: "😇",
              type: "success",
              id: 3
            },
            {
              smile: "😁",
              type: "success",
              id: 4
            },
            {
              smile: "🤐",
              type: "warning",
              id: 5
            },
            {
              smile: "😴",
              type: "warning",
              id: 6
            },
            {
              smile: "😠",
              type: "danger",
              id: 7
            },
            {
              smile: "👎",
              type: "danger",
              id: 8
            }
          ],

          // Third list of posts.
          PostsListThree: [
            {
              id:"1",
              LastName:"Sixth grade",
              Sum:"2",
              Smileys: [
                   "🙂",
                   "👍",
              ]
            },
            {
                id:"2",
                LastName:"Sixth grade",
                Sum:"5",
                Smileys: [
                     "🙂",
                     "👍",
                ]
            },
            {
                id:"3",
                LastName:"Sixth grade",
                Sum:"7",
                Smileys: [
                     "🙂",
                     "👍",
                ]
            },
            {
                id:"4",
                LastName:"Sixth grade",
                Sum:"0",
                Smileys: [
                     "🙂",
                     "👍",
                ]
            },
            {
                id:"5",
                LastName:"Sixth grade",
                Sum:"7",
                Smileys: [
                     "🙂",
                     "👍",
                ]

            },
            {
                id:"6",
                LastName:"Sixth grade",
                Sum:"6",
                Smileys: [
                     "🙂",
                     "👍",
                ]
            },
            {
                id:"1",
                LastName:"Sixth grade",
                Sum:"4",
                Smileys: [
                     "🙂",
                     "👍",
                ]
              },
              {
                  id:"2",
                  LastName:"Sixth grade",
                  Sum:"5",
                  Smileys: [
                       "🙂",
                       "👍",
                  ]

              },
              {
                  id:"3",
                  LastName:"Sixth grade",
                  Sum:"0",
                  Smileys: [
                       "🙂",
                       "👍",
                  ]
              },
              {
                  id:"4",
                  LastName:"Sixth grade",
                  Sum:"5",
                  Smileys: [
                       "🙂",
                       "👍",
                  ]
              }

          ],
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
