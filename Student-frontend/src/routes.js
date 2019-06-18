import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout, ProtectedLayout } from "./layouts";

// Route Views
import Overview from "./views/Overview";
import UserProfileLite from "./views/UserProfileLite";
import Errors from "./views/Errors";
import ErrorNotLogin from "./views/ErrorNotLogin";
import ComponentsOverview from "./views/ComponentsOverview";
import Tables from "./views/Tables";
import MyCourses from "./views/MyCourses";
import Callback from "./views/Callback";
import CourseDetails from "./views/CourseDetails";
import Lesson from "./views/Lesson";
import CourseSummery from "./views/CourseSummery";
import Store from "./views/Store";

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
    path: "/course-details/:id",
    layout: DefaultLayout,
    component: CourseDetails
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
  },
  {
    path: "/components-overview",
    layout: ProtectedLayout,
    component: ComponentsOverview
  },
  {
    path: "/lesson/:id",
    layout: DefaultLayout,
    component: Lesson
  },
  {
    path: "/tables",
    layout: ProtectedLayout,
    component: Tables
  },
  {
    path: "/my-courses",
    layout: ProtectedLayout,
    component: MyCourses
  },
  {
    path: "/course-summery/:id",
    layout: DefaultLayout,
    component: CourseSummery
  },
  {
    path: "/store/:id",
    layout: ProtectedLayout,
    component: Store
  },
];
