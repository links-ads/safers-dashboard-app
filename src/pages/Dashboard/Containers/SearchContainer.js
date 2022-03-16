import React from 'react';
import { Row, Col, Form, Label, Input, FormGroup,  } from 'reactstrap';
import { Formik } from 'formik';
// import { roles } from '../../constants/dropdowns';
// import DateComponent from '../Components/DateComponent';
import DateRangeComponent from '../Components/DateRange';

const SearchContainer = () => {
  return(
    <Row className='g-0'>
      <Col >
        <Formik
          initialValues={{
            areaOfInterest: '',
            dateRange: '',
          }}
              
          onSubmit={() => {
                
          }}
        >
          {({
            // values,
            // handleChange,
            // handleBlur,
            handleSubmit,
          }) => (
            <Form onSubmit={handleSubmit} noValidate>
              <Row >
                <Col md={5}  className=''>
                  <FormGroup row>
                    <Col sm={4}>
                      <Label
                        for="exampleEmail"
                        size="lg"
                        className='text-nowrap'
                      >
                            Area of interest
                      </Label>
                    </Col>
                    <Col sm={8}>
                      <Input
                        bsSize="md"
                        id="exampleEmail"
                        name="email"
                        placeholder="lg"
                        type="email"
                      />
                    </Col>
                  </FormGroup>
                </Col>
                <Col></Col>
                <Col md={3}>
                  <DateRangeComponent/>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  )}

export default SearchContainer;