import { getNewActionHandle } from '../../../../../redux/actions/workflow';
import { PrimaryButton } from '../../../../../components/';
import DynamicInputForm from '../../../../../components/dynamic_input_form';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../../../../constants/colors';
import SCREENS_NAME from '../../../../../constants/screens';
import { BORDER_RADIUS, SPACING } from '../../../../../constants/size';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { scale } from '../../../../../utils/responsive';
import ProgressPurchase from '../../../components/progress_purchase';
import themeContext from '../../../../../constants/theme/themeContext';

const InsurancePurchaseAutoGenScreen = props => {
  const { navigation, data } = props;
  const dispatch = useDispatch();
  const { fonts } = useContext(themeContext) || {};
  // Navigation next screen
  const onPress = useCallback(
    item => {
      switch (item?.value) {
        case 'submit':
          dispatch(
            getNewActionHandle({
              screenCode: SCREENS_NAME.INSURANCE_PURCHASE_SCREEN,
              flowCode: 'CreateInsurance',
              data: dataInput
            })
          );

          break;
        case 'back':
          navigation.goBack();
          break;
        default:
          break;
      }
    },
    [dataInput, dispatch, navigation]
  );

  const [dataInput, setDataInput] = useState();

  const workflowData = useSelector(state => state.workflow?.workflowData);

  useEffect(() => {
    if (workflowData) {
      navigation.navigate(workflowData.screenCode, workflowData);
    }
  }, [dispatch, navigation, workflowData]);

  // Initial value of data input
  useEffect(() => {
    setDataInput([...data?.listComponent]);
  }, [data?.listComponent]);

  const onChange = listComponent => {
    setDataInput([...listComponent]);
  };

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);
  return (
    <>
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { fontFamily: fonts?.BOLD }]}>{'Sản phẩm: Bảo An Khang'}</Text>
        <ProgressPurchase
          style={styles.progressContainer}
          currentStepIndex={0}
          stepList={[
            'product_screen.progress_purchase_item_01',
            'product_screen.progress_purchase_item_02',
            'product_screen.progress_purchase_item_03'
          ]}
        />
        <DynamicInputForm listComponent={dataInput} onChange={onChange} />
      </ScrollView>
      <View style={styles.footer}>
        <View style={[styles.flex, { marginRight: scale(15) }]}>
          <PrimaryButton
            translate
            title={'common.back_text'}
            titleStyle={styles.backTitle}
            onPress={goBack}
            backgroundColor={'rgba(240, 140, 49, 0.25)'}
            backgroundColorDisabled={BACKGROUND_COLOR.Silver}
          />
        </View>
        <View style={styles.flex}>
          <PrimaryButton
            translate
            title={'subcription.continue'}
            onPress={onPress}
            disabledText={styles.disabledText}
            backgroundColorDisabled={BACKGROUND_COLOR.Silver}
          />
        </View>
      </View>
    </>
  );
};

export default InsurancePurchaseAutoGenScreen;

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  list: {
    paddingVertical: SPACING.Normal
  },
  title: {
    marginHorizontal: SPACING.Medium,
    textAlign: 'center',
    lineHeight: LINE_HEIGHT.Heading,
    fontSize: FONT_SIZE.Heading,
    color: CUSTOM_COLOR.BlueStone
  },
  progressContainer: {
    marginTop: SPACING.Large,
    marginBottom: SPACING.Medium
  },
  footer: {
    paddingHorizontal: scale(12),
    paddingBottom: SPACING.Small,
    paddingTop: scale(16),
    backgroundColor: BACKGROUND_COLOR.White,
    marginTop: SPACING.Normal,
    flexDirection: 'row'
  },
  backTitle: {
    color: CUSTOM_COLOR.Orange
  },
  disabledText: {
    color: CUSTOM_COLOR.White
  },
  dropdownBackground: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dropdownContainer: {
    minHeight: '25%',
    width: '75%',
    backgroundColor: CUSTOM_COLOR.White,
    borderRadius: BORDER_RADIUS
  },
  expandView: {
    marginHorizontal: SPACING.Medium,
    marginVertical: SPACING.Normal
  },
  inputContainer: {
    // marginVertical: SPACING.Normal
  },
  buttonContainer: {
    marginHorizontal: SPACING.Medium,
    marginVertical: SPACING.Normal,
    flex: 1
  },
  butotnGroupContainer: {
    flexDirection: 'row'
  }
});
