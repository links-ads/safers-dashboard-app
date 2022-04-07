import React, {useState} from 'react';
import PropTypes from 'prop-types'
import { Badge, Card, CardBody, CardText, Col, Row, Button } from 'reactstrap';
import { formatDate } from '../../../store/utility';
import ReactTooltip from 'react-tooltip';
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'
import ModalVideo from 'react-modal-video'
import 'react-modal-video/scss/modal-video.scss'

const Alert = ({ card, alertId, setSelectedAlert, setFavorite }) => {

  const [isOpen, setisOpen] = useState(false);

  const getBadge = (tag, index) => {
    
    return (
      <Badge key={index} className='me-1 rounded-pill alert-badge event-alert-badge py-0 px-2 pb-0 mb-0'>
        <i className='fa-lg me-1'></i> 
        <span>{tag.toUpperCase()}</span>
      </Badge>
    )
  }

  const getMedia = (card) => {
    const { media } = card;
    if(!media) return null;
    if(media.type == 'Video'){
      return <ModalVideo
        videoId={media.videoId}
        channel={media.channel}
        isOpen={isOpen}
        onClose={() => {
          setisOpen(!isOpen)
        }}
      />
    }
    return (isOpen ? (
      <Lightbox
        mainSrc={media.url}
        enableZoom={true}
        imageCaption={
          <div className='position-fixed top-0 start-0 m-2'>
            <h5 className='mb-1'>{formatDate(card.date, 'YYYY-MM-DD HH:mm')}</h5>
            <h5>{card.source}</h5>
          </div>
        }
        onCloseRequest={() => {
          console.log('clicked..');
          setisOpen(false)
        }}
      />
    ) : null)
  }

  return (
    <>
      <Card
        onClick={() => setSelectedAlert(card.id)}
        className={'alerts-card mb-2 pt-1 ' + (card.id == alertId ? 'alert-card-active' : '')}>
        <CardBody className='p-0 m-2'>
          <Row>
            <Col md={1}>
            </Col>
            <Col>
              {card.tags && <CardText className='mb-2'>
                {card.tags.map((tag, idx) => (
                  getBadge(tag, idx)
                ))}
              </CardText>}
            </Col>
          </Row>
          <Row>
            <Col md={1}>
              <button
                type="button"
                className="btn float-start py-0 px-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setFavorite(card.id);
                }}
              >
                <i className={`mdi mdi-star${!card.isFavorite ? '-outline' : ''} card-title`}></i>
              </button>
            </Col>
            <Col>
              <Row>
                <Col md={8}>
                  <p>{formatDate(card.date)}</p>
                  <p className='mb-1'><i data-tip data-for="smoke-column" className='bx bx-info-circle float-start fs-5 me-2'></i><span >Smoke Column Class: {card.sourceInfo.SmokeColumn}</span></p>
                  <p className='mb-1'><i  data-tip data-for="geo-direction" className='bx bx-info-circle float-start fs-5 me-2'></i><span>Geographical Direction: {card.sourceInfo.GeoInfo}&deg;</span></p>
                </Col>
                <Col  md={4} className='text-end'>
                  <Button className="btn btn-primary px-5 py-2" onClick={()=>{setisOpen(true)}}>VIEW</Button>
                </Col>
              </Row>
              <Row>
                <Col md={2} className="ms-auto">
                  <CardText>
                    <span className='float-end alert-source-text me-2'>{(card.source).join(', ')}</span>
                  </CardText>
                </Col>
              </Row>
            </Col>
          </Row>
        </CardBody>
        <ReactTooltip id="smoke-column" aria-haspopup="true" role="example" place='right' class="alert-tooltip text-light">
          <h5>Smoke Column Class</h5>
          <p className='mb-2'>CL1 - fires invloving wood/plants</p>
          <p className='mb-2'>CL2 - fires invloving flammable materials / liquids</p>
          <p>CL3 - fires invloving gases</p>
        </ReactTooltip>
        <ReactTooltip id="geo-direction" aria-haspopup="true" role="example" place='right' class="alert-tooltip text-light">
          <h5>Geographical Direction</h5>
          <p className='tooltip-desc'>Geographical direction  of the fire respect to the position of the camera</p>
          <Row>
            <Col md={6}><span className='me-5'>0&deg; = North</span></Col>
            <Col md={6} className="float-start"><span>90&deg; = East</span></Col>
          </Row>
          <Row>
            <Col md={6}><span className='me-5'>180&deg; = South</span></Col>
            <Col md={6} className="float-start"><span>270&deg; = West</span></Col>
          </Row>
        </ReactTooltip>
      </Card>
      {getMedia(card)}
    </>
  )
}

Alert.propTypes = {
  card: PropTypes.any,
  alertId: PropTypes.string,
  setSelectedAlert: PropTypes.func,
  setFavorite: PropTypes.func,
}

export default Alert;
