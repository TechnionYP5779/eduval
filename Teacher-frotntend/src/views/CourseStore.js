/* eslint jsx-a11y/anchor-is-valid: 0 */
import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  ButtonGroup,
  Badge,
  Button,
  Form,
  FormGroup,
  FormInput,
  Alert
} from "shards-react";

import Modal from 'react-modal';

import server from "../Server/Server";

import PageTitle from "../components/common/PageTitle";
import TimeoutAlert from "../components/common/TimeoutAlert";

Modal.setAppElement('#root');

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-40%, -40%)',
    maxHeight            : '85vh'
  }
};

class CourseStore extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

      course: {
      },

      used_items: [
      ],

      disabled: false,

      current_item: {},

      titleModal: "",

      modalIsOpen: false,

      modalDeleteIsOpen: false,

      products: [],

      demi_products: [
        {
          id: 1,
          name: "Test pass",
          description: "skip the test on Monday",
          cost: 100,
          amountAvailable: 5,
          sellByDate: "14-02-2019"
        },
        {
          id: 2,
          name: "Homework pass",
          description: "one time pass to not turn in homework",
          cost: 30,
          amountAvailable: 25,
          sellByDate: "11-02-2019"
        },
        {
          id: 3,
          name: "Late day",
          description: "one time pass to come in late",
          cost: 5,
          amountAvailable: 25,
          sellByDate: "11-02-2019"
        },
        {
          id: 4,
          name: "Notebook",
          description: "Notebooks cupons",
          cost: 15,
          amountAvailable: 40,
          sellByDate: "11-07-2019"
        }
      ]

    };

    this.showNewItemModal = this.showNewItemModal.bind(this);
    this.closeItemModal = this.closeItemModal.bind(this);
    this.handleNameInput = this.handleNameInput.bind(this);
    this.handleDescriptionInput = this.handleDescriptionInput.bind(this);
    this.handlePriceInput = this.handlePriceInput.bind(this);
    this.handleAmountInput = this.handleAmountInput.bind(this);
    this.handleLastDateInput = this.handleLastDateInput.bind(this);
    this.showEditItemModal = this.showEditItemModal.bind(this);
    this.showDeleteItemModal = this.showDeleteItemModal.bind(this);
    this.closeDeleteModal = this.closeDeleteModal.bind(this);

    this.showBuyersModal = this.showBuyersModal.bind(this);
    this.closeInfoModal = this.closeInfoModal.bind(this);
  }

  showBuyersModal(product){
    this.setState({current_item: product, modalInfoIsOpen: true});
  }

  handleNameInput(input){
    let item = this.state.current_item;
    item.name = input.target.value;
    this.setState({current_item: item})
  }

  handlePriceInput(input){
    let item = this.state.current_item;
    item.cost = input.target.value;
    this.setState({current_item: item})
  }

  handleAmountInput(input){
    let item = this.state.current_item;
    item.amountAvailable = input.target.value;
    this.setState({current_item: item})
  }

  handleLastDateInput(input){
    let item = this.state.current_item;
    item.sellByDate = input.target.value;

    this.setState({current_item: item});
  }

  handleDescriptionInput(input){
    let item = this.state.current_item;
    item.description = input.target.value;
    this.setState({current_item: item})
  }

  showNewItemModal() {
    this.setState({modalIsOpen: true, titleModal: "Add new item to \"" + this.state.course.name + "\" store", current_item: {
      id: -1,
      name: "",
      description: "",
      cost: 0,
      amountAvailable: 0,
      sellByDate: this.state.course.endDate
    }});
  }

  showEditItemModal(item) {
    let edit_item = {};
    Object.assign(edit_item, item);
    edit_item.sellByDate = edit_item.sellByDate.substring(0,10);

    this.setState({modalIsOpen: true,
      titleModal: "Update \"" + edit_item.name + "\"",
      current_item: edit_item});
  }

  showDeleteItemModal(item) {
    this.setState({modalDeleteIsOpen: true,
      current_item: item});
  }

  closeItemModal() {
    this.setState({modalIsOpen: false});
  }

  closeDeleteModal() {
    this.setState({modalDeleteIsOpen: false});
  }

  closeInfoModal() {
    this.setState({modalInfoIsOpen: false});
  }

  componentDidMount() {
    var self = this;
    server.getCourse(function(response){
      self.setState({course: response.data});
    }, (err)=>{}, this.props.match.params.id);
    server.getProducts((response)=>{
      self.setState({products: response.data});
    }, (err)=>{console.log(err);}, this.props.match.params.id);
    server.getProductUse((response)=>{
      self.setState({used_items: response.data});
    }, (err)=>{console.log(err);}, this.props.match.params.id);
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
    str = str.trim();
    let res = str.split(" ").map((n)=>n[0].toUpperCase()).join("");
    if (res.length > 3){
      res = res.substring(0,3);
    }
    return res;
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


  render() {
    const {
      courses
    } = this.state;

    let stringToInitials = this.stringToInitials;
    let stringToColour = this.stringToColour;
    let getCorrectTextColor = this.getCorrectTextColor;
    let showEditItemModal = this.showEditItemModal;
    let closeItemModal = this.closeItemModal;
    let showDeleteItemModal = this.showDeleteItemModal;
    let closeDeleteModal = this.closeDeleteModal;
    let self = this;
    let showBuyersModal = this.showBuyersModal;

    return (
      <div>
      <Modal
        isOpen={this.state.modalDeleteIsOpen}
        onRequestClose={this.closeDeleteModal}
        style={customStyles}
      >
      <h3>Are you sure you want to delete "{this.state.current_item.name}"?</h3>

      <Button disabled={this.state.disabled} theme="success" onClick={()=>{
        self.setState({disabled: true});
        server.deleteItem((response)=>{window.location.reload();},
        (err)=>{self.setState({disabled: false, error: "An error has occured"});},
        self.state.current_item.id, self.props.match.params.id);
      }}>Yes</Button>
      <Button theme="danger" disabled={this.state.disabled} style={{float: "right"}} onClick={closeDeleteModal}>No</Button>
      </Modal>

      <Modal
        isOpen={this.state.modalInfoIsOpen}
        onRequestClose={this.closeInfoModal}
        style={customStyles}
      >
      <h3>Students who bought "{this.state.current_item.name}"</h3>

      <table className="table mb-0">
        <thead className="bg-light">
          <tr>
            <th scope="col" className="border-0">
            #
            </th>
            <th scope="col" className="border-0">
            Name
            </th>
            <th scope="col" className="border-0">
            Email
            </th>
            <th scope="col" className="border-0">
            Use count
            </th>
            <th scope="col" className="border-0">
            Buy count
            </th>
          </tr>
        </thead>
        <tbody>
          {this.state.used_items.filter(item=>item.id == this.state.current_item.id).map((item, idx)=>
            item.students.map((student, i)=>
              <tr key={i}>
                {console.log(student)}
                <td> {i+1} </td>
                <td> {student.name} </td>
                <td> {student.email} </td>
                <td> {student.amountUsed} </td>
                <td> {student.amountPurchased} </td>
              </tr>
            )
          )}
        </tbody>
      </table>


      <Button theme="danger" disabled={this.state.disabled} style={{float: "right"}} onClick={this.closeInfoModal}>Close</Button>
      </Modal>

      <Modal
        isOpen={this.state.modalIsOpen}
        onRequestClose={this.closeItemModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
      <h3>{this.state.titleModal}</h3>
      <Form>
        <FormGroup>
          <label htmlFor="itemName">Item Name</label>
          <FormInput id="itemName" placeholder="What are you selling" value={this.state.current_item.name} onChange={this.handleNameInput}/>
        </FormGroup>

        <FormGroup>
          <label htmlFor="itemName">Item Description</label>
          <FormInput id="itemName" placeholder="Describe your item for sale" value={this.state.current_item.description} onChange={this.handleDescriptionInput}/>
        </FormGroup>

        <Row form>
          <Col md="6" className="form-group">
            <label htmlFor="itemName">Amount</label>
            <FormInput id="itemName" type="number" value={this.state.current_item.amountAvailable} onChange={this.handleAmountInput}/>
          </Col>
          <Col md="6">
            <label htmlFor="itemName">Item Price</label>
            <FormInput id="itemName" type="number" value={this.state.current_item.cost} onChange={this.handlePriceInput}/>
          </Col>
        </Row>

        <FormGroup>
          <label htmlFor="itemName">End Date</label>
          <FormInput id="itemName" type="date"  value={this.state.current_item.sellByDate} onChange={this.handleLastDateInput}/>
        </FormGroup>
      </Form>
      <Button disabled={this.state.disabled} theme="success" onClick={()=>{
        let action;
        self.setState({disabled: true});
        if (self.state.current_item.id < 0){
          //adding new item
          server.createNewItem((response)=>{
            window.location.reload();
          }, (err)=>{self.setState({disabled: false, error: "An error has occured"}); window.scrollTo(0, 0);}, self.state.current_item, self.props.match.params.id);
        }
        else{
          server.updateItem((response)=>{
            window.location.reload();
          }, (err)=>{self.setState({disabled: false, error: "An error has occured"}); window.scrollTo(0, 0);}, self.state.current_item, self.props.match.params.id);
          //updating existing item
        }
      }}>Save</Button>
      <Button theme="danger" disabled={this.state.disabled} style={{float: "right"}} onClick={closeItemModal}>Cancel</Button>
      </Modal>
      {this.state.error &&
      <TimeoutAlert className="mb-0" theme="danger" msg={this.state.error} time={10000}/>
      }
      <Container fluid className="main-content-container px-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title={this.state.course.name + " Store"} subtitle="Manage course store items"
                     className="text-sm-left" />
        </Row>

        <Row>
        <Col lg="10">
        <Card className="card-post mb-4">
          <CardHeader className="border-bottom" >
            <Row>
            <Col sm="9">
            <h6 className="m-0">Items</h6>
            </Col>
            <Col sm="3">
            <Button theme="white" style={{width:"100%"}} disabled={this.state.disabled} onClick={this.showNewItemModal}>
              <span className="text-success" >
                <i className="material-icons">add</i>
              </span>{" "}
              New Item
            </Button>
            </Col>
            </Row>
          </CardHeader>

          <CardBody className="p-0">
            {this.state.products.map((product, idx) => {
              let initials = stringToInitials(product.name);
              let color = stringToColour(product.name);
              let fontColor = getCorrectTextColor(color);
              return (
              <div key={idx} className="blog-comments__item d-flex p-3 no_padding">
                {/* Content */}
                  {/* Content :: Title */}
                  <Row style={{width: "100%"}}> <Col sm="9">
                  <div data-letters={initials} style={{"--background-color" : color, "--font-color" : fontColor}} className="blog-comments__meta text-mutes">
                    {product.name}
                    <span className="text-mutes"> - until {product.sellByDate.substring(0,10)}</span>
                  </div>

                  {/* Content :: Body */}
                  <div style={{marginLeft:"3.5em"}}>
                  <p className="m-0 my-1 mb-2 text-muted">{product.description}</p>
                  <p className="m-0 my-1 mb-2 text-muted">Price: {product.cost}</p>
                  <p className="m-0 my-1 mb-2 text-muted">Items left: {product.amountAvailable}</p>
                  </div>
                  </Col>
                  <Col sm="3">
                  {/* Content :: Actions */}
                  <div className="blog-comments__actions">
                    <ButtonGroup vertical style={{width:"100%"}} className="mr-2">
                      <Button disabled={this.state.disabled} theme="white" onClick={()=>showEditItemModal(product)}>
                        <span className="text-light">
                          <i className="material-icons">edit</i>
                        </span>{" "}
                        Edit
                      </Button>
                      <Button disabled={this.state.disabled} theme="white" onClick={()=>showDeleteItemModal(product)}>
                        <span className="text-danger">
                          <i className="material-icons">clear</i>
                        </span>{" "}
                        Delete
                      </Button>
                      <Button disabled={this.state.disabled} theme="white" onClick={()=>showBuyersModal(product)}>
                        <span outline className="text-light">
                          <i className="material-icons">error_outline</i>
                        </span>{" "}
                        Usage Information
                      </Button>
                    </ButtonGroup>
                  </div>
                  </Col></Row>
              </div>
            );})}
          </CardBody>
        </Card>

        </Col></Row>

      </Container>
      </div>
    );
  }
}

export default CourseStore;
