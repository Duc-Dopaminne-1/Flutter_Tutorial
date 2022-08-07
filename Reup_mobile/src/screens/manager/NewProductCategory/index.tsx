import { View } from "react-native-animatable";
import React from "react";
import { styles } from "../NewCategory/styles";
import Container from "@src/components/Container";
import { CustomButton } from "@src/components/CustomButton";
import CustomSectionHeader from "@src/components/CustomSection";
import { ADD_PLUS } from "@src/constants/icons";
import CustomInput from "@src/components/CustomInput";
import translate from "@src/localize";
import { Formik } from "formik";
import * as yup from 'yup';
import { KeyboardAvoidingView, Keyboard, Alert } from "react-native";
import getStyles from "@src/utils/getStyles";
import { getKeyboardAdvoidStyle } from "@src/utils";
import ErrorMessage from "@src/components/ErrorMessage";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@src/types/types";
import { IUserProfile } from "@reup/reup-api-sdk/libs/api/user/models";
import { IProductCategoryRequestParams } from "@reup/reup-api-sdk/libs/api/shopping_store/models";
import NavigationActionsService from "@src/navigation/navigation";
import { createProductCategory } from "@src/modules/shopping_store/action";
import { useRoute } from "@react-navigation/native";

const NewProductCategory = () => {

  const dispatch = useDispatch();
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const route = useRoute();
  const { flatList } = route.params as any;

  const validationSchema = yup.object().shape({
    categoryName: yup
      .string()
      .trim()
      .required(translate('new_product_category.name_require'))
  });

  const onCreateCategoryName = (value: any) => {
    Keyboard.dismiss();
    const companyId = me && me.default_company && me.default_company.id;
    const params: IProductCategoryRequestParams = {
      name: value.categoryName
    };

    NavigationActionsService.showLoading();
    dispatch(createProductCategory({
      companyId: companyId,
      params: params,
      onSuccess: (data) => {
        NavigationActionsService.hideLoading();
        flatList && flatList.current && flatList.current.reloadData();
        console.log("===== created product category: ", data);
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

  return (
    <Container isShowHeader={true} title={translate("new_product_category.title")}>
      <KeyboardAvoidingView style={getStyles('flex-1')} keyboardVerticalOffset={getKeyboardAdvoidStyle()} behavior={'padding'}>
        <Formik initialValues={{ categoryName: '' }}
          onSubmit={onCreateCategoryName}
          validationSchema={validationSchema}>
          {({ handleSubmit, values, errors, handleChange, touched, handleBlur }) => (
            <View style={{ flex: 1 }}>
              <View style={styles.container}>
                <CustomSectionHeader
                  title={translate("new_product_category.header")}
                  icon={ADD_PLUS}
                  styleIcon={styles.iconSectionHeader} />
                <View style={styles.body}>
                  <CustomInput
                    description={translate("new_product_category.category_name")}
                    onChangeText={handleChange('categoryName')}
                    autoCapitalize="none"
                    returnKeyType="next"
                    value={values.categoryName}
                    onSubmitEditing={handleSubmit}
                    onBlur={handleBlur('categoryName')}
                  />
                  <ErrorMessage errorValue={touched.categoryName && errors.categoryName} />
                </View>
              </View>
              <View style={styles.containerSubmitBtn}>
                <CustomButton
                  style={styles.submitBtn}
                  text={translate("create_category.submit_button")}
                  textStyle={styles.textSubmitBtn}
                  onPress={handleSubmit}
                />
              </View>
            </View>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default NewProductCategory;
