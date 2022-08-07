import React from "react";
import { styles } from "../NewCategory/styles";
import Container from "@src/components/Container";
import { CustomButton } from "@src/components/CustomButton";
import CustomSectionHeader from "@src/components/CustomSection";
import { ADD_PLUS } from "@src/constants/icons";
import CustomInput from "@src/components/CustomInput";
import translate from "@src/localize";
import { Formik } from "formik";
import * as yub from 'yup';
import { View, KeyboardAvoidingView, ScrollView, Keyboard, Alert } from "react-native";
import ErrorMessage from "@src/components/ErrorMessage";
import getStyles from "@src/utils/getStyles";
import { getKeyboardAdvoidStyle } from "@src/utils";
import { CreateCategoryParams } from "@reup/reup-api-sdk/libs/api/company/maintenance/category";
import { useDispatch, useSelector } from "react-redux";
import NavigationActionsService from "@src/navigation/navigation";
import { createMaintenanceCategory } from "@src/modules/Maintenance/actions";
import { RootState } from "@src/types/types";
import { IUserProfile } from "@reup/reup-api-sdk/libs/api/user/models";
import { useRoute } from "@react-navigation/native";

const NewCategory = () => {

  const dispatch = useDispatch();
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const route = useRoute();
  const { flatList } = route.params as any;

  const onPressSubmit = (value: any) => {
    Keyboard.dismiss();
    const companyId = me && me.default_company && me.default_company.id;
    const params: CreateCategoryParams = {
      name: value.title
    };

    NavigationActionsService.showLoading();

    dispatch(createMaintenanceCategory({
      companyId: companyId,
      params: params,
      onSuccess: (data) => {
        NavigationActionsService.hideLoading();
        flatList && flatList.current && flatList.current.reloadData();
        console.log("===== created position data: ", data);
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

  const validationSchema = yub.object().shape({
    title: yub.string().trim().required(translate("create_category.title_require"))
  });

  return (
    <Container
      isShowHeader={true}
      isDisplayNotification={false}
      isDisplayMenuButton={false}
      title={translate("create_category.title_header")}
    >
      <KeyboardAvoidingView style={getStyles('flex-1')} keyboardVerticalOffset={getKeyboardAdvoidStyle()} behavior={'padding'}>
        <Formik
          initialValues={{ title: "" }}
          onSubmit={onPressSubmit}
          validationSchema={validationSchema}
        >
          {({ handleSubmit, values, errors, handleChange, touched, handleBlur }) => (
            <>
              <ScrollView
                contentContainerStyle={{ flex: 1 }}
                style={{ flex: 1 }}
                bounces={false} >
                <View style={styles.container}>
                  <CustomSectionHeader
                    title={translate("create_category.title_section_header")}
                    icon={ADD_PLUS}
                    styleIcon={styles.iconSectionHeader}
                  />
                  <View style={styles.body}>
                    <CustomInput
                      description={translate("create_category.title_category")}
                      onChangeText={handleChange('title')}
                      autoCapitalize="none"
                      returnKeyType="next"
                      value={values.title}
                      onBlur={handleBlur('title')}
                    />
                    <ErrorMessage errorValue={touched.title && errors.title} />
                  </View>
                </View>
              </ScrollView>
              <View style={styles.containerSubmitBtn}>
                <CustomButton
                  style={styles.submitBtn}
                  text={translate("create_category.submit_button")}
                  textStyle={styles.textSubmitBtn}
                  onPress={handleSubmit}
                />
              </View>
            </>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default React.memo(NewCategory);
