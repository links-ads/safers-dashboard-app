import React, { useState } from 'react';
import PropTypes from 'prop-types'
import {
  Button,
  CardSubtitle,
  CardText,
  CardTitle,
  Col,
  Input,
  Row
} from 'reactstrap';
import { Popup } from 'react-map-gl';
import { useNavigate } from 'react-router-dom';

const Tooltip = ({ object, coordinate, isEdit = false, setFavorite, editInfo }) => {
  const [editToggle, setEditToggle] = useState(isEdit);
  const [favToggle, setFavToggle] = useState(object.isFavorite);
  const [description, setDescription] = useState(object.description);
  const navigate = useNavigate();
  return (
    <Popup
      longitude={coordinate[0]}
      latitude={coordinate[1]}
      offsetTop={15}
      dynamicPosition={true}
      anchor='top-left'
      style={{ borderRadius: '10px' }}
    >

      <div className='my-2 mx-4 map-tooltip'>
        <Row className='mb-2'>
          <Col md={1} className='d-flex g-0'>
           
            <i 
              onClick={(e) => {
                e.stopPropagation();
                setFavorite(object.id);
                setFavToggle(!favToggle);
              }}
              className={`mdi mdi-star${!favToggle ? '-outline' : ''} card-title my-auto`}></i>
           
          </Col>
          <Col>
            <CardTitle className="card-title h-100 d-flex">
              <p className='my-auto'>{object.title}</p>
            </CardTitle>
          </Col>
        </Row>
        <Row>
          <Col md={1} className='d-flex g-0'>
            <i className='fa fa-map-marker my-auto'></i>
          </Col>
          <Col md={10}>
            <CardSubtitle className="my-auto">
              Filoktiti Oikonomidou, Athens 114 76, Greece
            </CardSubtitle>
          </Col>
        </Row>
        <Row className='my-1'>
          <Col md={1} className='g-0 d-flex'>
            <i className='fa fa-calendar my-auto'></i>
          </Col>
          <Col md={10}>
            <CardSubtitle className="my-auto">
              Start: Dec 11, 2021, 16:00 <br></br>
              End: not set
            </CardSubtitle>
          </Col>
        </Row>
        <Row className='my-2'>
          <Col md={1} className='g-0'>
            <i className='fa fa-user my-auto'></i>
          </Col>
          <Col md={10}>
            <CardSubtitle className="my-auto">
              People Affected : 120
            </CardSubtitle>
          </Col>
        </Row>
        <Row className='my-2'>
          <Col md={1} className='g-0'>
            <i className='fa fa-ambulance my-auto'></i>
          </Col>
          <Col md={10}>
            <CardSubtitle className="my-auto">
              Casualties: not recorded
            </CardSubtitle>
          </Col>
        </Row>
        <Row className='my-2'>
          <Col md={1} className='g-0'>
            <i className='fas fa-euro-sign my-auto'></i>
          </Col>
          <Col md={10}>
            <CardSubtitle className="my-auto text-muted">
              Estimated damage: not registered
            </CardSubtitle>
          </Col>
        </Row>

        <Row className='mt-3'>
          <Col md={2} className="g-0">
            <CardText className='mb-2 px-0'>
              <span className='mb-5'>Info: </span>
            </CardText>
          </Col>
          <Col className='g-0'>
            <CardText>
              {
                editToggle ?
                  <Input type='textarea' rows="6" value={description} onChange={(e) => { setDescription(e.target.value) }} />
                  : description
              }
            </CardText>
          </Col>
          
          <Row className='g-0'>
            <Col md={2}>
              <CardText className='mb-2'>
                <small className="font-italic">
                  Source:
                </small>
              </CardText>
            </Col>
            <Col>
              <CardText className='mb-2'>
                <small className="font-italic">
                  {object.source}</small>
              </CardText>
            </Col>
          </Row>
          {editToggle ?
            <>
              <Row className='align-middle g-0'>
                <Button
                  color="primary"
                  className='save-event-button'
                  onClick={() => {
                    setEditToggle(false);
                    editInfo(object.id, description);
                  }} >
                  SAVE
                </Button>
              </Row>
              <Row className='g-0'>
                <Button className='link-button' color="link" onClick={() => setEditToggle(false)} >
                  Cancel
                </Button>
              </Row>
            </>
            : <>
              <Row className='g-0'>
                <Button color="secondary" className='create-event-button' onClick={()=>{navigate(`/event-dashboard/${object.id}`);}}>
                  SHOW INFO
                </Button>
              </Row>
              <Row className='g-0'>
                <Button className='link-button' color="link" onClick={() => setEditToggle(true)} >
                  Edit
                </Button>
              </Row>
            </>
          }
        </Row>
      </div>
    </Popup >
  )
}

Tooltip.propTypes = {
  object: PropTypes.any,
  coordinate: PropTypes.array,
  isEdit: PropTypes.bool,
  setFavorite: PropTypes.func,
  validateEvent: PropTypes.func,
  editInfo: PropTypes.func

}

export default Tooltip;
