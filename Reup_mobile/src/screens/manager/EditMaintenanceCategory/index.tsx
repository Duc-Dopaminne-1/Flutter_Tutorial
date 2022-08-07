import React, { useEffect } from 'react';
import Container from '@src/components/Container';
import { View, KeyboardAvoidingView, ScrollView, Keyboard, Alert } from 'react-native';
import CustomInput from '@src/components/CustomInput';
import styles from './styles';
import CustomSectionHeader from '@src/components/CustomSection';
import translate from '@src/localize';
import { CustomButton } from '@src/components/CustomButton';
import { ICON_EDIT_WHITE } from '@src/constants/icons';
import { Formik, FormikHelpers } from 'formik';
import { object, string } from 'yup';
import { getKeyboardAdvoidStyle } from '@src/utils';
import getStyles from '@src/utils/getStyles';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import CustomAccessory from '@src/components/CustomAccessory';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@src/types/types';
import NavigationActionsService from '@src/navigation/navigation';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { useRoute } from '@react-navigation/native';
import ErrorMessage from '@src/components/ErrorMessage';
import { CreateCategoryParams } from '@reup/reup-api-sdk/libs/api/company/maintenance/category';
import { updateMaintenanceCategory } from '@src/modules/Maintenance/actions';

interface EditCategoryProps { }

const EditMaintenanceCategory = (props: EditCategoryProps) => {
  const dispatch = useDispatch();
  const route = useRoute();
  let mFormikProps: FormikHelpers<any>;
  const { item, flatList } = route.params as any;
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);

  useEffect(() => {
    mFormikProps.setFieldValue('categoryName', item.name)
    return () => {
    };
  }, []);

  const validationSchema = object().shape({
    categoryName: string()
      .trim()
      .required(translate('create_category.category_name_required')),
  });

  const onUpdateCategory = (value: any) => {
    Keyboard.dismiss()
    let companyId = '';
    if (me && me.default_company) {
      companyId = me.default_company.id;
    }

    const params: CreateCategoryParams = {
      name: value.categoryName
    }

    NavigationActionsService.showLoading();

    dispatch(updateMaintenanceCategory({
      companyId: companyId,
      id: item.id ?? '',
      params: params,
      onSuccess: (data) => {
        NavigationActionsService.hideLoading();
        flatList && flatList.current && flatList.current.reloadData()
        console.log("===== update category data: ", data)
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
        initialValues={{ categoryName: '' }}
        onSubmit={onUpdateCategory}
        validationSchema={validationSchema}>
        {formikProps => {
          mFormikProps = formikProps;
          return (
            <View style={[styles.containerMain]}>
              <View style={[styles.addCategoryContainer]}>
                <CustomSectionHeader
                  title={translate('create_category.edit_title_section_header')}
                  icon={ICON_EDIT_WHITE}
                  styleIcon={styles.sectionIconStyle}
                />
              </View>
              <ScrollView bounces={false} contentContainerStyle={styles.containerScrollView} keyboardShouldPersistTaps="handled">
                <View style={styles.inputFormSubContainer}>
                  <CustomInput
                    description={translate('create_category.title_category')}
                    onChangeText={formikProps.handleChange('categoryName')}
                    autoCapitalize="none"
                    onSubmitEditing={formikProps.handleSubmit}
                    returnKeyType="done"
                    value={formikProps.values.categoryName}
                    onBlur={formikProps.handleBlur('categoryName')}
                  />
                  <ErrorMessage errorValue={formikProps.touched.categoryName && formikProps.errors.categoryName} />
                </View>
              </ScrollView>
              <View style={styles.bottomButtonContainer}>
                <CustomButton
                  textStyle={styles.buttonText}
                  text={translate('create_category.save_button')}
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

  return (
    <View style={[{ flex: 1 }]}>
      <KeyboardAvoidingView style={getStyles('flex-1')} keyboardVerticalOffset={getKeyboardAdvoidStyle()} behavior={'padding'}>
        <Container
          spaceBottom={true}
          isShowHeader={true}
          isDisplayNotification={false}
          isDisplayMenuButton={false}
          title={translate('create_category.edit_title_header')}
        >
          {renderInputFields()}
        </Container>
      </KeyboardAvoidingView>
    </View>
  );
};

export default React.memo(EditMaintenanceCategory);
