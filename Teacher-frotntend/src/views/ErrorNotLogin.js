import React from "react";
import { Container } from "shards-react";

const ErrorNotLogin = () => (
  <Container fluid className="main-content-container px-4 pb-4">
    <div className="error">
      <div className="error__content">
        <h2>401</h2>
        <h3>You are not authorized!</h3>
        <p>Please login to see the content</p>
      </div>
    </div>
  </Container>
);

export default ErrorNotLogin;
