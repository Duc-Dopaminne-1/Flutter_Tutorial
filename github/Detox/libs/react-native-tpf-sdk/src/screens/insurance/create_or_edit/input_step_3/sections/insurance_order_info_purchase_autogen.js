import { getNewActionHandle } from '../../../../../redux/actions/workflow';
import { CustomInput, ExpandView, PrimaryButton } from '../../../../../components/';
import CustomDropdown from '../../../../../components/custom_dropdown';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../../../../constants/colors';
import SCREENS_NAME from '../../../../../constants/screens';
import { BORDER_RADIUS, SPACING } from '../../../../../constants/size';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { scale } from '../../../../../utils/responsive';

const InsuranceOrderInfoPurchaseAutoScreen = props => {
  const { navigation, data } = props;

  const dispatch = useDispatch();
  // Navigation next screen
  const onPress = useCallback(
    item => {
      switch (item?.value) {
        case 'submit':
          dispatch(
            getNewActionHandle({
              screenCode: SCREENS_NAME.INSURANCE_ORDER_INFO_PURCHASE_SCREEN,
              flowCode: 'CreateInsurance',
              data: dataInput
            })
          );

          break;
        case 'endpoint':
          navigation.navigate(data?.screenCode);
          break;
        case 'back':
          navigation.goBack();
          break;
        default:
          break;
      }
    },
    [data?.screenCode, dataInput, dispatch, navigation]
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

  const onChange = useCallback(
    ({ value, key, parentCode }) => {
      if (parentCode) {
        // In case component in belong to a form
        const newData = [...dataInput];
        const formIdx = dataInput.findIndex(element => element?.key === parentCode);
        newData[formIdx].value?.findIndex((element, index) => {
          if (element?.key === key) {
            newData[formIdx].value[index].value = value;
          }
        });
        setDataInput([...newData]);
      } else {
        // In case normal component
        const newData = [...dataInput];
        newData.value?.findIndex((element, index) => {
          if (element?.key === key) {
            newData.value[index].value = value;
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
        const formIdx = dataInput.findIndex(element => element?.key === parentCode);

        newData[formIdx]?.value?.findIndex((element, index) => {
          if (element?.key === key) {
            newData[formIdx].value[index].visible = !newData[formIdx].value[index].visible;
          }
        });
        setDataInput([...newData]);
      } else {
        // In case normal component
        const newData = [...dataInput];
        newData.value?.findIndex((element, index) => {
          if (element?.key === key) {
            newData.value[index].visible = !newData.value[index].visible;
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
                                key: item?.key,
                                parentCode: component?.key
                              })
                            }
                            data={item?.data}
                            onConfirm={value =>
                              onChange({
                                value,
                                key: item?.key,
                                parentCode: component?.key
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
                            type={item?.type}
                            title={item?.name}
                            placeholder={item?.placeholder || 'profile_info.enter_information'}
                            value={item?.value}
                            onChangeText={value =>
                              onChange({
                                value,
                                key: item?.key,
                                parentCode: component?.key
                              })
                            }
                            style={styles.inputContainer}
                            onVisibleChange={
                              item?.type === 'select'
                                ? () =>
                                    onAutoVisibleChange({
                                      key: item?.key,
                                      parentCode: component?.key
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

export default InsuranceOrderInfoPurchaseAutoScreen;

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
