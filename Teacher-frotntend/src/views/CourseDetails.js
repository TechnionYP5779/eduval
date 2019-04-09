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
class CourseDetails extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
    
          // Third list of posts.
          PostsListThree: [
            {
              id:"1",
              FirstName: "Stud1",
              LastName:"Sixth grade",
              Phone:"123456789",
            },
            {
                id:"2",
                FirstName: "Stud2",
                LastName:"Sixth grade",
                Phone:"123456789",
            },
            {
                id:"3",
                FirstName: "Stud3",
                LastName:"Sixth grade",
                Phone:"123456789",
            },
            {
                id:"4",
                FirstName: "Stud4",
                LastName:"Sixth grade",
                Phone:"123456789",
            },
            {
                id:"5",
                FirstName: "Stud5",
                LastName:"Sixth grade",
                Phone:"123456789",
            },
            {
                id:"6",
                FirstName: "Stud6",
                LastName:"Sixth grade",
                Phone:"123456789",
            },
            {
                id:"1",
                FirstName: "Stud1",
                LastName:"Sixth grade",
                Phone:"123456789",
              },
              {
                  id:"2",
                  FirstName: "Stud2",
                  LastName:"Sixth grade",
                  Phone:"123456789",
              },
              {
                  id:"3",
                  FirstName: "Stud3",
                  LastName:"Sixth grade",
                  Phone:"123456789",
              },
              {
                  id:"4",
                  FirstName: "Stud4",
                  LastName:"Sixth grade",
                  Phone:"123456789",
              },
              {
                  id:"5",
                  FirstName: "Stud5",
                  LastName:"Sixth grade",
                  Phone:"123456789",
              },
              {
                  id:"6",
                  FirstName: "Stud6",
                  LastName:"Sixth grade",
                  Phone:"123456789",
              },
              {
                id:"1",
                FirstName: "Stud1",
                LastName:"Sixth grade",
                Phone:"123456789",
              },
              {
                  id:"2",
                  FirstName: "Stud2",
                  LastName:"Sixth grade",
                  Phone:"123456789",
              },
              {
                  id:"3",
                  FirstName: "Stud3",
                  LastName:"Sixth grade",
                  Phone:"123456789",
              },
              {
                  id:"4",
                  FirstName: "Stud4",
                  LastName:"Sixth grade",
                  Phone:"123456789",
              },
              {
                  id:"5",
                  FirstName: "Stud5",
                  LastName:"Sixth grade",
                  Phone:"123456789",
              },
              {
                  id:"6",
                  FirstName: "Stud6",
                  LastName:"Sixth grade",
                  Phone:"123456789",
              },
              {
                id:"1",
                FirstName: "Stud1",
                LastName:"Sixth grade",
                Phone:"123456789",
              },
              {
                  id:"2",
                  FirstName: "Stud2",
                  LastName:"Sixth grade",
                  Phone:"123456789",
              },
              {
                  id:"3",
                  FirstName: "Stud3",
                  LastName:"Sixth grade",
                  Phone:"123456789",
              },
              {
                  id:"4",
                  FirstName: "Stud4",
                  LastName:"Sixth grade",
                  Phone:"123456789",
              },
              {
                  id:"5",
                  FirstName: "Stud5",
                  LastName:"Sixth grade",
                  Phone:"123456789",
              },
              {
                  id:"6",
                  FirstName: "Stud6",
                  LastName:"Sixth grade",
                  Phone:"123456789",
              },
              {
                id:"1",
                FirstName: "Stud1",
                LastName:"Sixth grade",
                Phone:"123456789",
              },
              {
                  id:"2",
                  FirstName: "Stud2",
                  LastName:"Sixth grade",
                  Phone:"123456789",
              },
              {
                  id:"3",
                  FirstName: "Stud3",
                  LastName:"Sixth grade",
                  Phone:"123456789",
              },
              {
                  id:"4",
                  FirstName: "Stud4",
                  LastName:"Sixth grade",
                  Phone:"123456789",
              },
              {
                  id:"5",
                  FirstName: "Stud5",
                  LastName:"Sixth grade",
                  Phone:"123456789",
              },
              {
                  id:"6",
                  FirstName: "Stud6",
                  LastName:"Sixth grade",
                  Phone:"123456789",
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
          <Col>
            <Form>
              <Row form>
                {/* Course Name */}
                <Col md="6" className="form-group">
                  <label htmlFor="feFirstName">Course Name</label>
                  <FormInput
                    id="feFirstName"
                    placeholder="Course Name"
                    value="Physics 1"
                  />
                </Col>
                </Row>
                <Row form>
                {/* Start */}
                <Col md="6" className="form-group">
                  <label htmlFor="feLastName">Start</label>
                  <FormInput
                    type="date"
                    id="feLastName"
                    placeholder="15.03.2019"
                  />
                </Col>
              
                {/* End */}
                <Col md="6" className="form-group">
                  <label htmlFor="feEmail">End</label>
                  <FormInput
                    type="date"
                    id="feEmail"
                    placeholder="27/07/2019"
                  />
                </Col>
                {/* Course Location */}
                <Col md="6" className="form-group">
                  <label htmlFor="feZipCode">Location</label>
                  <FormInput
                    id="feZipCode"
                    placeholder="Location"
                  />
                </Col>
              </Row>
              <Row form>
                {/* Description */}
                <Col md="12" className="form-group">
                  <label htmlFor="feDescription">Description</label>
                  <FormTextarea id="feDescription" rows="5" />
                </Col>
              </Row>
              <Button theme="accent">Update Course</Button>
              <Button theme="accent" style={{float:"right"}}>Start lesson</Button>
            </Form>
          </Col>
        </Row>
      </ListGroupItem>
    </ListGroup>
  </Card>
    
      <Col>
        <Card small className="mb-4">
          <CardHeader className="border-bottom">
            <h6 className="m-0">Active Users</h6>
          </CardHeader>
          <CardBody className="p-0 pb-3">
            <table className="table mb-0">
              <thead className="bg-light">
              
                <tr>
                  <th scope="col" className="border-0">
                    #
                  </th>
                  <th scope="col" className="border-0">
                    First Name
                  </th>
                  <th scope="col" className="border-0">
                    Last Name
                  </th>
                  <th scope="col" className="border-0">
                    Phone
                  </th>
                </tr>
              </thead>
              <tbody>
              {PostsListThree.map((post, idx) => (
                <tr>
                  <td>{post.id}</td>
                  <td>{post.FirstName}</td>
                  <td>{post.LastName}</td>
                  <td>{post.Phone}</td>
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
