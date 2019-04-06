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

export default class UserActions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false
    };

    this.toggleUserActions = this.toggleUserActions.bind(this);
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
              alt="User Avatar"
            />{" "}
            <span className="d-none d-md-inline-block">[Username]</span>
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
