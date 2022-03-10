import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'

export default function Tweet({
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
          dnt: true,
          theme: 'dark',
        }
      ).then(() => setIsLoading(false));
    }
  }, [tweetID]);

  return (
    <div className="w-full animate-fadeIn" id={tweetID}>
      {isLoading && <p>LOADING</p>}
    </div>
  );
}

Tweet.propTypes = {
  tweetID: PropTypes.string,
}

// twttr.widgets.createTweet:
// https://developer.twitter.com/en/docs/twitter-for-websites/embedded-tweets/guides/embedded-tweet-javascript-factory-function

// Embedded Tweet parameter reference
// https://developer.twitter.com/en/docs/twitter-for-websites/embedded-tweets/guides/embedded-tweet-parameter-reference