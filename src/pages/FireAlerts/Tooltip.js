import React, { useState } from 'react';
import PropTypes from 'prop-types'
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardSubtitle,
  CardText,
  CardTitle,
  Col,
  Input,
  Row
} from 'reactstrap';
import { Popup } from 'react-map-gl';

const Tooltip = ({ object, coordinate, isEdit = false }) => {
  const [editToggle, setEditToggle] = useState(isEdit);
  const [description, setDescription] = useState(object.description);
  return (
    <Popup
      longitude={coordinate[0]}
      latitude={coordinate[1]}
      dynamicPosition={true}
      anchor='top-left'
    >
      <Card className="map-tooltip mb-0" >
        <CardBody>
          <button
            type="button"
            className="btn float-start py-0 px-1"
          >
            <i className="mdi mdi-star-outline d-block font-size-16" />
          </button>
          <CardTitle className="mt-0">{object.title}</CardTitle>
          <CardSubtitle className="font-14 text-muted">
            {object.timestamp}
          </CardSubtitle>
        </CardBody>
        <Row className='no-gutters'>
          <Col xl={6}>
            <CardImg
              className="img-fluid tooltip-img"
              src={'https://st3.depositphotos.com/3589679/34560/i/380/depositphotos_345604100-stock-photo-blaze-fire-flame-texture-background.jpg'} alt="" />
          </Col>
          <Col xl={6}>
            <CardImg
              className="img-fluid tooltip-img"
              src={'https://media.istockphoto.com/photos/ring-of-fire-bailey-colorado-rocky-mountain-forest-wildfire-picture-id157384116?b=1&k=20&m=157384116&s=170667a&w=0&h=Pw_yN0VDs32EtF72o_8eosnV7KUugM4BzFBgoGapZVs='} alt="" />
          </Col>
        </Row>
        <CardBody>
          <CardText className='mb-2'>
            <span className='float-start mb-5'>Info: </span>
            {
              editToggle ?
                <Input type='textarea' value={description} onChange={(e) => { setDescription(e.target.value) }} />
                : object.description
            }
          </CardText>
          <CardText className='mb-2'>
            <small className="font-italic">
              Source: {object.source}
            </small>
          </CardText>
          {editToggle ?
            <>
              <Row className='align-middle'>
                <Button color="primary" onClick={() => setEditToggle(false)} >
                  SAVE
                </Button>
              </Row>
              <Row>
                <Button color="link" onClick={() => setEditToggle(false)} >
                  Cancel
                </Button>
              </Row>
            </>
            : <>
              <Row className='align-middle'>
                <Button color="primary" >
                  CREATE EVENT
                </Button>
              </Row>
              <Row>
                <Button color="link" onClick={() => setEditToggle(true)} >
                  Edit
                </Button>
              </Row>
            </>
          }
        </CardBody>
      </Card>
    </Popup>
  )
}

Tooltip.propTypes = {
  object: PropTypes.any,
  coordinate: PropTypes.array,
  isEdit: PropTypes.bool
}

export default Tooltip;
