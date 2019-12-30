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
    };
  }


  render() {

    return (
      <div class="main-content container-fluid">
        <Container fluid className="main-content-container px-4">
        {/* Page Header */}
          <DemoLessonProperties/>
        </Container>
      </div>
    );
  }
}
