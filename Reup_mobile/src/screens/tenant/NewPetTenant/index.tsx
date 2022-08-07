import Container from "@src/components/Container";
import React, { useState, useEffect } from "react";
import translate from "@src/localize";
import { ADD_PLUS } from "@src/constants/icons";
import {
  KeyboardAvoidingView, ScrollView,
  View, Alert, Keyboard
} from "react-native";
import getStyles from "@src/utils/getStyles";
import { getKeyboardAdvoidStyle, isAndroid } from "@src/utils";
import { Formik } from "formik";
import CustomSectionHeader from "@src/components/CustomSection";
import styles from "./styles";
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
import { CreateUnitPetParams } from "@reup/reup-api-sdk/libs/api/unit/pet";
import { action as UnitAction } from '@src/modules/Units';

interface Props {
  route?: any
  unitId: string
  petFlatList: any
}

let isShowKeyboard = false;

const NewPetTenant = (props: Props) => {
  const dispatch = useDispatch();

  const [images, setImages] = useState<string[]>([]);
  const [currentInputIndex, setCurrentInputIndex] = useState<number>(0);
  const inputComponents: any[] = [];
  const numberOfInput = 5;
  const route = useRoute();
  const { unitId, petFlatList } = route.params as Props;
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

  const onAddNewPet = (formikProps: any) => {
    if (unitId) {
      const params: CreateUnitPetParams =
      {
        name: formikProps.pet_name,
        type: formikProps.type,
        img_url: formikProps.images,
      };

      dispatch(UnitAction.addNewPet({
        unitId: unitId,
        params: params,
        onSuccess: async (data) => {
          petFlatList && petFlatList.current && petFlatList.current.reloadData();
          console.log("===== Success add new pet: ", data);
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
  const initialValues = {
    pet_name: '',
    type: '',
    image: images
  };

  const validationSchema = object().shape({
    pet_name: string()
      .trim()
      .required(`${translate('new_pet.pet_name')} ${translate('error.required')}`),
    type: string()
      .trim()
      .required(`${translate('new_pet.type')} ${translate('error.required')}`),
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


  const renderSectionHeader = () => {
    return (
      <CustomSectionHeader
        title={translate('new_pet.title_section')}
        icon={ADD_PLUS}
        style={styles.sectionHeader}
        styleIcon={styles.iconSectionHeader}
        styleTitle={styles.titleSectionHeader}
      />
    );
  };

  const renderInputPetName = (formikProps: any) => {
    const { values, errors, setValues, touched, handleBlur } = formikProps;
    return (
      <>
        <CustomInput
          componentContainer={styles.input}
          description={translate("new_pet.pet_name")}
          onChangeText={(text: string) => {
            setValues({ ...values, pet_name: text });
          }}
          autoCapitalize="none"
          returnKeyType="next"
          value={values.pet_name}
          onBlur={handleBlur('pet_name')}
          inputRef={(input: any) => { putInputRef(input); }}
          onFocus={() => setCurrentInputIndex(0)}
        />
        <ErrorMessage errorValue={touched.pet_name && errors.pet_name} style={styles.errorMessage} />
      </>
    );
  };

  const renderInputType = (formikProps: any) => {
    const { values, errors, setValues, touched, handleBlur } = formikProps;
    return (
      <>
        <CustomInput
          description={translate("new_pet.type")}
          onChangeText={(text: string) => {
            setValues({ ...values, type: text });
          }}
          autoCapitalize="none"
          returnKeyType="next"
          value={values.type}
          onBlur={handleBlur('type')}
          inputRef={(input: any) => { putInputRef(input); }}
          onFocus={() => setCurrentInputIndex(1)}
        />
        <ErrorMessage errorValue={touched.type && errors.type} style={styles.errorMessage} />
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
          description={translate('new_pet.add_image')}
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
          text={translate('new_pet.submit_button')}
          style={styles.button} />
      </View>
    );
  };

  const renderInputFields = () => {
    return (
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onAddNewPet}
      >
        {(formikProps) => (
          <View style={[styles.listContainer, !isAndroid() ? { paddingBottom: paddingBottom } : {}]}>
            <ScrollView style={styles.containerScrollView}>
              {renderInputPetName(formikProps)}
              {renderInputType(formikProps)}
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
      title={translate('new_pet.title')}
    >
      <KeyboardAvoidingView style={getStyles('flex-1')} keyboardVerticalOffset={getKeyboardAdvoidStyle()} behavior={'padding'}>
        {renderSectionHeader()}
        {renderInputFields()}
      </KeyboardAvoidingView>
      {renderKeyboardAccessory()}
    </Container>
  );
};

export default React.memo(NewPetTenant);
