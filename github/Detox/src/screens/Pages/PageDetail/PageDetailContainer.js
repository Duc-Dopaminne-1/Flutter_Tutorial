import CookieManager from '@react-native-cookies/cookies';
import {useNavigation} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {
  Image,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import WebView from 'react-native-webview';

import {COMMENT_OBJECT_TYPES, USER_AGENT} from '../../../assets/constants';
import {IMAGES} from '../../../assets/images';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {normal, small} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import {SocialFollowButton} from '../../../components/Button/SocialFollowButton';
import CenterText from '../../../components/CenterText';
import PageScreen from '../../../components/PageScreen';
import {ShareIcon} from '../../../components/ShareIcon';
import {getConfigs} from '../../../configs';
import {useShare} from '../../../hooks/useShare';
import {NOT_ALLOW_FONT_SCALE} from '../../../utils/avoidFontScale';
import HTMLEntities, {sanitizeHtmlText} from '../../../utils/HTMLEntities';
import {SCREEN_SIZE} from '../../../utils/ImageUtil';
import {dateToString} from '../../../utils/TimerCommon';
import {useMount} from '../../commonHooks';
import ScreenIds from '../../ScreenIds';
import PageDetailHotNews from './PageDetailHotNews';

const getHtmlContent = (contentData, backgroundColor = COLORS.BACKGROUND, noMargin = false) => {
  const bodyStyles = `background-color:${backgroundColor};${noMargin ? 'margin: 0 auto;' : ''}`;
  const htmlContent = `<html>
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, shrink-to-fit=no">

  </head>
  <body style="${bodyStyles}">
  ${contentData}
  </body>
</html>`;
  return htmlContent;
};

const getImageTag = imageUrl => {
  if (!imageUrl) {
    return '';
  }

  const imageTag = `<p><img src=\"${imageUrl}\"/></p>`;
  return imageTag;
};

const customStyle = '<style>* {max-width: 100%;} </style>';
const javascriptDisableSelection = "document.documentElement.style.webkitUserSelect='none';";
const javascriptDisableCallout = "document.documentElement.style.webkitTouchCallout='none';";
const webViewScript = `
  setTimeout(function() {
    window.ReactNativeWebView.postMessage(document.documentElement.scrollHeight);
  }, 300);
    true;
  `;
const javaScriptInjectDisableZoomString =
  javascriptDisableSelection + javascriptDisableCallout + webViewScript;

const autoplayParams = '?=0&autoplay=0&showinfo=0&controls=0&fullscreen=1&playsinline=0';

const PageDetailContainer = props => {
  const {
    detail,
    isShowDate,
    showSocialComment = true,
    title = '',
    isLoading,
    isShowPreview,
    isSubmenu = false,
    autoPlay = false,
    hotNews = [],
    noMarginContent = false,
    onPressHotNewsItem = () => {},
    emptyCommentMessage = null,
    showHotNews = false,
  } = props;
  const navigation = useNavigation();
  const previewImageUrl = detail?.previewImageUrl || detail?.imageUrl || '';
  const sanitizedText = sanitizeHtmlText(detail?.body || '');
  const previewImageTag = isShowPreview ? getImageTag(previewImageUrl) : '';
  const htmlContentCustomStyle = `${customStyle}${previewImageTag}${sanitizedText}`;
  const htmlContent = getHtmlContent(htmlContentCustomStyle, COLORS.NEUTRAL_WHITE, noMarginContent);
  const [webHeight, setWebheight] = useState(SCREEN_SIZE.HEIGHT);
  const [loading, setLoading] = useState(false);
  const commentRef = useRef(null);

  useMount(() => {
    if (Platform.OS === 'android' && isSubmenu) {
      CookieManager.setFromResponse(detail, getConfigs().COOKIE);
    }
  });

  const source = isSubmenu
    ? {
        uri: `${detail}${autoPlay ? autoplayParams : ''}`,
        headers: {
          Cookie: getConfigs().COOKIE,
        },
      }
    : {html: htmlContent || '<html></html>'};
  const containerStyle = isSubmenu
    ? styles.container
    : [styles.container, {paddingHorizontal: normal}];

  const onRefreshData = () => {
    commentRef?.current?.refreshComment();
    setLoading(false);
  };

  return (
    <PageScreen
      rightComponent={
        <PageDetailRightComponent
          navigation={navigation}
          showSocialComment={showSocialComment}
          detail={detail}
          objectTitle={props?.title}
          objectId={detail?.id}
          feedObjectTypeId={COMMENT_OBJECT_TYPES.NEWS}
          customEmptyMessage={emptyCommentMessage}
          followVisible={false}
        />
      }
      title={title}>
      {detail ? (
        <View style={containerStyle}>
          {!isSubmenu && <Text style={styles.name}>{HTMLEntities.decode(detail.title)}</Text>}
          {isShowDate && <Text style={styles.date}>{dateToString(detail.createdDatetime)}</Text>}
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefreshData} />}
            enableOnAndroid>
            <WebView
              {...NOT_ALLOW_FONT_SCALE}
              style={[styles.mainContent, {height: webHeight}]}
              scalesPageToFit={false}
              automaticallyAdjustContentInsets={false}
              injectedJavaScript={javaScriptInjectDisableZoomString}
              scrollEnabled={false}
              androidLayerType={'hardware'}
              allowsInlineMediaPlayback={true}
              allowsFullscreenVideo={false}
              javaScriptEnabled={true}
              contentContainerStyle={styles.mainContentContainer}
              useWebKit={true}
              source={source}
              dataDetectorTypes={'all'}
              decodeEntities={false}
              userAgent={USER_AGENT}
              domStorageEnabled={true}
              onMessage={event => {
                setWebheight(parseInt(event.nativeEvent.data, 10));
              }}
            />
            {!!showHotNews && (
              <PageDetailHotNews hotNews={hotNews} onItemPress={onPressHotNewsItem} />
            )}
          </KeyboardAwareScrollView>
        </View>
      ) : (
        <CenterText loading={isLoading} />
      )}
    </PageScreen>
  );
};

const FollowButton = ({title, id}) => {
  if (title && id) {
    return (
      <SocialFollowButton
        feedObjectTypeId={COMMENT_OBJECT_TYPES.NEWS}
        feedObjectTitle={title}
        feedObjectId={id}
      />
    );
  }
  return null;
};

const CommentIcon = ({onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image source={IMAGES.IC_MESSAGE_FILL} />
    </TouchableOpacity>
  );
};

const PageDetailRightComponent = ({
  showSocialComment = false,
  navigation,
  detail,
  followVisible = false,
  objectTitle,
  objectId,
  customEmptyMessage,
}) => {
  const {showShare} = useShare({
    news: {id: detail?.id, slug: detail?.slug},
    message: detail?.title,
    title: detail?.title,
    onAfterShare: () => {},
  });

  const onPressComment = () => {
    navigation.navigate(ScreenIds.CommentDetail, {
      objectTitle: objectTitle,
      objectId: objectId,
      feedObjectTypeId: COMMENT_OBJECT_TYPES.NEWS,
      customEmptyMessage: customEmptyMessage,
      customStyle: styles.commentCustomStyle,
    });
  };

  if (showSocialComment && detail?.id) {
    return (
      <View style={HELPERS.row}>
        {!!followVisible && <FollowButton title={detail?.title} id={detail?.id} />}
        {showSocialComment && <CommentIcon onPress={onPressComment} />}
        <View style={commonStyles.separatorColumn12} />
        <ShareIcon hideLabel onPress={showShare} />
      </View>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  name: {
    fontSize: 20,
    ...FONTS.bold,
    marginBottom: small,
  },
  date: {
    fontSize: 12,
    ...FONTS.regular,
    color: COLORS.TEXT_DARK_40,
  },
  container: {
    flex: 1,
  },
  mainContent: {
    opacity: 0.99,
    marginBottom: normal,
  },
  mainContentContainer: {},
  commentCustomStyle: {
    marginTop: normal,
  },
});

export default PageDetailContainer;
