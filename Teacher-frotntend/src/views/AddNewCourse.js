import React from "react";
import { Container, Row, Card} from "shards-react";


import PageTitle from "../components/common/PageTitle";
import Editor from "../components/add-new-post/Editor";
import SidebarActions from "../components/add-new-post/SidebarActions";
import SidebarCategories from "../components/add-new-post/SidebarCategories";
import NewCourseForm from "../components/add-new-post/NewCourseForm";
import TimeoutAlert from "../components/common/TimeoutAlert";

export default class AddNewCourse extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      success: false,
      error: false
    };

    this.handler = this.handler.bind(this)
  }

  // removeAlert(){
  //   this.setState({error: false, success: false, timeout: false});
  // }

  handler(errorMsg){
    // var removeAlert = this.removeAlert;
    // if (this.state.timeout)
    //   clearTimeout(this.state.timeout);
    // this.setState({timeout: setTimeout(removeAlert, 3000)});

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

    // <i className="fa fa-info mx-2"></i> Success! Your course has been added!
    // </TimeoutAlert>

  //   <i className="fa fa-info mx-2"></i> {this.state.error}
  // </TimeoutAlert>
    var successMsg = "Success! Your course has been added!";
    return (
          <div class="main-content container-fluid">
            {this.state.error &&
              <TimeoutAlert msg={this.state.error} time={10000} className="mb-0" theme="danger"/>
            }
            {this.state.success &&
              <TimeoutAlert msg={successMsg} time={10000} className="mb-0" theme="success"/>
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
