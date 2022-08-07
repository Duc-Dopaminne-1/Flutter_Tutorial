/* eslint-disable no-case-declarations */
import { BACKGROUND_COLOR, CUSTOM_COLOR, TEXT_COLOR } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/size';
import React, { useCallback, useContext, useLayoutEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { BodyText } from '../../../components/';
import { scale } from '../../../utils/responsive';
import { Shadow } from '../../../constants/stylesCSS';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { formatNumber } from '../../../helpers/formatNumber';
import { ICInfoBold } from '../../../assets/icons';
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '../../../components/app_text';
import { useRef } from 'react';
import themeContext from '../../../constants/theme/themeContext';

const PayBackDetail = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { data } = route.params || {};
  const button = useRef(null);
  const { loanAmount, calculateType, duration, paymentTerm, _calculateLoan } = data || {};
  const [modalVisible, setModalVisible] = useState(false);
  const [marginTop, setMarginTop] = useState(0);

  const { fonts, text, app } = useContext(themeContext) || {};

  const onOpenModal = useCallback(() => {
    button.current.measure((fx, fy, width, height, px, py) => {
      setMarginTop(py);
      setModalVisible(true);
    });
  }, []);
  const onCloseModal = useCallback(() => {
    setModalVisible(false);
  }, []);
  useLayoutEffect(() => {
    navigation.setOptions({
      RightComponent: () => (
        <TouchableOpacity ref={button} onPress={onOpenModal}>
          <ICInfoBold style={styles.headerRightIC} />
        </TouchableOpacity>
      )
    });
  }, [navigation, onOpenModal]);

  const termCount = useMemo(() => {
    switch (paymentTerm) {
      case 1:
        return parseInt(duration, 10);
      case 2:
        return Math.ceil(parseInt(duration, 10) / 3);
      case 3:
        return Math.ceil(parseInt(duration, 10) / 12);
      default:
        break;
    }
  }, [duration, paymentTerm]);

  const calculatePrincipalBalance = useCallback(
    (index, term = 1) => {
      const _totalPaid =
        (_calculateLoan?.interestPaidMonthly + _calculateLoan?.principalPaidMonthly) * term;
      return {
        interestPaid: Math.round(_calculateLoan?.interestPaidMonthly * term),
        principalPaid: Math.round(_calculateLoan?.principalPaidMonthly * term),
        totalPaid: _totalPaid,
        remain: Math.round(loanAmount - _calculateLoan?.principalPaidMonthly * (index + 1))
      };
    },
    [_calculateLoan, loanAmount]
  );

  const calculateRemainingBalance = useCallback(
    (totalRemain, term, i, surplus) => {
      const _interestPaidArray = Array.from(
        Array(surplus || term),
        (value, index) => _calculateLoan?.interestPaidMonthly[i * term + index]
      );
      const _interestPaid = _interestPaidArray.reduce((result, curValue) => result + curValue, 0);
      const _principalPaid = surplus
        ? _calculateLoan?.principalPaidMonthly * surplus
        : _calculateLoan?.principalPaidMonthly * term;
      const _totalPaid = _interestPaid + _principalPaid;
      const remain = totalRemain - _principalPaid;
      return {
        interestPaid: Math.round(_interestPaid),
        principalPaid: Math.round(_principalPaid),
        totalPaid: Math.round(_totalPaid),
        remain: Math.round(remain)
      };
    },
    [_calculateLoan]
  );

  const termValue = useMemo(() => {
    if (calculateType === 1) {
      switch (paymentTerm) {
        case 1:
          return Array.from(Array(termCount), (v, i) => {
            return calculatePrincipalBalance(i, 1);
          });
        case 2:
          if (parseInt(duration, 10) % 3 === 0) {
            return Array.from(Array(termCount), (v, i) => {
              return calculatePrincipalBalance(i, 3);
            });
          } else {
            return Array.from(Array(termCount), (v, i) => {
              if (i !== termCount - 1) {
                return {
                  ...calculatePrincipalBalance(i, parseInt(duration, 10) % 3 === 0),
                  remain: 0
                };
              } else {
                return calculatePrincipalBalance(i, 3);
              }
            });
          }
        case 3:
          if (parseInt(duration, 10) % 12 === 0) {
            return Array.from(Array(termCount), (v, i) => {
              return calculatePrincipalBalance(i, 12);
            });
          } else {
            return Array.from(Array(termCount), (v, i) => {
              if (i === termCount - 1) {
                return {
                  ...calculatePrincipalBalance(i, parseInt(duration, 10) % 12),
                  remain: 0
                };
              } else {
                return calculatePrincipalBalance(i, 12);
              }
            });
          }
        default:
          return;
      }
    } else {
      switch (paymentTerm) {
        case 1:
          let totalRemainMonthly = loanAmount;
          return Array.from(Array(termCount), (v, i) => {
            const _totalPaid =
              _calculateLoan?.interestPaidMonthly[i] + _calculateLoan?.principalPaidMonthly;
            const remain = totalRemainMonthly - _calculateLoan?.principalPaidMonthly;
            totalRemainMonthly -= _calculateLoan?.principalPaidMonthly;
            return {
              interestPaid: Math.round(_calculateLoan?.interestPaidMonthly[i]),
              principalPaid: Math.round(_calculateLoan?.principalPaidMonthly),
              totalPaid: Math.round(_totalPaid),
              remain: Math.round(remain)
            };
          });
        case 2:
          let totalRemainQuarter = loanAmount;
          const surplus = parseInt(duration, 10) % 3;
          if (surplus === 0) {
            return Array.from(Array(termCount), (v, i) => {
              const result = calculateRemainingBalance(totalRemainQuarter, 3, i);
              totalRemainQuarter -= result?.principalPaid || 0;
              return result;
            });
          } else {
            return Array.from(Array(termCount), (v, i) => {
              if (i === termCount - 1) {
                const result = calculateRemainingBalance(totalRemainQuarter, 3, i, surplus);
                totalRemainQuarter -= result?.principalPaid || 0;
                return result;
              } else {
                const result = calculateRemainingBalance(totalRemainQuarter, 3, i);
                totalRemainQuarter -= result?.principalPaid || 0;
                return result;
              }
            });
          }
        case 3:
          let totalRemainYearly = loanAmount;
          const surplusYearly = parseInt(duration, 10) % 12;
          if (surplusYearly === 0) {
            return Array.from(Array(termCount), (v, i) => {
              const result = calculateRemainingBalance(totalRemainYearly, 12, i);
              totalRemainYearly -= result?.principalPaid || 0;
              return result;
            });
          } else {
            return Array.from(Array(termCount), (v, i) => {
              if (i === termCount - 1) {
                const result = calculateRemainingBalance(totalRemainYearly, 12, i, surplusYearly);
                totalRemainYearly -= result?.principalPaid || 0;
                return result;
              } else {
                const result = calculateRemainingBalance(totalRemainYearly, 12, i);
                totalRemainYearly -= result?.principalPaid || 0;
                return result;
              }
            });
          }
        default:
          return;
      }
    }
  }, [
    termCount,
    paymentTerm,
    calculatePrincipalBalance,
    duration,
    _calculateLoan,
    calculateType,
    calculateRemainingBalance,
    loanAmount
  ]);

  const _marginTop = useMemo(() => {
    return Platform.OS === 'android' ? scale(20) : scale(14) + insets.top;
  }, [insets]);

  const styleLabel = {
    ...styles.label,
    color: app?.primaryColor2
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.wrapper}
        showsVerticalScrollIndicator={false}>
        {termValue.map((item, index) => (
          <View key={index.toString()} style={styles.boxContainer}>
            <View style={[styles.rowItem, { marginTop: 0 }]}>
              <Text style={[styles.bigHeader, { fontFamily: fonts?.SEMIBOLD }]}>{`Kỳ hạn ${
                index + 1
              }`}</Text>
              <Text style={[styles.unit.color, { fontFamily: fonts?.MEDIUM }]}>
                {'Đơn vị (VNĐ)'}
              </Text>
            </View>

            <View style={styles.dashed} />
            <View style={styles.rowItem}>
              <AppText translate style={styleLabel}>
                {'other.interest_refund'}
              </AppText>
              <BodyText color={app?.primaryColor2} medium>
                {formatNumber(item?.interestPaid)}
              </BodyText>
            </View>
            <View style={styles.rowItem}>
              <AppText translate style={styleLabel}>
                {'other.root_refund'}
              </AppText>
              <BodyText color={app?.primaryColor2} medium>
                {formatNumber(item?.principalPaid)}
              </BodyText>
            </View>
            <View style={styles.rowItem}>
              <AppText translate style={styleLabel}>
                {'other.money_refund'}
              </AppText>
              <BodyText color={app?.primaryColor2} medium>
                {formatNumber(item?.totalPaid.toFixed(0))}
              </BodyText>
            </View>
            <View style={styles.rowItem}>
              <AppText translate style={styleLabel}>
                {'other.debt'}
              </AppText>
              <BodyText color={app?.primaryColor2} bold>
                {formatNumber(item?.remain.toFixed(0))}
              </BodyText>
            </View>
            <View style={styles.circle} />
          </View>
        ))}
      </ScrollView>
      <Modal
        onBackdropPress={onCloseModal}
        isVisible={modalVisible}
        backdropColor={null}
        animationIn="fadeIn"
        animationOut="fadeOut"
        style={{ justifyContent: 'flex-start' }}>
        <View style={{ marginTop, alignItems: 'flex-end' }}>
          <View style={styles.triangle} />
          <View style={styles.noticeView}>
            <AppText translate medium style={styles.whiteText}>
              {'step_finish.credit_noticeView_01'}
            </AppText>
            <AppText translate medium style={styles.whiteText}>
              {'step_finish.credit_noticeView_02'}
            </AppText>
            <AppText translate medium style={styles.whiteText}>
              {'step_finish.credit_noticeView_03'}
            </AppText>
          </View>
        </View>
      </Modal>
    </>
  );
};
export default PayBackDetail;

const styles = StyleSheet.create({
  headerRightIC: {
    marginRight: SPACING.Normal
  },
  container: {
    backgroundColor: BACKGROUND_COLOR.Primary,
    flex: 1
  },
  wrapper: {
    paddingHorizontal: SPACING.Medium,
    paddingVertical: SPACING.Large
  },
  boxContainer: {
    marginBottom: SPACING.Medium,
    padding: SPACING.Medium,
    backgroundColor: BACKGROUND_COLOR.Primary,
    borderRadius: BORDER_RADIUS,
    ...Shadow
  },
  bigHeader: {
    marginBottom: SPACING.Medium,

    fontSize: FONT_SIZE.Heading,
    lineHeight: LINE_HEIGHT.Heading,
    color: CUSTOM_COLOR.BlueStone
  },
  unit: {
    marginBottom: SPACING.Medium,
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText,
    color: CUSTOM_COLOR.GreenBold
  },
  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.Medium
  },
  circle: {
    position: 'absolute',
    height: scale(16, false),
    width: scale(16),
    borderRadius: scale(16),
    backgroundColor: CUSTOM_COLOR.Alabaster,
    top: scale(50),
    right: scale(-8)
  },
  dashed: {
    borderWidth: scale(1),
    borderStyle: 'dashed',
    borderColor: CUSTOM_COLOR.GreyDivider
  },
  whiteText: {
    color: CUSTOM_COLOR.White,
    fontSize: FONT_SIZE.Small,
    lineHeight: LINE_HEIGHT.Small
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: scale(8),
    borderRightWidth: scale(8),
    borderBottomWidth: scale(9),
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: CUSTOM_COLOR.BlueStone,
    marginRight: SPACING.XNormal
  },
  noticeView: {
    backgroundColor: CUSTOM_COLOR.BlueStone,
    borderRadius: BORDER_RADIUS,
    padding: SPACING.XNormal,
    width: scale(280),
    height: scale(153),
    justifyContent: 'space-between'
  },
  label: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    color: CUSTOM_COLOR.GreenBold
  }
});
