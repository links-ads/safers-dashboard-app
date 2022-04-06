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
  const media = {
    time: '2021 - 11 - 23 20:47:38',
    title: 'In Situ Camera',
    type: 'photo',
    url: 'https://media.gettyimages.com/photos/forest-fire-wildfire-at-night-time-on-the-mountain-with-big-smoke-picture-id1266552048?s=2048x2048'
  }

  const getBadge = () => {
    
    return (
      <Badge className='me-1 rounded-pill alert-badge event-alert-badge py-0 px-2 pb-0 mb-0'>
        <i className='fa-lg me-1'></i> 
        <span>{card.status}</span>
      </Badge>
    )
  }

  const getMedia = (media) => {
    if(!media) return null;
    if(media.type == 'video'){
      return <ModalVideo
        videoId={media.videoId}
        channel="youtube"
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
            <h5 className='mb-1'>{media.time}</h5>
            <h4>{media.title}</h4>
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
        className={'alerts-card mb-2 ' + (card.id == alertId ? 'alert-card-active' : '')}>
        <CardBody className='p-0 m-2'>
          <Row>
            <Col md={1}>
            </Col>
            <Col>
              <CardText className='mb-2'>
                {getBadge()}
              </CardText>
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
                  <p>{formatDate(card.start)}</p>
                  <p className='mb-1' data-tip data-for="global"><i className='bx bx-info-circle float-start fs-5 me-2'></i><span >Lorem posum</span></p>
                  <p data-tip data-for="global"><i className='bx bx-info-circle float-start fs-5 me-2'></i><span>Lorem posum</span></p>
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
        <ReactTooltip id="global" aria-haspopup="true" role="example" place='right' class="alert-tooltip">
          <p>This is a global react component tooltip</p>
          <p>You can put every thing here</p>
        </ReactTooltip>
      </Card>
      {getMedia(media)}
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
