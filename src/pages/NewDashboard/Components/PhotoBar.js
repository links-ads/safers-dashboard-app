import React, {useEffect, useState}  from 'react';
import { useSelector, useDispatch} from 'react-redux'
import { Container, Row, Card } from 'reactstrap';
import { ReactComponent as Placeholder } from './placeholder.svg'
import { getAllInSituAlerts } from '../../../store/insitu/action'


const PhotoBar = () => {
  
  let [photoList, setPhotoList] = useState([]);
  
  const allPhotos = useSelector(state => {
    console.log('state', state);
    console.log('photos', state?.inSituAlerts?.allAlerts);
    return state?.inSituAlerts?.allAlerts
  });

  const dispatch = useDispatch();
  console.log('All photos', allPhotos.map(item => item.url));

  useEffect(() => {
    const dateRangeParams = {};
    console.log('dispatching');
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
    //TODO find out why this is not triggered when allPhotos is set
    // ok, so it only triggers if []
    console.log('got new photos');
    setPhotoList(allPhotos);
    console.log('Photolist is now', allPhotos);
  }, [allPhotos])

  return (
    <div className="">
      <Container fluid className="flex-stretch">
        <Card>
          <p className="align-self-baseline">In-situ Photos</p>
          <Row className="mx-4 gx-2 row-cols-8 flex-wrap">
            {!photoList 
              ? [1,2,3,4,5,6,7,8].map((photo, index)=> {
                return(
                  <div key={`photo_${index}`} className="col-3 my-3">
                    <Placeholder width="100%" height="120px"/>
                  </div>
                )})
              : 
              photoList.slice(0,16).map(photo => {
                return(
                  <div key={`photo_${photo.id}`} className="col-3 my-3">
                    <img src={`${photo.url}`} width="100%" height="120px" />
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
