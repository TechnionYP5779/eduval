import React from "react";
import { Nav } from "shards-react";

import UserActions from "./UserActions";


export default () => (
  <Nav navbar className="border-left flex-row" style={{alignItems:"center"}}>
    <UserActions />
  </Nav>
);
