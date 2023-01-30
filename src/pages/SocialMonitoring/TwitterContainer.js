import React, { useState, useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Card, Row, Col } from 'reactstrap';

import PaginationWrapper from '../../components/Pagination';
import TweetComponent from '../../components/TweetComponent';

//i18n

const TwitterContainer = () => {
  const tweets = useSelector(state => state.dashboard.tweets);
  const [pageData, setPageData] = useState([]);
  const [localLang, setLocalLang] = useState('en');
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (localLang !== i18n.language) {
      setLocalLang(i18n.language);
    }
  }, [i18n, i18n.language, localLang]);

  return (
    <>
      <Col className="d-flex">
        <Card className="card-weather">
          <Row className="mb-2">
            <span className="weather-text">
              {t('Latest Tweets', { ns: 'common' })}
            </span>
          </Row>
          <Row>
            {pageData.map(tweet => {
              return (
                <Col key={tweet} md={6} lg={4} xs={12}>
                  {localLang === i18n.language && (
                    <TweetComponent tweetID={tweet.tweetID} />
                  )}
                </Col>
              );
            })}
          </Row>
          <Row>
            <Col className="pt-3 text-center">
              <PaginationWrapper
                pageSize={9}
                list={tweets}
                setPageData={setPageData}
              />
            </Col>
          </Row>
        </Card>
      </Col>
    </>
  );
};

export default TwitterContainer;
