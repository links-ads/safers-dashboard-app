import React, { useState } from 'react';
import { Card } from 'reactstrap';

import ModalVideo from 'react-modal-video'
import 'react-modal-video/scss/modal-video.scss'

const image_url = 'https://media.gettyimages.com/photos/forest-fire-wildfire-at-night-time-on-the-mountain-with-big-smoke-picture-id1266552048?s=2048x2048'

const VideoComponent = () => {
  const [isOpen, setisOpen] = useState(false)

  return (
    <>
      
      <Card>
        <div className='position-absolute top-0 start-0 m-2'>
          <h6 className='mb-1'>2021 - 11 - 23 20:47:38</h6>
          <h5>In Situ Camera</h5>
        </div>
        <img
          alt="Card image cap"
          src={image_url}
          width="100%"
          height="100%"
        />
        <div className='position-absolute bottom-0 end-0 m-2'>
          <i className='fas fa-play-circle fa-2x text-danger' onClick={() => setisOpen(!isOpen)}></i>
        </div>
      </Card>
      <ModalVideo
        videoId="L61p2uyiMSo"
        channel="youtube"
        isOpen={isOpen}
        onClose={() => {
          setisOpen(!isOpen)
        }}
      />
    </>
  )
}

export default VideoComponent;