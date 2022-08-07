import { PrimaryButton } from '../../../../components/';
import { CustomInput } from '../../../../components/';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../../../constants/colors';
import { DEVICE_WIDTH, SPACING } from '../../../../constants/size';
import React, { useCallback, useState } from 'react';
import { DeviceEventEmitter, StyleSheet, View, Linking, Platform } from 'react-native';
import { scale } from '../../../../utils/responsive';
import AddImage from '../../../../screens/support/components/add_image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { createFAQSupportHandler } from '../../../../redux/actions/faq';
import { RequestType } from '../../../../global/request_type';
import { WithLoading } from '../../../../components/';
import { FAQ } from '../../../../redux/actionsType';
import { getShowAlertError } from '../../../../redux/actions/system';
import { CREATE_FAQ_SUPPORT_SUCCESSFULLY } from '../../../../constants/success';
import { CALL_API_ERROR } from '../../../../constants/errors';
import InputExtend from '../../../../screens/support/components/input_extend';
import { isIphoneX } from '../../../../helpers/device';
const widthImage = DEVICE_WIDTH / 2 - SPACING.Medium - scale(6);
const MemberSupport = ({ navigation, images = [], onRemoveImage, addImage }) => {
  const [requestType, setRequestType] = useState('Application');
  const [content, setContent] = useState('');

  // const onPressAddImage = result => {
  //   const newData = images.concat(result);
  //   setImages(newData);
  // };
  // const openTopenId = React.useCallback(async () => {
  //   try {
  //     const url = AppConfigs.TOPENID_ACCOUNT;
  //     if (await InAppBrowser.isAvailable()) {
  //       if (Platform.OS === 'ios') {
  //         const res = await InAppBrowser.openAuth(url, 'topenfintech:/oauth2callback', {});
  //         dispatch(getTopenIDProfileHandle());
  //         return;
  //       }

  //       const res = await InAppBrowser.open(url, {
  //         // iOS Properties
  //         dismissButtonStyle: 'cancel',
  //         readerMode: false,
  //         animated: true,
  //         modalPresentationStyle: 'fullScreen',
  //         modalTransitionStyle: 'coverVertical',
  //         modalEnabled: true,
  //         enableBarCollapsing: false,
  //         // Android Properties
  //         showTitle: true,
  //         secondaryToolbarColor: 'black',
  //         navigationBarColor: 'black',
  //         navigationBarDividerColor: 'white',
  //         enableUrlBarHiding: true,
  //         enableDefaultShare: true,
  //         forceCloseOnRedirection: false
  //       });
  //       dispatch(getTopenIDProfileHandle());
  //     } else {
  //       Linking.openURL(url);
  //     }
  //   } catch (error) {
  //   }
  // }, [dispatch]);

  const dispatch = useDispatch();
  const role = useSelector(state => state.auth.role);
  const memberId = useSelector(state => state.auth.memberId);
  const profile = useSelector(state => state.member.profile);
  const { name, email, phone } = profile || {};
  const onCreateFAQSupport = useCallback(() => {
    /// TODO
    // if (!name) {
    //   return dispatch(
    //     getShowAlertError({
    //       ...CONFIRM_UPDATE_PROFILE,
    //       confirmAction: openTopenId
    //     })
    //   );
    // }
    const imageBase64 = images.map(item => {
      return { image: item?.data };
    });
    dispatch(
      createFAQSupportHandler({
        params: {
          memberId,
          content,
          fullName: name,
          email,
          phoneNumber: phone || '0912345678',
          requesterType: role || 'Member',
          requestType,
          images: imageBase64
        },
        callback: (err, res) => {
          if (!err) {
            dispatch(getShowAlertError(CREATE_FAQ_SUPPORT_SUCCESSFULLY));
            DeviceEventEmitter.emit('CREATE_FAQ_REQUEST');
            navigation.goBack();
          } else {
            dispatch(getShowAlertError(CALL_API_ERROR));
            navigation.goBack();
          }
        }
      })
    );
  }, [
    images,
    dispatch,
    memberId,
    name,
    email,
    phone,
    content,
    requestType,
    role,
    navigation
    // openTopenId
  ]);
  return (
    <>
      <View style={styles.container}>
        <KeyboardAwareScrollView
          extraHeight={80}
          keyboardOpeningTime={-1}
          enableResetScrollToCoords={false}
          style={styles.contentContainer}
          bounces={false}
          showsVerticalScrollIndicator={false}>
          <CustomInput
            required
            translate
            translateTitle
            title={'support.content_needs_support'}
            type={'select'}
            placeholder={'support.select_content_to_support'}
            value={requestType}
            onChangeText={value => {
              setRequestType(value);
            }}
            selectOptions={RequestType}
            translateValue
          />
          <InputExtend value={content} onChangeValue={setContent} />
          <AddImage
            addImage={addImage}
            images={images}
            style={styles.imageContainer}
            onRemoveImage={onRemoveImage}
            imageStyle={{ width: widthImage, height: widthImage / 1.36 }}
          />
        </KeyboardAwareScrollView>
        <View style={styles.footer}>
          <View style={styles.flex}>
            <PrimaryButton
              translate
              onPress={onCreateFAQSupport}
              title={'support.send_require'}
              style={styles.button}
              titleStyle={styles.whiteTitle}
              //disabledText={styles.disabledText}
              //backgroundColorDisabled={BACKGROUND_COLOR.Silver}
              disabled={!content || !requestType || content.length > 256}
            />
          </View>
        </View>
      </View>
    </>
  );
};

export default WithLoading(React.memo(MemberSupport), [FAQ.CREATE_FAQ_SUPPORT.HANDLER]);

const styles = StyleSheet.create({
  container: {
    backgroundColor: CUSTOM_COLOR.White,
    flex: 1,
    paddingVertical: SPACING.Medium
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: SPACING.Medium
  },
  footer: {
    padding: SPACING.Medium,
    paddingBottom: isIphoneX ? 0 : SPACING.Medium,
    borderTopWidth: 1,
    borderColor: CUSTOM_COLOR.GalleryDark,
    backgroundColor: BACKGROUND_COLOR.White,
    marginTop: SPACING.Normal,
    flexDirection: 'row'
  },
  flex: {
    flex: 1
  },
  imageContainer: {
    marginTop: SPACING.Medium
  }
});
