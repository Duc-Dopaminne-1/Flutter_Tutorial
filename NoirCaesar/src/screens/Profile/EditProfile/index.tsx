import { View, Keyboard } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import Container from '@components/Container';
import styles from './styles';
import translate from '@src/localize';
import { CustomHeader } from '@src/components/CustomHeader';
import { BACK, ARROW_RIGHT } from '@src/constants/icons';
import NavigationActionsService from '@src/navigation/navigation';
import { CustomText } from '@src/components/CustomText';
import CustomInput from '@src/components/CustomInput';
import { Formik } from 'formik';
import ErrorMessage from '@src/components/ErrorMessage';
import { object, string, ref } from 'yup';
import { FAVORITE } from '@src/constants/screenKeys';
import { FavoriteItemModel } from '@src/components/FlatListItem/FavoriteItem';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, changePassword } from '@src/modules/auth/actions';
import { RootState } from '@src/types/types';
import { CustomPopup } from '@src/components/CustomPopup';
import { get } from 'lodash';
import { CustomTouchable } from '@src/components/CustomTouchable';
import { CustomButton } from '@src/components/CustomButton';
import { IUser } from '@goldfishcode/noir-caesar-api-sdk/libs/api/user/models';

const EditProfile = () => {
  const dispatch = useDispatch();
  const emailRef: any = useRef(null);
  const [isShowPopup, setShowPopup] = useState(false);
  const confirmPasswordRef: any = useRef(null);
  let mFormikProps: any;
  const me = useSelector<RootState, IUser>((state: RootState) => state.auth.userData!);

  const validateSchema = object().shape({
    username: string()
      .trim()
      .required(`${translate('error_validate_field.user_name')} ${translate('error_validate_field.input_is_require')}!`)
      .min(2, `${translate('error_validate_field.user_name')} ${translate('error_validate_field.input_too_short')}!`)
      .max(36, `${translate('profile.last_name')} ${translate('error_validate_field.input_too_long')}!`)
      .matches(/^[a-zA-Z0-9_]*$/, `${translate('error_validate_field.user_name')} ${translate('error_validate_field.is_not_valid')}!`),
    password: string()
      .trim()
      .min(8, `${translate('authentication.short_password')}!`)
      .matches(
        /^(?=.*\d).+$/,
        `${translate('error_validate_field.password')} ${translate('error_validate_field.password_special_character')}!`,
      )
      .matches(
        /.*[!@#$%^&*(),.?":{}|<>].*$/,
        `${translate('error_validate_field.password')} ${translate('error_validate_field.password_special_character')}!`,
      ),
    confirm_password: string()
      .trim()
      .min(8, `${translate('authentication.short_confirm_password')}!`)
      .oneOf([ref('password'), null], `${translate('error_validate_field.confirm_pwd')} ${translate('error_validate_field.not_match')}!`),
  });

  useEffect(() => {
    setDataUserMe();
  }, [me]);

  const setDataUserMe = () => {
    mFormikProps && mFormikProps.setFieldValue('username', me && me.username ? me.username : '');
    const favoriteid: string[] = [];
    const favorite: string[] = [];
    me &&
      me.favorite &&
      me.favorite.forEach(item => {
        if (get(item, ['name'], '')) {
          favorite.push(get(item, ['name'], ''));
        }
        if (get(item, ['id'], '')) {
          favoriteid.push(get(item, ['id'], ''));
        }
      });
    mFormikProps && mFormikProps.setFieldValue('favoriteid', favoriteid.join(', ').toString());
    mFormikProps && mFormikProps.setFieldValue('favorite', favorite.join(', ').toString());
  };

  const onUpdateProfile = (values: any) => {
    const fororites = values.favoriteid.split(', ');
    dispatch(
      updateProfile({
        data: {
          username: values.username,
          favorite: fororites && fororites.length > 0 && fororites[0] ? fororites : [],
        },
        onSuccess: () => {
          if (values.password && values.confirm_password) {
            dispatch(
              changePassword({
                newPassword: values.password,
                onSuccess: () => {
                  setShowPopup(true);
                  mFormikProps && mFormikProps.setFieldValue('password', '');
                  mFormikProps && mFormikProps.setFieldValue('confirm_password', '');
                },
                onFail: error => {
                  setTimeout(() => {
                    NavigationActionsService.showErrorPopup(error);
                  }, 500);
                },
              }),
            );
          } else {
            setShowPopup(true);
          }
        },
        onFail: error => {
          setTimeout(() => {
            NavigationActionsService.showErrorPopup(error);
          }, 500);
        },
      }),
    );
  };

  const onBack = () => {
    NavigationActionsService.pop();
  };

  const renderRightHeader = () => {
    return <CustomText style={{ fontSize: 12, color: '#676877' }} text={translate('edit_profile.cancel')} />;
  };

  const renderHeader = () => {
    return (
      <CustomHeader
        containerStyle={styles.headerContainer}
        leftImage={BACK}
        leftAction={onBack}
        title={translate('edit_profile.edit_profile')}
        rightComponent={renderRightHeader()}
        rightAction={onBack}
      />
    );
  };

  const onSubmitCollection = (values: any) => {
    Keyboard.dismiss();
    onUpdateProfile(values);
  };

  const onPressFavorite = () => {
    Keyboard.dismiss();
    NavigationActionsService.push(FAVORITE, { onPressActive: onPressActive, favoriteid: mFormikProps.values.favoriteid }, true);
  };

  const onPressActive = (data: FavoriteItemModel[]) => {
    const selectedName = data.filter(item => item.selected).map(item => item.name);
    const selectedId = data.filter(item => item.selected).map(item => item.id);
    if (selectedName && selectedName.length > 0) {
      mFormikProps && mFormikProps.setFieldValue('favorite', selectedName.join(', ').toString());
    } else {
      mFormikProps && mFormikProps.setFieldValue('favorite', '');
    }
    if (selectedId && selectedId.length > 0) {
      mFormikProps && mFormikProps.setFieldValue('favoriteid', selectedId.join(', ').toString());
    } else {
      mFormikProps && mFormikProps.setFieldValue('favoriteid', '');
    }
  };

  const onFocusEmail = () => {
    emailRef.current && emailRef.current.focus();
  };

  const onFocusConfirmPassword = () => {
    confirmPasswordRef.current && confirmPasswordRef.current.focus();
  };

  const renderFormik = () => {
    return (
      <Formik
        initialValues={{ username: '', favorite: '', password: '', confirm_password: '', favoriteid: '' }}
        onSubmit={onSubmitCollection}
        validationSchema={validateSchema}
      >
        {formikProps => {
          mFormikProps = formikProps;
          return (
            <View style={styles.containerFormik}>
              <View>
                <CustomInput
                  onChangeText={formikProps.handleChange('username')}
                  onSubmitEditing={onFocusEmail}
                  placeholder={translate('edit_profile.username')}
                  returnKeyType="next"
                  value={formikProps.values.username}
                  onBlur={formikProps.handleBlur('username')}
                />
                <ErrorMessage errorValue={formikProps.touched.username && formikProps.errors.username} />
                <CustomTouchable
                  style={formikProps.touched.username && formikProps.errors.username ? { marginTop: 10 } : styles.favorite}
                  onPress={onPressFavorite}
                >
                  <CustomInput
                    onChangeText={formikProps.handleChange('favorite')}
                    placeholder={translate('edit_profile.favorite')}
                    returnKeyType="next"
                    rightIcon={ARROW_RIGHT}
                    pointerEvents={'none'}
                    editable={false}
                    value={formikProps.values.favorite}
                  />
                </CustomTouchable>
                <CustomInput
                  onChangeText={formikProps.handleChange('password')}
                  onSubmitEditing={onFocusConfirmPassword}
                  placeholder={translate('edit_profile.password')}
                  returnKeyType="next"
                  moreStyle={styles.password}
                  value={formikProps.values.password}
                  secureTextEntry
                  onBlur={formikProps.handleBlur('password')}
                />
                <ErrorMessage errorValue={formikProps.touched.password && formikProps.errors.password} />
                <CustomInput
                  inputRef={confirmPasswordRef}
                  onChangeText={formikProps.handleChange('confirm_password')}
                  onSubmitEditing={formikProps.handleSubmit}
                  placeholder={translate('edit_profile.confirm_password')}
                  returnKeyType="next"
                  secureTextEntry
                  moreStyle={formikProps.touched.password && formikProps.errors.password ? { marginTop: 10 } : styles.confirm_password}
                  value={formikProps.values.confirm_password}
                  onBlur={formikProps.handleBlur('confirm_password')}
                />
                <ErrorMessage errorValue={formikProps.touched.confirm_password && formikProps.errors.confirm_password} />
              </View>
              <CustomButton
                onPress={formikProps.handleSubmit}
                disabled={!formikProps.isValid}
                style={styles.buttonSubmit}
                text={translate('edit_profile.save')}
              />
            </View>
          );
        }}
      </Formik>
    );
  };

  const onBackdropPress = () => {
    setShowPopup(false);
    NavigationActionsService.pop();
  };

  const onPressActivePopUp = () => {
    setShowPopup(false);
    NavigationActionsService.pop();
  };

  return (
    <Container>
      <CustomPopup
        text={translate('edit_profile.update_successfully')}
        onBackdropPress={onBackdropPress}
        loading={isShowPopup}
        onPressRedButton={onPressActivePopUp}
      />
      <View style={styles.container}>
        {renderHeader()}
        <KeyboardAwareScrollView style={styles.container} keyboardShouldPersistTaps={'handled'}>
          <View style={styles.scrollview}>{renderFormik()}</View>
        </KeyboardAwareScrollView>
      </View>
    </Container>
  );
};

export default EditProfile;
