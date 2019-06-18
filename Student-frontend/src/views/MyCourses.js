/* eslint jsx-a11y/anchor-is-valid: 0 */
import history from '../history';
import React from "react";
import axios from 'axios';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardFooter,
  Form,
  FormGroup,
  FormInput,
  Badge,
  Button
} from "shards-react";

import PageTitle from "../components/common/PageTitle";
import awsIot  from 'aws-iot-device-sdk';

import Modal from 'react-modal';
const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-40%, -40%)',
    maxHeight            : '45vh'
  }
};

Modal.setAppElement('#root');
class MyCourses extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: res,
      // Third list of posts.
      PostsListThree: [],
      lessons_status: {},
      lessons_student_status: {},
      modalIsOpen: false,
      post_id:-1,
      deskNum: -1
    };

    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleNameInput = this.handleNameInput.bind(this);



    let headers = {
        'X-Api-Key': 'ZrcWSl3ESR4T3cATxz7qN1NONPWx5SSea4s6bnR6'
    }
    let sub=new Buffer( localStorage.getItem('sub')).toString('base64');
    axios.get('https://api.emon-teach.com/student/byToken/'+sub,
     {headers: headers})
      .then(response =>localStorage.setItem('student_id', response.data.id) );
      let res=[];

      axios.get('https://api.emon-teach.com/course/byStudent/'+localStorage.getItem('student_id'),
     {headers: headers})
     .then((response) => {
     this.setState({PostsListThree: response.data});


           const getContent = function(url) {
      return new Promise((resolve, reject) => {
    	    const lib = url.startsWith('https') ? require('https') : require('http');
    	    const request = lib.get(url, (response) => {
    	      if (response.statusCode < 200 || response.statusCode > 299) {
    	         reject(new Error('Failed to load page, status code: ' + response.statusCode));
    	       }

    	      const body = [];
    	      response.on('data', (chunk) => body.push(chunk));
    	      response.on('end', () => resolve(body.join('')));
    	    });
    	    request.on('error', (err) => reject(err))
        })
    };
    let client;

      let connect = async () => {
    	return getContent('https://qh6vsuof2f.execute-api.eu-central-1.amazonaws.com/dev/iot/keys').then((res) => {
    		res = JSON.parse(res)
    		client = awsIot.device({
                region: res.region,
                protocol: 'wss',
                accessKeyId: res.accessKey,
                secretKey: res.secretKey,
                sessionToken: res.sessionToken,
                port: 443,
                host: res.iotEndpoint
            });
    	})

    }

    var j;
    for (j = 0; j < this.state.PostsListThree.length; j++) {
      axios.get('https://api.emon-teach.com/lesson/'+ this.state.PostsListThree[j].id +'/status',
          {headers: headers})
          .then((response) => {
            
            var current_id = ((response.request.responseURL).split('lesson')[1]).split('/')[1];
          if(response.data === "LESSON_START"){
            var insert = this.state.lessons_status;
            var insert_student_status = this.state.lessons_student_status
            insert[current_id] = false;
            this.setState({lessons_status: insert});
            axios.get('https://api.emon-teach.com/lesson/'+ current_id +'/present',
                {headers: headers})
                .then((response) => {
                   var Student_id = parseInt(localStorage.getItem('student_id'));
                    for (var student of response.data){
                      if(student.id == Student_id){
                        console.log("IN THE LESSON!!!");
                        insert_student_status[current_id] = true;
                        this.setState({lessons_student_status: insert_student_status});
                        break;
                      }
                    }
                });
          
          }else{
            
              this.state.lessons_status[current_id] = true;
             this.setState({lessons_status: this.state.lessons_status});
          }
          
        }).catch((error)=>{
          console.log(error);
        });
    }

     var i;
    for (i = 0; i < this.state.PostsListThree.length; i++) {
      
      let LessonsStatusURL = 'lesson/'+ this.state.PostsListThree[i].id +'/status';
      connect().then(() => {
        client.subscribe(LessonsStatusURL);
        client.on('message', (topic, message) => {
          
        var current_id = ((topic).split('lesson')[1]).split('/')[1];
         if(message === "LESSON_START"){
            var insert = this.state.lessons_status;
            insert[current_id] = false;
            this.setState({lessons_status: insert});
          }else{
            var insert = this.state.lessons_status;
              insert[current_id] = true;
             this.setState({lessons_status: insert});
          }
        })
      });

  }

   })
  .catch((error)=>{
     console.log(error);
  });

  }


  insertDeskNumber() {
    var Student_id = parseInt(localStorage.getItem('student_id'));
    var lesson_id = this.state.post_id;
    console.log(localStorage.getItem('student_id'));
      let config = {
          headers: {'X-Api-Key' : 'ZrcWSl3ESR4T3cATxz7qN1NONPWx5SSea4s6bnR6'}
      };
      var txt;
      this.showModal();
        axios.post('https://api.emon-teach.com/lesson/'+ lesson_id +'/present',{
          id:  Student_id,
          desk: this.state.deskNum}, config).then(function(response){
            history.push("/lesson/" + lesson_id);
          });
      
     }

showModal(id) {
  if(this.state.lessons_student_status[id]){
    history.push("/lesson/" + id);
  }else{
    this.setState({modalIsOpen: true, titleModal: "Enter your desk number " , desk_num: "767"});
    this.setState({post_id: id}); 
  }
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  handleNameInput(input){
    this.setState({deskNum: input.target.value});
  }

  render() {
    const {
      PostsListOne,
      PostsListTwo,
      PostsListThree,
      PostsListFour
    } = this.state;
    let showModal = this.showModal;
    let closeModal = this.closeModal;


    return (
<div>

  <Modal
        isOpen={this.state.modalIsOpen}
        onRequestClose={this.closeModal}
        style={customStyles}
      >
      <h3>Please enter your desk number</h3>
      <Form>
        <FormGroup>
          <label htmlFor="deskNum">Desk number</label>
          <FormInput id="deskNum"  onChange={this.handleNameInput}/>
        </FormGroup>
        </Form>

        <Button disabled={this.state.disabled} theme="success" onClick={()=>{
        let action;
        this.setState({disabled: true});
        this.insertDeskNumber();
      }}>Enter</Button>
      <Button theme="danger" disabled={this.state.disabled} style={{float: "right"}} onClick={closeModal}>Cancel</Button>


      </Modal>

      <Container fluid className="main-content-container px-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title="My Courses" subtitle="Manage eveyrthing in one place"
                     className="text-sm-left" />
        </Row>




        {/* First Row of Posts */}
        <Row>
          {
            PostsListThree.map((post, idx) => (
            <Col lg="4" key={idx}>
              <Card small className="card-post mb-4">
                <CardBody>
                  <h4 className="card-title">{post.name}</h4>
                  <p className="card-text text-muted">{post.description}</p>
                </CardBody>
                <CardFooter className="border-top d-flex">
                  <div className="card-post__author d-flex">
                    <div className="d-flex flex-column justify-content-center ml-3">
                    <a href={"/course-details/" + post.id}><Button size="sm" theme="white">
                      <i className="far fa-edit mr-1" /> View more
                    </Button></a>
                    </div>
                  </div>

                  <div className="my-auto ml-auto">

                    <Button  size="sm" theme="white" href={"/store/" + post.id}>
                      <i className="fas fa-dollar-sign mr-1" /> Shop
                    </Button>

                  </div>

                  <div className="my-auto ml-auto">

                    <Button disabled = {this.state.lessons_status[post.id]} size="sm" theme="white" onClick={() => {this.showModal(post.id)}}>
                      <i className="far fa-bookmark mr-1" /> {this.state.lessons_student_status[post.id] ? "Resume" : "Join" }
                    </Button>

                  </div>
                </CardFooter>
              </Card>
            </Col>
          ))}
        </Row>

      </Container>

</div>
    );

  }

}

export default MyCourses;
