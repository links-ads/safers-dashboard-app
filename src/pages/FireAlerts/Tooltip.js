import React, { useState } from 'react';
import PropTypes from 'prop-types'
import {
  Button,
  // Card,
  CardImg,
  CardSubtitle,
  CardText,
  CardTitle,
  Col,
  Input,
  Row
} from 'reactstrap';
import { Popup } from 'react-map-gl';

const Tooltip = ({ object, coordinate, isEdit = false, setFavorite, validateEvent, editInfo }) => {
  const [editToggle, setEditToggle] = useState(isEdit);
  const [favToggle, setFavToggle] = useState(object.isFavorite);
  const [description, setDescription] = useState(object.description);
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
          <Col md={1}>
            <button
              type="button"
              className="btn px-0"
              onClick={(e) => {
                e.stopPropagation();
                setFavorite(object.id);
                setFavToggle(!favToggle);
              }}
            >
              <i className={`mdi mdi-star${!favToggle ? '-outline' : ''} card-title`}></i>
            </button>
          </Col>
          <Col >
            <CardTitle className="mt-0 card-title">{object.title}</CardTitle>
            <CardSubtitle className="font-14 text-muted">
              {object.timestamp}
            </CardSubtitle>
          </Col>
        </Row>
        <Row className='no-gutters mx-0'>
          <Col md={6} className='px-1'>
            <CardImg
              className="img-fluid tooltip-img"
              src={'https://st3.depositphotos.com/3589679/34560/i/380/depositphotos_345604100-stock-photo-blaze-fire-flame-texture-background.jpg'} alt="" />
          </Col>
          <Col md={6} className='px-1'>
            <CardImg
              className="img-fluid tooltip-img"
              src={'https://media.istockphoto.com/photos/ring-of-fire-bailey-colorado-rocky-mountain-forest-wildfire-picture-id157384116?b=1&k=20&m=157384116&s=170667a&w=0&h=Pw_yN0VDs32EtF72o_8eosnV7KUugM4BzFBgoGapZVs='} alt="" />
          </Col>
        </Row>
        <Row className='mt-3 px-1 g-0'>
          <Row className='g-0'>
            <Col md={3}>
              <CardText className='mb-2'>
                <span className='float-start mb-5'>Info: </span>
              </CardText>
            </Col>
            <Col>
              <CardText>
                {
                  editToggle ?
                    <Input type='textarea' value={description} onChange={(e) => { setDescription(e.target.value) }} />
                    : object.description
                }
              </CardText>
            </Col>
          </Row>
          <Row className='g-0'>
            <Col md={3}>
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
                <Button color="primary" className='create-event-button' onClick={() => validateEvent(object.id)}>
                  CREATE EVENT
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
