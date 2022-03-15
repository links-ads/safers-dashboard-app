import React from 'react';
import { Card } from 'reactstrap';
const image_url = 'https://image.shutterstock.com/image-illustration/aerial-view-space-ecological-disaster-600w-1489282427.jpg'

const ImageComponent = () => {
  return (
    <Card>
      <img
        alt="Card image cap"
        src={image_url}
        width="100%"
        height="100%"
      />
    </Card>
  )
}

export default ImageComponent;