import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';
import { BACKGROUND_COLOR } from '../../../constants/colors';
import {
  CustomInputPassword,
  PopupPolicy,
  PrimaryButton,
  SecondaryButton,
  WithLoading
} from '../../../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import FloatFooter from '../../../components/float_footer';
import { useDispatch, useSelector } from 'react-redux';
import {
  acceptLegalHandle,
  createMemberFromSDKHandle,
  getPolicyTopenIdHandle,
  createTPFMemberFromSDKHandle
} from '../../../redux/actions/member';
import { scale } from '../../../utils/responsive';
import { BORDER_RADIUS, ICON_SIZE, MULTIE_BORDER_RADIUS, SPACING } from '../../../constants/size';
import { ICFinance, ICInsurrance, ICStick } from '../../../assets/icons';
import AppText from '../../../components/app_text';
import themeContext from '../../../constants/theme/themeContext';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { translate as t } from '../../../i18n';
import { changePasswordHandle, getPasswordPatternHandle } from '../../../redux/actions/auth';
import { validatePassword } from '../../../helpers/validate';
import { LEGAL_TYPE } from '../../../global/legal_type';
import { parseGenders } from '../../../redux/parses/gender';
import { MEMBER, AUTH } from '../../../redux/actionsType';
import { formatToUtcReq } from '../../../helpers/formatTime';
import { DEFAULT_DOB } from '../index';

const LegalScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const {
    memberId,
    passwordPattern,
    passwordPatternDescription,
    acceptSDK,
    acceptPolicy,
    hasPassword
  } = useSelector(state => state.auth);
  const { account } = useSelector(state => state.middleware);
  const { terms, privacy } = useSelector(state => state.member);

  const termList = useSelector(state => state.termAndCondition.termAndConditionList);
  const privacyList = useSelector(state => state.termAndCondition.privacyList);

  const item = termList.length > 0 ? termList[0] : {};
  const termContent = item.content || '';

  const privacyItem = privacyList.length > 0 ? privacyList[0] : {};
  const privacyContent = privacyItem.content || '';

  const theme = useContext(themeContext);
  const [toggleAccept, setToggleAccept] = useState(false);
  const [sizeFooter, setSizeFooter] = useState(0);
  const [password, setPassword] = React.useState('');
  const [confirm_password, setConfirmPassword] = React.useState('');
  const [errors, setErrors] = React.useState({
    password: null,
    confirm_password: null
  });

  const [visible, setVisible] = useState(false);
  const [policy, setPolicy] = useState({});

  const { routeName, params, legalType, callBack } = route?.params;
  const isExistTopenId =
    legalType === LEGAL_TYPE.CREATE_TOPENID_TPF ||
    (legalType === LEGAL_TYPE.UPDATE_TOPENID_TO_TPF && hasPassword);

  const fullName = account?.name ?? account?.last_name + ' ' + account?.first_name;

  useEffect(() => {
    dispatch(getPolicyTopenIdHandle());
  }, [dispatch]);

  useEffect(() => {
    isExistTopenId && dispatch(getPasswordPatternHandle());
  }, [isExistTopenId, dispatch]);

  useEffect(() => {
    if (acceptSDK && acceptPolicy && memberId) {
      navigation.pop();
      if (typeof callBack === 'function') {
        callBack();
        return;
      }
      navigation.navigate(routeName, params);
    }
  }, [acceptSDK, acceptPolicy, memberId]);
  const onChangeText = name => value => {
    switch (name) {
      case 'password':
        setPassword(value);
        errors.password = !validatePassword(value, passwordPattern)
          ? passwordPatternDescription
          : null;
        break;

      case 'confirm_password':
        setConfirmPassword(value);
        errors.confirm_password = password !== value ? t('validation.confirm_password') : null;
        break;

      default:
        break;
    }
    setErrors(errors);
  };

  const onValidateBeforeSubmit = values => {
    const newErrors = { ...errors };
    let isValid = true;
    for (const key in values) {
      let value = values[key];
      switch (key) {
        case 'password':
          isValid = validatePassword(value, passwordPattern);
          newErrors.password = !isValid ? passwordPatternDescription : null;
          break;

        case 'confirm_password':
          isValid = values['password'] === value && validatePassword(value, passwordPattern);
          newErrors.confirm_password = !isValid ? t('validation.confirm_password') : null;
          break;
        default:
          break;
      }
    }
    setErrors(newErrors);
    return isValid;
  };

  const registerMemberFullFromSDK = async () => {
    const { phone, first_name, last_name, dob, gender, flow } = account || {};
    const input = {
      firstName: first_name,
      lastName: last_name,
      phone,
      dob: formatToUtcReq(dob || DEFAULT_DOB),
      gender: parseGenders(gender),
      topenIdPassword: password,
      flow
    };

    if (!onValidateBeforeSubmit({ password, confirm_password })) {
      return;
    }
    dispatch(createMemberFromSDKHandle({ input }));
  };
  const updateMember = async () => {
    if (hasPassword) {
      const input = {
        newPassword: password
      };

      if (isExistTopenId && !onValidateBeforeSubmit({ password, confirm_password })) {
        return;
      }

      dispatch(changePasswordHandle({ input }));
    } else {
      dispatch(acceptLegalHandle());
    }
  };

  const createAccountTopenIdToTPF = async () => {
    const { name, dob, gender, flow } = account || {};

    const input = {
      name,
      dob: formatToUtcReq(dob || DEFAULT_DOB),
      gender: parseGenders(gender),
      flow
    };
    dispatch(createTPFMemberFromSDKHandle({ input }));
  };

  const handleConfirm = () => {
    switch (legalType) {
      case LEGAL_TYPE.CREATE_TOPENID_TPF:
        registerMemberFullFromSDK();
        break;

      case LEGAL_TYPE.UPDATE_TOPENID_TO_TPF:
        updateMember();
        break;

      case LEGAL_TYPE.CREATE_TPF:
        createAccountTopenIdToTPF();
        break;

      default:
        dispatch(acceptLegalHandle());
        navigation.pop();
        if (typeof callBack === 'function') {
          callBack();
          return;
        }
        navigation.navigate(routeName, params);
        break;
    }
  };

  const handleReject = () => {
    navigation.goBack();
  };

  const onToggleAccept = () => {
    setToggleAccept(!toggleAccept);
  };

  const getSizeFooter = e => {
    const { x, y, width, height } = e.nativeEvent.layout;
    setSizeFooter({ x, y, width, height });
  };

  const onViewTermOfUse = () => {
    setVisible(true);

    setPolicy({
      type: terms.type,
      content: {
        topenId: terms.value,
        app: termContent
      }
    });
  };

  const onViewPrivacyPolicy = () => {
    setVisible(true);
    setPolicy({
      type: privacy.type,
      content: {
        topenId: privacy.value,
        app: privacyContent
      }
    });
  };

  const ServiceItem = ({ name, iconJSX }) => (
    <View style={styles.row}>
      <View style={{ ...styles.bgIcon, backgroundColor: theme.app.primaryColor1 }}>{iconJSX}</View>
      <AppText
        semiBold
        translate
        style={{
          ...styles.textRegular,
          paddingLeft: SPACING.Fit
        }}>
        {name}
      </AppText>
    </View>
  );
  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={[
          styles.contentWrapper,
          { marginBottom: sizeFooter.height, paddingTop: SPACING.XXLarge }
        ]}
        contentContainerStyle={{ paddingBottom: scale(80) }}>
        <AppText
          bold
          translate
          style={{
            fontSize: FONT_SIZE.Title3,
            lineHeight: LINE_HEIGHT.Heading,
            textAlign: 'center'
          }}>
          {'legal.verify_info'}
        </AppText>

        <View style={[styles.commonWrapper, styles.lastCommonWrapper]}>
          <AppText
            bold
            translate
            style={{
              fontSize: FONT_SIZE.SubHead,
              lineHeight: LINE_HEIGHT.BodyText
            }}>
            {'legal.use_topen_fintech_sevices'}
          </AppText>
        </View>
        <View style={[styles.row, styles.lastCommonWrapper]}>
          <ServiceItem
            name={'legal.finance'}
            iconJSX={<ICFinance width={scale(20)} height={scale(20)} />}
          />
          <View style={{ paddingHorizontal: SPACING.Medium }} />
          <ServiceItem
            name={'legal.insurrance'}
            iconJSX={<ICInsurrance width={scale(20)} height={scale(20)} />}
          />
        </View>

        <AppText style={[styles.marginBottom12, styles.textRegular]} translate>
          {isExistTopenId ? 'legal.accept_by_press' : 'legal.accept_by_press_exist_account'}
        </AppText>

        {isExistTopenId && (
          <View style={styles.lastCommonWrapper}>
            <AppText style={[styles.marginBottom12, styles.textRegular]}>
              {t('profile.full_name')}: {fullName}
            </AppText>
            <AppText style={[styles.marginBottom12, styles.textRegular]}>
              {t('profile.phone_number')}: {account?.phone}
            </AppText>

            <CustomInputPassword
              translateTitle
              translatePlaceholder
              title={'legal.password'}
              value={password}
              onChangeText={onChangeText('password')}
              placeholder={'legal.input_password'}
              errorText={errors.password}
            />

            <CustomInputPassword
              translatePlaceholder
              onChangeText={onChangeText('confirm_password')}
              value={confirm_password}
              placeholder={'legal.confirm_password'}
              errorText={errors.confirm_password}
            />
          </View>
        )}

        <>
          <View style={styles.commonWrapper}>
            <View style={styles.dot} />
            <Text style={styles.textArea}>
              <AppText translate>{`legal.argee_with`}</AppText>
              <AppText
                translate
                style={[styles.primaryTextBold, { color: theme.app.primaryColor1 }]}
                onPress={onViewTermOfUse}>
                {`legal.terms_of_use`}
              </AppText>
              <AppText translate>{`legal.and`}</AppText>
              <AppText
                translate
                style={[styles.primaryTextBold, { color: theme.app.primaryColor1 }]}
                onPress={onViewPrivacyPolicy}>{`legal.privacy_policy`}</AppText>
              <AppText translate>{`legal.of_topen_fintech`}</AppText>
            </Text>
          </View>

          <View style={styles.acceptArea}>
            <TouchableWithoutFeedback onPress={onToggleAccept}>
              <View style={[styles.radio, { backgroundColor: theme.button.primary.background }]}>
                {toggleAccept && <ICStick />}
              </View>
            </TouchableWithoutFeedback>
            <AppText onPress={onToggleAccept} translate>
              {'legal.recive_marketing_info'}
            </AppText>
          </View>
        </>
      </KeyboardAwareScrollView>
      <FloatFooter style={styles.buttonsArea} onLayout={getSizeFooter}>
        <SecondaryButton
          width="48%"
          backgroundColor={theme.button.secondary.background}
          translate
          onPress={handleReject}
          title={'common.reject'}
        />
        <PrimaryButton
          width="48%"
          translate
          onPress={handleConfirm}
          title={'common.continue_text'}
        />
      </FloatFooter>

      <PopupPolicy
        isVisible={visible}
        type={policy?.type}
        content={policy?.content}
        onClose={() => setVisible(false)}
      />
    </View>
  );
};

export default WithLoading(LegalScreen, [
  MEMBER.CREATE_MEMBER_FROM_SDK.HANDLER,
  MEMBER.CREATE_TPF_MEMBER_FROM_SDK.HANDLER,
  MEMBER.ACCEPT_LEGAL.HANDLER,
  AUTH.CHANGE_PASSWORD.HANDLER
]);
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND_COLOR.White },
  contentWrapper: { paddingHorizontal: SPACING.Medium, flex: 1 },
  banner: {
    width: scale(223),
    height: scale(32)
  },
  bannerWrapper: {
    alignItems: 'center',
    paddingTop: SPACING.XXLarge,
    paddingBottom: SPACING.XXLarge
  },
  buttonsArea: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  acceptArea: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.XLarge
  },
  radio: {
    width: ICON_SIZE.MEDIUM,
    height: ICON_SIZE.MEDIUM,
    marginRight: SPACING.XNormal,
    borderRadius: MULTIE_BORDER_RADIUS.SMALL,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dot: {
    width: scale(4),
    height: scale(4),
    borderRadius: scale(2),
    backgroundColor: 'black',
    position: 'absolute',
    top: SPACING.Fit,
    left: SPACING.Normal
  },
  commonWrapper: {
    flexDirection: 'row'
  },
  textArea: {
    flex: 1,
    marginBottom: SPACING.XNormal,
    lineHeight: scale(22),
    flexDirection: 'row'
  },
  lastCommonWrapper: {
    marginBottom: scale(35) - SPACING.XNormal
  },
  marginBottom12: {
    marginBottom: SPACING.XNormal
  },
  primaryTextBold: {
    fontFamily: FONT_FAMILY.BOLD
  },
  contentImageArea: {
    flex: 1
  },
  bgIcon: {
    width: scale(40),
    height: scale(40),
    borderRadius: BORDER_RADIUS,
    alignItems: 'center',
    justifyContent: 'center'
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  textRegular: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.BodyText
  }
});
