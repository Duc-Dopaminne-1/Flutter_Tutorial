import {
  closeFAQRequestHandle,
  feedbackToOperatorHandle,
  getFAQSupportDetailHandle
} from '../../../redux/actions/faq';
import { getShowAlertError } from '../../../redux/actions/system';
import { FAQ } from '../../../redux/actionsType';
import { ICAddImgSupport } from '../../../assets/icons';
import { CustomBadge, PrimaryButton, SecondaryButton, WithLoading } from '../../../components/';
import AppText from '../../../components/app_text';
import CustomHeader from '../../../components/custom_header';
import Divider from '../../../components/divider';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../../constants/colors';
import { CALL_API_ERROR } from '../../../constants/errors';
import SCREENS_NAME from '../../../constants/screens';
import { BORDER_RADIUS, BOTTOM_TAB_HEIGHT, SPACING } from '../../../constants/size';
import { Shadow } from '../../../constants/stylesCSS';
import { RESPONSE_REQUEST_SUCCESSFULLY } from '../../../constants/success';
import { CLOSE_REQUEST_SUCCESS, CONFIRM_CLOSE_REQUEST } from '../../../constants/warnings';
import showToast from '../../../helpers/showToast';
import __ from 'lodash';
import React, { useCallback, useEffect, useMemo, useState, useContext } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import { getLoadingSelector } from '../../../redux/selectors/loading';
import { FAQSupportStatus } from '../../../global/faq_support_status';
import { scale } from '../../../utils/responsive';
import AddImage from '../components/add_image';
import InputExtend from '../components/input_extend';
import themeContext from '../../../constants/theme/themeContext';
import { emitEvent } from '../../../utils/eventEmit';
import { SDK_EVENT_NAME } from '../../../global/app';
import { validateImageUrl } from '../../../helpers/validate';

const ResponseItem = React.memo(({ item, onViewFile, title, topenResponseColor, theme }) => {
  const { content, images, date, memberId } = item || {};
  const _title = useMemo(() => {
    return title ? title : memberId ? 'support.member_response' : 'support.topen_response';
  }, [memberId, title]);
  const _titleStyle = useMemo(() => {
    return [
      [styles.responseTitle, { color: topenResponseColor }],
      (title || memberId) && { color: topenResponseColor }
    ];
  }, [memberId, title, topenResponseColor]);
  const validImages = images?.filter(img => validateImageUrl(img.url)) || [];
  return (
    <View style={styles.supportInfo}>
      <AppText translate semiBold style={_titleStyle}>
        {_title}
      </AppText>
      <Text
        style={[
          styles.responseContent,
          { color: theme?.text?.primary, fontFamily: theme?.fonts?.MEDIUM }
        ]}>
        {content}
      </Text>
      {validImages?.length !== 0 && (
        <AppText translate style={[styles.title, { marginTop: SPACING.Medium }]}>
          {'support.file'}
        </AppText>
      )}
      {validImages?.map((image, index) => (
        <>
          <TouchableOpacity
            style={styles.fileInfo}
            key={index.toString()}
            onPress={() => onViewFile(image, index)}>
            <ICAddImgSupport color1={theme?.icon?.color1} />
            <View style={styles.imgInfo}>
              <Text
                style={[
                  styles.imgName,
                  { color: theme?.text?.primary, fontFamily: theme?.fonts?.SEMIBOLD }
                ]}
                numberOfLines={1}>
                {image?.name}
              </Text>
              <Text style={[styles.size, { color: theme?.text?.secondary }]}>{image?.size}</Text>
            </View>
          </TouchableOpacity>
        </>
      ))}
      <AppText style={[styles.date, { color: theme?.text?.secondary }]}>{date}</AppText>
    </View>
  );
});

const SupportDetailScreen = props => {
  const theme = useContext(themeContext);
  const { route } = props;
  const { item } = route.params || {};
  const [supportId, setSupportId] = useState(item?.id || 0);
  const { id } = item || {};
  const dispatch = useDispatch();
  const loading = useSelector(state =>
    getLoadingSelector(state, [FAQ.GET_FAQ_SUPPORT_DETAIL.HANDLER])
  );
  const detail = useSelector(state => state.faq.faqSupportDetail);
  const {
    status,
    requestType,
    content,
    date,
    images,
    supporDetail = [],
    memberId,
    lastModify
  } = detail || {};
  const [imagesAdd, setImagesAdd] = useState([]);
  const [contentAdd, setContentAdd] = useState('');

  const stylePrimaryText = {
    color: theme?.text?.primary,
    fontFamily: theme?.fonts?.SEMIBOLD
  };

  React.useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      const _addImageFromPicker = props.route.params.addImageFromPicker || [];
      const _addImageFromSnap = props.route.params.photoAdded || {};

      if (_addImageFromSnap.sourceURL || _addImageFromSnap.path) {
        const data = [...imagesAdd, _addImageFromSnap];
        const newData = __.uniqBy(data, e => e.sourceURL || e.path);
        setImagesAdd(newData);
      }

      if (_addImageFromPicker.length > 0) {
        const data = [...imagesAdd, ..._addImageFromPicker];
        const newData = __.uniqBy(data, e => e.sourceURL || e.path);
        setImagesAdd(newData);
      }
    });

    return unsubscribe;
  }, [props.route.params, imagesAdd, props.navigation]);

  const addImage = useCallback(() => {
    props.navigation.navigate(SCREENS_NAME.CAMERA_CREATE_QUESTION, {
      base64: true,
      screenName: SCREENS_NAME.SUPPORT_DETAIL_SCREEN
    });
  }, [props.navigation]);

  const onRemoveImage = useCallback(image => {
    setImagesAdd([...image]);
  }, []);

  const onChangeContent = useCallback(text => {
    setContentAdd(text);
  }, []);

  const onFetch = useCallback(() => {
    dispatch(
      getFAQSupportDetailHandle({
        params: supportId
      })
    );
  }, [dispatch, supportId]);

  useEffect(() => {
    onFetch();
  }, []);

  const onViewFile = useCallback(
    (_item, index) => {
      showToast();
      let dirs = RNFetchBlob.fs.dirs;
      const dirToSave = Platform.OS === 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
      let path = dirToSave + '/' + _item?.name;
      const encodedUri = encodeURI(_item?.url);
      RNFetchBlob.config({
        // response data will be saved to this path if it has access right.
        fileCache: false,
        path: path,
        appendExt: _item?.type?.toUpperCase(),
        title: _item?.name,
        addAndroidDownloads: {
          path: path,
          useDownloadManager: true, // <-- this is the only thing required
          // Optional, override notification setting (default to true)
          notification: true,
          // Optional, but recommended since android DownloadManager will fail when
          mime: 'image/' + _item?.type,
          title: _item?.name,
          description: 'File downloaded by download manager.',
          mediaScannable: true
        }
      })
        .fetch('GET', encodedUri)
        .then(res => {
          Platform.OS === 'ios'
            ? RNFetchBlob.ios.openDocument(res.path())
            : RNFetchBlob.android.actionViewIntent(res.path(), 'image/png');
        })
        .catch(() => {
          dispatch(getShowAlertError(CALL_API_ERROR));
        });
    },
    [dispatch]
  );

  const onPressSubmit = useCallback(() => {
    const imageBase64 = imagesAdd.map(img => {
      return { image: img?.data };
    });
    dispatch(
      feedbackToOperatorHandle({
        params: {
          supportId: supportId,
          memberId,
          content: contentAdd,
          images: imageBase64
        },
        callback: (err, res) => {
          if (!err) {
            dispatch(getShowAlertError(RESPONSE_REQUEST_SUCCESSFULLY));
            onFetch();
          } else {
            dispatch(getShowAlertError(CALL_API_ERROR));
          }
        }
      })
    );
  }, [dispatch, supportId, contentAdd, imagesAdd, memberId, onFetch]);

  const onPressCloseRequest = useCallback(() => {
    dispatch(
      getShowAlertError({
        ...CONFIRM_CLOSE_REQUEST,
        confirmAction: () => {
          dispatch(
            closeFAQRequestHandle({
              params: {
                cmsFAQSupportId: supportId,
                memberId
              },
              callback: (err, res) => {
                if (!err) {
                  onFetch();
                  const eventData = { ...detail, status: 'Closed' };
                  emitEvent({ event_name: SDK_EVENT_NAME.SUPPORT_UPDATE, data: eventData });
                  dispatch(getShowAlertError(CLOSE_REQUEST_SUCCESS));
                }
              }
            })
          );
        }
      })
    );
  }, [dispatch, supportId, memberId, onFetch]);

  const statusSection = useMemo(() => {
    switch (status) {
      case FAQSupportStatus.PROCESSING.code:
        return (
          <View style={styles.statusContainer}>
            <Text style={[styles.name, stylePrimaryText]} numberOfLines={2}>
              {content}
            </Text>
            <CustomBadge status={'warning'} value={FAQSupportStatus.PROCESSING.displayName} />
          </View>
        );

      case FAQSupportStatus.WAIT_FOR_RESPONSE.code:
        return (
          <View style={styles.statusContainer}>
            <Text style={[styles.name, stylePrimaryText]} numberOfLines={2}>
              {content}
            </Text>
            <CustomBadge
              status={'warning'}
              value={FAQSupportStatus.WAIT_FOR_RESPONSE.displayName}
            />
          </View>
        );
      case FAQSupportStatus.RESPONSED.code:
        return (
          <View style={styles.statusContainer}>
            <Text style={[styles.name, stylePrimaryText]} numberOfLines={2}>
              {content}
            </Text>
            <CustomBadge status={'warning'} value={FAQSupportStatus.PROCESSING.displayName} />
          </View>
        );
      case FAQSupportStatus.CLOSED.code:
        return (
          <View style={styles.statusContainer}>
            <Text style={[styles.name, stylePrimaryText]} numberOfLines={2}>
              {content}
            </Text>
            <CustomBadge status={'success'} value={FAQSupportStatus.CLOSED.displayName} />
          </View>
        );

      default:
        return <View />;
    }
  }, [status, content]);

  const renderProcessingBottom = useCallback(
    () => (
      <View style={styles.footer}>
        <View style={styles.flex}>
          <PrimaryButton
            translate
            onPress={onPressCloseRequest}
            title={'common.confirm_close_request_title'}
            style={styles.button}
            titleStyle={styles.whiteTitle}
            //disabledText={styles.disabledText}
            //backgroundColorDisabled={BACKGROUND_COLOR.Silver}
          />
        </View>
      </View>
    ),
    [onPressCloseRequest]
  );

  const footerSection = useMemo(() => {
    switch (status) {
      case FAQSupportStatus.PROCESSING.code:
        return renderProcessingBottom();
      case FAQSupportStatus.RESPONSED.code:
        return renderProcessingBottom();
      case FAQSupportStatus.WAIT_FOR_RESPONSE.code:
        return (
          <View style={styles.footer}>
            <View style={[styles.flex, { marginRight: scale(15) }]}>
              <SecondaryButton
                translate
                title={'common.confirm_close_request_title'}
                //style={styles.button}
                //titleStyle={styles.backTitle}
                onPress={onPressCloseRequest}
                //backgroundColorDisabled={BACKGROUND_COLOR.Silver}
              />
            </View>
            <View style={styles.flex}>
              <PrimaryButton
                translate
                title={'common.send_feedback'}
                style={styles.button}
                titleStyle={styles.whiteTitle}
                //disabledText={styles.disabledText}
                onPress={onPressSubmit}
                //backgroundColorDisabled={BACKGROUND_COLOR.Silver}
                disabled={!contentAdd || contentAdd.length > 256}
              />
            </View>
          </View>
        );
      default:
        return;
    }
  }, [status, contentAdd, onPressSubmit, onPressCloseRequest, renderProcessingBottom]);

  return (
    <SafeAreaView
      forceInset={{ bottom: 'never' }}
      edges={['left', 'right']}
      style={styles.container}>
      {loading ? (
        <ActivityIndicator style={styles.loading} />
      ) : (
        <>
          <KeyboardAwareScrollView
            extraHeight={80}
            keyboardOpeningTime={-1}
            enableResetScrollToCoords={false}
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
            bounces={false}>
            <View style={[styles.supportInfo, styles.supportInfoNoPadding]}>
              {statusSection}
              <Divider style={styles.divider} />
              <View style={styles.subContainer}>
                <AppText translate style={styles.title}>
                  {'common.request_type'}
                </AppText>
                <AppText translate semiBold style={styles.subHead}>
                  {requestType}
                </AppText>
              </View>
              <View style={styles.subContainer}>
                <AppText translate style={styles.title}>
                  {'common.request_code'}
                </AppText>
                <Text style={[styles.subHead, stylePrimaryText]}>{supportId}</Text>
              </View>
              {status === FAQSupportStatus.CLOSED && (
                <View style={styles.subContainer}>
                  <AppText translate style={styles.title}>
                    {'support.last_modify'}
                  </AppText>
                  <Text style={[styles.subHead, stylePrimaryText]}>{lastModify}</Text>
                </View>
              )}
            </View>
            <ResponseItem
              topenResponseColor={theme.app.primaryColor1}
              title={'support.content'}
              item={{
                content,
                images,
                date
              }}
              onViewFile={onViewFile}
              theme={theme}
            />
            {supporDetail.map((_item, index) => (
              <ResponseItem
                topenResponseColor={theme.app.primaryColor1}
                key={(_item?.id || index).toString()}
                item={_item}
                onViewFile={onViewFile}
                theme={theme}
              />
            ))}
            {status === FAQSupportStatus.WAIT_FOR_RESPONSE.code && (
              <View style={[styles.supportInfo, { marginBottom: BOTTOM_TAB_HEIGHT }]}>
                <AppText translate style={[styles.responseTitle, { marginBottom: 0 }]}>
                  {'support.continue_support'}
                </AppText>
                <InputExtend value={contentAdd} onChangeValue={onChangeContent} />
                <AddImage
                  images={imagesAdd}
                  addImage={addImage}
                  style={styles.imageAddContainer}
                  imageStyle={styles.imageAdd}
                  icCloseStyle={styles.icClose}
                  onRemoveImage={onRemoveImage}
                />
              </View>
            )}
          </KeyboardAwareScrollView>
          {footerSection}
        </>
      )}
    </SafeAreaView>
  );
};

export default WithLoading(SupportDetailScreen, [
  FAQ.FEEDBACK_TO_OPERATOR.HANDLER,
  FAQ.CLOSE_REQUEST.HANDLER
]);

const styles = StyleSheet.create({
  imageAddContainer: {
    marginTop: SPACING.Medium
  },
  imageAdd: {
    height: scale(90, false),
    width: scale(90),
    borderRadius: BORDER_RADIUS,
    marginRight: scale(16),
    marginTop: scale(12)
  },
  responseTitle: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText,
    marginBottom: SPACING.Normal
  },
  responseMemberTitle: {
    color: CUSTOM_COLOR.Orange
  },
  responseContent: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText
  },
  imgInfo: {
    flex: 1,
    marginLeft: scale(12)
  },
  bottomImgTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between'
  },
  imgName: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText
  },
  divider: {
    marginTop: SPACING.Medium
  },
  supportInfo: {
    ...Shadow,
    borderRadius: BORDER_RADIUS,
    backgroundColor: CUSTOM_COLOR.White,
    padding: SPACING.Medium,
    marginBottom: SPACING.Medium
  },
  supportInfoNoPadding: {
    paddingHorizontal: 0
  },
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR.Primary
  },
  scrollView: {
    padding: SPACING.Medium,
    flex: 1
  },
  contentContainer: {
    paddingBottom: SPACING.Medium
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.Medium
  },
  name: {
    fontSize: FONT_SIZE.Heading,
    lineHeight: LINE_HEIGHT.Heading,
    color: CUSTOM_COLOR.BlueStone,
    flex: 1,
    paddingRight: SPACING.Medium
  },
  subContainer: {
    marginTop: SPACING.Medium,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.Medium
  },
  title: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead
  },
  subHead: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    marginTop: SPACING.Small,
    textAlign: 'justify'
  },
  bodyText: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText,
    marginTop: SPACING.Small
  },
  file: {
    flexDirection: 'row',
    marginVertical: SPACING.Small,
    alignItems: 'center'
  },
  fileInfo: {
    flexDirection: 'row',
    paddingTop: scale(8)
  },
  size: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    marginTop: SPACING.Small
  },
  date: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    marginTop: SPACING.XNormal,
    alignSelf: 'flex-end'
  },
  footer: {
    paddingHorizontal: scale(16),
    paddingBottom: SPACING.Small,
    paddingTop: scale(16),
    backgroundColor: BACKGROUND_COLOR.White,
    marginTop: SPACING.Normal,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: CUSTOM_COLOR.GalleryDark
  },
  flex: {
    flex: 1
  },
  backTitle: {
    color: CUSTOM_COLOR.Orange
  },
  loading: {
    marginTop: SPACING.Medium
  },
  icClose: {
    top: scale(15),
    right: scale(20)
  },
  imgLoading: {
    alignSelf: 'flex-start',
    marginLeft: scale(12),
    marginVertical: scale(4)
  }
});
