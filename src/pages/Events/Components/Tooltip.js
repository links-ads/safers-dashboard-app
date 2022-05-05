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
import { formatDate } from '../../../store/utility';
import classnames from 'classnames';
import DatePicker from '../../../components/DateRangePicker/DatePicker';

const Tooltip = ({ object, coordinate, isEdit = false, setFavorite, editInfo }) => {
  
  const [editToggle, setEditToggle] = useState(isEdit);
  const [favToggle, setFavToggle] = useState(object.isFavorite);
  const [casualties, setCasualties] = useState(object.casualties);
  const [damage, setDamage] = useState(object.damage);
  const [endDate, setEndDate] = useState(object.end);
  const [peopleAffected, setPeoppleAffected] = useState(object.people_affected);
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

      <div className='my-2 mx-4 map-tooltip' role='event-tooltip'>
        <Col>
          <Row className='mb-2'>
            <Col md={1} className='d-flex'>
           
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
            <Col md={1} className='d-flex'>
              <i className='fa fa-map-marker my-auto'></i>
            </Col>
            <Col md={10}>
              <CardSubtitle className="my-auto">
                {object.location}
              </CardSubtitle>
            </Col>
          </Row>
          <Row className='my-1'>
            <Col md={1} className='d-flex'>
              <i className='fa fa-calendar my-auto'></i>
            </Col>
            <Col>
              <CardSubtitle className="my-auto">
                Start :&nbsp;{formatDate(object.start)} <br></br>
                <div className='d-flex text-nowrap'>
                  End : &nbsp;
                  {
                    editToggle ?
                      <DatePicker 
                        type='text'  
                        setDate={setEndDate}
                        isTooltipInput={true}
                        date={endDate} 
                      />
                      :  endDate ? formatDate(endDate) : 'not set'
                  }
                </div>
              </CardSubtitle>
            </Col>
          </Row>
          <Row className={classnames({
            'opacity-50': !peopleAffected,
          }, 'my-2')}>
            <Col md={1} className=''>
              <i className='fa fa-user my-auto'></i>
            </Col>
            <Col>
              <CardSubtitle className="my-auto d-flex text-nowrap">
              People Affected : &nbsp;
                {
                  editToggle ?
                    <Input type='text' value={peopleAffected ? peopleAffected: '' } className='tootip-input ms-2' onChange={(e) => { setPeoppleAffected(e.target.value) }} />
                    :  peopleAffected ? peopleAffected : 'not recorded'
                }
              </CardSubtitle>
            </Col>
          </Row>
          <Row className={classnames({
            'opacity-50': !casualties,
          }, 'my-2')}>
            <Col md={1} className=''>
              <i className='fa fa-ambulance my-auto'></i>
            </Col>
            <Col >
              <CardSubtitle className="my-auto d-flex text-nowrap">
              Casualties: &nbsp; 
                {
                  editToggle ?
                    <Input type='text' className='tootip-input ms-2' value={casualties? casualties: ''} onChange={(e) => { setCasualties(e.target.value) }} />
                    :  casualties ? casualties : 'not recorded'
                }
              </CardSubtitle>
            </Col>
          </Row>
          <Row className={classnames({
            'opacity-50': !damage,
          }, 'my-2')}>
            <Col md={1} className=''>
              <i className='fas fa-euro-sign my-auto'></i>
            </Col>
            <Col >
              <CardSubtitle className="my-auto text-muted d-flex text-nowrap">
                Estimated damage : &nbsp;
                {
                  editToggle ?
                    <Input type='text' className='tootip-input ms-2' value={damage ? damage : ''} onChange={(e) => { setDamage(e.target.value) }} />
                    :  damage ? damage : 'not recorded'
                }
              </CardSubtitle>
            </Col>
          </Row>

          <Row className='mt-3 my-2'>
            <Col md={2} className="">
              <CardText className='mb-2 px-0'>
                <span className='mb-5'>Info: </span>
              </CardText>
            </Col>
            <Col>
              <CardText>
                {
                  editToggle ?
                    <Input type='textarea' className='tootip-input' rows="6" value={description} onChange={(e) => { setDescription(e.target.value) }} />
                    : description
                }
              </CardText>
            </Col>
          </Row>

          <Row className='my-2'>
            <Col md={2} className='pe-0'>
              <CardText className='mb-2'>
                <small className="font-italic">
                  Source:
                </small>
              </CardText>
            </Col>
            
            <Col>
              <CardText className='mb-2'>
                <small className="font-italic">
                  {(object.source).join(', ')}
                </small>
              </CardText>
            </Col>
          </Row>
            
          {editToggle ?
            <>
              <Row>
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
              <Row>
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
        </Col>
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
