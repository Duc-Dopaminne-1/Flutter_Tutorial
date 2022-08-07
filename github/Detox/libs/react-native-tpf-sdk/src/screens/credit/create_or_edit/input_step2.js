import __ from 'lodash';
import { CREDIT } from '../../../redux/actionsType';
import { SPACING } from '../../../constants/size';
import { scale } from '../../../utils/responsive';
import { CUSTOM_COLOR } from '../../../constants/colors';
import { getShowAlertError } from '../../../redux/actions/system';
import { StyleSheet, Text, View } from 'react-native';
import { useEmptyForm } from '../../../hooks/useEmptyForm';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { ERROR_PROCESS_AND_TRY } from '../../../constants/errors';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import ProgressPurchase from '../../insurance/components/progress_purchase';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  DynamicInputForm,
  PrimaryButton,
  SecondaryButton,
  WithLoading
} from '../../../components/';
import {
  createFinaneDealOrderClear,
  createFinaneDealOrderHandle
} from '../../../redux/actions/credit';
import SCREENS_NAME from '../../../constants/screens';
import { isIphoneX } from '../../../helpers/device';
import themeContext from '../../../constants/theme/themeContext';
import { ID_ATTRIBUTE_ARISTAS_STATUS, ID_GROUP_CUSTOMER_INFO } from './constants';

const InputStep2 = props => {
  const detailForm = useSelector(state => state.credit.financeDealOrderForm);
  const createOrEditResult = useSelector(state => state.credit.createOrEditResult);
  const [loaded, setLoaded] = React.useState(false);
  const [isHideDependentPay, setIsHideDependentPay] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [listComponent, setListComponent] = useState([]);
  const { fonts, text } = useContext(themeContext) || {};

  const initForm = components => {
    const companyComponent = __.find(components, o => {
      const customerType = __.find(
        o?.listAttribute || [],
        ob => ob?.attributeCode === 'CustomerType'
      );
      if (customerType) {
        return true;
      }

      return false;
    });

    const MarriedStatusComponent = __.find(components, o => {
      const customerType = __.find(
        o?.listAttribute || [],
        ob => ob?.attributeCode === 'TPB_MarriedStatus'
      );
      if (customerType) {
        return true;
      }

      return false;
    });

    if (MarriedStatusComponent) {
      let listComponentInstance = [...listComponent];

      const indexIDnumberRelation = __.findIndex(
        MarriedStatusComponent?.listAttribute || [],
        o => o?.attributeCode === 'TPB_IDnumberRelation'
      );

      const listAttributeInstance = [...MarriedStatusComponent?.listAttribute];

      if (indexIDnumberRelation > -1) {
        listAttributeInstance[indexIDnumberRelation].isRequired = false;
        listAttributeInstance[indexIDnumberRelation].hidden = true;
      }

      setListComponent([...listComponentInstance]);
    }

    if (companyComponent) {
      let listComponentInstance = [...listComponent];

      const indexCompanyName = __.findIndex(
        companyComponent?.listAttribute || [],
        o => o?.attributeCode === 'CompanyName'
      );

      const indexCompanyCode = __.findIndex(
        companyComponent?.listAttribute || [],
        o => o?.attributeCode === 'CompanyCode'
      );

      const indexCompanyAddress = __.findIndex(
        companyComponent?.listAttribute || [],
        o => o?.attributeCode === 'CompanyAddress'
      );

      const listAttributeInstance = [...companyComponent?.listAttribute];

      if (indexCompanyName > -1) {
        listAttributeInstance[indexCompanyName].isRequired = false;
        listAttributeInstance[indexCompanyName].hidden = true;
      }
      if (indexCompanyCode > -1) {
        listAttributeInstance[indexCompanyCode].isRequired = false;
        listAttributeInstance[indexCompanyCode].hidden = true;
      }
      if (indexCompanyAddress > -1) {
        listAttributeInstance[indexCompanyAddress].hidden = true;
      }

      setListComponent([...listComponentInstance]);
      return;
    }

    setListComponent(components);
  };

  useEffect(() => {
    const listComponentInit =
      detailForm.productForm?.listComponent?.filter(t => t?.step === 2) || [];
    setListComponent(listComponentInit);
    setLoaded(true);
  }, [detailForm]);

  useEffect(() => {
    if (loaded) {
      initForm(listComponent);
    }
  }, [loaded]);

  useEffect(() => {
    dispatch(createFinaneDealOrderClear());
    if (createOrEditResult?.isSuccess && createOrEditResult.step === 2) {
      if (createOrEditResult.action === 'continue') {
        navigation.navigate(SCREENS_NAME.CREATE_CREDIT_STEP_3_SCREEN, {
          orderId: createOrEditResult?.orderId
        });
      } else {
        // navigation.goBack();
      }
    } else if (createOrEditResult?.isError) {
      dispatch(getShowAlertError(ERROR_PROCESS_AND_TRY));
    }
  }, [dispatch, navigation, createOrEditResult]);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onChangeForm = components => {
    const companyComponent = __.find(components, o => {
      const customerType = __.find(
        o?.listAttribute || [],
        ob => ob?.attributeCode === 'CustomerType'
      );
      if (customerType) {
        return true;
      }

      return false;
    });

    const MarriedStatusComponent = __.find(components, o => {
      const customerType = __.find(
        o?.listAttribute || [],
        ob => ob?.attributeCode === 'TPB_MarriedStatus'
      );
      if (customerType) {
        return true;
      }

      return false;
    });

    if (MarriedStatusComponent) {
      const index = __.findIndex(components, o => {
        const customerType = __.find(
          o?.listAttribute || [],
          ob => ob?.attributeCode === 'TPB_MarriedStatus'
        );

        if (customerType) {
          return true;
        }

        return false;
      });
      const marriedStatus = __.find(
        MarriedStatusComponent?.listAttribute || [],
        o => o?.attributeCode === 'TPB_MarriedStatus'
      );

      const selected = marriedStatus?.value || '';
      const selectedAlias = __.find(marriedStatus?.optionData || [], o => o?.value === +selected);

      let listComponentInstance = [...listComponent];

      const indexIDnumberRelation = __.findIndex(
        MarriedStatusComponent?.listAttribute || [],
        o => o?.attributeCode === 'TPB_IDnumberRelation'
      );

      const listAttributeInstance = [...MarriedStatusComponent?.listAttribute];

      if (selectedAlias?.code !== '1') {
        if (indexIDnumberRelation > -1) {
          listAttributeInstance[indexIDnumberRelation].isRequired = false;
          listAttributeInstance[indexIDnumberRelation].hidden = true;
          listAttributeInstance[indexIDnumberRelation].error = '';
        }
        listComponentInstance[index] = {
          ...listComponentInstance[index],
          listAttribute: [...listAttributeInstance]
        };
      } else {
        if (indexIDnumberRelation > -1) {
          listAttributeInstance[indexIDnumberRelation].isRequired = true;
          listAttributeInstance[indexIDnumberRelation].hidden = false;
        }
        listComponentInstance[index] = {
          ...listComponentInstance[index],
          listAttribute: [...listAttributeInstance]
        };
      }

      setListComponent([...listComponentInstance]);
    }

    if (companyComponent) {
      const index = __.findIndex(components, o => {
        const customerType = __.find(
          o?.listAttribute || [],
          ob => ob?.attributeCode === 'CustomerType'
        );

        if (customerType) {
          return true;
        }

        return false;
      });

      const customerType = __.find(
        companyComponent?.listAttribute || [],
        o => o?.attributeCode === 'CustomerType'
      );
      const selected = customerType?.value || '';
      const selectedAlias = __.find(customerType?.optionData || [], o => o?.value === +selected);

      let listComponentInstance = [...listComponent];

      const indexCompanyName = __.findIndex(
        companyComponent?.listAttribute || [],
        o => o?.attributeCode === 'CompanyName'
      );

      const indexCompanyCode = __.findIndex(
        companyComponent?.listAttribute || [],
        o => o?.attributeCode === 'CompanyCode'
      );

      const indexCompanyAddress = __.findIndex(
        companyComponent?.listAttribute || [],
        o => o?.attributeCode === 'CompanyAddress'
      );

      const listAttributeInstance = [...companyComponent?.listAttribute];

      if (selectedAlias?.code === 'RB') {
        if (indexCompanyName > -1) {
          listAttributeInstance[indexCompanyName].isRequired = false;
          listAttributeInstance[indexCompanyName].error = '';
          listAttributeInstance[indexCompanyName].hidden = true;
        }
        if (indexCompanyCode > -1) {
          listAttributeInstance[indexCompanyCode].isRequired = false;
          listAttributeInstance[indexCompanyCode].error = '';
          listAttributeInstance[indexCompanyCode].hidden = true;
        }
        if (indexCompanyAddress > -1) {
          listAttributeInstance[indexCompanyAddress].hidden = true;
        }
        listComponentInstance[index] = {
          ...listComponentInstance[index],
          listAttribute: [...listAttributeInstance]
        };
      } else {
        if (indexCompanyName > -1) {
          listAttributeInstance[indexCompanyName].isRequired = true;
          listAttributeInstance[indexCompanyName].hidden = false;
        }
        if (indexCompanyCode > -1) {
          listAttributeInstance[indexCompanyCode].isRequired = true;
          listAttributeInstance[indexCompanyCode].hidden = false;
        }
        if (indexCompanyAddress > -1) {
          listAttributeInstance[indexCompanyAddress].hidden = false;
        }
        listComponentInstance[index] = {
          ...listComponentInstance[index],
          listAttribute: [...listAttributeInstance]
        };
      }

      setListComponent([...listComponentInstance]);
      return;
    }

    setListComponent(components);
  };

  const onContinue = useCallback(() => {
    const step3Component = detailForm.productForm?.listComponent?.filter(t => t?.step === 3) || [];
    const step1Component = detailForm.productForm?.listComponent?.filter(t => t?.step === 1) || [];
    let submitForm = {
      ...detailForm,
      productForm: {
        ...detailForm.productForm,
        listComponent: [...listComponent, ...step3Component, ...step1Component]
      }
    };

    dispatch(
      createFinaneDealOrderHandle({
        form: submitForm,
        action: 'continue',
        step: 2
      })
    );
  }, [dispatch, detailForm, listComponent]);

  useEffect(() => {
    if (listComponent) {
      const groupCustomerInfo = listComponent?.find(item =>
        ID_GROUP_CUSTOMER_INFO.includes(item.code)
      );
      const attributeAristasStatus = groupCustomerInfo?.listAttribute.find(item =>
        ID_ATTRIBUTE_ARISTAS_STATUS.includes(item.attributeCode)
      );
      const tmp = attributeAristasStatus?.optionData?.find(item => {
        if (
          ['0'].includes(item?.code) &&
          attributeAristasStatus?.value?.toString() === item?.value?.toString()
        ) {
          return item;
        }
      });
      if (tmp) {
        setIsHideDependentPay(true);
      }
    }
    return () => {
      setIsHideDependentPay(false);
    };
  }, [listComponent]);

  const isFillAll = useEmptyForm(listComponent, isHideDependentPay);

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        extraHeight={80}
        keyboardOpeningTime={-1}
        enableResetScrollToCoords={false}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: text?.primary, fontFamily: fonts?.BOLD }]}>
          {detailForm?.ordersItem?.name}
        </Text>
        <ProgressPurchase
          style={styles.progressContainer}
          currentStepIndex={1}
          stepList={[
            'confirm_subscription.step_list_01',
            'confirm_subscription.step_list_02',
            'confirm_subscription.step_list_03'
          ]}
        />

        <View style={styles.formContainer}>
          <DynamicInputForm
            listComponent={listComponent}
            onChange={onChangeForm}
            isHideDependentPay={isHideDependentPay}
          />
        </View>
      </KeyboardAwareScrollView>
      <View style={styles.footer}>
        <View style={[styles.flex, { marginRight: SPACING.Medium }]}>
          <SecondaryButton translate title={'common.back'} onPress={goBack} />
        </View>
        <View style={styles.flex}>
          <PrimaryButton
            translate
            title={'common.continue'}
            onPress={onContinue}
            disabled={!isFillAll}
          />
        </View>
      </View>
    </View>
  );
};

export default WithLoading(InputStep2, [
  CREDIT.CREATE_FINANE_DEAL_ORDER.HANDLER,
  CREDIT.GET_FINANCEDEAL_ORDER_FORM.HANDLER
]);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: CUSTOM_COLOR.White
  },
  formContainer: {
    marginTop: scale(24),
    marginHorizontal: scale(16)
  },
  title: {
    marginHorizontal: SPACING.Medium,
    textAlign: 'center',
    lineHeight: LINE_HEIGHT.Heading,
    fontSize: FONT_SIZE.Heading,
    marginTop: scale(24),
    marginBottom: scale(20)
  },
  footer: {
    padding: SPACING.Medium,
    paddingBottom: isIphoneX ? 0 : SPACING.Medium,
    borderTopWidth: 1,
    borderColor: CUSTOM_COLOR.GalleryDark,
    flexDirection: 'row'
  },
  flex: {
    flex: 1
  }
});
