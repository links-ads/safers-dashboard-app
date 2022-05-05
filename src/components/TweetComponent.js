import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SimpleBar from 'simplebar-react'
import Loader from './Loader'

//i18n
import { withTranslation } from 'react-i18next'

const TweetComponent = ({
  tweetID,
  i18n
}) => {
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    if ((window).twttr) {
      (window ).twttr.widgets.createTweet(
        tweetID,
        document.getElementById(tweetID),
        {
          align: 'center',
          conversation: 'none',
          cards: 'vivible',
          dnt: true,
          theme: 'dark',
          lang: i18n.language
        }
      ).then(() => {
        setIsLoading(false);
      });
    }

  }, [tweetID, i18n,i18n.language]);



  return (
    <SimpleBar style={{ maxHeight: '300px', margin: '5px' }}>
      <div className="w-full animate-fadeIn twitter-component" id={tweetID}><Loader show={isLoading} msg="Loading.." /></div>
    </SimpleBar>
  );
}

TweetComponent.propTypes = {
  tweetID: PropTypes.string,
  i18n: PropTypes.object,
}

export default withTranslation()(TweetComponent);

// twttr.widgets.createTweet:
// https://developer.twitter.com/en/docs/twitter-for-websites/embedded-tweets/guides/embedded-tweet-javascript-factory-function

// Embedded Tweet parameter reference
// https://developer.twitter.com/en/docs/twitter-for-websites/embedded-tweets/guides/embedded-tweet-parameter-reference
