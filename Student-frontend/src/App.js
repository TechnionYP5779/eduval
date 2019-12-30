import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import routes from "./routes";
import withTracker from "./withTracker";

import "bootstrap/dist/css/bootstrap.min.css";
import "./shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import "./shards-dashboard/styles/EMON-styles.css";
import { enUS, ruRU } from '@material-ui/core/locale';

import { useTranslation } from 'react-i18next';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';


const themes = {
  ru: createMuiTheme({}, ruRU),
  en: createMuiTheme({}, enUS),
};


export default () => {
  
  const { i18n } = useTranslation();
  const theme = themes[i18n.language];
  
  return(
    <ThemeProvider theme={theme}>
      <Router basename={process.env.REACT_APP_BASENAME || ""}>
        <div>
          {routes.map((route, index) => {
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
    </ThemeProvider>
  );
}
