import React  from 'react';
import { Container, Row, Col, Form, Label, Input, FormGroup, Card, CardHeader, CardBody, CardFooter, Badge,  } from 'reactstrap';
import { Formik } from 'formik';
// import { roles } from '../../constants/dropdowns';
import DateComponent from './DateComponent';
import MapComponent from './MapComponent';
import ImageComponent from './ImageComponent';
import TwitterContainer from './Containers/TwitterContainer';

const tweetIDs = [
  '1495718988952838147',
  '1473967871512367105',
  '1468979511907790861',
  '1503322032477552641',
  '1503186160524439557',
  '1501558771293765636',
]

const Dashboard = () => {

  return (
    <div className="page-content">
      <Container fluid className='p-0'>
        
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
                    <Col md={6}  className=''>
                      <FormGroup row>
                        <Label
                          for="exampleEmail"
                          size="lg"
                          sm={4}
                          className='text-nowrap'
                        >
                            Area of interest
                        </Label>
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
                      <DateComponent/>
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card className='stats-card px-2 pb-3'>
              <CardHeader>
              Reports
              </CardHeader>
              <CardBody className='mx-auto'>
              35
              </CardBody>
              <CardFooter>
              </CardFooter>
            </Card>
          </Col>
          <Col>
            <Card className='stats-card px-2 pb-3'>
              <CardHeader>
              Alerts
              </CardHeader>
              <CardBody className='mx-auto'>
              8
              </CardBody>
              <CardFooter>
              </CardFooter>
            </Card>
          </Col>
          <Col>
            <Card className='stats-card px-2 pb-3'>
              <CardHeader>
              Events
              </CardHeader>
              <CardBody className='mx-auto'>
              12
              </CardBody>
              <CardFooter>
              </CardFooter>
            </Card>
          </Col>
          <Col>
            <Card className='stats-card px-2 pb-3'>
              <CardHeader>
              Social Engagement
              </CardHeader>
              <CardBody className='mx-auto'>
                <span>20k</span>
              </CardBody>
              <CardFooter className='mx-auto'>
                Total number of tweets
              </CardFooter>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md={5}>
            <Card>
              <MapComponent/>
            </Card>
          </Col>
          <Col md={7} className='d-flex'>
            <Card className='card-weather' >
              <Row className='mb-2'>
                <span className='weather-text'>Weather Forecast</span>
              </Row>
              <Row>
                <Col>
                  <Badge className='badge-temp px-2 temp'>
                    <i className='fa fa-thermometer p-1'></i><span>Temperature</span>
                  </Badge>
                </Col>
                <Col>
                  <Badge className='badge-temp px-2 pressure'>
                    <i className='fa fa-solid fa-wind p-1'></i><span>Atm.Pressure</span>
                  </Badge>
                </Col>
                <Col>
                  <Badge className='badge-temp px-2 pressure'>
                    <i className='bx bxs-cloud-rain p-1'></i><span>Precipitation</span>
                  </Badge>
                </Col>
                <Col></Col>
              </Row>
              <Row className='mt-2'>
                <span className="celcius-symbol">
                  C°
                </span>
              </Row>
              <Row className='h-100'>
                <Col >
                  <Card className='card-temperature h-100 flex-column text-center '>
                    <Col className="p-2 pressure-text"><span>24H</span></Col>
                    <Col className="p-2 degrees-text">17°</Col>
                    <Col className="p-2"></Col>
                  </Card>
                </Col>
                <Col>
                  <Card className='card-temperature h-100 flex-column text-center'>
                    <Col className="p-2 pressure-text"><span>48H</span></Col>
                    <Col className="p-2 degrees-text">16°</Col>
                    <Col className="p-2"></Col>
                  </Card>
                </Col>
                <Col>
                  <Card className='card-temperature h-100 flex-column justify-content-between text-center'>
                    <Col className="p-2 pressure-text"><span>72H</span></Col>
                    <Col className="p-2 degrees-text">14°</Col>
                    <Col className="p-2"></Col>
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Row className='weather-variables-card'>
          <Col md={12} className='d-flex'>
            <Card className='card-weather' >
              <Row className='mb-2'>
                <span className='weather-text'>Weather Variables on an hourly basis</span>
              </Row>
              <Row>
                <Col>
                  <Badge className='badge-temp px-2 pressure'>
                    <i className='fa fa-solid fa-wind p-1'></i><span>Wind</span>
                  </Badge>
                </Col>
                <Col>
                  <Badge className='badge-temp px-2 pressure'>
                    <i className='bx bxs-cloud-rain p-1'></i><span>Relative Humidity</span>
                  </Badge>
                </Col>
                <Col></Col>
              </Row>
              <Row className='h-100'>
                {Array.from(Array(8), () => {
                  return <Col>
                    <Card className='card-temperature h-100 flex-column text-center '>
                      <Col className="p-2 "><span>16:00</span></Col>
                      <Col className="p-2 ">4m/s</Col>
                      <Col className="p-2">35%</Col>
                    </Card>
                  </Col>
                })}
                
              </Row>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md={12} className='d-flex'>
            <Card className='card-weather' >
              <Row className='mb-2'>
                <span className='weather-text'>In-situ Photos & Videos</span>
              </Row>
              <Row >
                <Col md={3} className='d-flex  dashboard-image'>
                  <ImageComponent/>
                </Col>
                <Col md={3} className='d-flex  dashboard-image'>
                  <ImageComponent/>
                </Col>
                <Col md={3} className='d-flex  dashboard-image'>
                  <ImageComponent/>
                </Col>
                <Col md={3} className='d-flex  dashboard-image'>
                  <ImageComponent/>
                </Col>
                <Col md={3} className='d-flex  dashboard-image'>
                  <ImageComponent/>
                </Col>
                <Col md={3} className='d-flex  dashboard-image'>
                  <ImageComponent/>
                </Col>
                <Col md={3} className='d-flex  dashboard-image'>
                  <ImageComponent/>
                </Col>
                <Col md={3} className='d-flex  dashboard-image'>
                  <ImageComponent/>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md={12} className='d-flex'>
            <Card className='card-weather' >
              <Row className='mb-2'>
                <span className='weather-text'>Latest Tweets</span>
              </Row>
              <Row >
                {tweetIDs.map((tweetID, index) => {
                  return <Col md={4} key={index}>
                    <TwitterContainer  tweetID={tweetID}/>
                  </Col>
                })}
                  
              </Row>
            </Card>
          </Col>
        </Row>
        
      </Container>
    </div>
  );
}

export default Dashboard;
