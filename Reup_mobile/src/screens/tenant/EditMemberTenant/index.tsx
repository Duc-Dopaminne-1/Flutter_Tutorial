import Container from "@src/components/Container"
import React, { useState, useEffect, useRef } from "react"
import translate from "@src/localize"
import { ICON_EDIT_WHITE, AVATAR_DEFAULT_RECTANGLE } from "@src/constants/icons"
import { KeyboardAvoidingView, ScrollView, View, Alert, Keyboard } from "react-native"
import getStyles from "@src/utils/getStyles"
import { getKeyboardAdvoidStyle, isAndroid } from "@src/utils"
import { Formik } from "formik"
import CustomSectionHeader from "@src/components/CustomSection"
import styles from "./styles"
import { ObjDropdown } from "@src/components/Dropdown/DropdownNative"
import { object, string } from "yup"
import CustomInput from "@src/components/CustomInput"
import ErrorMessage from "@src/components/ErrorMessage"
import { CustomButton } from "@src/components/CustomButton"
import { CustomDropdownSelect } from "@src/components/CustomDropdownSelect"
import CustomPhoneInput from "@src/components/CustomPhoneInput"
import { findIndex } from "lodash"
import CustomAccessory from "@src/components/CustomAccessory"
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory'
import { HEIGHT } from "@src/constants/vars"
import { CustomText } from "@src/components/CustomText"
import { CustomTouchable } from "@src/components/CustomTouchable"
import DocumentPickerImage from "@src/components/DocumentPickerImage"
import RectangleAvatar from "@src/components/RectangleAvatar"
import NavigationActionsService from "@src/navigation/navigation"
import { useRoute } from "@react-navigation/native"
import { RoleUnit } from '@reup/reup-api-sdk/libs/api/enum';
import moment from "moment"
import { useDispatch, useSelector } from "react-redux"
import { uploadImage } from "@src/modules/auth/actions"
import { updateMember } from "@src/modules/Units/actions"


export const defaultChoose = translate('new_member.please_choose')
export enum RoleMember {
  OWNER = RoleUnit.Owner,
  TENANT = RoleUnit.Tenant,
  MEMBER = RoleUnit.Member,
}

export const role: ObjDropdown[] = [
  { _key: '', _value: defaultChoose },
  { _key: RoleMember.OWNER + "", _value: RoleMember.OWNER + "" },
  { _key: RoleMember.MEMBER + "", _value: RoleMember.MEMBER + "" },
  { _key: RoleMember.TENANT + "", _value: RoleMember.TENANT + "" },
];

interface InfoMember {
  firstName: string;
  lastName: string;
  role: RoleMember;
  email?: string;
  phone?: string;
  phoneCode?: string;
  phoneFake?: string;
  avatar?: string;
}
let isShowKeyboard = false;
const EditMemberTenant = () => {
  const phoneRef = useRef(undefined);
  const [currentInputIndex, setCurrentInputIndex] = useState<number>(0)
  const inputComponents: any[] = []
  const numberOfInput = 5
  const documentRef: any = useRef(null)
  const { item, unitId, updateSuccess }: any = useRoute().params;
  const [avatar, setAvatar] = useState<string>(item.member.avatar ?? '');
  const dispatch = useDispatch();
  const identity: any = useSelector<any>(state => {
    return {
      identity_type: state.auth.userData.identity_type,
      identity_code: state.auth.userData.identity_code,
    };
  })

  const infoMember = {
    firstName: item.member.first_name ?? '',
    lastName: item.member.last_name ?? '',
    role: item.role,
    email: item.member.email ?? '',
    phone: item.member.phone ?? '',
    phoneCode: item.member.phone_code ?? '',
    phoneFake: item.member.phone ?? '',
    avatar: item.member.avatar ?? ''
  }

  const [paddingBottom, setPaddingBottom] = useState(0);
  const keyboardDidShow = () => {
    if (isShowKeyboard) {
      if (paddingBottom === 44) {
        return;
      }
      setPaddingBottom(44)
      return;
    }
    isShowKeyboard = true;
    if (paddingBottom === 0) {
      return;
    }
    setPaddingBottom(0)
  };

  const keyboardDidHide = () => {
    isShowKeyboard = false
    setPaddingBottom(0)
  };

  useEffect(() => {
    Keyboard.addListener(isAndroid() ? 'keyboardDidHide' : 'keyboardWillHide', keyboardDidHide)
    Keyboard.addListener(isAndroid() ? 'keyboardDidShow' : 'keyboardWillShow', keyboardDidShow)
    isShowKeyboard = false;
    return () => {
      Keyboard.removeListener(isAndroid() ? 'keyboardDidHide' : 'keyboardWillHide', keyboardDidHide)
      Keyboard.removeListener(isAndroid() ? 'keyboardDidShow' : 'keyboardWillShow', keyboardDidShow)
    };
  }, []);

  const validationSchema = object().shape({
    firstName: string()
      .trim()
      .required(translate('edit_member.required_first_name')),
    lastName: string()
      .trim()
      .required(translate('edit_member.required_last_name')),
    role: string()
      .trim()
      .required(translate('edit_member.required_role'))
      .test('role',
        translate('edit_member.required_role'),
        function (value) {
          return this.parent.role !== defaultChoose;
        }),
  });

  const putInputRef = (inp: any) => {
    inputComponents.push(inp)
  }

  const getInputRef = (index: number) => {
    setCurrentInputIndex(index)
    return inputComponents[index]
  }

  const nextInput = () => {
    const currentInput = getInputRef(currentInputIndex)
    currentInput.onDonePress && currentInput.onDonePress()
    currentInput.dismiss && currentInput.dismiss()
    setTimeout(() => {
      return getInputRef(currentInputIndex + 1).focus()
    }, 100)
  }

  const previousInput = () => {
    const currentInput = getInputRef(currentInputIndex)
    currentInput.onDonePress && currentInput.onDonePress()
    currentInput.dismiss && currentInput.dismiss()
    setTimeout(() => {
      return getInputRef(currentInputIndex - 1).focus()
    }, 100)
  }

  const doneTyping = () => {
    return Keyboard.dismiss()
  }

  const onSubmit = (values: InfoMember) => {
    const param: any = {
      member: {
        email: values.email ?? '',
        first_name: values.firstName,
        last_name: values.lastName,
        avatar: values.avatar ? values.avatar : '',
        phone: values.phoneFake,
        phone_code: values.phoneCode,
        identity_code: identity ? identity.identity_code : '',
        identity_type: identity ? identity.identity_type : '',
      },
      role: values.role
    };

    const newParam: any = {
      member: {},
      role: values.role
    };

    Object.keys(param.member).map(key => {
      if (param.member[key]) {
        newParam['member'][key] = param.member[key];
      }
    });

    NavigationActionsService.showLoading()
    dispatch(updateMember({
      unitId: unitId,
      id: item.id,
      params: newParam,
      onSuccess: (data) => {
        updateSuccess(data);
        NavigationActionsService.hideLoading()
        setTimeout(() => {
          NavigationActionsService.pop();
        }, 500);
      },
      onFail: error => {
        NavigationActionsService.hideLoading()
        setTimeout(() => {
          error && Alert.alert(translate('alert.title_error'), error.message);
        }, 700);
      }
    }
    ));
  }

  const renderSectionHeader = () => {
    return (
      <CustomSectionHeader
        title={translate('edit_member.title_section_header')}
        icon={ICON_EDIT_WHITE}
        style={styles.sectionHeader}
        styleIcon={styles.iconSectionHeader}
        styleTitle={styles.titleSectionHeader}
      />
    )
  }

  const renderInputFirstName = (formikProps: any) => {
    const { values, errors, setValues, touched, handleBlur } = formikProps
    return (
      <>
        <CustomInput
          componentContainer={styles.input}
          description={translate("edit_member.title_first_name")}
          onChangeText={(text: string) => {
            setValues({ ...values, firstName: text })
          }}
          autoCapitalize="words"
          returnKeyType="next"
          value={values.firstName}
          onBlur={handleBlur('firstName')}
          isShowRequired={true}
          inputRef={(input: any) => { putInputRef(input) }}
          onFocus={() => setCurrentInputIndex(0)}
        />
        <ErrorMessage errorValue={touched.firstName && errors.firstName} style={styles.errorMessage} />
      </>
    )
  }

  const renderInputLastName = (formikProps: any) => {
    const { values, errors, setValues, touched, handleBlur } = formikProps
    return (
      <>
        <CustomInput
          description={translate("edit_member.title_last_name")}
          onChangeText={(text: string) => {
            setValues({ ...values, lastName: text })
          }}
          autoCapitalize="words"
          returnKeyType="next"
          value={values.lastName}
          onBlur={handleBlur('lastName')}
          isShowRequired={true}
          inputRef={(input: any) => { putInputRef(input) }}
          onFocus={() => setCurrentInputIndex(1)}
        />
        <ErrorMessage errorValue={touched.lastName && errors.lastName} style={styles.errorMessage} />
      </>
    )
  }

  const renderInputRole = (formikProps: any) => {
    const { values, errors, setValues, touched } = formikProps

    return (
      <>
        <CustomDropdownSelect
          numberOfInput={numberOfInput}
          currentInputIndex={currentInputIndex}
          containerStyle={styles.dropdownRole}
          inputRef={(input: any) => { putInputRef(input) }}
          textTitle={translate("edit_member.title_role")}
          onFocus={() => setCurrentInputIndex(2)}
          arrData={role}
          onPressDown={nextInput}
          onPressUp={previousInput}
          selected={findIndex(role, { _key: values.role })}
          onChangeDropDown={(obj: ObjDropdown) => {
            setValues({ ...values, role: obj._key })
          }}
          isShowRequired={true}
        />
        <ErrorMessage errorValue={touched.role && errors.role} style={styles.errorMessage} />
      </>
    )
  }

  const renderInputEmail = (formikProps: any) => {
    const { values, errors, setValues, touched, handleBlur } = formikProps
    return (
      <>
        <CustomInput
          description={translate("edit_member.title_email")}
          onChangeText={(text: string) => {
            setValues({ ...values, email: text })
          }}
          autoCapitalize="none"
          returnKeyType="next"
          value={values.email}
          onBlur={handleBlur('email')}
          inputRef={(input: any) => { putInputRef(input) }}
          onFocus={() => setCurrentInputIndex(3)}
        />
        <ErrorMessage errorValue={touched.email && errors.email} style={styles.errorMessage} />
      </>
    )
  }

  const renderInputPhone = (formikProps: any) => {
    const { values, errors, handleChange, touched, handleBlur, setValues } = formikProps
    return (
      <>
        <CustomPhoneInput
          inputRef={(input: any) => {
            phoneRef.current = input;
            putInputRef(input);
          }}
          description={translate('edit_member.title_phone')}
          countryCodeValue={values.phoneCode}
          onFocus={() => setCurrentInputIndex(4)}
          onChangePhoneNumber={(phoneFake: string, phone: string, phoneCode: string) => {
            setValues({ ...values, phoneFake, phone, phoneCode });
          }}
          returnKeyType="next"
          value={values.phoneFake}
          onBlur={handleBlur('phone')}
        />
        <ErrorMessage errorValue={touched.phone && errors.phone} style={styles.errorMessage} />
      </>
    )
  }

  const renderPicker = (formikProps: any) => {
    const { values, setValues } = formikProps;
    return (
      <DocumentPickerImage
        ref={documentRef}
        onCompleted={(imageResponse: any) => {
          setAvatar(imageResponse.path);
          setValues({ ...values, avatar: imageResponse.path })
          let file = {};
          if (imageResponse) {
            file = {
              uri: imageResponse.path,
              type: imageResponse.mime,
              name: moment().valueOf().toString() + ".jpg"
            };
          }
          const formData = new FormData();
          formData.append("folder_name", 'media/photos');
          formData.append('file', file);
          NavigationActionsService.showLoading();
          dispatch(
            uploadImage({
              data: formData,
              progress: () => { },
              onSuccess: (data) => {
                setValues({ ...values, avatar: data ? data.url : '' });
                NavigationActionsService.hideLoading();
              },
              onFail: error => {
                NavigationActionsService.hideLoading();
                setTimeout(() => {
                  error && Alert.alert(translate('alert.title_error'), error.message);
                }, 700);
              },
            }),
          );
        }}
      />
    )
  };

  const renderAvatar = () => {
    return (
      <>
        <View style={styles.avatarContainer}>
          <CustomText
            text={translate('edit_member.avatar')}
            styleContainer={styles.avatarTitle}
            style={styles.textAvatar} />
          <CustomTouchable onPress={() => { documentRef.current && documentRef.current.show() }}>
            <CustomText
              text={translate('edit_member.change_the_avatar')}
              styleContainer={styles.changeAvatar}
              style={styles.textChangeAvatar} />
          </CustomTouchable>
        </View>
        <RectangleAvatar
          imageDefault={AVATAR_DEFAULT_RECTANGLE}
          width={50}
          height={50}
          avatar={avatar}
          styleContainer={{ alignItems: 'flex-start' }}
        />
      </>
    )
  }

  const renderSaveBtn = (formikProps: any) => {
    return (
      <View style={styles.buttonContainer}>
        <CustomButton
          onPress={formikProps.handleSubmit}
          text={translate('edit_member.save')}
          style={styles.button} />
      </View>
    )
  }

  const renderInputFields = () => {
    return (
      <Formik
        initialValues={infoMember}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(formikProps) => (
          <View style={[styles.listContainer, !isAndroid() ? { paddingBottom: paddingBottom } : {}]}>
            <ScrollView style={styles.containerScrollView}>
              {renderInputFirstName(formikProps)}
              {renderInputLastName(formikProps)}
              {renderInputRole(formikProps)}
              {renderInputEmail(formikProps)}
              {renderInputPhone(formikProps)}
              {renderAvatar()}
              {renderPicker(formikProps)}
            </ScrollView>
            {renderSaveBtn(formikProps)}
          </View>
        )}
      </Formik>
    )
  }

  const renderKeyboardAccessory = () => {
    return (
      <KeyboardAccessoryView style={styles.accessory} androidAdjustResize>
        <CustomAccessory
          currentInputIndex={currentInputIndex}
          numberOfInput={numberOfInput}
          onPressDown={nextInput}
          onPressUp={previousInput}
          onPressDone={doneTyping}
        />
      </KeyboardAccessoryView>
    )
  }

  return (
    <Container
      isShowHeader={true}
      title={translate('edit_member.title')}
      isDisplayNotification={false}
      isDisplayMenuButton={false}
    >
      <KeyboardAvoidingView style={getStyles('flex-1')} keyboardVerticalOffset={getKeyboardAdvoidStyle()} behavior={'padding'}>
        {renderSectionHeader()}
        {renderInputFields()}
      </KeyboardAvoidingView>
      {renderKeyboardAccessory()}
    </Container>
  )
}

export default EditMemberTenant
