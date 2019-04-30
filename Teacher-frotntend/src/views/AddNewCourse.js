import React from "react";
import { Container, Row, Col, Card, CardHeader, Alert} from "shards-react";

import CompleteFormExample from "../components/components-overview/CompleteFormExample";

import PageTitle from "../components/common/PageTitle";
import Editor from "../components/add-new-post/Editor";
import SidebarActions from "../components/add-new-post/SidebarActions";
import SidebarCategories from "../components/add-new-post/SidebarCategories";
import NewCourseForm from "../components/add-new-post/NewCourseForm";

export default class AddNewCourse extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      success: false,
      error: false
    };

    this.handler = this.handler.bind(this)
  }

  handler(errorMsg){
    if (errorMsg){
      this.setState({success: false, error: errorMsg});
      window.scrollTo(0, 0);
    }
    else{
      this.setState({success: true, error: false});
      window.scrollTo(0, 0);
    }
  }

  render(){
    var handler  =   this.handler;
    return (
          <div>
            {this.state.error &&
            <Container fluid className="px-0">
              <Alert className="mb-0" theme="danger">
                <i className="fa fa-info mx-2"></i> {this.state.error}
              </Alert>
            </Container>
            }
            {this.state.success &&
            <Container fluid className="px-0">
              <Alert className="mb-0" theme="success">
                <i className="fa fa-info mx-2"></i> Success! Your course has been added!
              </Alert>
            </Container>
            }

            <Container fluid className="main-content-container px-4 pb-4">

              {/* Page Header */}
              <Row noGutters className="page-header py-4">
                <PageTitle sm="4" title="Add New Course" subtitle="Your Courses" className="text-sm-left" />
              </Row>

              <Row>
                {/* Editor */}
                <Card style={{width:"80%", marginLeft: "16px"}} >
                  <NewCourseForm handler = {handler.bind(this)}/>
                </Card>
              </Row>
            </Container>
          </div>

    );
  }
}
