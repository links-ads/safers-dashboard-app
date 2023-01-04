import React, {useEffect, useState}  from 'react';
import { useSelector, useDispatch} from 'react-redux'
import { Container, Row, Card } from 'reactstrap';
import { ReactComponent as Placeholder } from './placeholder.svg'
import { getAllInSituAlerts } from '../../../store/insitu/action'
import { Img } from 'react-image'

const PhotoBar = () => {
  
  let [photoList, setPhotoList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const photoNumbers = [1,2,3,4,5,6,7,8];

  const allPhotos = useSelector(state => {
    return state?.inSituAlerts?.allAlerts
  });

  const dispatch = useDispatch();

  useEffect(() => {
    const dateRangeParams = {};
    dispatch(getAllInSituAlerts({
      type: undefined,
      order: '-date',
      camera_id: undefined,
      bbox:  undefined,
      default_date: false,
      default_bbox: false,
      ...dateRangeParams
    }));

  }, []);

  useEffect(() => {
    setPhotoList(allPhotos);
    setIsLoaded(true);
    console.log('Now isLoaded');
  }, [allPhotos])

  return (
    <div className="">
      <Container fluid className="flex-stretch">
        {!isLoaded ? <Card><h1>Loading...</h1></Card> : null}
        <Card>
          <p className="align-self-baseline">In-situ Photos</p>
          <Row className="mx-4 gx-2 row-cols-8 flex-wrap">
            
            {!photoList 
              ? photoNumbers.map((photo, index)=> {
                return(
                  <div key={`photo_${index}`} className="col-3 my-3">
                    <Placeholder width="100%" height="120px"/>
                  </div>
                )})
              : 
              photoList.slice(0,16).map(photo => {
                return(
                  <div key={`photo_${photo.id}`} className="col-3 my-3">    
                    {/* This is a custom component which handles fallbacks */}
                    <Img 
                      decode={true}
                      unloader={<Placeholder width="100%" height="120px"/>} 
                      src={[`${photo.url}`]} 
                      width="100%" height="120px" 
                      alt="Image is missing"
                    />
                  </div>
                )
              })}
          </Row>
        </Card>
      </Container>
    </div>
  );
}

export default PhotoBar;
