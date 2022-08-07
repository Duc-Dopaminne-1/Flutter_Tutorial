import {useAnalytics} from '@segment/analytics-react-native';
import React, {useContext, useRef, useState} from 'react';
import {Image, Keyboard, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux/lib/hooks/useSelector';

import {AppContext} from '../../../appData/appContext/appContext';
import {isAgent} from '../../../appData/user/selectors';
import {CONSTANTS, KEY_BOARD_TYPE, TOAST_MESSAGE_TYPE} from '../../../assets/constants';
import {IMAGES} from '../../../assets/images';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {METRICS, normal, small, tiny} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import CustomButton from '../../../components/Button/CustomButton';
import DatePickerSection from '../../../components/Button/DatePickerSection';
import InputSection from '../../../components/InputSection';
import KeyboardScrollView from '../../../components/KeyboardScrollView';
import LinkTextButton from '../../../components/LinkTextButton';
import {Captcha} from '../../../components/RecaptchaV2/Captcha';
import {getAvatarSource} from '../../../utils/fileHandler';
import {TrackingActions} from '../../WithSegment';
import DropDownGender, {GENDERS} from './DropDownGender';
import GetAvatarView from './GetAvatarView';
import {BasicProfileContext} from './useBasicProfile';

const styles = StyleSheet.create({
  viewContainer: {
    paddingHorizontal: 16,
  },
  textEmailConfirmed: {
    fontSize: 15,
    ...FONTS.regular,
  },
  viewEditEmail: {
    position: 'absolute',
    right: 0,
    top: 36,
    height: 45,
    paddingHorizontal: small,
    justifyContent: 'center',
  },
  iconEditEmail: {
    width: 20,
    height: 20,
    marginBottom: tiny,
  },
  viewVerifyEmail: {
    marginLeft: tiny,
  },
  textVerifyEmail: {
    color: COLORS.PRIMARY_A100,
    fontSize: 15,
    textDecorationLine: 'none',
  },
  /* eslint-disable react-native/no-unused-styles */
  subscriptionCardHeader: {
    fontSize: 22,
    ...FONTS.bold,
    ...METRICS.marginBottom,
  },
});

const EditEmailIcon = ({onPress}) => (
  <TouchableOpacity style={styles.viewEditEmail} onPress={onPress}>
    {/* <MaterialIcons name="edit" size={20} style={{color: COLORS.PRIMARY_A100}} /> */}
    <Image source={IMAGES.IC_EDIT_EMAIL} style={styles.iconEditEmail} />
  </TouchableOpacity>
);

const BasicProfileFields = ({state, errors, onComponentChange}) => {
  const {
    firstName,
    lastName,
    userName,
    phoneNumber,
    email,
    emailConfirmed,
    referralCode,
    dob,
    gender,
    avatar,
    isVerifyProfilePhoto,
  } = state;

  const {track} = useAnalytics();
  const {updateUserInfo, verifyEmail, isEditRefCode} = useContext(BasicProfileContext);
  const isAgentUser = useSelector(isAgent);
  const {showToastInfo} = useContext(AppContext);
  const captchaRef = useRef();
  const [isEditedEmail, setEditedEmail] = useState(false);
  const onChooseAvatar = avatarSource => {
    if (avatarSource && avatarSource.uri) {
      onComponentChange({profilePhoto: avatarSource.uri, avatar: avatarSource.uri});
    }
  };

  const onPressIsVerifyProfilePhoto = () => {
    showToastInfo({
      messageType: TOAST_MESSAGE_TYPE.warning,
      title: translate('common.waitingForApprove'),
      message: translate('avatar.pendingApproval'),
    });
  };

  const errorForField = fieldName => {
    let error = '';
    if (errors?.[fieldName]) {
      error = translate(errors?.[fieldName]);
    }
    return error;
  };

  const onClickSubmit = () => {
    track(TrackingActions.profileUpdated, {
      first_name: firstName,
      last_name: lastName,
      user_name: userName,
      phone_number: phoneNumber,
      email: email,
      birthday: dob,
      gender: gender,
      referral_code: referralCode,
    });

    Keyboard.dismiss();
    setEditedEmail(false);
    updateUserInfo();
  };

  const onPressEnableEmail = () => {
    setEditedEmail(!isEditedEmail);
  };
  const verifyEmailCaptcha = () => {
    captchaRef?.current?.show(captcha => {
      verifyEmail(captcha);
    });
  };

  const imageSource = getAvatarSource(avatar);

  const renderVerifyEmail = () => {
    const title = emailConfirmed ? translate('EMAIL_CONFIRMED') : translate('EMAIL_NOT_CONFIRM');
    return (
      <Captcha ref={captchaRef}>
        <View style={[HELPERS.row, {marginTop: tiny, marginBottom: normal}]}>
          <Text style={styles.textEmailConfirmed}>{title}</Text>
          {!emailConfirmed && (
            <LinkTextButton
              style={styles.viewVerifyEmail}
              textStyle={styles.textVerifyEmail}
              title={translate('SEND_REQUEST_EMAIL')}
              onPress={verifyEmailCaptcha}
            />
          )}
        </View>
      </Captcha>
    );
  };

  return (
    <BasicProfileContain
      isAgentUser={isAgentUser}
      state={state}
      imageSource={imageSource}
      onChooseAvatar={onChooseAvatar}
      firstName={firstName}
      onComponentChange={onComponentChange}
      errorForField={errorForField}
      isVerifyProfilePhoto={isVerifyProfilePhoto}
      onPressIsVerifyProfilePhoto={onPressIsVerifyProfilePhoto}
      lastName={lastName}
      userName={userName}
      phoneNumber={phoneNumber}
      email={email}
      isEditedEmail={isEditedEmail}
      onPressEnableEmail={onPressEnableEmail}
      renderVerifyEmail={renderVerifyEmail}
      dob={dob}
      gender={gender}
      referralCode={referralCode}
      isEditRefCode={isEditRefCode}
      onClickSubmit={onClickSubmit}
    />
  );
};

export default BasicProfileFields;

export const BasicProfileContain = ({
  imageSource,
  onChooseAvatar,
  firstName,
  onComponentChange,
  errorForField,
  lastName,
  phoneNumber,
  email,
  isEditedEmail,
  onPressEnableEmail,
  renderVerifyEmail,
  dob,
  gender,
  referralCode,
  isEditRefCode,
  onClickSubmit,
  isShowAvatar = true,
  isVerifyProfilePhoto,
  onPressIsVerifyProfilePhoto,
}) => {
  return (
    <KeyboardScrollView extraScrollHeight={CONSTANTS.EXTRA_KEYBOARD_SCROLL_FOR_HEADER}>
      <View style={styles.viewContainer}>
        <View>
          {isShowAvatar && (
            <GetAvatarView
              gender={gender}
              isShowBtnAdd={true}
              containerStyle={{marginTop: normal}}
              onPressIsVerifyProfilePhoto={onPressIsVerifyProfilePhoto}
              isVerifyProfilePhoto={isVerifyProfilePhoto}
              imageSource={imageSource}
              onAvatarSourceChange={onChooseAvatar}
            />
          )}
          <InputSection
            customStyle={{...METRICS.mediumMarginTop}}
            inputStyle={{...commonStyles.inputBorder}}
            isRequired={true}
            headerTitle={translate(STRINGS.NAME)}
            value={firstName}
            onChangeText={text => {
              onComponentChange({firstName: text});
            }}
            error={errorForField('firstName')}
            autoCapitalize="words"
          />
          <InputSection
            headerTitle={translate(STRINGS.MIDDLE_AND_LAST_NAME)}
            inputStyle={{...commonStyles.inputBorder}}
            value={lastName}
            onChangeText={text => {
              onComponentChange({lastName: text});
            }}
          />
          {/* <InputSection
            headerTitle={translate(STRINGS.USER_NAME)}
            value={userName}
            onChangeText={text => {
              onComponentChange({userName: text});
            }}
            editable={false}
          /> */}
          <InputSection
            headerTitle={translate(STRINGS.PHONE_NUMBER)}
            keyboardType={KEY_BOARD_TYPE.PHONE_NUMBER}
            value={phoneNumber}
            onChangeText={text => {
              onComponentChange({phoneNumber: text});
            }}
            error={errorForField('phoneNumber')}
            editable={false}
          />
          <View>
            <InputSection
              isRequired={true}
              headerTitle={translate(STRINGS.EMAIL)}
              keyboardType={KEY_BOARD_TYPE.EMAIL}
              value={email}
              inputStyle={{...commonStyles.inputBorder}}
              onChangeText={text => {
                onComponentChange({email: text});
              }}
              editable={isEditedEmail}
              error={errorForField('email')}
            />
            <EditEmailIcon onPress={onPressEnableEmail} />
          </View>
          {renderVerifyEmail()}
          <View style={METRICS.smallMarginTop} />
          <DatePickerSection
            isRequired
            headerTitle={translate(STRINGS.DAY_OF_BIRTH)}
            value={dob}
            onChosen={date => {
              onComponentChange({dob: date.toISOString()});
            }}
            error={errorForField('dob')}
          />
          <View style={METRICS.smallMarginTop} />
          <DropDownGender
            initialGender={gender}
            inputStyle={{...commonStyles.inputBorder}}
            onChosenGender={item => {
              const genderValue = item?.id ? GENDERS[item.id] : 'NA';
              onComponentChange({gender: genderValue});
            }}
          />
          <InputSection
            inputStyle={{...commonStyles.inputBorder}}
            headerTitle={translate(STRINGS.REFERRAL_CODE)}
            onChangeText={text => {
              onComponentChange({referralCode: text});
            }}
            keyboardType={KEY_BOARD_TYPE.PHONE_NUMBER}
            value={referralCode}
            editable={isEditRefCode}
            customStyle={{...METRICS.marginTop}}
          />
          <View style={METRICS.smallMarginTop} />
          {/* ****** Temporary hidden, based on request: https://dev.azure.com/topenlandtech/ht-topenland/_workitems/edit/14292 *****
          {isAgentUser && (
            <>
              <Text style={styles.subscriptionCardHeader}>{translate(STRINGS.YOUR_PACKAGE)}</Text>
              <SubscriptionCardView state={state} />
              <View style={METRICS.marginBottom} />
            </>
          )} */}
        </View>
        <CustomButton
          style={[commonStyles.buttonNext, METRICS.mediumMarginBottom]}
          title={translate(STRINGS.UPDATE)}
          onPress={onClickSubmit}
        />
      </View>
    </KeyboardScrollView>
  );
};
