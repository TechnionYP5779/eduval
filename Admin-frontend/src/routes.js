import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout, ProtectedLayout } from "./layouts";

// Route Views
import Overview from "./views/Overview";
import UserProfileLite from "./views/UserProfileLite";
import Errors from "./views/Errors";
import Callback from "./views/Callback";


export default [
  {
    path: "/",
    exact: true,
    layout: DefaultLayout,
    component: () => <Redirect to="/overview" />
  },
  {
    path: "/callback",
    exact: true,
    layout: DefaultLayout,
    component: Callback
  },
  {
    path: "/overview",
    layout: DefaultLayout,
    component: Overview
  },
  {
    path: "/user-profile-lite",
    layout: ProtectedLayout,
    component: UserProfileLite
  },
  {
    path: "/errors",
    layout: ProtectedLayout,
    component: Errors
  }
];
