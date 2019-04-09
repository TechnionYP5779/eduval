import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "shards-react";

import MainNavbar from "../components/layout/MainNavbar/MainNavbar";
import MainSidebar from "../components/layout/MainSidebar/MainSidebar";
import MainFooter from "../components/layout/MainFooter";

import auth from "../Auth/Auth"
import ErrorNotLogin from "../views/ErrorNotLogin"

const ProtectedLayout = ({ children, noNavbar, noFooter }) => (
  <Container fluid>
    <Row>
      <MainSidebar/>
      <Col
        className="main-content p-0"
        lg={{ size: 10, offset: 2 }}
        md={{ size: 9, offset: 3 }}
        sm="12"
        tag="main"
      >
        {!noNavbar && <MainNavbar />}
        {auth.isAuthenticated() && children}
        {!auth.isAuthenticated() && <ErrorNotLogin/>}
        {!noFooter && <MainFooter />}
      </Col>
    </Row>
  </Container>
);

ProtectedLayout.propTypes = {
  /**
   * Whether to display the navbar, or not.
   */
  noNavbar: PropTypes.bool,
  /**
   * Whether to display the footer, or not.
   */
  noFooter: PropTypes.bool
};

ProtectedLayout.defaultProps = {
  noNavbar: false,
  noFooter: false
};

export default ProtectedLayout;
