import { getNewActionHandle } from '../../../../../redux/actions/workflow';
import { CustomInput, ExpandView, PrimaryButton } from '../../../../../components/';
import CustomDropdown from '../../../../../components/custom_dropdown';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../../../../constants/colors';
import SCREENS_NAME from '../../../../../constants/screens';
import { BORDER_RADIUS, SPACING } from '../../../../../constants/size';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { scale } from '../../../../../utils/responsive';
import ProgressPurchase from '../../components/progress_purchase';
import themeContext from '../../../../../constants/theme/themeContext';

const InsuranceConfirmInfoAutoScreen = props => {
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
              screenCode: SCREENS_NAME.INSURANCE_CONFIRM_INFO_SCREEN,
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
    [dispatch, dataInput, navigation]
  );

  const workflowData = useSelector(state => state.workflow?.workflowData);

  useEffect(() => {
    if (workflowData) {
      // navigation.navigate(workflowData.screenCode, workflowData);
    }
  }, [dispatch, navigation, workflowData]);

  const [dataInput, setDataInput] = useState();
  // Initial value of data input
  useEffect(() => {
    setDataInput([...data?.listComponent]);
  }, [data]);

  const onChange = useCallback(
    ({ value, key, parentCode }) => {
      if (parentCode) {
        // In case component in belong to a form
        const newData = [...dataInput];
        const formIdx = dataInput.findIndex(element => element?.keyField === parentCode);

        newData[formIdx]?.data?.findIndex((element, index) => {
          if (element?.keyField === key) {
            newData[formIdx].data[index].value = value;
          }
        });
        setDataInput([...newData]);
      } else {
        // In case normal component
        const newData = [...dataInput];
        newData.data?.findIndex((element, index) => {
          if (element?.keyField === key) {
            newData.data[index].value = value;
          }
        });
        setDataInput([...newData]);
      }
    },
    [dataInput]
  );

  const onAutoVisibleChange = useCallback(
    ({ key, parentCode }) => {
      if (parentCode) {
        // In case component in belong to a form
        const newData = [...dataInput];
        const formIdx = dataInput.findIndex(element => element?.keyField === parentCode);

        newData[formIdx]?.data?.findIndex((element, index) => {
          if (element?.keyField === key) {
            newData[formIdx].data[index].visible = !newData[formIdx].data[index].visible;
          }
        });

        setDataInput([...newData]);
      } else {
        // In case normal component
        const newData = [...dataInput];
        newData.data?.findIndex((element, index) => {
          if (element?.keyField === key) {
            newData.data[index].visible = !newData.data[index].visible;
          }
        });
        setDataInput([...newData]);
      }
    },
    [dataInput]
  );

  let extraView;

  return (
    <>
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { fontFamily: fonts?.BOLD }]}>{'Sản phẩm: Bảo An Khang'}</Text>
        <ProgressPurchase
          style={styles.progressContainer}
          currentStepIndex={1}
          stepList={[
            'product_screen.progress_purchase_item_01',
            'product_screen.progress_purchase_item_02',
            'product_screen.progress_purchase_item_03'
          ]}
        />
        {dataInput?.map(component => {
          switch (component?.type) {
            case 'form':
              return (
                <>
                  <ExpandView style={styles.expandView} title={component?.name}>
                    {component?.value?.map(item => {
                      if (item?.type === 'select') {
                        extraView = [
                          ...extraView,
                          <CustomDropdown
                            title={item?.name}
                            visible={item?.visible}
                            onVisibleChange={() =>
                              onAutoVisibleChange({
                                key: item?.keyField,
                                parentCode: component?.keyField
                              })
                            }
                            data={item?.data}
                            onConfirm={value =>
                              onChange({
                                value,
                                key: item?.keyField,
                                parentCode: component?.keyField
                              })
                            }
                            placeholder={item?.placeholder || ''}
                          />
                        ];
                      }

                      return (
                        <>
                          <CustomInput
                            translate
                            title={item?.name}
                            type={item?.type}
                            placeholder={item?.placeholder || 'profile_info.enter_information'}
                            value={item?.value}
                            onChangeText={value =>
                              onChange({
                                value,
                                key: item?.keyField,
                                parentCode: component?.keyField
                              })
                            }
                            style={styles.inputContainer}
                            onVisibleChange={
                              item?.type === 'select'
                                ? () =>
                                    onAutoVisibleChange({
                                      key: item?.keyField,
                                      parentCode: component?.keyField
                                    })
                                : undefined
                            }
                          />
                        </>
                      );
                    })}
                  </ExpandView>
                </>
              );
            case 'button':
              return (
                <View style={styles.buttonContainer}>
                  <PrimaryButton
                    translate
                    title={'common.continue_text'}
                    onPress={onPress}
                    disabledText={styles.disabledText}
                    backgroundColorDisabled={BACKGROUND_COLOR.Silver}
                  />
                </View>
              );
            case 'groupbutton':
              return (
                <View style={styles.butotnGroupContainer}>
                  {component?.value?.map(item => (
                    <View style={styles.buttonContainer}>
                      <PrimaryButton
                        title={item?.name}
                        onPress={() => onPress(item)}
                        disabledText={styles.disabledText}
                        backgroundColor={
                          item?.value !== 'confirm' && item?.value !== 'submit'
                            ? 'rgba(240, 140, 49, 0.25)'
                            : undefined
                        }
                        titleStyle={
                          item?.value !== 'confirm' && item?.value !== 'submit'
                            ? styles.backTitle
                            : undefined
                        }
                        backgroundColorDisabled={BACKGROUND_COLOR.Silver}
                      />
                    </View>
                  ))}
                </View>
              );
            default:
              return <View />;
          }
        })}
      </ScrollView>
      {extraView?.map(extraItem => extraItem)}
    </>
  );
};

export default InsuranceConfirmInfoAutoScreen;

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
