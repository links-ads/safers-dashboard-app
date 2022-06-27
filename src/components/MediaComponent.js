import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Card } from 'reactstrap';

import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'
import ModalVideo from 'react-modal-video'
import 'react-modal-video/scss/modal-video.scss'

const MediaComponent = (props) => {
  const [isFits, setIsFits] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  
  const expandMedia = ()=> {
    setIsOpen(!isOpen);
    setIsFits(!isFits);
  }

  console.log('props', props.media);
  return (
    <>
      {isFits ? (
        <Lightbox
          mainSrc={props.media.url}
          enableZoom={true}
          imageCaption={
            <div className='position-fixed top-0 start-0 m-2'>
              <h5 className='mb-1'>{props.media.time}</h5>
              <h4>{props.media.title}</h4>
            </div>
          }
          onCloseRequest={() => {
            setIsFits(!isFits)
          }}
        />
      ) : null}
      <Card className='w-100'>
        <div className='position-absolute top-0 start-0 m-2'>
          <h6 className='mb-1'>{props.media.time}</h6>
          <h5>{props.media.title}</h5>
        </div>
        <img
          alt="Card image cap"
          src={props.media.url}
          width="100%"
          height="100%"
          onClick={expandMedia} 
          style={{cursor:'pointer'}}
        />
        <div className='position-absolute bottom-0 end-0 m-2'>
          {props.media.type==='Image' ? <i className='fa fa-eye fa-2x text-danger' ></i> :
            <i className='fas fa-play-circle fa-2x text-danger'></i>}
        </div>
      </Card>
      {props.media.type == 'video' && <ModalVideo
        videoId={props.media.videoId}
        channel="youtube"
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(!isOpen)
        }}
      />}
    </>
  )
}

MediaComponent.propTypes = {
  media: PropTypes.object,
}

export default MediaComponent;