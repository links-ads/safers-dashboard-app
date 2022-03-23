import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Label, Input, FormGroup,  } from 'reactstrap';
import { Formik } from 'formik';
import DateRangeComponent from '../Components/DateRange';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { getAllAreas } from '../../../store/appAction';

const SearchContainer = () => {
  const dispatch = useDispatch();
  const defaultAoi = useSelector(state => state.user.defaultAoi);
  const allAoi = useSelector(state => state.user.aois);
  
  const [selectedAoi, setAoi] = useState(null);
  
  useEffect(() => {
    dispatch(getAllAreas)
  }, []);

  const selectAoi = (e) => {
    const objAoi = _.find(allAoi, { features: [{ properties: { id: parseInt(e.target.value) } }] })
    setAoi(objAoi);
  }

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
            handleSubmit,
          }) => (
            <Form onSubmit={handleSubmit} noValidate>
              <Row >
                <Col md={6}  xs={12}  className=''>
                  <FormGroup row>
                    <Col sm={4} md={3} xs={4}>
                      <Label
                        for="exampleEmail"
                        size="lg"
                        className='text-nowrap position-absolute e-0 '
                      >
                            Area of interest :
                      </Label>
                    </Col>
                    <Col sm={8} md={8} xs={8}>
                      <Input
                        id="exampleSelect"
                        name="select"
                        type="select"
                        onChange={(e) => selectAoi(e)}
                        value={selectedAoi ? selectedAoi.features[0].properties.id : 
                          defaultAoi ? defaultAoi.features[0].properties.id : ''}
                      >
                        <option value='' key={''}> ---------- Select Area -----------</option>
                        {allAoi.map((aoi, index) => <option key={index} value={aoi.features[0].properties.id}>
                          {aoi.features[0].properties.country} - {aoi.features[0].properties.name}
                        </option>)}
                        
                      </Input>
                    </Col>
                  </FormGroup>
                </Col>
                <Col></Col>
                <Col md={4}>
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