import React from "react";
import { Link } from "react-router-dom";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Collapse,
  NavItem,
  NavLink
} from "shards-react";

import auth from "../../../../Auth/Auth"
import server from "../../../../Server/Server"

function nameShortener(name, size) {
  return(name.length>25+size? name.substring(0,22)+"..." : name);
}



export default class UserActions extends React.Component {

  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      username: ""
    };

    this.toggleUserActions = this.toggleUserActions.bind(this);
  }


  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidMount() {
    var self = this;
    this._isMounted = true;
    var teacher_payload = server.getTeacherProfile( function(error){
        console.log("Error in getting Teacher Profile for Nav Bar");
        console.log(error);
    });
    if (teacher_payload)
    {
      var fnlen = teacher_payload["https://emon-teach.com/first_name"].length;
      self.setState({username: nameShortener(teacher_payload["https://emon-teach.com/first_name"],0)+" "+ nameShortener(teacher_payload["https://emon-teach.com/last_name"],25-fnlen)});
    }
    else
    {
      console.log("Problem at componentDidMount at UserActions.js!");
    }

  }

  toggleUserActions() {
    this.setState({
      visible: !this.state.visible
    });
  }

  logout() {
    auth.logout();
  }

  login() {
    auth.login();
  }


  render() {
    const { isAuthenticated } = auth;
    return (
      <div >
      {isAuthenticated() &&
        <NavItem tag={Dropdown} caret toggle={this.toggleUserActions}>
          <DropdownToggle caret tag={NavLink} className="text-nowrap px-3">
            <img
              className="user-avatar rounded-circle mr-2"
              src={require("./../../../../images/avatars/owl.png")}
              alt=""
            />{" "}
            <span className="d-none d-md-inline-block">{this.state.username}</span>
          </DropdownToggle>
          <Collapse tag={DropdownMenu} right small open={this.state.visible}>
            <DropdownItem tag={Link} to="user-profile-lite">
              <i className="material-icons">&#xE8B8;</i> Edit Settings
            </DropdownItem>
            <DropdownItem divider />
            <DropdownItem tag={Link} to="#" className="text-danger" onClick={this.logout.bind(this)}>
              <i className="material-icons text-danger">&#xE879;</i> Logout
            </DropdownItem>
          </Collapse>
        </NavItem>
      }
      {!isAuthenticated() &&
        <NavItem tag={Link} to="#" className="text-nowrap px-3"  onClick={this.login.bind(this)}>
          <i className="material-icons">&#xE879;</i> Login
        </NavItem>
      }
      </div>
    );
  }
}
