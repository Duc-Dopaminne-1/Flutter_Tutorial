import React, { useEffect } from 'react';
import Container from '@src/components/Container';
import { View, KeyboardAvoidingView, ScrollView, Keyboard, Alert } from 'react-native';
import CustomInput from '@src/components/CustomInput';
import styles from './styles';
import CustomSectionHeader from '@src/components/CustomSection';
import translate from '@src/localize';
import ErrorMessage from '../../../../components/ErrorMessage';
import { CustomButton } from '@src/components/CustomButton';
import { ICON_EDIT_WHITE } from '@src/constants/icons';
import { Formik, FormikHelpers } from 'formik';
import { object, string } from 'yup';
import { getKeyboardAdvoidStyle } from '@src/utils';
import getStyles from '@src/utils/getStyles';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import CustomAccessory from '@src/components/CustomAccessory';
import { useDispatch, useSelector } from 'react-redux';
import { updatePosition } from '@src/modules/Company/actions';
import { RootState } from '@src/types/types';
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { ICompany } from '@reup/reup-api-sdk/libs/api/company/models';
import { UpdateCompanyPositionParams } from '@reup/reup-api-sdk/libs/api/company/position/indes';
import NavigationActionsService from '@src/navigation/navigation';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { useRoute } from '@react-navigation/native';

interface AddStaffPositionProps { }

const EditStaffPosition = (props: AddStaffPositionProps) => {
  const dispatch = useDispatch();
  const route = useRoute();
  let mFormikProps: FormikHelpers<any>;
  const { item, flatList } = route.params as any;
  const companyList = useSelector<RootState, IPagination<ICompany>>((state: RootState) => state.company.listCompany);
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);

  useEffect(() => {
    mFormikProps.setFieldValue('positionName', item.name)
    return () => {
    };
  }, []);

  const validationSchema = object().shape({
    positionName: string()
      .trim()
      .required(translate('staff.staff_position_name_required')),
  });

  const onUpdatePosition = (value: any) => {
    Keyboard.dismiss()
    let currentCompany = '';
    if (me && me.default_company) {
      const selectedCompany = companyList.results.find(item => item.id === me.default_company.id);
      currentCompany = selectedCompany ? selectedCompany.id : '';
    }

    const params: UpdateCompanyPositionParams = {
      name: value.positionName
    }

    NavigationActionsService.showLoading();

    dispatch(updatePosition({
      companyId: currentCompany,
      id: item.id ?? '',
      params: params,
      onSuccess: (data) => {
        NavigationActionsService.hideLoading();
        flatList && flatList.current && flatList.current.reloadData()
        console.log("===== created position data: ", data)
        NavigationActionsService.pop()
      },
      onFail: error => {
        NavigationActionsService.hideLoading();
        setTimeout(() => {
          error && Alert.alert(translate('alert.title_error'), error.message);
        }, 700);
      }
    }))
  };

  const doneTyping = () => {
    return Keyboard.dismiss();
  };

  const renderInputFields = () => {
    return (
      <Formik
        initialValues={{ positionName: '' }}
        onSubmit={onUpdatePosition}
        validationSchema={validationSchema}>
        {formikProps => {
          mFormikProps = formikProps;
          return (
            <View style={[styles.containerMain]}>
              <View style={[styles.addStaffPositionContainer]}>
                <CustomSectionHeader
                  title={translate('staff.edit_staff_position_section_header')}
                  icon={ICON_EDIT_WHITE}
                  styleIcon={styles.sectionIconStyle}
                />
              </View>
              <ScrollView bounces={false} contentContainerStyle={styles.containerScrollView} keyboardShouldPersistTaps="handled">
                <View style={styles.inputFormSubContainer}>
                  <CustomInput
                    description={translate('staff.staff_position_name')}
                    onChangeText={formikProps.handleChange('positionName')}
                    autoCapitalize="none"
                    onSubmitEditing={formikProps.handleSubmit}
                    returnKeyType="done"
                    value={formikProps.values.positionName}
                    onBlur={formikProps.handleBlur('positionName')}
                  />
                  <ErrorMessage errorValue={formikProps.touched.positionName && formikProps.errors.positionName} />
                </View>
              </ScrollView>
              <View style={styles.bottomButtonContainer}>
                <CustomButton
                  textStyle={styles.buttonText}
                  text={translate('staff.staff_position_save')}
                  onPress={formikProps.handleSubmit}
                  style={styles.createButton}
                />
              </View>
            </View>
          )
        }}
      </Formik>
    );
  };

  const renderKeyboardAccessory = () => (
    <KeyboardAccessoryView style={{ padding: 0, height: 45 }} androidAdjustResize>
      <CustomAccessory
        currentInputIndex={0}
        numberOfInput={1}
        onPressDown={() => { }}
        onPressUp={() => { }}
        onPressDone={doneTyping}
      />
    </KeyboardAccessoryView>
  );

  return (
    <View style={[{ flex: 1 }]}>
      <KeyboardAvoidingView style={getStyles('flex-1')} keyboardVerticalOffset={getKeyboardAdvoidStyle()} behavior={'padding'}>
        <Container
          spaceBottom={true}
          isShowHeader={true}
          isDisplayNotification={false}
          isDisplayMenuButton={false}
          title={translate('staff.edit_staff_position_add_title')}
        >
          {renderInputFields()}
        </Container>
      </KeyboardAvoidingView>
      {renderKeyboardAccessory()}
    </View>
  );
};

export default EditStaffPosition;
