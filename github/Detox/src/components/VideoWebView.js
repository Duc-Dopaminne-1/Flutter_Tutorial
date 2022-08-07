import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {StyleSheet, ViewPropTypes} from 'react-native';
import WebView from 'react-native-webview';

import {METRICS} from '../assets/theme/metric';

const styles = StyleSheet.create({
  webView: {
    flex: 1,
    ...METRICS.horizontalMargin,
  },
});

const PREFIX_YOU_TUBE_LINK = 'https://www.youtube.com';

const isYouTubeVideoLink = url => {
  return url && url.startsWith(PREFIX_YOU_TUBE_LINK);
};

const embedYouTubeVideoUrl = url => {
  if (isYouTubeVideoLink(url) && url.includes('watch?v=')) {
    return url.replace('watch?v=', 'embed/');
  } else {
    return url;
  }
};

const videoHtmlContent = videoUrl => {
  let displayContent = '';
  if (videoUrl) {
    if (videoUrl.startsWith(PREFIX_YOU_TUBE_LINK)) {
      //You tube video link
      const embedVideoUrl = embedYouTubeVideoUrl(videoUrl);
      displayContent = `<iframe width="100%" height="100%" src="${embedVideoUrl}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen> </iframe>`;
    } else {
      //other video link
      displayContent = `
      <video controls="true"  preload="metadata" class="embed-responsive-item">
      <source src="${videoUrl}" />
      </video>`;
    }
  }

  return `<!doctype html>
    <html lang="en">
      <head>
        <!-- Required meta tags -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <!-- Bootstrap CSS -->
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
      </head>
      <body>
      <div class="embed-responsive embed-responsive-16by9">
      ${displayContent}
      </div>
        <!-- Optional JavaScript -->
        <!-- jQuery first, then Popper.js, then Bootstrap JS -->
        <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
      </body>
    </html>`;
};

const VideoWebView = ({url}) => {
  const [htmlContent, setHtmlContent] = useState('');
  useEffect(() => {
    const content = videoHtmlContent(url);
    setHtmlContent(content);
  }, [url]);

  return <WebView style={styles.webView} originWhitelist={['*']} source={{html: htmlContent}} />;
};

VideoWebView.propTypes = {
  style: ViewPropTypes.style,
  url: PropTypes.string,
};

export default VideoWebView;
export {isYouTubeVideoLink};
