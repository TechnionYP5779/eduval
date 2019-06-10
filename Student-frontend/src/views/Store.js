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
  Badge,
  Button
} from "shards-react";

import PageTitle from "../components/common/PageTitle";
import awsIot  from 'aws-iot-device-sdk';


class Store extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: res,
      course:{},
      balance:0,
      // Third list of posts.
      PostsListThree: [{name:"No Test", description:"You may not come to the test",price:555}],
      lessons_status: {}
    };
    console.log("props for Store is ", this.props.match.params.id);
    let headers = {
        'X-Api-Key': 'ZrcWSl3ESR4T3cATxz7qN1NONPWx5SSea4s6bnR6'
    };
    axios.get('https://api.emon-teach.com/course/'+this.props.match.params.id,
     {headers: headers})
      .then(response =>{console.log(response.data); this.setState({course: response.data});} );


      let res=[];






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





  }




  render() {
    const {
      PostsListOne,
      PostsListTwo,
      PostsListThree,
      PostsListFour
    } = this.state;



    return (


      <Container fluid className="main-content-container px-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title={this.state.course.name+"'s Store"} subtitle="You can buy stuff with your Emons"
                     className="text-sm-left" />


        </Row>
        <Row >
              <Col >
                <div style={{fontSize: 20}}><p>You have {this.state.balance} Emons in this course</p></div>
              </Col>
        </Row>




        {/* First Row of Posts */}
        <Row>
          {
            PostsListThree.map((post, idx) => (
            <Col lg="3.5" key={idx}>
              <Card small className="card-post mb-4">
                <CardBody>
                  <h4 className="card-title">{post.name}</h4>
                  <p className="card-text text-muted"><b>description: </b>{" "+ post.description}</p>
                  <p className="card-text text-muted"><b>price: </b>{" "+post.price}</p>
                </CardBody>
                <CardFooter className="border-top d-flex" >

                  <div className="d-flex flex-column justify-content-center ml-1">

                    <Button
                     size="sm"   theme="white" onClick={() => {console.log("Pushed")}}>
                     Buy
                    </Button>

                  </div>
                </CardFooter>
              </Card>
            </Col>
          ))}
        </Row>

      </Container>


    );

  }

}

export default Store;
