import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Label, Input, FormGroup,  } from 'reactstrap';
import { Formik } from 'formik';
import DateRangeComponent from '../Components/DateRange';
import { useSelector } from 'react-redux';
import { getAllAreas } from '../../../api/services/aoi';
import _ from 'lodash';

const SearchContainer = () => {
  const defaultAoi = useSelector(state => state.user.defaultAoi);
  
  const [selectedAoi, setAoi] = useState(null);
  const [allAoi, setAllAoi] = useState([]);
  

  useEffect(() => {
    const getAllAoi = async () => {
      let aoiList = await getAllAreas();
      setAllAoi(aoiList)
    }
    getAllAoi();
  }, []);

  const selectAoi = (e) => {
    const objAoi = _.find(allAoi, { features: [{ properties: { id: parseInt(e.target.value) } }] })
    setAoi(objAoi);
    console.log(objAoi)
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
                        id="exampleSelect"
                        name="select"
                        type="select"
                        onChange={(e) => selectAoi(e)}
                        value={selectedAoi ? selectedAoi.features[0].properties.id : 
                          defaultAoi ? defaultAoi.features[0].properties.id : ''}
                      >
                        <option value='' key={''}> ---- Select Area ------</option>
                        {allAoi.map((aoi, index) => <option key={index} value={aoi.features[0].properties.id}>
                          {aoi.features[0].properties.country} - {aoi.features[0].properties.name}
                        </option>)}
                        
                      </Input>
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