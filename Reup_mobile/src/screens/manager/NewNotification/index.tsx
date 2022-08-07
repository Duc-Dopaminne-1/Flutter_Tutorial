import React, { useState, useEffect } from 'react';
import styles from './styles';
import {
  View, ScrollView, Keyboard,
  KeyboardAvoidingView, Alert, TouchableWithoutFeedback
} from 'react-native';
import { of, combineLatest, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ADD_PLUS } from '@src/constants/icons';
import { CustomButton } from '@src/components/CustomButton';
import Container from '@src/components/Container';
import translate from '@src/localize';
import CustomSectionHeader from '@src/components/CustomSection';
import { Formik } from 'formik';
import CustomInput from '@src/components/CustomInput';
import ErrorMessage from '@src/components/ErrorMessage';
import { object, string, array } from 'yup';
import { clone, pickBy } from 'lodash';
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
import { ICountry } from '@reup/reup-api-sdk/libs/api/country/model';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import Modal from 'react-native-modal';
import CustomSelect, { CustomSelectType } from '@src/components/CustomSelect';
import CustomInputSelect from '@src/components/CustomInputSelect';
import { getListProperty, getListTenant } from '@src/modules/Company/actions';
import { ICompanyProperty } from '@reup/reup-api-sdk/libs/api/company/property/model';
import { useRoute } from '@react-navigation/native';
import { NotificationType } from '@reup/reup-api-sdk/libs/api/enum';
import { CustomDropdownSelect } from '@src/components/CustomDropdownSelect';
import { IUnitMember } from '@reup/reup-api-sdk/libs/api/unit/member/models';
import { GetCompanyTenantParams } from '@reup/reup-api-sdk/libs/api/company/tenant';
import { createFormData, ImageUploadModel, ObservebleImageModel } from '@src/utils/image';
import { createNotification } from '@src/modules/bulletin/actions';
interface Props {
  ref: any
}

let isShowKeyboard = false;
const NewNotification = () => {

  const myCountry = useSelector<RootState, ICountry[]>((state: RootState) => state.company.listMyCountry.results);
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const dispatch = useDispatch();
  const router = useRoute();
  let notificationObservable: any = null;
  const { ref } = router.params as Props;
  const [images, setImages] = useState<ImageUploadModel[]>([]);
  const [currentInputIndex, setCurrentInputIndex] = useState<number>(0);
  const [paddingBottom, setPaddingBottom] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState<boolean>(false);
  const [isCountryModalVisible, setCountryModalVisible] = useState<boolean>(false);
  const [isPropertyModalVisible, setPropertyModalVisible] = useState<boolean>(false);
  const [selectedListCountry, setSelectedListCountry] = useState<string[]>([]);
  const [selectedListProperty, setSelectedListProperty] = useState<string[]>([]);
  const [countryDropdownList, setCountryDropdownList] = useState<ObjDropdown[]>([]);

  const [isShowAssignee, setShowAssignee] = useState<boolean>(false)
  const [isAssigneeModalVisible, setAssigneeModalVisible] = useState<boolean>(false);
  const [selectedListAssignee, setSelectedListAssignee] = useState<string[]>([]);
  const [assignee, setAssignee] = useState<IUnitMember[]>([])
  const listAssignee: ObjDropdown[] = [
    ...assignee.map(item => ({
      _key: item && item.member ? item.member.user_id : '',
      _value: item && item.member
        ? getUserName(item.member.first_name, item.member.last_name, item.member.email)
        : ''
    }))
  ]

  const [property, setProperty] = useState<ICompanyProperty[]>([]);
  const propertyList: ObjDropdown[] = [
    ...property.map(item => ({
      _key: item.id ? item.id + "" : '',
      _value: item.name,
    }))
  ]

  const defaultChoose = translate('new_notification.default_choose')
  const inputComponents: any[] = [];
  const numberOfInput = 3;
  const notificationType: ObjDropdown[] = [
    { _key: '', _value: defaultChoose },
    { _key: NotificationType.General, _value: translate('new_notification.general_notification') },
    { _key: NotificationType.Incident, _value: translate('new_notification.incident_report') }
  ]

  useEffect(() => {
    Keyboard.addListener(isAndroid() ? 'keyboardDidHide' : 'keyboardWillHide', keyboardDidHide)
    Keyboard.addListener(isAndroid() ? 'keyboardDidShow' : 'keyboardWillShow', keyboardDidShow)
    isShowKeyboard = false;
    return () => {
      if (notificationObservable) {
        notificationObservable.unsubscribe()
      }
      Keyboard.removeListener(isAndroid() ? 'keyboardDidHide' : 'keyboardWillHide', keyboardDidHide)
      Keyboard.removeListener(isAndroid() ? 'keyboardDidShow' : 'keyboardWillShow', keyboardDidShow)
    };
  }, []);

  useEffect(() => {
    const countriesList: ObjDropdown[] = [];
    myCountry.forEach((item) => {
      const obj: ObjDropdown = {
        _key: item.id + "",
        _value: item.name,
      };
      countriesList.push(obj);
    });
    setCountryDropdownList(countriesList);
  }, [myCountry]);

  const onLoad = () => { };

  const fetchListBuilding = (companyId: string, countryId: string) => {
    // API: Get list building
    if (companyId) {
      NavigationActionsService.showLoading();
      dispatch(
        getListProperty({
          companyId,
          params: {
            country_id: countryId,
          },
          isSave: false,
          limit: LimitGetAll,
          page: 1,
          onSuccess: async (data) => {
            console.log("===== Success List Building: ", data);
            setProperty(data.results);
            NavigationActionsService.hideLoading();
          },
          onFail: (error) => {
            NavigationActionsService.hideLoading();
            setTimeout(() => {
              error && Alert.alert(translate('alert.title_error'), error.message);
            }, 700);
          }
        }));
    }
  };

  const fetchDataAssignees = (params: GetCompanyTenantParams) => {
    const companyId = me && me.default_company
      ? me.default_company.id ?? ''
      : ''
    if (companyId) {
      NavigationActionsService.showLoading();
      dispatch(
        getListTenant({
          companyId,
          isSave: false,
          params,
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
    const params: CreateCompanyBulletinBoardNotificationParams = pickBy({
      title: formikProps.title,
      property_id: formikProps.building,
      description: formikProps.description,
      image_urls: responseUrls,
      assignee_id: isShowAssignee ? formikProps.assignee : undefined,
      type: formikProps.type,
    }) as CreateCompanyBulletinBoardNotificationParams
    const companyId = me && me.default_company ? me.default_company.id ?? '' : '';
    if (companyId) {
      dispatch(
        createNotification({
          id: companyId,
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
    notificationObservable = of(source$).pipe(
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
    country: string()
      .trim()
      .required(translate('new_notification.required_country')),
    building: string()
      .trim()
      .required(translate('new_notification.required_buidling')),
    title: string()
      .trim()
      .required(translate('authentication.registered_title')),
    description: string()
      .trim()
      .required(translate('authentication.registered_description')),
    images: array()
      .min(1, translate('new_notification.required_images')),
    type: string()
      .trim()
      .required(translate('new_notification.required_notification_type')),
    assignee: string()
      .trim()
      .test(
        "assignee",
        translate('new_notification.required_assignee'),
        value => {
          if (!isShowAssignee) {
            return true
          } else {
            return value
          }
        }
      )
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
            })
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

  const onOpenCountryModal = () => {
    setCountryModalVisible(true);
  };

  const onCloseCountryModal = () => {
    setCountryModalVisible(false);
  };

  const onOpenPropertyModal = () => {
    setPropertyModalVisible(true);
  };

  const onClosePropertyModal = () => {
    setPropertyModalVisible(false);
  };

  const onSelectCountryDone = (selectedList: string[], setFieldValue: any, key: string) => {
    setCountryModalVisible(false);
    setSelectedListCountry(selectedList);

    if (selectedList.length > 0) {
      if (selectedList.length === 1) {
        countryDropdownList.map((element: ObjDropdown) => {
          if (element._key === selectedList[0]) {
            setFieldValue(key, element._key);
            setFieldValue('building', '');
            setFieldValue('assignee', '')
            setAssignee([])
            setProperty([])
            setSelectedListProperty([])
            setSelectedListAssignee([])
            fetchListBuilding(me.default_company.id, element._key);
          }
        });
      }
    } else {
      setFieldValue(key, "");
    }
  };

  const onSelectPropertyDone = (selectedList: string[], formikProps: any, key: string) => {
    const { setFieldValue, values } = formikProps
    setPropertyModalVisible(false);
    setSelectedListProperty(selectedList);
    if (selectedList.length > 0) {
      if (selectedList.length === 1) {
        propertyList.map((element: ObjDropdown) => {
          if (element._key === selectedList[0]) {
            setFieldValue(key, element._key);
            if (isShowAssignee) {
              setFieldValue('assignee', '')
              setSelectedListAssignee([])
              setAssignee([])
              fetchDataAssignees({
                country_id: values.country ?? '',
                property_id: element._key ?? '',
                is_user: true,
              })
            }
          }
        });
      }
    } else {
      setFieldValue(key, "");
    }
  };

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
        deleteOnpress={(index: number) => onRemoveImage(index, setFieldValue)} />
    );
  };

  const onChangeDropDown = (obj: ObjDropdown, setFieldValue: any, key: string) => {
    if (obj._key) {
      setFieldValue(key, obj._key);
      return;
    }
    setFieldValue(key, '');
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
        checkListData={countryDropdownList}
        selectedList={selectedListCountry}
        onCloseModal={onCloseCountryModal}
        onDone={(selectedList: string[]) => {
          onSelectCountryDone(selectedList, setFieldValue, 'country');
        }}
        type={CustomSelectType.SingleSelect}
      />
    </Modal>;
  };

  const renderModalBuilding = (formikProps: any) => {
    return <Modal
      key={'building'}
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
        checkListData={propertyList}
        selectedList={selectedListProperty}
        onCloseModal={onClosePropertyModal}
        onDone={(selectedList: string[]) => {
          onSelectPropertyDone(selectedList, formikProps, 'building');
        }}
        type={CustomSelectType.SingleSelect}
      />
    </Modal>;
  };

  const renderInputType = (formikProps: any) => {
    const selected = notificationType.findIndex(item => item._key == formikProps.values.type)
    const { values, setFieldValue, touched, errors } = formikProps
    return (
      <>
        <CustomDropdownSelect
          numberOfInput={numberOfInput}
          currentInputIndex={currentInputIndex}
          arrData={notificationType}
          textTitle={translate('new_notification.notification_type')}
          lineBottom={false}
          containerStyle={styles.notificationType}
          selected={selected >= 0 ? selected : 0}
          onChangeDropDown={(object) => {
            if (object._key == NotificationType.Incident && object._key != values.type) {
              setFieldValue('assignee', '')
              setSelectedListAssignee([])
              setAssignee([])
              if (values.country && values.building) {
                fetchDataAssignees({
                  country_id: values.country,
                  property_id: values.building,
                  is_user: true,
                })
              }
            }
            setShowAssignee(object && object._key == NotificationType.Incident)
            onChangeDropDown(object, setFieldValue, 'type')
            formikProps.handleBlur('type');
          }}
          inputRef={(input: any) => putInputRef(input)}
          onFocus={() => setCurrentInputIndex(1)}
          onPressDown={nextInput}
          onPressUp={previousInput}
        />
        <ErrorMessage errorValue={touched.type && errors.type} />
      </>
    )
  }

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
        country: '',
        building: '',
        title: '',
        description: '',
        images: images,
        type: '',
        assignee: '',
      }} onSubmit={(values: any) => onAddNotification(values)} validationSchema={validationSchema}>
        {formikProps => (
          <View style={[styles.listContainer, !isAndroid() ? { paddingBottom: paddingBottom } : {}]}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.containerScrollView}>
              <View style={styles.inputFormSubContainer}>

                {/* COUNTRY */}
                {renderModalCountry(formikProps.setFieldValue)}
                <CustomInputSelect
                  description={translate('task.country')}
                  text={formikProps.values.country ? setTextFromKey(countryDropdownList, selectedListCountry) : defaultChoose}
                  onPress={onOpenCountryModal}
                />
                <ErrorMessage errorValue={formikProps.touched.country && formikProps.errors.country} />

                {/* BUILDING */}
                {renderModalBuilding(formikProps)}
                <CustomInputSelect
                  description={translate('task.building')}
                  text={formikProps.values.building ? setTextFromKey(propertyList, selectedListProperty) : defaultChoose}
                  onPress={onOpenPropertyModal}
                />
                <ErrorMessage errorValue={formikProps.touched.building && formikProps.errors.building} />

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

                {/*TYPE*/}
                {renderInputType(formikProps)}

                {/* ASSIGNEE */}
                {isShowAssignee ? renderInputAssignee(formikProps) : null}

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

export default NewNotification;
