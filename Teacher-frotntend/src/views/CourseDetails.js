import React from "react";
import PropTypes from "prop-types";
import SmallStats from "./../components/common/SmallStats";
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
import "./CourseDetails.css"
class CourseDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          balance:555,



          // Third list of posts.
          PostsListThree: [
            {
              id:"1",
              Date: "1/1/2019",
              LastName:"Sixth grade",
              Sum:"123456789",
              Smileys: [
                   "🙂",
                   "👍",
              ]
            },
            {
                id:"2",
                Date: "1/1/2019",
                LastName:"Sixth grade",
                Sum:"123456789",
                Smileys: [
                     "🙂",
                     "👍",
                ]
            },
            {
                id:"3",
                Date: "1/1/2019",
                LastName:"Sixth grade",
                Sum:"123456789",
                Smileys: [
                     "🙂",
                     "👍",
                ]
            },
            {
                id:"4",
                Date: "1/1/2019",
                LastName:"Sixth grade",
                Sum:"123456789",
                Smileys: [
                     "🙂",
                     "👍",
                ]
            },
            {
                id:"5",
                Date: "1/1/2019",
                LastName:"Sixth grade",
                Sum:"123456789",
                Smileys: [
                     "🙂",
                     "👍",
                ]

            },
            {
                id:"6",
                Date: "1/1/2019",
                LastName:"Sixth grade",
                Sum:"123456789",
                Smileys: [
                     "🙂",
                     "👍",
                ]
            },
            {
                id:"1",
                Date: "1/1/2019",
                LastName:"Sixth grade",
                Sum:"123456789",
                Smileys: [
                     "🙂",
                     "👍",
                ]
              },
              {
                  id:"2",
                  Date: "1/1/2019",
                  LastName:"Sixth grade",
                  Sum:"123456789",
                  Smileys: [
                       "🙂",
                       "👍",
                  ]

              },
              {
                  id:"3",
                  Date: "1/1/2019",
                  LastName:"Sixth grade",
                  Sum:"123456789",
                  Smileys: [
                       "🙂",
                       "👍",
                  ]
              },
              {
                  id:"4",
                  Date: "1/1/2019",
                  LastName:"Sixth grade",
                  Sum:"123456789",
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
          <PageTitle sm="4" title={"Physics " + this.props.match.params.id + " - 114051"} subtitle="Course Details" className="text-sm-left" />
        </Row>

        <Row>
          {/* Editor */}
  <Card style = {{height:"100%",width:"60%",marginLeft:"16px"}} className="mb-4">
    <CardHeader className="border-bottom">
      <h6 className="m-0">Details</h6>
    </CardHeader>
    <ListGroup flush>
      <ListGroupItem className="p-3">
        <Row>
            <Col >
            <div style={{fontWeight: 600}}>
            You have a Balance of {this.state.balance} Emons in this course.<br /><br />
            Keep up the good work!
            </div>
            </Col>


        </Row>
      </ListGroupItem>
    </ListGroup>
  </Card>

      <Col>
        <Card small className="mb-4">
          <CardHeader className="border-bottom">
            <h6 className="m-0">Recent Lessons</h6>
          </CardHeader>
          <CardBody className="p-0 pb-3">
            <table className="table mb-0">
              <thead className="bg-light">

                <tr>
                  <th scope="col" className="border-0">
                    #
                  </th>
                  <th scope="col" className="border-0">
                    Date
                  </th>
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
                  <td>{post.id}</td>
                  <td>{post.Date}</td>
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


export default CourseDetails;
