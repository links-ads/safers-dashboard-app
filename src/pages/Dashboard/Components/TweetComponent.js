import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import SimpleBar from 'simplebar-react'

export default function TweetComponent({
  tweetID,
}) {
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
        }
      ).then(() => {
        setIsLoading(false);
      });
    }
  }, [tweetID]);

  return (
    <SimpleBar style={{ maxHeight: '300px', margin: '5px' }}>
      <div className="w-full animate-fadeIn twitter-component" id={tweetID}>
        {isLoading && <p>LOADING .....</p>}
      </div>
    </SimpleBar>
  );
}

TweetComponent.propTypes = {
  tweetID: PropTypes.string,
}

// twttr.widgets.createTweet:
// https://developer.twitter.com/en/docs/twitter-for-websites/embedded-tweets/guides/embedded-tweet-javascript-factory-function

// Embedded Tweet parameter reference
// https://developer.twitter.com/en/docs/twitter-for-websites/embedded-tweets/guides/embedded-tweet-parameter-reference
