import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {REQUEST_STATUS_CODE} from '../../../../assets/constants';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {HELPERS} from '../../../../assets/theme/helpers';
import {METRICS} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import KeyboardScrollView from '../../../../components/KeyboardScrollView';
import TextView from '../../../../components/TextView';
import ScreenIds from '../../../ScreenIds';
import RequestContactView from './RequestContactView';
import RequestInfoView from './RequestInfoView';
import RequestStatusView from './RequestStatusView';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    ...METRICS.horizontalPadding,
  },
  textHeader: {
    ...FONTS.bold,
    ...FONTS.fontSize18,
  },
  viewDetail: {
    marginTop: 3,
  },
  textViewDetail: {
    alignSelf: 'center',
    ...FONTS.regular,
    ...FONTS.fontSize12,
    color: COLORS.PRIMARY_A100,
  },
});

const RequestDetailInfoView = ({
  style = {},
  navigation,
  onChangeNote,
  isB2C = false,
  state,
  isTesting = false,
  isSending = false,
  callStringee,
}) => {
  const {statusCode = 0} = state.contactTradingInfo ?? {};
  const visibleDeposit =
    (statusCode === REQUEST_STATUS_CODE.STATE_DEPOSIT ||
      statusCode === REQUEST_STATUS_CODE.STATE_COMPLETED ||
      statusCode === REQUEST_STATUS_CODE.STATE_CLOSE) &&
    state.rawContactTradingInfo?.deposit;
  const visibleTransaction =
    statusCode === REQUEST_STATUS_CODE.STATE_COMPLETED ||
    (statusCode === REQUEST_STATUS_CODE.STATE_CLOSE && state.rawContactTradingInfo?.contract);

  const onPressTransactionSection = () => {
    navigation.navigate(ScreenIds.TradingCompleteDetail, {isViewing: true});
  };

  const onPressDepositSection = () => {
    navigation.navigate(ScreenIds.TradingDepositDetail);
  };

  const SectionView = ({title, onPress = () => {}}) => {
    return (
      <>
        <View style={HELPERS.fillRowSpaceBetween}>
          <Text style={styles.textHeader}>{title}</Text>
          <TextView
            disableTitle={true}
            containerStyle={styles.viewDetail}
            value={translate(STRINGS.VIEW_DETAIL)}
            valueStyle={styles.textViewDetail}
            canBeInteractive={true}
            valueContainerStyle={HELPERS.noneFill}
            onPress={onPress}
          />
        </View>
        <View style={commonStyles.separatorRow24} />
      </>
    );
  };

  return (
    <KeyboardScrollView
      showsVerticalScrollIndicator={false}
      contentStyle={[styles.container, style]}>
      <RequestStatusView
        navigation={navigation}
        isB2C={isB2C}
        isSending={isSending}
        state={state}
        callStringee={callStringee}
      />
      <View style={commonStyles.separatorRow24} />
      {!isTesting && (
        <RequestContactView
          isSending={isSending}
          isB2C={isB2C}
          state={state}
          callStringee={callStringee}
        />
      )}
      <View style={commonStyles.separatorRow24} />
      <RequestInfoView
        onChangeNote={onChangeNote}
        isB2C={isB2C}
        navigation={navigation}
        isSending={isSending}
        state={state}
      />
      <View style={commonStyles.separatorRow24} />

      {visibleDeposit && isSending && (
        <SectionView
          onPress={onPressDepositSection}
          title={translate(STRINGS.DEPOSIT_INFOMATION)}
        />
      )}
      {visibleTransaction && isSending && (
        <SectionView
          onPress={onPressTransactionSection}
          title={translate(STRINGS.TRANSACTION_INFO)}
        />
      )}
    </KeyboardScrollView>
  );
};

export default RequestDetailInfoView;
