import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../../constants/colors';
import FormInput from './components/form_input';
import { AppLoading, PrimaryButton } from '../../../components';
import { SPACING } from '../../../constants/size';
import { isIphoneX } from '../../../helpers/device';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { createRequestHandle } from '../../../redux/actions/lead';
import SCREENS_NAME from '../../../constants/screens';
import { validateEmail, validatePhone } from '../../../helpers/validate';
import { getShowAlertError } from '../../../redux/actions/system';
const CreateRequestScreen = ({ navigation, route }) => {
  const memberId = useSelector(state => state.auth.memberId);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    type: 1,
    fullName: '',
    phone: '',
    email: '',
    description: '',
    categories: [],
    images: []
  });
  const isValidForm = () => {
    const isValidEmail = data?.email?.trim() != '' && validateEmail(data?.email);
    const isValidPhone = data?.phone?.trim() != '' && validatePhone(data?.phone);
    return (
      data?.fullName?.trim() != '' &&
      data?.description?.trim() != '' &&
      data?.categories?.length > 0 &&
      isValidEmail &&
      isValidPhone
    );
  };
  const onChangeForm = item => {
    setData({ ...data, ...item });
  };
  const handleSubmit = () => {
    const { fullName, phone, email, description, categories, images } = data;
    setLoading(true);
    const callback = status => {
      setLoading(false);
      if (status) {
        setData({
          type: 1,
          fullName: '',
          phone: '',
          email: '',
          description: '',
          categories: [],
          images: []
        });
        navigation.navigate(SCREENS_NAME.CREATE_REQUEST_SCREEN_SUCCESS);
      }
    };
    dispatch(
      createRequestHandle({
        memberId,
        fullName,
        phone,
        email,
        description,
        categories,
        images,
        callback
      })
    );
  };
  const onContinue = () => {
    if (data.categories.length == 1) {
      dispatch(
        getShowAlertError({
          title: 'create_request.create_request_title',
          message: 'create_request.create_request_confirm',
          btnLeft: 'create_request.btn_create_only_request',
          btnRight: 'create_request.btn_create_record',
          confirmAction: () =>
            navigation.navigate(SCREENS_NAME.TRIGGER_FLOW_SCREEN, {
              triggerCode: data.categories[0].triggerCode,
              fromCreateLead: true // flag to handle navigate goback;
            }),
          cancelAction: handleSubmit
        })
      );
    } else {
      handleSubmit();
    }
  };

  return (
    <View style={styles.container}>
      <AppLoading loading={loading} />
      <KeyboardAwareScrollView
        enableResetScrollToCoords={false}
        contentContainerStyle={styles.wrapper}
        showsVerticalScrollIndicator={false}>
        <FormInput data={data} navigation={navigation} route={route} onChange={onChangeForm} />
      </KeyboardAwareScrollView>
      <View style={styles.footer}>
        <PrimaryButton
          translate
          title={'create_request.btn_create'}
          onPress={onContinue}
          disabled={!isValidForm()}
        />
      </View>
    </View>
  );
};

export default CreateRequestScreen;
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND_COLOR.White },
  wrapper: { paddingHorizontal: 15, paddingBottom: 30 },
  footer: {
    padding: SPACING.Medium,
    paddingBottom: isIphoneX ? 0 : SPACING.Medium,
    borderTopWidth: 1,
    borderColor: CUSTOM_COLOR.GalleryDark
  }
});
