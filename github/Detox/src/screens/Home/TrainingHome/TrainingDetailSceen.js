import React, {useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import WebView from 'react-native-webview';

import {getPageUrlTraning} from '../../../api/userApi/staticPagesApi';
import {USER_AGENT} from '../../../assets/constants';
import PageScreen from '../../../components/PageScreen';
import {getConfigs} from '../../../configs';
import {NOT_ALLOW_FONT_SCALE} from '../../../utils/avoidFontScale';
import {SCREEN_SIZE} from '../../../utils/ImageUtil';

const TrainingDetailSceen = ({route}) => {
  const {id, slug, title = ''} = route?.params || {};
  const urlPage = getPageUrlTraning({
    id: id,
    slug: slug,
  });
  const source = {
    uri: `${urlPage}?=0&autoplay=0&showinfo=0&controls=0&fullscreen=1&playsinline=0`,
    headers: {
      Cookie: getConfigs().COOKIE,
    },
  };

  const [webHeight, setWebHeight] = useState(SCREEN_SIZE.HEIGHT);
  return (
    <PageScreen title={title}>
      <ScrollView onLayout={e => setWebHeight(e.nativeEvent.layout.height)}>
        <WebView
          {...NOT_ALLOW_FONT_SCALE}
          allowsInlineMediaPlayback={true}
          allowsFullscreenVideo={false}
          source={source}
          userAgent={USER_AGENT}
          style={styles.webview(webHeight)}
        />
      </ScrollView>
    </PageScreen>
  );
};

const styles = StyleSheet.create({
  webview: height => ({
    width: '100%',
    height,
    opacity: 0.99,
  }),
});

export default TrainingDetailSceen;
