import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout, ProtectedLayout } from "./layouts";

// Route Views
import Overview from "./views/Overview";
import UserProfileLite from "./views/UserProfileLite";
import AddNewCourse from "./views/AddNewCourse";
import Errors from "./views/Errors";
import ComponentsOverview from "./views/ComponentsOverview";
import Tables from "./views/Tables";
import MyCourses from "./views/MyCourses";
import Callback from "./views/Callback";
import CourseDetails from "./views/CourseDetails";
import CourseStore from "./views/CourseStore";
import Lesson from "./views/Lesson";
import DemoLesson from "./views/DemoLesson";



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
    layout: ProtectedLayout,
    component: CourseDetails
  },
  {
    path: "/manage-store/:id",
    layout: ProtectedLayout,
    component: CourseStore
  },
  {
    path: "/user-profile-lite",
    layout: ProtectedLayout,
    component: UserProfileLite
  },
  {
    path: "/add-new-course",
    layout: ProtectedLayout,
    component: AddNewCourse
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
    layout: ProtectedLayout,
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
    path: "/demo-lesson",
    layout: ProtectedLayout,
    component: DemoLesson
  }
];
