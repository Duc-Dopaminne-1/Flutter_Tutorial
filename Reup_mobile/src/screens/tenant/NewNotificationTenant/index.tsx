import React, { useState, useEffect } from 'react';
import styles from './styles';
import {
  View, ScrollView, Keyboard,
  KeyboardAvoidingView, Alert, TouchableWithoutFeedback
} from 'react-native';
import { ADD_PLUS } from '@src/constants/icons';
import { CustomButton } from '@src/components/CustomButton';
import Container from '@src/components/Container';
import translate from '@src/localize';
import CustomSectionHeader from '@src/components/CustomSection';
import { Formik } from 'formik';
import CustomInput from '@src/components/CustomInput';
import ErrorMessage from '@src/components/ErrorMessage';
import { object, string, array } from 'yup';
import { clone, findIndex } from 'lodash';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import CustomAccessory from '@src/components/CustomAccessory';
import getStyles from '@src/utils/getStyles';
import { getKeyboardAdvoidStyle, isAndroid, getUserName } from '@src/utils';
import AddImage from '@src/components/AddImage';
import { CustomFlatList } from '@src/components/FlatList';
import AddImageItem from '@src/components/FlatListItem/AddImageItem';
import { CreateCompanyBulletinBoardNotificationParams } from '@reup/reup-api-sdk/libs/api/company/bulletin-board/notification';
import NavigationActionsService from '@src/navigation/navigation';
import moment from 'moment';
import { uploadImage } from '@src/modules/auth/actions';
import { useDispatch, useSelector } from 'react-redux';
import { ObjDropdown } from '@src/components/Dropdown/DropdownNative';
import { LimitGetAll } from '@src/constants/vars';
import { RootState } from '@src/types/types';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import Modal from 'react-native-modal';
import CustomSelect, { CustomSelectType } from '@src/components/CustomSelect';
import CustomInputSelect from '@src/components/CustomInputSelect';
import { getListStaff } from '@src/modules/Company/actions';
import { ICompanyProperty, IProperty } from '@reup/reup-api-sdk/libs/api/company/property/model';
import { useRoute } from '@react-navigation/native';
import { NotificationType } from '@reup/reup-api-sdk/libs/api/enum';
import { CustomDropdownSelect } from '@src/components/CustomDropdownSelect';
import { IUnitMember } from '@reup/reup-api-sdk/libs/api/unit/member/models';
import { GetCompanyTenantParams } from '@reup/reup-api-sdk/libs/api/company/tenant';
import { createNotification } from '@src/modules/bulletin/actions';
import { QueryCompanyUserParams } from '@reup/reup-api-sdk/libs/api/company/user';
import { CreateResidentBulletinBoardNotificationParams } from '@reup/reup-api-sdk/libs/api/resident/bulletin/notification';
import { ImageUploadModel, createFormData, ObservebleImageModel } from '@src/utils/image';
import { of, combineLatest, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
interface Props {
  ref: any
}

let isShowKeyboard = false;
const NewNotificationTenant = () => {
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const listMyProperty = useSelector<RootState, IProperty[]>((state: RootState) => state.company.listMyProperty.results);
  const defaultProperty = listMyProperty[findIndex(listMyProperty, { id: me && me.default_property }) ?? 0];
  const dispatch = useDispatch();
  const router = useRoute()
  const { ref } = router.params as Props
  let newNotificationObservable: any = null;

  const [currentInputIndex, setCurrentInputIndex] = useState<number>(0);
  const [paddingBottom, setPaddingBottom] = useState(0);
  const [images, setImages] = useState<ImageUploadModel[]>([]);
  const [scrollEnabled, setScrollEnabled] = useState<boolean>(false);

  const [isAssigneeModalVisible, setAssigneeModalVisible] = useState<boolean>(false);
  const [selectedListAssignee, setSelectedListAssignee] = useState<string[]>([]);
  const [assignee, setAssignee] = useState<IUnitMember[]>([])
  const listAssignee: ObjDropdown[] = [
    ...assignee.map(item => ({
      _key: item && item.user ? item.user.user_id : '',
      _value: item && item.user
        ? getUserName(item.user.first_name, item.user.last_name, item.user.email)
        : ''
    }))
  ]

  const defaultChoose = translate('new_notification.default_choose')
  const inputComponents: any[] = [];
  const numberOfInput = 3;

  useEffect(() => {
    Keyboard.addListener(isAndroid() ? 'keyboardDidHide' : 'keyboardWillHide', keyboardDidHide)
    Keyboard.addListener(isAndroid() ? 'keyboardDidShow' : 'keyboardWillShow', keyboardDidShow)
    isShowKeyboard = false;
    return () => {
      if (newNotificationObservable) {
        newNotificationObservable.unsubscribe()
      }
      Keyboard.removeListener(isAndroid() ? 'keyboardDidHide' : 'keyboardWillHide', keyboardDidHide)
      Keyboard.removeListener(isAndroid() ? 'keyboardDidShow' : 'keyboardWillShow', keyboardDidShow)
    };
  }, []);


  const onLoad = () => { };

  useEffect(() => {
    fetchDataAssignees()
  }, [me.default_property])

  const fetchDataAssignees = () => {
    if (me.default_property && defaultProperty) {
      NavigationActionsService.showLoading();
      dispatch(
        getListStaff({
          id: me.default_property,
          page: 1,
          limit: LimitGetAll,
          isSave: false,
          onSuccess: (data) => {
            NavigationActionsService.hideLoading()
            setAssignee(data.results)
          },
          onFail: error => {
            NavigationActionsService.hideLoading()
            setTimeout(() => {
              error && Alert.alert(translate('alert.title_error'), error.message);
            }, 700);
          }
        })
      );
    } else {
      setAssignee([])
    }
  }

  const onSubmitData = (responseUrls: string[], formikProps: any) => {
    const params: CreateResidentBulletinBoardNotificationParams = {
      title: formikProps.title,
      description: formikProps.description,
      image_urls: responseUrls,
      assignee_id: formikProps.assignee,
    }
    dispatch(
      createNotification({
        id: me.default_property,
        params: params,
        onSuccess: async () => {
          NavigationActionsService.hideLoading();
          ref && ref.current && ref.current.reloadData()
          NavigationActionsService.pop();
        },
        onFail: error => {
          setTimeout(() => {
            NavigationActionsService.hideLoading();
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        }
      }));
  }

  const onAddNotification = (formikProps: any) => {
    const source$ = images.map((val: ImageUploadModel) => {
      if (!val.isUploaded) {
        const formData = createFormData(val.file)
        return from(onUploadImage(formData))
      }
      return of({
        url: val.file.uri,
        completed: true
      });
    })
    newNotificationObservable = of(source$).pipe(
      switchMap(() => {
        NavigationActionsService.showLoading();
        return combineLatest(source$)
      }),
      map((response) => {
        if (response && response.filter(item => !item.completed).length > 0) {
          NavigationActionsService.hideLoading();
          setTimeout(() => {
            Alert.alert(translate('alert.title_error'), translate('alert.message_error_default'));
          }, 700);
          return;
        }
        onSubmitData(response.map(item => item.url) as string[], formikProps);
      })
    ).subscribe();
  };

  const validationSchema = object().shape({
    title: string()
      .trim()
      .required(translate('authentication.registered_title')),
    description: string()
      .trim()
      .required(translate('authentication.registered_description')),
    assignee: string()
      .trim(),
    // .required(translate('new_notification.required_assignee')),
    images: array()
      .min(1, translate('new_notification.required_images'))
  });

  const putInputRef = (inp: any) => {
    inputComponents.push(inp);
  };

  const getInputRef = (index: number) => {
    setCurrentInputIndex(index);
    return inputComponents[index];
  };

  const doneTyping = () => {
    return Keyboard.dismiss();
  };

  const nextInput = () => {
    const currentInput = getInputRef(currentInputIndex);
    currentInput.dismiss && currentInput.dismiss();
    setTimeout(() => {
      return getInputRef(currentInputIndex + 1).focus();
    }, 300);
  };

  const previousInput = () => {
    getInputRef(currentInputIndex).dismiss && getInputRef(currentInputIndex).dismiss();
    setTimeout(() => {
      return getInputRef(currentInputIndex - 1).focus();
    }, 300);
  };

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

  const setTextFromKey = (dropDownList: ObjDropdown[], listSelected: string[]) => {
    const findIndex = dropDownList.findIndex(item => item._key === listSelected[0]);
    return findIndex != -1 ? dropDownList[dropDownList.findIndex(item => item._key === listSelected[0])]._value : 'Please Choose';
  };

  const onRemoveImage = (index: number, setFieldValue: any) => {
    const cloneData = clone(images);
    cloneData.splice(index, 1);
    setImages(cloneData);
    setFieldValue('images', cloneData);
  };

  const onCompletedPickerImage = (imageResponse: any, setFieldValue: any) => {
    if (images.length > 4) {
      Alert.alert(translate('alert.title_error'), 'Maximum is 5 images');
      return;
    }
    const cloneData = clone(images);
    cloneData.push(
      {
        file: {
          uri: imageResponse.path,
          type: imageResponse.mime,
          name: moment().valueOf().toString() + ".jpg"
        },
        isUploaded: false
      });
    setImages(cloneData);

    setFieldValue('images', cloneData);
  };


  const onUploadImage = (formData: FormData) => {
    return new Promise<ObservebleImageModel>((resolve, reject) => {
      dispatch(
        uploadImage({
          data: formData,
          progress: () => { },
          onSuccess: (data) => {
            resolve({
              url: data.url,
              completed: true
            });
          },
          onFail: error => {
            resolve({
              completed: false
            })
          },
        }),
      );
    })
  }
  const renderKeyboardAccessory = () => (
    <KeyboardAccessoryView style={{ padding: 0, height: 45 }} androidAdjustResize>
      <CustomAccessory
        currentInputIndex={currentInputIndex}
        numberOfInput={numberOfInput}
        onPressDown={nextInput}
        onPressUp={previousInput}
        onPressDone={doneTyping}
      />
    </KeyboardAccessoryView>
  );

  const _renderItem = (item: ImageUploadModel, index: number, setFieldValue: any) => {
    return (
      <AddImageItem
        item={item.file.uri}
        index={index}
        deleteOnpress={(index => { onRemoveImage(index, setFieldValue); })} />
    );
  };

  const onChangeDropDown = (obj: ObjDropdown, setFieldValue: any, key: string) => {
    if (obj._key) {
      setFieldValue(key, obj._key);
      return;
    }
    setFieldValue(key, '');
  };


  const onCloseAssigneeModal = () => {
    setAssigneeModalVisible(false);
  };

  const onOpenAssigneeModal = () => {
    setAssigneeModalVisible(true);
  };

  const onSelectAssigneeDone = (selectedList: string[], setFieldValue: any, key: string) => {
    setAssigneeModalVisible(false);
    setSelectedListAssignee(selectedList);
    if (selectedList !== []) {
      if (selectedList.length === 1) {
        listAssignee.map((element: ObjDropdown) => {
          if (element._key === selectedList[0]) {
            onChangeDropDown(element, setFieldValue, 'assignee')
          }
        });
      }
    } else {
      setFieldValue(key, "");
    }
  };

  const renderModalAssignee = (setFieldValue: any) => {
    return <Modal
      key={'assignee'}
      hideModalContentWhileAnimating
      isVisible={isAssigneeModalVisible}
      useNativeDriver
      customBackdrop={
        <TouchableWithoutFeedback onPress={onCloseAssigneeModal}>
          <View style={styles.backgroundModal} />
        </TouchableWithoutFeedback>
      }
    >
      <CustomSelect
        checkListData={listAssignee}
        selectedList={selectedListAssignee}
        onCloseModal={onCloseAssigneeModal}
        onDone={(selectedList: string[]) => {
          onSelectAssigneeDone(selectedList, setFieldValue, 'assignee');
        }}
        type={CustomSelectType.SingleSelect}
      />
    </Modal>
  }

  const renderInputAssignee = (formikProps: any) => {
    const { setFieldValue, values, touched, errors } = formikProps
    const text = (values.assignee && listAssignee.length > 0) ?
      setTextFromKey(listAssignee, selectedListAssignee)
      : defaultChoose
    return (
      <>
        {renderModalAssignee(setFieldValue)}
        <CustomInputSelect
          description={translate('new_notification.assignee')}
          text={text}
          onPress={onOpenAssigneeModal}
          moreStyle={styles.containerInputAssignee}
        />
        <ErrorMessage errorValue={touched.assignee && errors.assignee} />
      </>
    )
  }

  const renderInputFields = () => {
    return (
      <Formik initialValues={{
        title: '',
        description: '',
        images: images,
        assignee: '',
      }} onSubmit={onAddNotification} validationSchema={validationSchema}>
        {formikProps => (
          <View style={[styles.listContainer, !isAndroid() ? { paddingBottom: paddingBottom } : {}]}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.containerScrollView}>
              <View style={styles.inputFormSubContainer}>

                {/* TITLE */}
                <CustomInput
                  inputRef={(input: any) => putInputRef(input)}
                  description={`${translate('new_notification.title')}`}
                  onChangeText={formikProps.handleChange('title')}
                  autoCapitalize="none"
                  returnKeyType="next"
                  value={formikProps.values.title}
                  onFocus={() => setCurrentInputIndex(0)}
                  onBlur={formikProps.handleBlur('title')}
                />
                <ErrorMessage errorValue={formikProps.touched.title && formikProps.errors.title} />

                {/* ASSIGNEE */}
                {renderInputAssignee(formikProps)}

                {/* DESCRIPTION */}
                <CustomInput
                  inputRef={(input: any) => putInputRef(input)}
                  description={`${translate('new_notification.description')}`}
                  onChangeText={(field: string) => {
                    formikProps.setValues({ ...formikProps.values, description: field.toString() });
                    setScrollEnabled(true);
                  }}
                  returnKeyType="done"
                  value={formikProps.values.description}
                  onFocus={() => setCurrentInputIndex(2)}
                  onBlur={() => {
                    formikProps.handleBlur('description');
                    setScrollEnabled(false);
                  }}
                  scrollEnabled={scrollEnabled}
                  moreStyle={styles.description}
                  multiline={true}
                />
                <ErrorMessage errorValue={formikProps.touched.description && formikProps.errors.description} />

                {/* IMAGE */}
                <AddImage
                  images={images.map(item => item.file.uri)}
                  description={translate('new_notification.add_image')}
                  onCompletedPickerImage={
                    (imageResponse => { onCompletedPickerImage(imageResponse, formikProps.setFieldValue); })
                  }
                />
                <CustomFlatList
                  horizontal={true}
                  onLoad={onLoad}
                  showEmpty={false}
                  data={images}
                  contentContainerStyle={styles.imagesList}
                  renderItem={(item: any, index: number) => _renderItem(item, index, formikProps.setFieldValue)}
                />
                < ErrorMessage errorValue={formikProps.errors.images as string} />
              </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
              <CustomButton onPress={formikProps.handleSubmit} text={translate('new_notification.submit')} style={styles.button} />
            </View>
          </View>
        )}
      </Formik>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView style={getStyles('flex-1')} keyboardVerticalOffset={getKeyboardAdvoidStyle()} behavior={'padding'}>
        <Container
          isDisplayMenuButton={false}
          spaceBottom={true}
          isDisplayNotification={false}
          title={translate('new_notification.new_notification')}
          isShowHeader={true}>
          <View style={styles.container}>
            <CustomSectionHeader
              style={styles.sectionHeader}
              title={translate('new_notification.create_new_notification')}
              icon={ADD_PLUS}
              styleIcon={styles.sectionIconStyle}
            />
            {renderInputFields()}
          </View>
        </Container>
      </KeyboardAvoidingView>
      {renderKeyboardAccessory()}
    </View>
  );
};

export default NewNotificationTenant;
