import React, { useState, useEffect, useRef } from 'react';
import styles from './styles';
import { View, ScrollView, Keyboard, KeyboardAvoidingView, Alert, TouchableWithoutFeedback } from 'react-native';
import { ADD_PLUS } from '@src/constants/icons';
import { CustomButton } from '@src/components/CustomButton';
import Container from '@src/components/Container';
import translate from '@src/localize';
import CustomSectionHeader from '@src/components/CustomSection';
import { Formik } from 'formik';
import CustomInput from '@src/components/CustomInput';
import ErrorMessage from '@src/components/ErrorMessage';
import { object, string } from 'yup';
import Modal from 'react-native-modal';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import CustomAccessory from '@src/components/CustomAccessory';
import getStyles from '@src/utils/getStyles';
import { getKeyboardAdvoidStyle, isAndroid } from '@src/utils';
import { HEIGHT, LimitGetAll } from '@src/constants/vars';
import { CustomDropdownSelect } from '@src/components/CustomDropdownSelect';
import { useRoute } from '@react-navigation/native';
import { ObjDropdown } from '@src/components/Dropdown/DropdownNative';
import { CustomText } from '@src/components/CustomText';
import CustomRadioButton from '@src/components/CustomRadioButton';
import { adminDecentralizationData } from './Model';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@src/types/types';
import { ICompany, ICompanyUserInvitation } from '@reup/reup-api-sdk/libs/api/company/models';
import { getListProperty, inviteStaff, getListPosition } from '@src/modules/Company/actions';
import { ICompanyProperty } from '@reup/reup-api-sdk/libs/api/company/property/model';
import { CustomTouchable } from '@src/components/CustomTouchable';
import CustomSelect, { CustomSelectType } from '@src/components/CustomSelect';
import { findIndex } from 'lodash';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { ICountry } from '@reup/reup-api-sdk/libs/api/country/model';
import { Role, LevelType } from '@reup/reup-api-sdk/libs/api/enum';
import { ICompanyPosition } from '@reup/reup-api-sdk/libs/api/company/position/model';
import NavigationActionsService from '@src/navigation/navigation';
import { emailRegex } from '@src/constants/regex';
import { baseURLInvitations } from '@src/services/init';

export enum InviteStaffType {
  STAFF,
  ADMIN,
}
let isShowKeyboard = false;
export const rolesStaff: ObjDropdown[] = [
  { _key: 'Staff', _value: 'Staff' },
  { _key: 'Admin', _value: 'Admin' },
];

const InviteStaff = () => {
  const route = useRoute();
  const { flatList } = route.params as any;
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const [currentInputIndex, setCurrentInputIndex] = useState<number>(0);
  const inputComponents: any[] = [];
  const [inviteStaffType, setInviteStaffType] = useState<InviteStaffType>(InviteStaffType.STAFF);
  const [paddingBottom, setPaddingBottom] = useState(0);
  const inputNumb = inviteStaffType === InviteStaffType.STAFF ? 3 : 2;
  const [selectedAdminDecentralization, setSelectedAdminDecentralization] = useState<string>(adminDecentralizationData[0].id || '');
  const companyList = useSelector<RootState, ICompany[]>((state: RootState) => state.company.listCompany.results);
  const propertyList = useSelector<RootState, ICompanyProperty[]>((state: RootState) => state.company.listProperty.results);
  const myCountry = useSelector<RootState, ICountry[]>((state: RootState) => state.company.listMyCountry.results);
  const positionList = useSelector<RootState, ICompanyPosition[]>((state: RootState) => state.company.listPosition.results);

  const [dropdownPosition, setDropdownPosition] = useState<ObjDropdown[]>([]);
  const [selectListProperty, setSelectListProperty] = useState<ObjDropdown[]>([]);
  const [selectListCountry, setSelectListCountry] = useState<ObjDropdown[]>([]);
  const [isPropertyModalVisible, setPropertyModalVisible] = useState<boolean>(false);
  const [isCountryModalVisible, setCountryModalVisible] = useState<boolean>(false);
  const [selectedListProperty, setSelectedListProperty] = useState<string[]>([]);
  const [selectedListCountry, setSelectedListCountry] = useState<string[]>([]);


  const dispatch = useDispatch();

  useEffect(() => {
    const defaultCompany = companyList.find(item => item.id === me.default_company.id);
    const defaultCompanyId = defaultCompany ? defaultCompany.id : '';
    dispatch(getListProperty({
      companyId: defaultCompanyId,
      page: 1,
      limit: LimitGetAll,
      onSuccess: (data) => {
        console.log("===== Success list property: ", data);
      },
      onFail: error => {
        setTimeout(() => {
          error && Alert.alert(translate('alert.title_error'), error.message);
        }, 700);
      }
    }));
    dispatch(getListPosition({
      companyId: defaultCompanyId,
      page: 1,
      limit: LimitGetAll,
      onSuccess: (data) => {
        console.log("===== Success list position: ", data);
      },
      onFail: error => {
        setTimeout(() => {
          error && Alert.alert(translate('alert.title_error'), error.message);
        }, 700);
      }
    }));

  }, [companyList]);

  useEffect(() => {
    const dataList: ObjDropdown[] = [{ _key: '', _value: "Please choose..." }];
    positionList.forEach((item) => {
      const obj: ObjDropdown = {
        _key: item.id.toString(),
        _value: item.name,
      };
      dataList.push(obj);
    });
    setDropdownPosition(dataList);
  }, [positionList]);

  useEffect(() => {
    const dataList: ObjDropdown[] = [];
    propertyList.forEach((item) => {
      const obj: ObjDropdown = {
        _key: item.id,
        _value: item.name,
      };
      dataList.push(obj);
    });
    setSelectListProperty(dataList);
  }, [propertyList]);

  useEffect(() => {
    const dataList: ObjDropdown[] = [];
    myCountry.forEach((item) => {
      const obj: ObjDropdown = {
        _key: item.id + "",
        _value: item.name,
      };
      dataList.push(obj);
    });
    setSelectListCountry(dataList);
  }, [myCountry]);

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

  const validateEmail = (email: string) => {
    return emailRegex.test(email);
  };

  const validationSchemaStaff = object().shape({
    email: string()
      .trim()
      .required(`${translate('invite_staff.email')} ${translate('error.required')}`)
      .test(
        "email",
        translate("authentication.valid_email"),
        value => {
          if (validateEmail(value)) {
            return true;
          }
          return false;
        }
      ),
    role: string()
      .trim()
      .required(`${translate('invite_staff.role')} ${translate('error.required')}`),
    position: string()
      .trim()
      .required(`${translate('invite_staff.position')} ${translate('error.required')}`),
    building: string()
      .trim()
      .required(`${translate('invite_staff.building')} ${translate('error.required')}`),
  });
  const validationSchemaAdminAll = object().shape({
    email: string()
      .trim()
      .required(`${translate('invite_staff.email')} ${translate('error.required')}`)
      .test(
        "email",
        translate("authentication.valid_email"),
        value => {
          if (validateEmail(value)) {
            return true;
          }
          return false;
        }
      ),
    role: string()
      .trim()
      .required(`${translate('invite_staff.role')} ${translate('error.required')}`),
    country: string()
      .trim(),
    building: string()
      .trim()
  });

  const validationSchemaAdminBuilding = object().shape({
    email: string()
      .trim()
      .required(`${translate('invite_staff.email')} ${translate('error.required')}`)
      .test(
        "email",
        translate("authentication.valid_email"),
        value => {
          if (validateEmail(value)) {
            return true;
          }
          return false;
        }
      ),
    role: string()
      .trim()
      .required(`${translate('invite_staff.role')} ${translate('error.required')}`),
    country: string()
      .trim(),
    building: string()
      .trim()
      .required(`${translate('invite_staff.building')} ${translate('error.required')}`),
  });

  const validationSchemaAdminCountry = object().shape({
    email: string()
      .trim()
      .required(`${translate('invite_staff.email')} ${translate('error.required')}`)
      .test(
        "email",
        translate("authentication.valid_email"),
        value => {
          if (validateEmail(value)) {
            return true;
          }
          return false;
        }
      ),
    role: string()
      .trim()
      .required(`${translate('invite_staff.role')} ${translate('error.required')}`),
    country: string()
      .trim()
      .required(`${translate('invite_staff.country')} ${translate('error.required')}`),
    building: string()
      .trim()
  });

  /* KeyBoard Accessory Handle*/
  const putInputRef = (inp: any) => {
    inputComponents.push(inp);
  };

  const getInputRef = (index: number) => {
    setCurrentInputIndex(index);
    return inputComponents[index];
  };

  const nextInput = () => {
    const currentInput = getInputRef(currentInputIndex);
    currentInput.dismiss && currentInput.dismiss();
    setTimeout(() => {
      return getInputRef(currentInputIndex + 1).focus();
    });
  };
  const previousInput = () => {
    getInputRef(currentInputIndex).dismiss && getInputRef(currentInputIndex).dismiss();
    setTimeout(() => {
      return getInputRef(currentInputIndex - 1).focus();
    });
  };
  const doneTyping = () => {
    return Keyboard.dismiss();
  };

  const onFocus = (index: number) => {
    setCurrentInputIndex(index);
  };
  const onSubmitInviteStaff = (values: any) => {
    NavigationActionsService.showLoading();
    const defaultCompany = companyList.find(item => item.id === me.default_company.id);
    const defaultCompanyId = defaultCompany ? defaultCompany.id : '';
    let params: ICompanyUserInvitation;
    if (inviteStaffType === InviteStaffType.STAFF) {
      const role: Role = Role.Staff;
      const email = values.email.trim();
      const levelType: LevelType = LevelType.Property;

      params = {
        email: email,
        activation_link_template: `${baseURLInvitations}/invitation?type=COMPANY_USER&token={token}`,
        role: role,
        position_id: values.position,
        level_type: levelType,
        related_level_list: selectedListProperty,
      };

    } else {
      const role: Role = Role.Admin;
      const email = values.email.trim();
      let levelTypeAdmin: LevelType = LevelType.All;
      if (selectedAdminDecentralization === adminDecentralizationData[0].id) {
        levelTypeAdmin = LevelType.All;
      } else if (selectedAdminDecentralization === adminDecentralizationData[1].id) {
        levelTypeAdmin = LevelType.Country;
      } else if (selectedAdminDecentralization === adminDecentralizationData[2].id) {
        levelTypeAdmin = LevelType.Property;
      }

      let relatedLevelList: string[] = [];

      switch (levelTypeAdmin) {
        case LevelType.All:
          relatedLevelList = [];
          break;
        case LevelType.Country:
          relatedLevelList = selectedListCountry;
          break;
        case LevelType.Property:
          relatedLevelList = selectedListProperty;
          break;
        default:
          relatedLevelList = [];
          break;
      }

      params = {
        email: email,
        activation_link_template: `${baseURLInvitations}/invitation?type=COMPANY_USER&token={token}`,
        role: role,
        level_type: levelTypeAdmin,
        related_level_list: relatedLevelList,
      };
    }
    dispatch(inviteStaff({
      companyId: defaultCompanyId,
      params: params,
      onSuccess: (data) => {
        console.log("===== Success list my country: ", data);
        NavigationActionsService.hideLoading();
        flatList && flatList.current && flatList.current.reloadData();
        NavigationActionsService.pop();
      },
      onFail: error => {
        NavigationActionsService.hideLoading();
        setTimeout(() => {
          error && Alert.alert(translate('alert.title_error'), error.message);
        }, 700);
      }
    }));

  };

  const renderKeyboardAccessory = () => (
    <KeyboardAccessoryView style={{ padding: 0, height: 45 }} androidAdjustResize>
      <CustomAccessory
        currentInputIndex={currentInputIndex}
        numberOfInput={inputNumb}
        onPressDown={nextInput}
        onPressUp={previousInput}
        onPressDone={doneTyping}
      />
    </KeyboardAccessoryView>
  );

  const initialValue = {
    email: "",
    role: "Staff",
    position: "",
    building: "",
    country: "",
  };

  const onChangeDropdown = (obj: ObjDropdown, setFieldValue: any, field: string) => {
    if (obj._key) {
      setFieldValue(field, obj._key.toString());
      return;
    }
    setFieldValue(field, "");
  };

  const onPressAdminDecentralizationData = (item: any) => {
    setSelectedAdminDecentralization(item.id);
    console.log('minh', item);
  };

  const onOpenPropertyModal = () => {
    setPropertyModalVisible(true);
  };

  const onClosePropertyModal = () => {
    setPropertyModalVisible(false);
  };


  const onOpenCountryModal = () => {
    setCountryModalVisible(true);
  };

  const onCloseCountryModal = () => {
    setCountryModalVisible(false);
  };

  const onSelectCountryDone = (selectedList: string[], setFieldValue: any, key: string) => {
    setCountryModalVisible(false);
    setSelectedListCountry(selectedList);

    if (selectedList !== []) {
      let fieldValue = "";
      const listDataDisplay: string[] = [];
      if (selectedList.length === 1) {
        selectListCountry.map((element) => {
          if (element._key === selectedList[0]) {
            fieldValue = element._value;
          }
        });
      } else {
        selectListCountry.forEach((item) => {
          if (selectedList.includes(item._key)) {
            listDataDisplay.push(item._value);
          }
        });
        fieldValue = listDataDisplay.join(", ");
      }
      setFieldValue(key, fieldValue);
    } else {
      setFieldValue(key, "");
    }
  };


  const onSelectPropertyDone = (selectedList: string[], setFieldValue: any, key: string) => {
    setPropertyModalVisible(false);
    setSelectedListProperty(selectedList);
    if (selectedList !== []) {
      let fieldValue = "";
      const listDataDisplay: string[] = [];
      if (selectedList.length === 1) {
        selectListProperty.map((element) => {
          if (element._key === selectedList[0]) {
            fieldValue = element._value;
          }
        });
      } else {
        selectListProperty.forEach((item) => {
          if (selectedList.includes(item._key)) {
            listDataDisplay.push(item._value);
          }
        });
        fieldValue = listDataDisplay.join(", ");
      }
      setFieldValue(key, fieldValue);
    } else {
      setFieldValue(key, "");
    }
  };

  const getValidationSchema = () => {
    let initSchema: any;
    if (inviteStaffType === InviteStaffType.STAFF) {
      initSchema = validationSchemaStaff;
    } else {
      if (selectedAdminDecentralization === adminDecentralizationData[1].id) {
        initSchema = validationSchemaAdminCountry;
      } else if (selectedAdminDecentralization === adminDecentralizationData[2].id) {
        initSchema = validationSchemaAdminBuilding;
      } else {
        initSchema = validationSchemaAdminAll;
      }
    }
    return initSchema;
  };


  const renderEmail = (handleChange: any, values: any, handleBlur: any) => {
    return (
      <CustomInput
        inputRef={(input: any) => putInputRef(input)}
        description={`${translate('invite_staff.email')}:`}
        onChangeText={handleChange('email')}
        autoCapitalize="none"
        returnKeyType="next"
        value={values.email}
        onFocus={() => onFocus(0)}
        onBlur={handleBlur('email')}
        currentInputIndex={currentInputIndex}
        numberOfInput={inputNumb}
      />
    );
  };
  const renderDropdownRole = (values: any, setFieldValue: any) => {
    return <CustomDropdownSelect
      onFocus={() => onFocus(1)}
      numberOfInput={inputNumb}
      currentInputIndex={currentInputIndex}
      onPressUp={previousInput}
      onPressDown={nextInput}
      inputRef={(input: any) => putInputRef(input)}
      textTitle={translate('invite_staff.role')}
      arrData={rolesStaff}
      contentDropdownStyle={styles.contentDropdownStyle}
      containerStyle={styles.dropdownContainer}
      textStyle={styles.textStyle}
      selected={findIndex(rolesStaff, { _key: values.role })}
      lineBottom={true}
      onChangeDropDown={(object) => {
        setInviteStaffType(object._key === 'Staff' ? InviteStaffType.STAFF : InviteStaffType.ADMIN);
        onChangeDropdown(object, setFieldValue, "role");
      }}
    />;
  };

  const renderDropdownPosition = (values: any, setFieldValue: any) => {
    return <CustomDropdownSelect
      onFocus={() => onFocus(2)}
      numberOfInput={inputNumb}
      currentInputIndex={currentInputIndex}
      onPressUp={previousInput}
      onPressDown={nextInput}
      inputRef={(input: any) => putInputRef(input)}
      textTitle={translate('invite_staff.position')}
      arrData={dropdownPosition}
      contentDropdownStyle={styles.contentDropdownStyle}
      containerStyle={styles.dropdownContainer}
      textStyle={styles.textStyle}
      selected={findIndex(dropdownPosition, { _key: values.position })}
      lineBottom={true}
      onChangeDropDown={(object) => {
        onChangeDropdown(object, setFieldValue, "position");
      }}
    />;
  };

  const renderSelectBuilding = (handleChange: any, handleBlur: any, values: any) => {
    return <View>
      <CustomText
        text={translate('invite_staff.building_title')}
        style={styles.titleInputText}
        styleContainer={styles.titleInputContainer}
      />
      <CustomTouchable
        onPress={onOpenPropertyModal}
      >
        <CustomInput
          pointerEvents={'none'}
          multiline={true}
          moreStyle={styles.moreStyleDescription}
          containerStyle={styles.containerStyleInput}
          onChangeText={handleChange('building')}
          inputRef={(input: any) => putInputRef(input)}
          inputStyle={styles.selectStyle}
          numberOfInput={inputNumb}
          onBlur={handleBlur('building')}
          currentInputIndex={currentInputIndex}
          editable={false}
          value={values.building}
        />
      </CustomTouchable>
    </View>;
  };

  const renderModalBuilding = (setFieldValue: any) => {
    return <Modal
      key={'property'}
      hideModalContentWhileAnimating
      isVisible={isPropertyModalVisible}
      useNativeDriver
      customBackdrop={
        <TouchableWithoutFeedback onPress={onClosePropertyModal}>
          <View style={styles.backgroundModal} />
        </TouchableWithoutFeedback>
      }
    >
      <CustomSelect
        checkListData={selectListProperty}
        selectedList={selectedListProperty}
        onCloseModal={onClosePropertyModal}
        onDone={(selectedList: string[]) => {
          onSelectPropertyDone(selectedList, setFieldValue, 'building');
        }}
        type={CustomSelectType.MultiSelect}
      />
    </Modal>;
  };

  const renderModalCountry = (setFieldValue: any) => {
    return <Modal
      key={'country'}
      hideModalContentWhileAnimating
      isVisible={isCountryModalVisible}
      useNativeDriver
      customBackdrop={
        <TouchableWithoutFeedback onPress={onCloseCountryModal}>
          <View style={styles.backgroundModal} />
        </TouchableWithoutFeedback>
      }
    >
      <CustomSelect
        checkListData={selectListCountry}
        selectedList={selectedListCountry}
        onCloseModal={onCloseCountryModal}
        onDone={(selectedList: string[]) => {
          onSelectCountryDone(selectedList, setFieldValue, 'country');
        }}
        type={CustomSelectType.MultiSelect}
      />
    </Modal>;
  };

  const renderRadioListContainer = (handleChange: any, handleBlur: any, values: any, touched: any, errors: any) => {
    return (
      <View style={styles.radioListContainer}>
        <CustomText text={translate('invite_staff.building_title')} style={styles.buildingTitle} styleContainer={styles.buildingTitleContainer} />
        <View style={styles.buildingRadioList}>
          <CustomRadioButton
            item={adminDecentralizationData[0]}
            selectedId={selectedAdminDecentralization}
            onPressExpireItem={onPressAdminDecentralizationData.bind(undefined, adminDecentralizationData[0])}
            styleContainerRadioBtn={styles.radio}
          />
        </View>
        <View style={styles.buildingRadioList}>
          <CustomRadioButton
            item={adminDecentralizationData[1]}
            selectedId={selectedAdminDecentralization}
            onPressExpireItem={onPressAdminDecentralizationData.bind(undefined, adminDecentralizationData[1])}
            styleContainerRadioBtn={styles.radio}
          />
        </View>
        {selectedAdminDecentralization === adminDecentralizationData[1].id && <CustomTouchable
          onPress={onOpenCountryModal} >
          <CustomInput
            pointerEvents={'none'}
            multiline={true}
            moreStyle={styles.moreStyleDescription}
            containerStyle={styles.containerStyleInput}
            onChangeText={handleChange('country')}
            inputRef={(input: any) => putInputRef(input)}
            inputStyle={styles.selectStyle}
            onBlur={handleBlur('country')}
            currentInputIndex={currentInputIndex}
            editable={false}
            value={values.country}
          />
        </CustomTouchable>}
        {selectedAdminDecentralization === adminDecentralizationData[1].id && (
          <ErrorMessage errorValue={touched.country && errors.country} />
        )}
        <View style={styles.buildingRadioList}>
          <CustomRadioButton
            item={adminDecentralizationData[2]}
            selectedId={selectedAdminDecentralization}
            onPressExpireItem={onPressAdminDecentralizationData.bind(undefined, adminDecentralizationData[2])}
            styleContainerRadioBtn={styles.radio}

          />
        </View>
        {selectedAdminDecentralization === adminDecentralizationData[2].id && <CustomTouchable
          onPress={onOpenPropertyModal}
        >
          <CustomInput
            pointerEvents={'none'}
            multiline={true}
            moreStyle={styles.moreStyleDescription}
            containerStyle={styles.containerStyleInput}
            onChangeText={handleChange('building')}
            inputRef={(input: any) => putInputRef(input)}
            inputStyle={styles.selectStyle}
            onBlur={handleBlur('building')}
            currentInputIndex={currentInputIndex}
            editable={false}
            value={values.building}
          />
        </CustomTouchable>}
        {selectedAdminDecentralization === adminDecentralizationData[2].id && (
          <ErrorMessage errorValue={touched.building && errors.building} />
        )}
      </View>
    );
  };

  const renderInputFields = () => {

    return (
      <Formik initialValues={initialValue}
        onSubmit={onSubmitInviteStaff}
        validationSchema={getValidationSchema()}>
        {({ handleSubmit, values, errors, setValues, touched, handleChange, handleBlur, setFieldValue }) => (
          <View style={[styles.listContainer, !isAndroid() ? { paddingBottom: paddingBottom } : {}]}>
            <ScrollView style={styles.containerScrollView}>
              <View style={styles.inputFormSubContainer}>
                {renderEmail(handleChange, values, handleBlur)}
                <ErrorMessage errorValue={touched.email && errors.email} />
                {renderDropdownRole(values, setFieldValue)}
                <ErrorMessage errorValue={touched.role && errors.role} />
                {inviteStaffType === InviteStaffType.STAFF ? (
                  renderDropdownPosition(values, setFieldValue)
                ) : null}
                {inviteStaffType === InviteStaffType.STAFF ? (<ErrorMessage errorValue={touched.position && errors.position} />) : null}
                {inviteStaffType === InviteStaffType.STAFF ?
                  (
                    renderSelectBuilding(handleChange, handleBlur, values)
                  ) : null
                }
                {inviteStaffType === InviteStaffType.STAFF ? (<ErrorMessage errorValue={touched.building && errors.building} />) : null}
                {renderModalBuilding(setFieldValue)}
                {renderModalCountry(setFieldValue)}
                {inviteStaffType === InviteStaffType.ADMIN ? (
                  renderRadioListContainer(handleChange, handleBlur, values, touched, errors)
                ) : null}
              </View>
            </ScrollView>

            <View style={styles.buttonContainer}>
              <CustomButton onPress={handleSubmit} text={translate('invite_staff.submit_button')} style={styles.button} />
            </View>
          </View>
        )}
      </Formik>
    );
  };

  return (
    <View style={{ flex: 1 }} >
      <KeyboardAvoidingView style={getStyles('flex-1')} keyboardVerticalOffset={getKeyboardAdvoidStyle()} behavior={'padding'}>
        <Container
          spaceBottom={true}
          title={translate('invite_staff.invite_title')}
          isShowHeader={true}
          isDisplayMenuButton={false}
          isDisplayNotification={false}
        >
          <View style={styles.container}>
            <CustomSectionHeader
              style={styles.sectionHeader}
              title={translate('invite_staff.invite_title')}
              icon={ADD_PLUS}
              styleIcon={styles.sectionIconStyle}
            />
            {renderInputFields()}
          </View>
        </Container>
      </KeyboardAvoidingView>
      {renderKeyboardAccessory()}
    </View >
  );
};

export default InviteStaff;
