import IframeRenderer, {iframeModel} from '@native-html/iframe-plugin';
import React from 'react';
import {View} from 'react-native';
import RenderHTML from 'react-native-render-html';
import WebView from 'react-native-webview';

import {SIZES} from '../../../../assets/constants/sizes';
import styles from './styles';

const CONTENT_WIDTH = SIZES.SCREEN_WIDTH - SIZES.PADDING_16 * 2;

const tagsStyles = {
  p: {
    margin: SIZES.MARGIN_0,
    paddingLeft: SIZES.MARGIN_0,
    paddingTop: SIZES.PADDING_6,
    paddingRight: SIZES.MARGIN_0,
    paddingBottom: SIZES.PADDING_6,
    fontSize: SIZES.FONT_16,
    lineHeight: SIZES.FONT_16_LINE_HEIGHT,
  },
  b: {
    fontSize: SIZES.FONT_16,
    fontWeight: 'bold',
  },
  img: {
    width: CONTENT_WIDTH,
  },
  iframe: {
    marginRight: 10,
  },
};

const renderers = {
  iframe: IframeRenderer,
};

const customHTMLElementModels = {
  iframe: iframeModel,
};

type ArticleContentProps = {
  content: string,
};

const ArticleContent = ({content}: ArticleContentProps) => {
  if (!content) return <></>;
  const source = {
    html: `${content}`,
  };

  return (
    <View style={styles.contentContainer}>
      <RenderHTML
        contentWidth={CONTENT_WIDTH - SIZES.PADDING_4}
        renderers={renderers}
        source={source}
        tagsStyles={tagsStyles}
        customHTMLElementModels={customHTMLElementModels}
        WebView={WebView}
        renderersProps={{
          iframe: {
            scalesPageToFit: true,
          },
        }}
      />
    </View>
  );
};

export default React.memo(ArticleContent);
