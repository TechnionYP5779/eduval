import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import routes from "./routes";
import withTracker from "./withTracker";

import "bootstrap/dist/css/bootstrap.min.css";
import "./shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import "./shards-dashboard/styles/EMON-styles.css";

import server from "./Server/Server";



export default () => {
  console.log("~~~~~~~~~~~~~;here~~~~~~~~~~~~");
  return(

    <Router basename={process.env.REACT_APP_BASENAME || ""}>

      <div>
      {console.log("meow") == null}
        {routes.map((route, index) => {
          console.log("~~~~~~~~~~~~~;there~~~~~~~~~~~~");
          return (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={withTracker(props => {
                return (
                  <route.layout {...props}>
                    <route.component {...props} />
                  </route.layout>
                );
              })}
            />
          );
        })}
      </div>
    </Router>
  );
}
