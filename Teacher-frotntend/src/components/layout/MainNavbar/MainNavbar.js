import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Container, Navbar} from "shards-react";

import NavbarNav from "./NavbarNav/NavbarNav";
import NavbarLang from "./NavbarLang";
import NavbarToggle from "./NavbarToggle";

const MainNavbar = ({ layout, stickyTop }) => {
  const classes = classNames(
    "main-navbar",
    "bg-white",
    stickyTop && "sticky-top"
  );

  return (
    <div className={classes}>
      <Container className="p-0">
        <Navbar type="light" className="flex p-0" style={{justifyContent: 'flex-start', flexDirection:'row-reverse'}}>
          <NavbarToggle />
          <NavbarNav style={{flexDirection: 'row', justifyContent: 'flex-end'}} />
          <NavbarLang style={{flexDirection: 'row', justifyContent: 'flex-end'}} />
        </Navbar>
      </Container>
    </div>
  );
};

MainNavbar.propTypes = {
  /**
   * The layout type where the MainNavbar is used.
   */
  layout: PropTypes.string,
  /**
   * Whether the main navbar is sticky to the top, or not.
   */
  stickyTop: PropTypes.bool
};

MainNavbar.defaultProps = {
  stickyTop: true
};

export default MainNavbar;
