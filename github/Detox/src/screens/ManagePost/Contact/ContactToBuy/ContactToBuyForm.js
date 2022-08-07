import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {
  APP_CURRENCY,
  CONSTANTS,
  CONTACT_TRADING_TYPE,
  KEY_BOARD_TYPE,
} from '../../../../assets/constants';
import {SIZES} from '../../../../assets/constants/sizes';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {HELPERS} from '../../../../assets/theme/helpers';
import {normal, smallNormal} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import CustomCheckbox from '../../../../components/Checkbox/CustomCheckbox';
import ImageProgress from '../../../../components/ImageProgress';
import InputSection from '../../../../components/InputSection';
import KeyboardScrollView from '../../../../components/KeyboardScrollView';
import PhoneInputSection from '../../../../components/PhoneInputSection';
import RadioSelectionsView from '../../../../components/RadioSelectionsView';
import {Captcha} from '../../../../components/RecaptchaV2/Captcha';
import {CreateContactRequestInput} from '../../../../hooks/useContactToBuy';
import MeasureUtils from '../../../../utils/MeasureUtils';
import NumberUtils from '../../../../utils/NumberUtils';
import {getUserFullName} from '../../../../utils/UserAgentUtil';
import ValidateInput from '../../../../utils/ValidateInput';
import SubmitComponent from '../SubmitComponent';
import ListSupportTypes from './ListSupportTypes';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  postInfo: {
    height: 193,
    borderRadius: 4,
    overflow: 'hidden',
  },
  contentContainer: {
    paddingHorizontal: normal,
  },
  postInfoImage: {
    width: '100%',
    height: '100%',
  },
  postTitle: {
    ...FONTS.fontSize18,
    ...FONTS.bold,
  },
  priceTitle: {
    ...FONTS.fontSize14,
    ...FONTS.regular,
  },
  checkBoxIsMe: {
    marginVertical: normal,
  },
  priceText: {
    ...FONTS.fontSize14,
    ...FONTS.bold,
    color: COLORS.STATE_ERROR,
  },
  inputContainer: {
    height: CONSTANTS.INPUT_HEIGHT,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.GREY_E4,
    marginTop: smallNormal,
    paddingHorizontal: 8,
    paddingVertical: 0,
  },
  inputPhoneInput: {
    flex: 1,
    paddingLeft: 8,
  },
});

const contactTypes = [
  {
    id: CONTACT_TRADING_TYPE.BUY,
    name: translate(STRINGS.BUY_PROPERTY),
    checked: true,
  },
  {
    id: CONTACT_TRADING_TYPE.RENT,
    name: translate('common.rent'),
    checked: false,
  },
];
type Props = {
  createContactTradingRequest: (input: CreateContactRequestInput) => {},
};

const ContactToBuyForm = ({
  state,
  setState,
  propertyPost,
  postTitle,
  image,
  createContactTradingRequest,
  services,
  isC2C,
  onSelectService,
}: Props) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isMe, setIsMe] = useState(false);
  const captchaRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const isBuying = state.contactType === CONTACT_TRADING_TYPE.BUY;
  const isRenting = state.contactType === CONTACT_TRADING_TYPE.RENT;
  // const shouldShowChooseContactType = propertyPost.forRent && propertyPost.forSale;
  const shouldShowChooseContactType = false;
  useEffect(() => {
    if (isMe) {
      if (state.user.firstName) {
        const fullName = getUserFullName(state.user);
        setName(fullName);
      }
      if (state.user.email) {
        setEmail(state.user.email);
      }
      if (state.user.phoneNumber) {
        setMobile(state.user.phoneNumber);
      }
    }
  }, [state.user, isMe]);

  const validateForm = () => {
    const errorsObj = {
      name: ValidateInput.checkName(name),
      mobile: ValidateInput.checkMobilePhone(mobile),
    };
    if (email) {
      const errorEmail = ValidateInput.checkEmail(email);
      if (errorEmail) {
        errorsObj.email = errorEmail;
      }
    }
    setErrors(errorsObj);
    for (const [, value] of Object.entries(errorsObj)) {
      if (value) {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    if (submitted) {
      validateForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, mobile, email]);

  const submitForm = () => {
    setSubmitted(true);
    if (validateForm()) {
      setErrors({});
      captchaRef?.current?.show(onGetCaptchaSuccess);
    }
  };

  const onGetCaptchaSuccess = captcha => {
    createContactTradingRequest({
      propertyPost,
      user: state.user,
      agentInfo: state.agentInfo,
      customerEmail: email,
      customerPhoneNumber: mobile,
      customerFullName: name,
      tokenCaptcha: captcha,
      requesterIsBuyer: isMe,
    });
  };

  const onChangeIsMe = checked => {
    setIsMe(checked);
    if (checked) {
      setErrors({});
    } else {
      setName('');
      setEmail('');
      setMobile('');
    }
  };

  const onChangePhoneCode = () => {};

  const onChosenContactType = item => {
    setState({...state, contactType: item?.id});
  };

  const propertyPrice = isRenting
    ? `${MeasureUtils.getPriceDescriptionNoUnitInput(
        propertyPost?.propertyPostForRentDto?.rentPrice,
      )}/${translate('common.month').toLowerCase()}`
    : `${NumberUtils.formatNumberToCurrencyNumber(propertyPost?.price, 0)} ${APP_CURRENCY}`;

  const prireRequest = isC2C
    ? propertyPrice
    : `${NumberUtils.formatNumberToCurrencyNumber(propertyPost?.price, 0)}`;

  return (
    <Captcha ref={captchaRef}>
      <View style={styles.container}>
        <KeyboardScrollView contentStyle={styles.contentContainer}>
          <View style={styles.postInfo}>
            <ImageProgress
              containerStyle={styles.postInfoImage}
              imageContainerStyle={styles.postInfoImage}
              image
              url={image}
            />
          </View>
          <View style={commonStyles.separatorRow16} />
          <View>
            <Text style={styles.postTitle}>{postTitle}</Text>
          </View>
          {shouldShowChooseContactType && (
            <>
              <View style={commonStyles.separatorRow16} />
              <View style={[HELPERS.row]}>
                <Text style={styles.contactTypeTitle}>
                  {translate('contactTrading.yourRequest')}:
                </Text>
                <View style={commonStyles.separatorColumn24} />
                <View style={HELPERS.fill}>
                  <RadioSelectionsView
                    data={contactTypes}
                    chosenItemId={state.contactType}
                    onChosen={onChosenContactType}
                  />
                </View>
              </View>
            </>
          )}
          <View style={commonStyles.separatorRow16} />
          <Text style={styles.priceTitle}>
            {translate(STRINGS.PRICE)}: <Text style={styles.priceText}>{prireRequest}</Text>
          </Text>
          <CustomCheckbox
            images={['checkbox', 'checkbox-blank-outline']}
            customCheckedBox
            iconCheckedColor={COLORS.PRIMARY_A100}
            iconColor={COLORS.GRAY_C9}
            title={isBuying ? translate(STRINGS.IS_BUYER) : translate('propertyPost.isRenter')}
            style={styles.checkBoxIsMe}
            onChange={onChangeIsMe}
          />
          <InputSection
            headerTitle={translate(STRINGS.CUSTOMER_FULLNAME)}
            placeholder={translate(STRINGS.FIll_NAME)}
            inputStyle={styles.inputContainer}
            value={name}
            onChangeText={setName}
            error={errors.name}
            editable={!isMe}
            isRequired={true}
          />
          <PhoneInputSection
            headerTitle={translate(STRINGS.PHONE_NUMBER)}
            inputContainerStyle={styles.inputContainer}
            inputStyle={styles.inputPhoneInput}
            value={mobile}
            keyboardType={KEY_BOARD_TYPE.PHONE_NUMBER}
            isRequired
            editable={!isMe}
            error={errors.mobile}
            onChangeText={setMobile}
            onChangePhoneCode={onChangePhoneCode}
          />
          <InputSection
            keyboardType={KEY_BOARD_TYPE.EMAIL}
            headerTitle={translate(STRINGS.EMAIL)}
            placeholder={translate(STRINGS.FILL_EMAIL)}
            inputStyle={styles.inputContainer}
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            editable={!isMe}
          />
          <View style={commonStyles.separatorRow16} />
          {isBuying && <ListSupportTypes items={services} onSelectItem={onSelectService} />}
          <View style={commonStyles.separatorRow24} />
        </KeyboardScrollView>
        <SubmitComponent onPress={submitForm} text={translate(STRINGS.CONFIRM_SEND)} />
      </View>
    </Captcha>
  );
};

ContactToBuyForm.defaultProps = {
  state: {
    showSuccessPopup: false,
    user: {},
    agentInfo: {},
    contactType: CONTACT_TRADING_TYPE.BUY,
  },
  setState: () => {},
  onSubmitSuccess: () => {},
  postTitle: '',
  image: null,
  price: null,
  propertyPost: {},
};

export default ContactToBuyForm;
