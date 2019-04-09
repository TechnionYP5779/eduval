import React from "react";
import {
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Form,
  FormInput,
  FormGroup,
  FormCheckbox,
  FormSelect,
  Button
} from "shards-react";

const NewCourseForm = () => (
  <ListGroup flush>
    <ListGroupItem className="p-3">
      <Row>
        <Col>
          <Form>
            <FormGroup>
              <label htmlFor="feInputAddress">Course Name</label>
              <FormInput id="feInputAddress" placeholder="A name that you're students will recognize" />
            </FormGroup>

            <FormGroup>
              <label htmlFor="feInputAddress">Course Description</label>
              <FormInput id="feInputAddress" placeholder="A short explanation of the course" />
            </FormGroup>

            <Row form>
              <Col md="6" className="form-group">
                <label htmlFor="feEmailAddress">Start Date</label>
                <FormInput
                  id="feEmailAddress"
                  type="date"
                  placeholder="1/1/19"
                />
              </Col>
              <Col md="6">
                <label htmlFor="fePassword">End Date</label>
                <FormInput
                  id="fePassword"
                  type="date"
                  placeholder="1/1/19"
                />
              </Col>
            </Row>

            <FormGroup>
              <label htmlFor="feInputAddress2">Class Room</label>
              <FormInput
                id="feInputAddress2"
                placeholder="Help you're students find the class room"
              />
            </FormGroup>
            <Button type="submit">Create New Course</Button>
          </Form>
        </Col>
      </Row>
    </ListGroupItem>
  </ListGroup>
);

export default NewCourseForm;
