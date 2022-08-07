import { View } from "react-native-animatable";
import React, { useState, useEffect } from "react";
import { styles } from "../NewCategory/styles";
import Container from "@src/components/Container";
import { CustomButton } from "@src/components/CustomButton";
import CustomSectionHeader from "@src/components/CustomSection";
import { ICON_EDIT_WHITE } from "@src/constants/icons";
import CustomInput from "@src/components/CustomInput";
import translate from "@src/localize";
import { Formik, FormikHelpers } from "formik";
import * as yup from 'yup';
import { KeyboardAvoidingView, Keyboard, Alert } from "react-native";
import getStyles from "@src/utils/getStyles";
import { getKeyboardAdvoidStyle } from "@src/utils";
import ErrorMessage from "@src/components/ErrorMessage";
import { useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@src/types/types";
import { IUserProfile } from "@reup/reup-api-sdk/libs/api/user/models";
import { IProductCategoryUpdateParams } from "@reup/reup-api-sdk/libs/api/shopping_store/models";
import NavigationActionsService from "@src/navigation/navigation";
import { updateProductCategory } from "@src/modules/shopping_store/action";

const EditProductCategory = () => {

  const dispatch = useDispatch();
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const route = useRoute()
  const { category, flatList } = route.params as any
  let mFormikProps: FormikHelpers<any>;

  useEffect(() => {
    mFormikProps.setFieldValue('categoryName', category.name)
    return () => {
    };
  }, []);

  const validationSchema = yup.object().shape({
    categoryName: yup
      .string()
      .trim()
      .required(translate('edit_product_category.name_require'))
  });

  const onUpdateCategoryName = (values: any) => {
    Keyboard.dismiss();
    const companyId = me && me.default_company && me.default_company.id;
    const params: IProductCategoryUpdateParams = {
      name: values.categoryName
    };

    NavigationActionsService.showLoading();
    dispatch(updateProductCategory({
      companyId: companyId,
      id: category.id ?? '',
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

  return (
    <Container isShowHeader={true} title={translate("edit_product_category.title")}>
      <KeyboardAvoidingView style={getStyles('flex-1')} keyboardVerticalOffset={getKeyboardAdvoidStyle()} behavior={'padding'}>
        <Formik initialValues={{ categoryName: '' }}
          onSubmit={onUpdateCategoryName}
          validationSchema={validationSchema}>
          {formikProps => {
            mFormikProps = formikProps;
            return (
              <View style={{ flex: 1 }}>
                <View style={styles.container}>
                  <CustomSectionHeader
                    title={translate("edit_product_category.header")}
                    icon={ICON_EDIT_WHITE}
                    styleIcon={styles.iconSectionHeader} />
                  <View style={styles.body}>
                    <CustomInput
                      description={translate("edit_product_category.category_name")}
                      onChangeText={formikProps.handleChange('categoryName')}
                      autoCapitalize="none"
                      returnKeyType="next"
                      value={formikProps.values.categoryName}
                      onSubmitEditing={formikProps.handleSubmit}
                      onBlur={formikProps.handleBlur('categoryName')}
                    />
                    <ErrorMessage errorValue={formikProps.touched.categoryName && formikProps.errors.categoryName} />
                  </View>
                </View>
                <View style={styles.containerSubmitBtn}>
                  <CustomButton
                    style={styles.submitBtn}
                    text={translate("edit_product_category.save")}
                    textStyle={styles.textSubmitBtn}
                    onPress={formikProps.handleSubmit}
                  />
                </View>
              </View>
            )
          }}
        </Formik>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default EditProductCategory;
