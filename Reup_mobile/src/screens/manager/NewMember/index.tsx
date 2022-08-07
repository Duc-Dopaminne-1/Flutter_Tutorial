import Container from "@src/components/Container";
import React, { useState, useEffect, useRef } from "react";
import translate from "@src/localize";
import { ADD_PLUS } from "@src/constants/icons";
import { KeyboardAvoidingView, ScrollView, View, Alert, Keyboard } from "react-native";
import getStyles from "@src/utils/getStyles";
import { getKeyboardAdvoidStyle, isAndroid } from "@src/utils";
import { Formik } from "formik";
import CustomSectionHeader from "@src/components/CustomSection";
import styles from "@src/screens/manager/NewMember/styles";
import { ObjDropdown } from "@src/components/Dropdown/DropdownNative";
import { object, string } from "yup";
import CustomInput from "@src/components/CustomInput";
import ErrorMessage from "@src/components/ErrorMessage";
import { CustomButton } from "@src/components/CustomButton";
import { CustomDropdownSelect } from "@src/components/CustomDropdownSelect";
import CustomPhoneInput from "@src/components/CustomPhoneInput";
import AddImage from "@src/components/AddImage";
import { CustomFlatList } from "@src/components/FlatList";
import { clone } from "lodash";
import AddImageItem from "@src/components/FlatListItem/AddImageItem";
import CustomAccessory from "@src/components/CustomAccessory";
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import { useRoute } from "@react-navigation/native";
import moment from 'moment';
import NavigationActionsService from '@navigation/navigation';
import { uploadImage } from '@modules/auth/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RoleUnit } from '@reup/reup-api-sdk/libs/api/enum';
import { createMember } from '@modules/Units/actions';
import { RootState } from "@src/types/types";
import { IUserProfile } from "@reup/reup-api-sdk/libs/api/user/models";
import { countListResident } from "@src/modules/Company/actions";
interface Props {
  route: any
  unitId: string
}

export const defaultChoose = translate('new_member.please_choose');
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
let isShowKeyboard = false;
const NewMember = (props: Props) => {
  const dispatch = useDispatch();
  const phoneRef = useRef(undefined);

  const [images, setImages] = useState<string[]>([]);
  const [currentInputIndex, setCurrentInputIndex] = useState<number>(0);
  const inputComponents: any[] = [];
  const numberOfInput = 5;
  const route = useRoute();
  const { unitId } = route.params as Props;
  const identity: any = useSelector<any>(state => {
    return {
      identity_type: state.auth.userData.identity_type,
      identity_code: state.auth.userData.identity_code,
    };
  });
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const [paddingBottom, setPaddingBottom] = useState(0);

  const keyboardDidShow = () => {
    if (isShowKeyboard) {
      if (paddingBottom === 44) {
        return;
      }
      setPaddingBottom(44);
      return;
    }
    isShowKeyboard = true;
    if (paddingBottom === 0) {
      return;
    }
    setPaddingBottom(0);
  };

  const keyboardDidHide = () => {
    isShowKeyboard = false;
    setPaddingBottom(0);
  };

  useEffect(() => {
    Keyboard.addListener(isAndroid() ? 'keyboardDidHide' : 'keyboardWillHide', keyboardDidHide);
    Keyboard.addListener(isAndroid() ? 'keyboardDidShow' : 'keyboardWillShow', keyboardDidShow);
    isShowKeyboard = false;
    return () => {
      Keyboard.removeListener(isAndroid() ? 'keyboardDidHide' : 'keyboardWillHide', keyboardDidHide);
      Keyboard.removeListener(isAndroid() ? 'keyboardDidShow' : 'keyboardWillShow', keyboardDidShow);
    };
  }, []);

  const fetchCountResident = (companyID: string) => {
    dispatch(countListResident({
      companyId: companyID,
      onFail: error => {
        setTimeout(() => {
          error && Alert.alert(translate('alert.title_error'), error.message);
        }, 700);
      }
    }));
  };

  const initialValues = {
    firstName: '',
    lastName: '',
    role: role[0]._key,
    email: '',
    phone: '',
    phoneFake: '',
    phoneCode: '',
  };

  const validationSchema = object().shape({
    firstName: string()
      .trim()
      .required(translate('new_member.required_first_name')),
    lastName: string()
      .trim()
      .required(translate('new_member.required_last_name')),
    role: string()
      .trim()
      .required(translate('new_member.required_role'))
      .test("role",
        translate('new_member.required_role'),
        function (value) {
          return this.parent.role !== defaultChoose;
        }),
  });

  const putInputRef = (inp: any) => {
    inputComponents.push(inp);
  };

  const getInputRef = (index: number) => {
    setCurrentInputIndex(index);
    return inputComponents[index];
  };

  const nextInput = () => {
    const currentInput = getInputRef(currentInputIndex);
    currentInput.onDonePress && currentInput.onDonePress();
    currentInput.dismiss && currentInput.dismiss();
    setTimeout(() => {
      return getInputRef(currentInputIndex + 1).focus();
    }, 100);
  };

  const previousInput = () => {
    const currentInput = getInputRef(currentInputIndex);
    currentInput.onDonePress && currentInput.onDonePress();
    currentInput.dismiss && currentInput.dismiss();
    setTimeout(() => {
      return getInputRef(currentInputIndex - 1).focus();
    }, 100);
  };

  const doneTyping = () => {
    return Keyboard.dismiss();
  };

  const onLoadImage = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => { };

  const onRemoveImage = (index: number) => {
    const cloneData = clone(images);
    cloneData.splice(index, 1);
    setImages(cloneData);
  };

  const onCompletedPickerImage = (imageResponse: any, formikProps: any) => {
    const { values, errors, setValues, touched, handleBlur } = formikProps;
    const cloneData = clone(images);
    cloneData.push(imageResponse.path);
    setImages(cloneData);
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
          setValues({ ...values, images: data ? data.url : '' });
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

  };

  const onSubmit = async (values: any) => {
    const param: any = {
      member: {
        email: values.email,
        first_name: values.firstName,
        last_name: values.lastName,
        avatar: values.images ? values.images : '',
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

    NavigationActionsService.showLoading();
    dispatch(createMember({
      unitId: unitId,
      params: newParam,
      onSuccess: () => {
        NavigationActionsService.hideLoading();
        if (me && me.default_company) {
          fetchCountResident(me.default_company.id);
        }
        setTimeout(() => {
          NavigationActionsService.pop();
        }, 500);
      },
      onFail: error => {
        NavigationActionsService.hideLoading();
        setTimeout(() => {
          error && Alert.alert(translate('alert.title_error'), error.message);
        }, 700);
      }
    }
    ));
  };

  const renderSectionHeader = () => {
    return (
      <CustomSectionHeader
        title={translate('new_member.title_section_header')}
        icon={ADD_PLUS}
        style={styles.sectionHeader}
        styleIcon={styles.iconSectionHeader}
        styleTitle={styles.titleSectionHeader}
      />
    );
  };

  const renderInputFirstName = (formikProps: any) => {
    const { values, errors, setValues, touched, handleBlur } = formikProps;
    return (
      <>
        <CustomInput
          componentContainer={styles.input}
          description={translate("new_member.title_first_name")}
          onChangeText={(text: string) => {
            setValues({ ...values, firstName: text });
          }}
          autoCapitalize="none"
          returnKeyType="next"
          value={values.firstName}
          onBlur={handleBlur('firstName')}
          isShowRequired={true}
          inputRef={(input: any) => { putInputRef(input); }}
          onFocus={() => setCurrentInputIndex(0)}
        />
        <ErrorMessage errorValue={touched.firstName && errors.firstName} style={styles.errorMessage} />
      </>
    );
  };

  const renderInputLastName = (formikProps: any) => {
    const { values, errors, setValues, touched, handleBlur } = formikProps;
    return (
      <>
        <CustomInput
          description={translate("new_member.title_last_name")}
          onChangeText={(text: string) => {
            setValues({ ...values, lastName: text });
          }}
          autoCapitalize="none"
          returnKeyType="next"
          value={values.lastName}
          onBlur={handleBlur('lastName')}
          isShowRequired={true}
          inputRef={(input: any) => { putInputRef(input); }}
          onFocus={() => setCurrentInputIndex(1)}
        />
        <ErrorMessage errorValue={touched.lastName && errors.lastName} style={styles.errorMessage} />
      </>
    );
  };

  const renderInputRole = (formikProps: any) => {
    const { values, errors, setValues, touched } = formikProps;

    const countrySelected = role.findIndex(item => item._key === values.role);

    return (
      <>
        <CustomDropdownSelect
          numberOfInput={numberOfInput}
          currentInputIndex={currentInputIndex}
          containerStyle={styles.dropdownRole}
          inputRef={(input: any) => { putInputRef(input); }}
          textTitle={translate("new_member.title_role")}
          onFocus={() => setCurrentInputIndex(2)}
          arrData={role}
          onPressDown={nextInput}
          onPressUp={previousInput}
          selected={countrySelected > 0 ? countrySelected : 0}
          onChangeDropDown={(obj: ObjDropdown) => {
            setValues({ ...values, role: obj._key });
          }}
          isShowRequired={true}
        />
        <ErrorMessage errorValue={touched.role && errors.role} style={styles.errorMessage} />
      </>
    );
  };

  const renderInputEmail = (formikProps: any) => {
    const { values, errors, setValues, touched, handleBlur } = formikProps;
    return (
      <>
        <CustomInput
          description={translate("new_member.title_email")}
          onChangeText={(text: string) => {
            setValues({ ...values, email: text });
          }}
          autoCapitalize="none"
          returnKeyType="next"
          value={values.email}
          onBlur={handleBlur('email')}
          inputRef={(input: any) => { putInputRef(input); }}
          onFocus={() => setCurrentInputIndex(3)}
        />
        <ErrorMessage errorValue={touched.email && errors.email} style={styles.errorMessage} />
      </>
    );
  };

  const renderInputPhone = (formikProps: any) => {
    const { values, errors, handleChange, touched, handleBlur, setValues } = formikProps;
    return (
      <>
        <CustomPhoneInput
          inputRef={(input: any) => {
            phoneRef.current = input;
            putInputRef(input);
          }}
          description={translate('new_member.title_phone')}
          onFocus={() => setCurrentInputIndex(4)}
          onChangePhoneNumber={(phoneFake: string, phone: string, phoneCode: string) => {
            setValues({ ...values, phoneFake, phone, phoneCode });
          }}
          value={values.phoneFake}
          onBlur={handleBlur('phone')}
        />
        <ErrorMessage errorValue={touched.phone && errors.phone} style={styles.errorMessage} />
      </>
    );
  };

  const renderItemImage = (item: any, index: number) => {
    return (
      <AddImageItem item={item} index={index} deleteOnpress={onRemoveImage} />
    );
  };

  const renderAddImage = (formikProps: any) => {
    return (
      <>
        <AddImage
          images={images}
          numberOfImage={1}
          description={translate('new_notification.add_image')}
          onCompletedPickerImage={
            (imageResponse => { onCompletedPickerImage(imageResponse, formikProps); })
          }
        />
        <CustomFlatList
          horizontal={true}
          onLoad={onLoadImage}
          data={images}
          showEmpty={false}
          contentContainerStyle={styles.imagesList}
          renderItem={renderItemImage}
        />
      </>
    );
  };

  const renderSubmitBtn = (formikProps: any) => {
    return (
      <View style={styles.buttonContainer}>
        <CustomButton
          onPress={formikProps.handleSubmit}
          text={translate('new_member.submit')}
          style={styles.button} />
      </View>
    );
  };

  const renderInputFields = () => {
    return (
      <Formik
        initialValues={initialValues}
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
              {renderAddImage(formikProps)}
            </ScrollView>
            {renderSubmitBtn(formikProps)}
          </View>
        )}
      </Formik>
    );
  };

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
    );
  };

  return (
    <Container
      spaceBottom={true}
      isShowHeader={true}
      isDisplayNotification={false}
      isDisplayMenuButton={false}
      title={translate('new_member.title')}
    >
      <KeyboardAvoidingView style={getStyles('flex-1')} keyboardVerticalOffset={getKeyboardAdvoidStyle()} behavior={'padding'}>
        {renderSectionHeader()}
        {renderInputFields()}
      </KeyboardAvoidingView>
      {renderKeyboardAccessory()}
    </Container>
  );
};

export default NewMember;
