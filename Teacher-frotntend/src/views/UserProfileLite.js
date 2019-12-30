import React from "react";
import { Container, Row, Col } from "shards-react";

import PageTitle from "../components/common/PageTitle";
import UserDetails from "../components/user-profile-lite/UserDetails";
import UserAccountDetails from "../components/user-profile-lite/UserAccountDetails";
import UserGraphsCard from "../components/user-profile-lite/UserGraphsCard";

import { useTranslation } from 'react-i18next';

const UserProfileLite = () => {
  const { t } = useTranslation();

  return <Container fluid className="main-content-container px-4">
    <Row noGutters className="page-header py-4">
      <PageTitle title={t("User Profile")} subtitle={t("Overview")} md="12" className="ml-sm-auto mr-sm-auto" />
    </Row>
    <Row>
      <Col lg="6">
        <UserAccountDetails />
      </Col>
      <Col lg="6">
        <UserGraphsCard />
      </Col>
    </Row>
  </Container>
};

export default UserProfileLite;
