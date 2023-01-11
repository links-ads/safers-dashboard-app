import React, {useEffect, useState}  from 'react';
import { useSelector, useDispatch} from 'react-redux'
import { Container, Card, Row } from 'reactstrap';
import { ReactComponent as Placeholder } from './placeholder.svg'
import { getAllInSituAlerts } from '../../../store/insitu/action'
import { Img } from 'react-image'
import { withTranslation } from 'react-i18next'
import PropTypes from 'prop-types';

const PhotoBar = ({t}) => {
  
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
  }, [allPhotos])

  return (
    <div className="">
      <Container fluid className="flex-stretch align-content-center flex-wrap">
        {!isLoaded ? <Card><h1>Loading...</h1></Card> : null}
        <Card>
          <p className="align-self-baseline alert-title">{t('in-situ-cameras')}</p>
          <Row xs={1} sm={2} md={3} lg={4}>
            {!photoList 
              ? photoNumbers.map((photo, index)=> {
                return(
                  <div key={`photoy_${index}`} className="p-3 my-3">
                    <Placeholder width="100%" height="120px"/>
                  </div>
                )})
              : 
              photoList.slice(0,8).map(photo => {
                return(
                  <div key={`photie_${photo.id}`} className="p-3 my-3">    
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

PhotoBar.propTypes = {
  t: PropTypes.func
}

export default withTranslation(['common'])(PhotoBar);
