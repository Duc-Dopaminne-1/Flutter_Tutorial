import Container from "@src/components/Container";
import React, { useState, useEffect, useRef } from "react";
import translate from "@src/localize";
import { ADD_PLUS } from "@src/constants/icons";
import { KeyboardAvoidingView, ScrollView, View, Alert, Keyboard } from "react-native";
import getStyles from "@src/utils/getStyles";
import { getKeyboardAdvoidStyle, isAndroid } from "@src/utils";
import { Formik } from "formik";
import CustomSectionHeader from "@src/components/CustomSection";
import styles from "./styles";
import { ObjDropdown } from "@src/components/Dropdown/DropdownNative";
import { object, string } from "yup";
import CustomInput from "@src/components/CustomInput";
import ErrorMessage from "@src/components/ErrorMessage";
import { CustomButton } from "@src/components/CustomButton";
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
import { useDispatch } from 'react-redux';
import { RoleUnit } from '@reup/reup-api-sdk/libs/api/enum';
import { countListResident } from "@src/modules/Company/actions";
import { CreateUnitVehicleParams } from "@reup/reup-api-sdk/libs/api/unit/vehicle";
import { action as UnitAction } from '@src/modules/Units';

interface Props {
  route?: any
  unitId: string,
  vehicleFlatList: any,
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

const NewVehicleTenant = (props: Props) => {
  const dispatch = useDispatch();

  const [images, setImages] = useState<string[]>([]);
  const [currentInputIndex, setCurrentInputIndex] = useState<number>(0);
  const inputComponents: any[] = [];
  const numberOfInput = 5;
  const route = useRoute();
  const { unitId, vehicleFlatList } = route.params as Props;
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

  const initialValues = {
    brand: '',
    model: '',
    licence_plate: '',
    images: images,
  };

  const validationSchema = object().shape({
    brand: string()
      .trim()
      .required(`${translate('new_vehicle.brand')} ${translate('error.required')}!`),
    model: string()
      .trim()
      .required(`${translate('new_vehicle.model')} ${translate('error.required')}!`),
    licence_plate: string()
      .trim()
      .required(`${translate('new_vehicle.licence_plate')} ${translate('error.required')}!`),
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

  const onAddVehicle = (formikProps: any) => {
    if (unitId) {
      const params: CreateUnitVehicleParams =
      {
        brand: formikProps.brand,
        model: formikProps.model,
        licence_plate: formikProps.licence_plate,
        img_url: formikProps.images.length > 0 ? formikProps.images : '',
      };
      dispatch(
        UnitAction.addVehicle({
          unitId: unitId,
          params: params,
          onSuccess: async (data) => {
            vehicleFlatList && vehicleFlatList.current && vehicleFlatList.current.reloadData();
            console.log("===== Success add vehicle: ", data);
            NavigationActionsService.pop();
          },
          onFail: error => {
            setTimeout(() => {
              error && Alert.alert(translate('alert.title_error'), error.message);
            }, 700);
          }
        }));
    }
  };

  const renderSectionHeader = () => {
    return (
      <CustomSectionHeader
        title={translate('new_vehicle.title_section')}
        icon={ADD_PLUS}
        style={styles.sectionHeader}
        styleIcon={styles.iconSectionHeader}
        styleTitle={styles.titleSectionHeader}
      />
    );
  };

  const renderInputBrand = (formikProps: any) => {
    const { values, errors, setValues, touched, handleBlur } = formikProps;
    return (
      <>
        <CustomInput
          componentContainer={styles.input}
          description={translate("new_vehicle.brand")}
          onChangeText={(text: string) => {
            setValues({ ...values, brand: text });
          }}
          autoCapitalize="none"
          returnKeyType="next"
          value={values.brand}
          onBlur={handleBlur('brand')}
          inputRef={(input: any) => { putInputRef(input); }}
          onFocus={() => setCurrentInputIndex(0)}
        />
        <ErrorMessage errorValue={touched.brand && errors.brand} style={styles.errorMessage} />
      </>
    );
  };

  const renderInputModel = (formikProps: any) => {
    const { values, errors, setValues, touched, handleBlur } = formikProps;
    return (
      <>
        <CustomInput
          description={translate("new_vehicle.model")}
          onChangeText={(text: string) => {
            setValues({ ...values, model: text });
          }}
          autoCapitalize="none"
          returnKeyType="next"
          value={values.model}
          onBlur={handleBlur('model')}
          inputRef={(input: any) => { putInputRef(input); }}
          onFocus={() => setCurrentInputIndex(1)}
        />
        <ErrorMessage errorValue={touched.model && errors.model} style={styles.errorMessage} />
      </>
    );
  };

  const renderInputLicencePlate = (formikProps: any) => {
    const { values, errors, setValues, touched, handleBlur } = formikProps;
    return (
      <>
        <CustomInput
          description={translate("new_vehicle.licence_plate")}
          onChangeText={(text: string) => {
            setValues({ ...values, licence_plate: text });
          }}
          autoCapitalize="none"
          returnKeyType="next"
          value={values.licence_plate}
          onBlur={handleBlur('licence_plate')}
          inputRef={(input: any) => { putInputRef(input); }}
          onFocus={() => setCurrentInputIndex(1)}
        />
        <ErrorMessage errorValue={touched.licence_plate && errors.licence_plate} style={styles.errorMessage} />
      </>
    );
  };

  const renderItemImage = (item: any, index: number) => {
    return (
      <AddImageItem item={item} index={index} deleteOnpress={onRemoveImage} />
    );
  };

  const renderAddImage = (formikProps: any) => {
    const { errors } = formikProps;
    return (
      <>
        <AddImage
          images={images}
          numberOfImage={1}
          description={translate('new_vehicle.add_image')}
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
        < ErrorMessage errorValue={errors.images as string} />
      </>
    );
  };

  const renderSubmitBtn = (formikProps: any) => {
    return (
      <View style={styles.buttonContainer}>
        <CustomButton
          onPress={formikProps.handleSubmit}
          text={translate('new_vehicle.submit_button')}
          style={styles.button} />
      </View>
    );
  };

  const renderInputFields = () => {
    return (
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onAddVehicle}
      >
        {(formikProps) => (
          <View style={[styles.listContainer, !isAndroid() ? { paddingBottom: paddingBottom } : {}]}>
            <ScrollView style={styles.containerScrollView}>
              {renderInputBrand(formikProps)}
              {renderInputModel(formikProps)}
              {renderInputLicencePlate(formikProps)}
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
      title={translate('new_vehicle.title')}
    >
      <KeyboardAvoidingView style={getStyles('flex-1')} keyboardVerticalOffset={getKeyboardAdvoidStyle()} behavior={'padding'}>
        {renderSectionHeader()}
        {renderInputFields()}
      </KeyboardAvoidingView>
      {renderKeyboardAccessory()}
    </Container>
  );
};

export default React.memo(NewVehicleTenant);
