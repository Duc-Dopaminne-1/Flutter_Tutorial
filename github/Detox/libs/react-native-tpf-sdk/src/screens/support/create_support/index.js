import React, { useCallback, useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import PrimaryButton from '../../../components/primary_button';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../../constants/colors';
import { SPACING } from '../../../constants/size';
import { scale } from '../../../utils/responsive';
import { MEMBER_TYPE } from '../../../global/member_type';
import MemberSupport from './sections/member_support';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CustomInput } from '../../../components/';
import AddImage from '../../../screens/support/components/add_image';
import { RequestType } from '../../../global/request_type';
import { WithLoading } from '../../../components/';
import { FAQ } from '../../../redux/actionsType';
import { useDispatch } from 'react-redux';
import { createFAQSupportHandler } from '../../../redux/actions/faq';
import { getShowAlertError } from '../../../redux/actions/system';
import { CREATE_FAQ_SUPPORT_SUCCESSFULLY } from '../../../constants/success';
import { CALL_API_ERROR } from '../../../constants/errors';
import InputExtend from '../components/input_extend';
import __ from 'lodash';
import SCREENS_NAME from '../../../constants/screens';

const CreateSupport = props => {
  const { addImageFromPicker, photoAdded } = props.route.params || {};
  const [requestType, setRequestType] = useState('Application');
  const [images, setImages] = useState([]);

  const addImage = useCallback(() => {
    props.navigation.navigate(SCREENS_NAME.CAMERA_CREATE_QUESTION, {
      base64: true,
      screenName: SCREENS_NAME.CREATE_SUPPORT_SCREEN
    });
  }, [props.navigation]);
  const dispatch = useDispatch();

  const [formState, setFormState] = useState({
    fullName: '',
    phone: '',
    email: '',
    content: ''
  });

  React.useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      const _addImageFromPicker = addImageFromPicker || [];
      const _addImageFromSnap = photoAdded || {};

      if (_addImageFromSnap.sourceURL || _addImageFromSnap.path) {
        const data = [...images, _addImageFromSnap];
        const newData = __.uniqBy(data, e => e.sourceURL || e.path);
        setImages(newData);
      }

      if (_addImageFromPicker.length > 0) {
        const data = [...images, ..._addImageFromPicker];
        const newData = __.uniqBy(data, e => e.sourceURL || e.path);
        setImages(newData);
      }

      props.navigation.setParams({
        addImageFromPicker: null,
        photoAdded: null
      });
    });

    return unsubscribe;
  }, [addImageFromPicker, photoAdded, images, props.navigation]);
  const onChangeValue = useCallback(
    field => value => setFormState({ ...formState, [field]: value }),
    [formState]
  );
  const onRemoveImage = useCallback(image => {
    setImages([...image]);
  }, []);

  const onCreateFAQSupport = useCallback(() => {
    const imageBase64 = images.map(item => {
      return { image: item?.data };
    });
    dispatch(
      createFAQSupportHandler({
        params: {
          content: formState.content,
          fullName: formState.fullName,
          email: formState.email,
          phoneNumber: formState.phone || '0912345678',
          requesterType: 'Guest',
          requestType,
          images: imageBase64
        },
        callback: (err, res) => {
          if (!err) {
            dispatch(getShowAlertError(CREATE_FAQ_SUPPORT_SUCCESSFULLY));
            props.navigation.goBack();
          } else {
            dispatch(getShowAlertError(CALL_API_ERROR));
            props.navigation.goBack();
          }
        }
      })
    );
  }, [images, dispatch, requestType, props.navigation, formState]);

  const role = useSelector(state => state.auth.role);
  useLayoutEffect(() => {
    props.navigation.setOptions({
      title: 'screen_name.create_support'
    });
  }, [props.navigation]);

  if (MEMBER_TYPE.Guest !== role) {
    return (
      <MemberSupport {...props} images={images} onRemoveImage={onRemoveImage} addImage={addImage} />
    );
  }

  return (
    <View forceInset={{ bottom: 'never' }} style={styles.container}>
      <KeyboardAwareScrollView
        bounces={false}
        style={styles.body}
        extraHeight={80}
        keyboardOpeningTime={-1}
        enableResetScrollToCoords={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.wrapper}>
        <View style={styles.box}>
          <CustomInput
            required
            translate
            translateTitle
            title={'create_support.fullname'}
            placeholder={'create_support.fullname_placeholder'}
            value={formState.fullName}
            onChangeText={onChangeValue('fullName')}
          />
          <CustomInput
            required
            translate
            translateTitle
            title={'create_support.phone'}
            placeholder={'create_support.phone_placeholder'}
            value={formState.phone}
            onChangeText={onChangeValue('phone')}
          />

          <CustomInput
            translate
            translateTitle
            title={'create_support.email'}
            placeholder={'create_support.email_placeholder'}
            value={formState.email}
            onChangeText={onChangeValue('email')}
          />
          <CustomInput
            translate
            translateItem
            translateValue
            translateTitle
            title={'support.content_needs_support'}
            type={'select'}
            placeholder={'support.select_content_to_support'}
            value={requestType}
            onChangeText={value => {
              setRequestType(value);
            }}
            selectOptions={RequestType}
          />
          <InputExtend value={formState.content} onChangeValue={onChangeValue('content')} />
          <AddImage
            images={images}
            style={styles.imageContainer}
            onRemoveImage={onRemoveImage}
            addImage={addImage}
          />
        </View>
      </KeyboardAwareScrollView>
      <View style={styles.footer}>
        <View style={styles.btn}>
          <PrimaryButton
            translate
            onPress={onCreateFAQSupport}
            title={'create_question.send_require'}
            backgroundColorDisabled={BACKGROUND_COLOR.Silver}
            disabled={
              !formState.fullName ||
              !formState.phone ||
              !formState.content ||
              !requestType ||
              formState.content.length > 256
            }
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: CUSTOM_COLOR.White
  },
  wrapper: {
    paddingBottom: SPACING.Medium
  },
  body: {
    padding: SPACING.Medium
  },

  imageContainer: {
    marginTop: SPACING.Medium
  },
  footer: {
    paddingBottom: SPACING.Small,
    paddingTop: scale(16),
    backgroundColor: BACKGROUND_COLOR.White,
    marginTop: SPACING.Normal,
    flexDirection: 'row'
  },
  btn: {
    flex: 1,
    marginHorizontal: SPACING.Medium
  }
});

export default WithLoading(CreateSupport, [FAQ.CREATE_FAQ_SUPPORT.HANDLER]);
