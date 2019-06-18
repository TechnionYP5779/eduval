import React from "react";
import { Container, Alert } from "shards-react";

class TimeoutAlert extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      timeout: false
    }
    this.removeAlert = this.removeAlert.bind(this);
    this.isTimedout = this.isTimedout.bind(this);
  }

  componentDidMount(){
    this.setState({id: setTimeout(this.removeAlert, this.props.time)});
  }

  componentWillUnmount(){
    if (this.state.id)
      clearTimeout(this.state.id);
  }

  static getDerivedStateFromProps(nextProps, prevState){
    if (prevState.timeout && prevState.timeoutCalled){
      return {timeout: false, timeoutCalled: false};
    }
    if (prevState.timeout){
      return {timeout: true, timeoutCalled: true};
    }
    return prevState;
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.timeout){
      if (this.state.id)
        clearTimeout(this.state.id);
      this.state.id = setTimeout(this.removeAlert, this.props.time);
    }
  }

  removeAlert(){
    this.setState({timeout: true, id: false});
  }

  isTimedout(){
    return this.state.timeout;
  }

  render() {
    var isTimedout = this.isTimedout;
    return(<Container fluid className="px-0">
      {!isTimedout() && <Alert className="mb-0" theme={this.props.theme}>
        <i className="fa fa-info mx-2"></i> {this.props.msg}
      </Alert>}
    </Container>);
  }
}

export default TimeoutAlert;
