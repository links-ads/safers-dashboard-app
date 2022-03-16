import React, { useState } from 'react';
import { Card } from 'reactstrap';

import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'

const image_url = 'https://media.gettyimages.com/photos/forest-fire-wildfire-at-night-time-on-the-mountain-with-big-smoke-picture-id1266552048?s=2048x2048'

const ImageComponent = () => {
  const [isFits, setisFits] = useState(false)
  
  
  return (
    <>
      {isFits ? (
        <Lightbox
          mainSrc={image_url}
          enableZoom={true}
          imageCaption={
            <div className='position-fixed top-0 start-0 m-2'>
              <h5 className='mb-1'>2021 - 11 - 23 20:47:38</h5>
              <h4>In Situ Camera</h4>
            </div>
          }
          onCloseRequest={() => {
            setisFits(!isFits)
          }}
        />
      ) : null}
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
          <i className='fa fa-eye fa-2x text-danger' onClick={() => setisFits(!isFits)}></i>
        </div>
      </Card>
    </>
  )
}

export default ImageComponent;