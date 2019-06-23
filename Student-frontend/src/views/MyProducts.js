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
import TimeoutAlert from "../components/common/TimeoutAlert";
import awsIot  from 'aws-iot-device-sdk';
import CoinImage from "../images/midEcoin.png"
import Dropdown from 'react-dropdown'
import Select from 'react-select';
import { DropdownButton } from 'react-bootstrap';

class MyProducts extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            courses:[],
            selectedCourse: []
        };

        var headers = {
            'Authorization': 'Bearer ' + localStorage.getItem('idToken')
        };

        let sub=new Buffer( localStorage.getItem('sub')).toString('base64');
    axios.get('https://api.emon-teach.com/student/byToken/'+sub,
     {headers: headers})
      .then(response =>localStorage.setItem('student_id', response.data.id) );
      let res=[];

        //getting data all the courses the student taking
        axios.get('https://api.emon-teach.com/course/byStudent/'+localStorage.getItem('student_id'),
        {headers: headers})
        .then(response =>{
            this.setState({courses: response.data});


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


}).catch((error)=>{
     console.log(error);
  });

    }


    setCourse(c) {
        this.setState({
            selectedCourse: c,

        });
    }

    render() {
        const {
            courses
        } = this.state;
        var rand;

        return (

    <Container fluid className="main-content-container px-4">
         {console.log(this.state.courses)}
                {this.state.error &&
          <Container fluid className="px-0" >
          <TimeoutAlert className="mb-0" theme="danger" msg={this.state.message} time={3000} />
          </Container>
          }

               {this.state.success &&
          <Container fluid className="px-0">
          <TimeoutAlert className="mb-0" theme="success" msg={this.state.message} time={3000} />
          </Container>
          }
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title="Your Products" subtitle="You can see here the products you bought"
                     className="text-sm-left" />


        </Row>
        <Row>

        <Select options={ this.state.courses.map((course)=>{
          return {value: course, label: course.name};
        }) } />

        </Row>

      </Container>
    );
  }
}
export default MyProducts;
