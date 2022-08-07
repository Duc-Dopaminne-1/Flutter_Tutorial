import React, { useState, useEffect, useRef } from 'react';
import { View, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, ScrollView, Alert } from 'react-native';
import Modal from 'react-native-modal';
import styles from './styles';
import { CustomText } from '@src/components/CustomText';
import { CustomButton } from '@src/components/CustomButton';
import ICON_LANDLORD from '@src/res/icons/icon_landlord.png';
import CustomSectionHeader from '@src/components/CustomSection';
import { upperCase, findIndex } from 'lodash';
import translate from '@src/localize';
import { CustomTouchable } from '@src/components/CustomTouchable';
import CustomInput from '@src/components/CustomInput';
import ErrorMessage from '@src/components/ErrorMessage';
import { Formik } from 'formik';
import * as yup from 'yup';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import CustomAccessory from '@src/components/CustomAccessory';
import { isAndroid, getKeyboardAdvoidStyle, getUserNameFromMail } from '@src/utils';
import { HEIGHT } from '@src/constants/vars';
import { ObjDropdown } from '@src/components/Dropdown/DropdownNative';
import { CustomDropdownSelect } from '@src/components/CustomDropdownSelect';
import { RoleUnit } from '@reup/reup-api-sdk/libs/api/enum';
import { baseURLInvitations } from '@src/services/init';
import { useDispatch } from 'react-redux';
import { api } from '@reup/reup-api-sdk';
import { invitations } from '@src/modules/Units/actions';
import { ICompanyUnit } from '@reup/reup-api-sdk/libs/api/company/unit/model';
import { emailRegex } from '@src/constants/regex';
import NavigationActionsService from '@src/navigation/navigation';

interface Props {
  item: ICompanyUnit;
  visible: boolean;
  onBackdropPress: () => void;
}

const InviteUser = (props: Props) => {
  const dispatch = useDispatch();
  const { item, visible, onBackdropPress } = props;
  const [currentInputIndex, setCurrentInputIndex] = useState<number>(0);
  const inputComponents: any[] = [];

  const validateEmail = (email: string) => {
    return emailRegex.test(email)
  }

  const validationSchema = yup.object().shape({
    role: yup
      .string()
      .trim()
      .required(translate('new_member.required_role')),
    email: yup
      .string()
      .trim()
      .required(`${translate('error_validate_field.email')} ${translate('error_validate_field.input_is_require')}!`)
      .test(
        "email",
        translate("authentication.valid_email"),
        value => {
          if (validateEmail(value)) {
            return true
          }
          return false
        }
      ),
  });

  const putInputRef = (inp: any) => {
    inputComponents.push(inp);
  };

  const getInputRef = (index: number) => {
    setCurrentInputIndex(index);
    return inputComponents[index];
  };

  const nextInput = () => {
    return getInputRef(currentInputIndex + 1).focus();
  };

  const previousInput = () => {
    return getInputRef(currentInputIndex - 1).focus();
  };

  const doneTyping = () => {
    return Keyboard.dismiss();
  };

  const renderButtonClose = () => {
    return (
      <CustomTouchable onPress={onBackdropPress}>
        <CustomText text='X' style={styles.textClose} styleContainer={styles.closeContainer} />
      </CustomTouchable>
    );
  };

  const renderHeader = () => {
    return (
      <CustomSectionHeader
        style={styles.sectionHeader}
        title={upperCase(translate("apartments.invite"))
        }
        icon={ICON_LANDLORD}
        rightComponent={renderButtonClose()}
      />
    );
  };

  const renderKeyboardAccessory = () => (
    <KeyboardAccessoryView style={{ padding: 0, height: 45 }} androidAdjustResize>
      <CustomAccessory
        currentInputIndex={currentInputIndex}
        numberOfInput={2}
        onPressDown={nextInput}
        onPressUp={previousInput}
        onPressDone={doneTyping}
      />
    </KeyboardAccessoryView>
  );

  const roles = [
    { _key: '', _value: 'Please Choose' },
    { _key: `${RoleUnit.Owner}`, _value: RoleUnit.Owner.valueOf() },
    { _key: `${RoleUnit.Tenant}`, _value: RoleUnit.Tenant.valueOf() },
    { _key: `${RoleUnit.Member}`, _value: RoleUnit.Member.valueOf() },
  ]

  const inviteUser = async (values: any) => {
    if (item && item.id) {
      const params = {
        email: values.email,
        activation_link_template: `${baseURLInvitations}/invitation?type=UNIT_MEMBER&token={token}`,
        role: values.role,
      }
      NavigationActionsService.showLoading()
      dispatch(
        invitations({
          unitId: item.id,
          params,
          onSuccess: () => {
            NavigationActionsService.hideLoading()
            renderAlert(values.email);
          },
          onFail: (error) => {
            NavigationActionsService.hideLoading()
            setTimeout(() => {
              error && Alert.alert(translate('alert.title_error'), error.message);
            }, 700);
          }
        })
      );
    }
  }

  const renderAlert = (email: string) => (
    Alert.alert(translate('invite_user.title_confirm'),
      translate('invite_user.message_invite', { user: getUserNameFromMail(email) }), [
      {
        text: translate('invite_user.ok'),
        style: 'cancel',
        onPress: onBackdropPress,
      }
    ])
  )

  const onSubmitInviteUser = (values: any, actions: any) => {
    inviteUser(values);
  }

  const renderFields = () => {
    return (
      <Formik initialValues={{ role: '', email: '', }} onSubmit={onSubmitInviteUser} validationSchema={validationSchema}>
        {formikProps => (
          <View style={styles.inputFormSubContainer}>
            <ScrollView>
              <CustomDropdownSelect
                numberOfInput={2}
                currentInputIndex={currentInputIndex}
                arrData={roles}
                textTitle={`${translate('invite_staff.role')}`}
                lineBottom={false}
                containerStyle={styles.filter}
                selected={findIndex(roles, { _key: formikProps.values.role }) ?? 0}
                onChangeDropDown={(object: ObjDropdown) => {
                  formikProps.setValues({ ...formikProps.values, role: object._key })
                }}
                inputRef={putInputRef.bind(undefined)}
                onFocus={() => setCurrentInputIndex(0)}
                onPressDown={nextInput}
                onPressUp={previousInput}
                containerMainStyle={styles.roleContainer}
              />
              <ErrorMessage errorValue={formikProps.touched.role && formikProps.errors.role} />
              <CustomInput
                description={translate('new_member.title_email')}
                onChangeText={formikProps.handleChange('email')}
                autoCapitalize="none"
                placeholder={translate('error_validate_field.email')}
                returnKeyType="done"
                inputRef={(input: any) => putInputRef(input)}
                value={formikProps.values.email}
                onFocus={() => setCurrentInputIndex(1)}
                onSubmitEditing={formikProps.handleSubmit}
                onBlur={formikProps.handleBlur('email')}
              />
              <ErrorMessage errorValue={formikProps.touched.email && formikProps.errors.email} />

              <View style={styles.buttonContainer} >
                <CustomButton
                  onPress={formikProps.handleSubmit}
                  text={upperCase(translate('authentication.submit_button'))}
                  style={styles.button} />
              </View>
            </ScrollView>
          </View>
        )}
      </Formik>
    );
  };

  return (
    <Modal
      style={{
        margin: 0,
      }}
      hideModalContentWhileAnimating
      useNativeDriver
      customBackdrop={
        <TouchableWithoutFeedback onPress={props.onBackdropPress}>
          <View style={styles.backgroundModal} />
        </TouchableWithoutFeedback>
      }
      key={'InviteUser'}
      coverScreen={false}
      isVisible={visible}>
      <TouchableWithoutFeedback
        onPress={props.onBackdropPress}
        style={styles.keyboardAvoidingView}>
        <View style={styles.viewContain}>
          <KeyboardAvoidingView style={styles.keyboardAvoidingView}
            keyboardVerticalOffset={getKeyboardAdvoidStyle()}
            behavior={'padding'}>
            <View style={styles.content}>
              {renderHeader()}
              {renderFields()}
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
      {renderKeyboardAccessory()}
    </Modal >
  );
};

export default React.memo(InviteUser);
