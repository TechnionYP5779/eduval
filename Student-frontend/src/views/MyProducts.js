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


const customStyles = {
  width: 50 ,
  control: base => ({
    ...base,
    height: 50,
    minHeight: 35
  })
};

class MyProducts extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            courses:[],
            selectedCourse: [], 
            products: [], 
            ischoosen: false, 
            haveAnswer: false, 
            message: ""
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
    }

    onSelect = e => {
        this.setState({products: [],selectedCourse: e, ischoosen: true});

        var headers = {
        'Authorization': 'Bearer ' + localStorage.getItem('idToken')
         };
        this.setState({haveAnswer: false});
        axios.get('https://api.emon-teach.com/student/'+localStorage.getItem('student_id')+'/courseInventory/'+e.value.id,
         {headers: headers})
         .then(response =>{var data = Array.from(response.data); this.setState({products: data.filter(elem => (elem.amount - elem.amountUsed)>0 ), haveAnswer: true }); } );

  }

  sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

  stringToColour(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
  }

  stringToInitials(str){
    return str.split(" ").map((n)=>n[0].toUpperCase()).join("");
  }

  getCorrectTextColor(hex){

    const threshold = 130;


    function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
    function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
    function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
    function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

    hex = cutHex(hex);
    let hRed = hexToR(hex);
    let hGreen = hexToG(hex);
    let hBlue = hexToB(hex);

    let cBrightness = ((hRed * 299) + (hGreen * 587) + (hBlue * 114)) / 1000;
      if (cBrightness > threshold){return "#000000";} else { return "#ffffff";}
  }

  getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;


   }

    productuse(product){
        var headers = {
        'Authorization': 'Bearer ' + localStorage.getItem('idToken')
      };

      
      axios.post('https://api.emon-teach.com/student/'+localStorage.getItem('student_id')+ '/courseInventory/' + this.state.selectedCourse.value.id + '/useItem', 
    product.itemId,
     {headers: headers})
      .then(response =>{this.setState({message: "The items is successfully used", success: true, error:false}); this.onSelect(this.state.selectedCourse); } );


      this.sleep(500);
      //getting emon balance of student in the course
      


    }


    render() {
        const {
            courses
        } = this.state;
        var rand;

        return (

    <Container fluid className="main-content-container px-4">
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
        <Row noGutters className="page-header py-4">
        <div style={{width: '300px'}}>

        <Select  onChange={this.onSelect} options={ this.state.courses.map((course)=>{
          return {value: course, label: course.name};
        }) } />
        </div>
        </Row>

        <Row >
              <Col >
                <p style={{fontSize: 20}}>{(Array.from(this.state.products).length == 0 && this.state.ischoosen && this.state.haveAnswer) ? "You don't have any items!" : null}</p>
              </Col>
        </Row>

        {/* items */}
        <Row>
           { Array.from(this.state.products).map((product, idx) => (
            <Col lg="4" key={idx}>
              <Card small className="card-post mb-4">
                <CardBody>
                <Row>
                <Col md={{ span: 1, offset: 0}}>
                <div data-letters={this.stringToInitials(product.name)} style={{"--background-color" :  this.stringToColour(product.name), "--font-color" : this.getCorrectTextColor(this.stringToColour(product.name))}} className="blog-comments__meta text-mutes">
                {}
                </div>
                </Col>
                <Col md={{ span: 1, offset: 1 }}>
                <h4 className="card-title" style={{ color:  this.stringToColour(product.name) }}>{product.name}</h4>
                </Col>
                </Row>




                  <p className="card-text text-muted" style={{ color:  this.getRandomColor() }}><b>Description: </b>{" "+ product.description}</p>
                  <p className="card-text text-muted" style={{ color:  this.getRandomColor() }}><b>Amount Left: </b>{" "+(product.amount - product.amountUsed)}</p>
                  <p className="card-text text-muted" style={{ color:  this.getRandomColor() }}><b>Status: </b>{(product.isActive) ? "Active" : "Not Active"}</p>


                </CardBody>
                <CardFooter className="border-top d-flex">
                  <div className="card-post__author d-flex">
                    <div className="d-flex flex-column justify-content-center ml-3">
                    <a ><Button ssize="sm"   theme="white" disabled={!product.isActive} onClick={() => {this.productuse(product)}}>
                      <i className="far  mr-1" /> Use
                    </Button></a>
                    </div>
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
export default MyProducts;
