import { View, ScrollView, Alert, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import Container from '@components/Container';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles';
import translate from '@src/localize';
import { Formik } from 'formik';
import { object, string } from 'yup';
import ErrorMessage from '@src/components/ErrorMessage';
import { IC_TRANSFER } from '@src/constants/icons';
import CustomSectionHeader from '@src/components/CustomSection';
import CustomTextInput from '@src/components/CustomTextInput';
import { CustomButton } from '@src/components/CustomButton';
import { CustomDropdownSelect } from '@src/components/CustomDropdownSelect';
import { ObjDropdown } from '@src/components/Dropdown/DropdownNative';
import { findIndex, find } from 'lodash';
import { useRoute } from '@react-navigation/native';
import { RootState } from '@src/types/types';
import { ICompanyProperty } from '@reup/reup-api-sdk/libs/api/company/property/model';
import { ICompanyUnit } from '@reup/reup-api-sdk/libs/api/company/unit/model';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { transferApartment, getListApartment, getListProperty } from '@src/modules/Company/actions';
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import NavigationActionsService from '@src/navigation/navigation';
import Modal from 'react-native-modal';
import CustomSelect, { CustomSelectType } from '@src/components/CustomSelect';
import CustomInputSelect from '@src/components/CustomInputSelect';

interface Props {
  item: ICompanyUnit;
  flatList: any
}

const TransferApartment = (props: Props) => {
  const dispatch = useDispatch();
  const route = useRoute();
  const { item, flatList } = route.params as Props;
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const [isCountryModalVisible, setCountryModalVisible] = useState<boolean>(false);
  const [selectedListCountry, setSelectedListCountry] = useState<string[]>([]);
  const [isBuildingModalVisible, setBuildingModalVisible] = useState<boolean>(false);
  const [selectedListBuilding, setSelectedListBuilding] = useState<string[]>([]);
  const [isApartmentModalVisible, setApartmentModalVisible] = useState<boolean>(false);
  const [selectedListApartment, setSelectedListApartment] = useState<string[]>([]);
  const myCountryList = useSelector<RootState, ObjDropdown[]>((state: RootState) => {
    return [
      ...state.company.listMyCountry.results.map(item => ({
        _key: item.id + '',
        _value: item.name
      }))
    ]
  });
  const [apartments, setApartments] = useState<ICompanyUnit[]>([])
  const [properties, setProperties] = useState<ICompanyProperty[]>([])

  const listApartment: ObjDropdown[] = [
    ...apartments.map(itemApartment => ({
      _key: itemApartment.id ?? '',
      _value: itemApartment.code ?? '',
    }))
  ];

  const listBuilding: ObjDropdown[] = [
    ...properties.map(item => ({
      _key: item.id ?? '',
      _value: item.name ?? '',
    }))
  ]

  const fetchDataProperties = (objectCountry: ObjDropdown, setFieldValue: any) => {
    setFieldValue('building', '')
    setProperties([])
    setFieldValue('apCode', '')
    setApartments([])
    if (me && me.default_company) {
      const companyId = me.default_company.id ?? ''
      const countryId = objectCountry._key ?? ''
      NavigationActionsService.showLoading()
      dispatch(
        getListProperty({
          companyId: companyId,
          params: {
            country_id: countryId,
          },
          isSave: false,
          onFail: (error) => {
            NavigationActionsService.hideLoading()
            setTimeout(() => {
              error && Alert.alert(translate('alert.title_error'), error.message);
            }, 700);
          },
          onSuccess: (data: IPagination<ICompanyProperty>) => {
            NavigationActionsService.hideLoading()
            setProperties(data.results)
          }
        })
      )
    }
  }

  const fetchDataApartments = (objectProperty: ObjDropdown, formikProps: any) => {
    const { values, setFieldValue } = formikProps
    setFieldValue('apCode', '')
    setApartments([])
    if (me && me.default_company) {
      const companyId = me.default_company.id ?? ''
      const propertyId = objectProperty._key ?? ''
      const countryId = values.country ?? ''
      NavigationActionsService.showLoading()
      dispatch(
        getListApartment({
          companyId: companyId,
          q: {
            country_id: countryId,
            property_id: propertyId,
          },
          isSave: false,
          onFail: (error) => {
            NavigationActionsService.hideLoading()
            setTimeout(() => {
              error && Alert.alert(translate('alert.title_error'), error.message);
            }, 700);
          },
          onSuccess: (data: IPagination<ICompanyUnit>) => {
            NavigationActionsService.hideLoading()
            const result = data.results.filter(itemUnit => itemUnit.id != item.id)
            setApartments(result)
          }
        })
      )
    }
  }

  const validationSchema = object().shape({
    country: string()
      .required(translate('transfer_apartment.require_country'))
      .test("country",
        translate('transfer_apartment.require_country'),
        function (value) {
          return this.parent.country
        }),
    building: string()
      .required(translate('transfer_apartment.require_building_name'))
      .test("building",
        translate('transfer_apartment.require_building_name'),
        function (value) {
          return this.parent.building
        }),
    apCode: string()
      .required(translate('transfer_apartment.require_apartment_code'))
      .test("apCode",
        translate('transfer_apartment.require_apartment_code'),
        function (value) {
          return this.parent.apCode
        }),
  });

  const onTransferApartment = (values: any) => {
    if (me && me.default_company) {
      const companyId = me.default_company.id ?? ''
      const unitFromId = item.id ?? ''
      const unitToId = values.apCode ?? ''
      NavigationActionsService.showLoading()
      dispatch(
        transferApartment({
          companyId: companyId,
          unitFromId: unitFromId,
          unitToId: unitToId,
          onSuccess: () => {
            NavigationActionsService.hideLoading()
            flatList && flatList.current && flatList.current.reloadData()
            NavigationActionsService.popTo(2)
          },
          onFail: (error) => {
            NavigationActionsService.hideLoading()
            setTimeout(() => {
              error && Alert.alert(translate('alert.title_error'), error.message);
            }, 700);
          }
        })
      )
    }
  };

  const renderHeaderTitle = () => (
    <CustomSectionHeader style={styles.headerTitle} title={translate('transfer_apartment.header_section')} icon={IC_TRANSFER} />
  );

  const renderHeaderSection = (title: string) => (
    <CustomSectionHeader
      isShowIcon={false}
      style={styles.headerTitle}
      title={title}
      styleTitle={styles.headerTitleStyle} />
  );

  const onChangeDropdown = (obj: ObjDropdown, setFieldValue: any, field: string) => {
    if (obj._key) {
      setFieldValue(field, obj._key)
      return
    }
    setFieldValue(field, '')
  }

  const renderFrom = (formikProps: any) => {
    return (
      <>
        {renderHeaderSection(translate('transfer_apartment.from'))}
        <View style={[styles.contentSd, { paddingTop: 17 }]}>
          <CustomTextInput
            description={translate('transfer_apartment.country')}
            text={item.property ? item.property.country.name : ''}
            moreStyle={styles.textSession}
          />
          <CustomTextInput
            description={translate('transfer_apartment.building_name')}
            text={item.property ? item.property.name : ''}
            moreStyle={styles.textSession}
          />
          <CustomTextInput
            description={translate('transfer_apartment.apartment_code')}
            text={item.code}
            moreStyle={styles.textSession}
          />
        </View>
      </>)
  }

  const onCloseCountryModal = () => {
    setCountryModalVisible(false);
  };

  const onOpenCountryModal = () => {
    setCountryModalVisible(true);
  };

  const onCloseBuildingModal = () => {
    setBuildingModalVisible(false);
  };

  const onOpenBuildingModal = () => {
    setBuildingModalVisible(true);
  };

  const onCloseApartmentModal = () => {
    setApartmentModalVisible(false);
  };

  const onOpenApartmentModal = () => {
    setApartmentModalVisible(true);
  };

  const setTextFromKey = (dropDownList: ObjDropdown[], listSelected: string[]) => {
    const position = dropDownList.findIndex(item => item._key === listSelected[0])
    return dropDownList[position]._value;
  };

  const onSelectCountryDone = (selectedList: string[], setFieldValue: any, key: string) => {
    setCountryModalVisible(false);
    setSelectedListCountry(selectedList);
    setSelectedListApartment([])
    setSelectedListBuilding([])
    if (selectedList !== []) {
      if (selectedList.length === 1) {
        myCountryList.map((element: ObjDropdown) => {
          if (element._key === selectedList[0]) {
            onChangeDropdown(element, setFieldValue, 'country')
            fetchDataProperties(element, setFieldValue)
          }
        });
      }
    } else {
      setFieldValue(key, "");
    }
  };

  const onSelectBuildingDone = (selectedList: string[], formikProps: any, key: string) => {
    setBuildingModalVisible(false);
    setSelectedListBuilding(selectedList);
    setSelectedListApartment([])
    if (selectedList !== []) {
      if (selectedList.length === 1) {
        listBuilding.map((element: ObjDropdown) => {
          if (element._key === selectedList[0]) {
            onChangeDropdown(element, formikProps.setFieldValue, 'building')
            fetchDataApartments(element, formikProps)
          }
        });
      }
    } else {
      formikProps.setFieldValue(key, "");
    }
  };

  const onSelectApartmentDone = (selectedList: string[], formikProps: any, key: string) => {
    setApartmentModalVisible(false);
    setSelectedListApartment(selectedList);
    if (selectedList !== []) {
      if (selectedList.length === 1) {
        listApartment.map((element: ObjDropdown) => {
          if (element._key === selectedList[0]) {
            onChangeDropdown(element, formikProps.setFieldValue, 'apCode')
          }
        });
      }
    } else {
      formikProps.setFieldValue(key, "");
    }
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
        checkListData={myCountryList}
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
      isVisible={isBuildingModalVisible}
      useNativeDriver
      customBackdrop={
        <TouchableWithoutFeedback onPress={onCloseBuildingModal}>
          <View style={styles.backgroundModal} />
        </TouchableWithoutFeedback>
      }
    >
      <CustomSelect
        checkListData={listBuilding}
        selectedList={selectedListBuilding}
        onCloseModal={onCloseBuildingModal}
        onDone={(selectedList: string[]) => {
          onSelectBuildingDone(selectedList, formikProps, 'building');
        }}
        type={CustomSelectType.SingleSelect}
      />
    </Modal>;
  };

  const renderModalApartment = (formikProps: any) => {
    return <Modal
      key={'apCode'}
      hideModalContentWhileAnimating
      isVisible={isApartmentModalVisible}
      useNativeDriver
      customBackdrop={
        <TouchableWithoutFeedback onPress={onCloseApartmentModal}>
          <View style={styles.backgroundModal} />
        </TouchableWithoutFeedback>
      }
    >
      <CustomSelect
        checkListData={listApartment}
        selectedList={selectedListApartment}
        onCloseModal={onCloseApartmentModal}
        onDone={(selectedList: string[]) => {
          onSelectApartmentDone(selectedList, formikProps, 'apCode');
        }}
        type={CustomSelectType.SingleSelect}
      />
    </Modal>;
  };

  const renderTo = (formikProps: any) => (
    <>
      {renderHeaderSection(translate('transfer_apartment.to'))}
      <View style={styles.contentSd}>
        <View style={styles.inputFormSubContainer}>
          {renderModalCountry(formikProps.setFieldValue)}
          <CustomInputSelect
            mainContainer={{ marginTop: 20 }}
            description={translate('transfer_apartment.country')}
            text={formikProps.values.country ?
              setTextFromKey(myCountryList, selectedListCountry)
              : translate('transfer_apartment.please_choose')}
            onPress={onOpenCountryModal}
          />
          <ErrorMessage errorValue={formikProps.touched.country && formikProps.errors.country} />
          {renderModalBuilding(formikProps)}
          <CustomInputSelect
            description={translate('transfer_apartment.building_name')}
            text={formikProps.values.building ?
              setTextFromKey(listBuilding, selectedListBuilding)
              : translate('transfer_apartment.please_choose')}
            onPress={onOpenBuildingModal}
          />
          <ErrorMessage errorValue={formikProps.touched.building && formikProps.errors.building} />
          {renderModalApartment(formikProps)}
          <CustomInputSelect
            description={translate('transfer_apartment.apartment_code')}
            text={formikProps.values.apCode ?
              setTextFromKey(listApartment, selectedListApartment)
              : translate('transfer_apartment.please_choose')}
            onPress={onOpenApartmentModal}
          />
          <ErrorMessage errorValue={formikProps.touched.apCode && formikProps.errors.apCode} />
        </View>
      </View>
    </>
  )

  return (
    <Container
      spaceBottom={true}
      isShowHeader={true}
      title={translate('transfer_apartment.title_screen')}>
      <Formik
        initialValues={{ country: '', building: '', apCode: '' }}
        onSubmit={onTransferApartment}
        validationSchema={validationSchema}>
        {formikProps => {
          return (
            <View style={[styles.container]}>
              {renderHeaderTitle()}
              <ScrollView style={styles.containerScrollView} keyboardShouldPersistTaps={'handled'}>
                {renderFrom(formikProps)}
                {renderTo(formikProps)}
              </ScrollView>
              <View style={styles.contentBottom}>
                <CustomButton
                  onPress={formikProps.handleSubmit}
                  textStyle={styles.buttonTextLogin}
                  text={translate('transfer_apartment.submit')}
                  style={styles.buttonSubmit}
                />
              </View>
            </View>
          );
        }}
      </Formik>
    </Container>
  );
};

export default TransferApartment;
