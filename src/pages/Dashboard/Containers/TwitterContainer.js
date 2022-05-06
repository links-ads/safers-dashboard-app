import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Card, Row, Col } from 'reactstrap';
import TweetComponent from '../../../components/TweetComponent';
import PaginationWrapper from '../../../components/Pagination';

//i18n
import { withTranslation } from 'react-i18next'

const TwitterContainer = ({t, i18n}) => {
  const tweets = useSelector(state => state.dashboard.tweets);
  const [pageData, setPageData] = useState([]);
  const [localLang, setLocalLang] = useState('en');
  useEffect(() => {

    if(localLang != i18n.language){
      setLocalLang(i18n.language)
    }

  }, [i18n, i18n.language]);

  return (
    <>
      <Col  className='d-flex'>
        <Card className='card-weather' >
          <Row className='mb-2'>
            <span className='weather-text'>{t('Latest Tweets')}</span>
          </Row>
          <Row>
            {pageData.map((tweet, index) => {
              return( 
                <Col key={index} md={6} lg={4} xs={12}>
                  {localLang == i18n.language && <TweetComponent tweetID={tweet.tweetID} />}
                </Col>
              )
            })}
          </Row>
          <Row>
            <Col className='pt-3 text-center'>
              <PaginationWrapper pageSize={6} list={tweets} setPageData={setPageData} />
            </Col>
          </Row>
        </Card>
      </Col>
    </>     
  );
}

TwitterContainer.propTypes = {
  t: PropTypes.any,
  i18n: PropTypes.any
}

export default withTranslation(['dashboard'])(TwitterContainer);
