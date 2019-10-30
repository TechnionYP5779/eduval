import React from "react";
import {
  Container,
  Row,
  Card
} from "shards-react";

import PageTitle from "../components/common/PageTitle";
import DemoLessonProperties from "../components/demo-lesson/DemoLessonProperties";


export default class DemoLesson extends React.Component {
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

  render() {
    var handler  =   this.handler;

    return (
      <div class="main-content container-fluid">
      <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle sm="4" title="Start a Trial Lesson" className="text-sm-left" />
      </Row>
      <Card style={{width:"50%", marginLeft: "16px"}} >
        <DemoLessonProperties handler = {handler.bind(this)}/>
      </Card>

      </Container>
      </div>
    );
  }
}
