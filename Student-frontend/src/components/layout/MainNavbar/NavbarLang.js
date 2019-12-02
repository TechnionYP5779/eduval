import React from "react";
import { Nav } from "shards-react";

import ChooseLanguage from "./ChooseLanguage";


export default () => (
  <Nav navbar className="border-left flex-row" style={{alignItems:"center"}}>
    <ChooseLanguage />
  </Nav>
);
