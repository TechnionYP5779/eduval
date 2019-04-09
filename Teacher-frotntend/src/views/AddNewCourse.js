import React from "react";
import { Container, Row, Col, Card, CardHeader} from "shards-react";

import CompleteFormExample from "../components/components-overview/CompleteFormExample";

import PageTitle from "../components/common/PageTitle";
import Editor from "../components/add-new-post/Editor";
import SidebarActions from "../components/add-new-post/SidebarActions";
import SidebarCategories from "../components/add-new-post/SidebarCategories";
import NewCourseForm from "../components/add-new-post/NewCourseForm";


const AddNewCourse = () => (

      <Container fluid className="main-content-container px-4 pb-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title="Add New Course" subtitle="Your Courses" className="text-sm-left" />
        </Row>

        <Row>
          {/* Editor */}
          <Card style={{width:"80%", marginLeft: "16px"}} >
            <NewCourseForm />
          </Card>
        </Row>
      </Container>

);

export default AddNewCourse;
