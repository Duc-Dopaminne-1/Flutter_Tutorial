import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, Keyboard, StyleSheet, Text, View} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';

import {KEY_BOARD_TYPE} from '../../../assets/constants';
import {SIZES} from '../../../assets/constants/sizes';
import {IMAGES} from '../../../assets/images';
import {translate} from '../../../assets/localize';
import {Message} from '../../../assets/localize/message/Message';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {normal} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import CustomButton from '../../../components/Button/CustomButton';
import CustomIconButton from '../../../components/CustomIconButton';
import DropdownIcon from '../../../components/DropdownIcon';
import ErrorText from '../../../components/ErrorText';
import RequiredLabel from '../../../components/RequiredLabel';
import WhiteBoxInput from '../../../components/WhiteBoxInput';
import logService from '../../../service/logService';
import ValidateInput from '../../../utils/ValidateInput';
import {useMount} from '../../commonHooks';
import {NewPostStyles} from '../NewPost/NewPostComponents/NewPostConstant';
import {useClosePropertyPost} from '../usePropertyPostActions';

const {width: windowWidth} = Dimensions.get('window');

const PADDING_HORIZONTAL = normal;

const styles = StyleSheet.create({
  viewContainer: {
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.BORDER_RADIUS_10,
    padding: PADDING_HORIZONTAL,
    backgroundColor: COLORS.BACKGROUND,
  },
  textTitle: {
    ...FONTS.semiBold,
    fontSize: 21,
  },
  textLabel: {
    marginTop: 12,
  },
  dropdown: {
    borderRadius: 5,
    marginTop: 8,
    borderWidth: 0,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    paddingTop: 10,
    paddingBottom: 12,
    paddingLeft: 8,
  },
  textStyleButtonDropdown: {
    ...FONTS.regular,
    fontSize: 14,
  },
  dropdownTextStyle: {
    ...FONTS.regular,
    fontSize: 14,
  },
  dropdownListShow: {
    width: windowWidth - PADDING_HORIZONTAL * 4 - 10,
    height: 125,
  },
  buttonConfirm: {
    marginTop: 20,
  },
});

const CUSTOMER_TYPE = {
  INSIDE: 'INSIDE',
  OUTSIDE: 'OUTSIDE',
  UNSALE: 'UNSALE',
};

const ARR_CUSTOMER_TYPE = [CUSTOMER_TYPE.INSIDE, CUSTOMER_TYPE.OUTSIDE, CUSTOMER_TYPE.UNSALE];

const ARR_TEXT_TYPES = [
  translate(STRINGS.CUSTOMER_INSIDE_TOPENLAND),
  translate(STRINGS.CUSTOMER_OUTSIDE_TOPENLAND),
  translate(STRINGS.CANNOT_SELL),
];

const validateInputs = (customerType, phoneNumber) => {
  if (!customerType) {
    return translate(Message.ERR_CHOOSE_CUSTOMER_INFO);
  }
  if (customerType === CUSTOMER_TYPE.INSIDE) {
    return translate(ValidateInput.checkMobilePhone(phoneNumber));
  }
  return '';
};

const DEFAULT_DROPDOWN_INDEX = 0;

const ViewInputPhone = ({onChangeTextPhone}) => {
  return (
    <View>
      <RequiredLabel
        style={styles.textLabel}
        isRequired={false}
        title={translate(STRINGS.CUSTOMER_PHONE_NUMBER)}
      />
      <WhiteBoxInput
        textInputStyle={NewPostStyles.textInput}
        placeholder={translate(STRINGS.PHONE_NUMBER)}
        keyboardType={KEY_BOARD_TYPE.PHONE_NUMBER}
        onChangeText={onChangeTextPhone}
      />
    </View>
  );
};

const ViewHeader = ({onPressDismiss}) => {
  return (
    <View style={commonStyles.viewFirstRow}>
      <Text style={styles.textTitle}>{translate(STRINGS.CLOSE_POST_CONFIRM)}</Text>
      <CustomIconButton
        style={styles.buttonDimiss}
        onPress={onPressDismiss}
        image={IMAGES.IC_DISMISS}
      />
    </View>
  );
};

const ClosePropertyPostPopup = ({
  propertyPostId,
  onPressDismiss,
  onClosePostSuccess = () => {},
}) => {
  const [errorState, setErrorState] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerType, setCustomerType] = useState(ARR_CUSTOMER_TYPE[DEFAULT_DROPDOWN_INDEX]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [shouldShowDropdown, setShouldShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useMount(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true); // or some other action
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false); // or some other action
    });
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  });

  useEffect(() => {
    if (!isKeyboardVisible && shouldShowDropdown) {
      dropdownRef.current.show();
    }
  }, [isKeyboardVisible, shouldShowDropdown]);

  const onErrorClosePost = error => {
    setErrorState(error?.errorMessage);
  };

  const closePropertyPostInput = {customerType, phoneNumber, propertyPostId};
  const {closePropertyPost} = useClosePropertyPost({
    closePropertyPostInput,
    onSuccess: onClosePostSuccess,
    onError: onErrorClosePost,
    // showSpinner: true,
  });

  const onChangeTextPhone = text => {
    setPhoneNumber(text);
  };

  const onPressConfirm = () => {
    const errCheck = validateInputs(customerType, phoneNumber);
    setErrorState(errCheck);
    if (!errCheck) {
      closePropertyPost(closePropertyPostInput);
    }
  };

  const onSelectDropdown = ids => {
    setErrorState('');
    setCustomerType(ARR_CUSTOMER_TYPE[ids]);
  };

  const onDropDownWillShow = () => {
    logService.log('isKeyboardVisible: ', isKeyboardVisible);
    if (isKeyboardVisible) {
      Keyboard.dismiss();
      setShouldShowDropdown(true);
      return false;
    }
    return true;
  };

  const onDropdownWillHide = () => {
    setShouldShowDropdown(false);
  };

  return (
    <View style={styles.viewContainer}>
      <ViewHeader onPressDismiss={onPressDismiss} />
      <RequiredLabel
        style={styles.textLabel}
        isRequired={false}
        title={translate(STRINGS.CUSTOMER_INFORMATION)}
      />
      <View>
        <ModalDropdown
          ref={dropdownRef}
          defaultIndex={DEFAULT_DROPDOWN_INDEX}
          defaultValue={ARR_TEXT_TYPES[DEFAULT_DROPDOWN_INDEX]}
          style={styles.dropdown}
          textStyle={styles.textStyleButtonDropdown}
          dropdownTextStyle={styles.dropdownTextStyle}
          dropdownStyle={styles.dropdownListShow}
          options={ARR_TEXT_TYPES}
          onSelect={onSelectDropdown}
          keyboardShouldPersistTaps="always"
          onDropdownWillShow={onDropDownWillShow}
          onDropdownWillHide={onDropdownWillHide}
        />
        <DropdownIcon onPress={() => dropdownRef.current.show()} />
      </View>
      {customerType === CUSTOMER_TYPE.INSIDE && (
        <ViewInputPhone onChangeTextPhone={onChangeTextPhone} />
      )}
      <ErrorText errorText={errorState} />
      <CustomButton
        title={translate(STRINGS.CONFIRM)}
        style={[commonStyles.buttonNext, styles.buttonConfirm]}
        onPress={onPressConfirm}
      />
    </View>
  );
};
export default ClosePropertyPostPopup;
