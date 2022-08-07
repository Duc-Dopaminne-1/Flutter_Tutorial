import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {IconButton} from 'react-native-paper';

import {SIZES} from '../../../assets/constants/sizes';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {METRICS, normal, small, tiny} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import CustomButton from '../../../components/Button/CustomButton';
import CustomButtonWithArrowRight from '../../../components/Button/CustomButtonWithArrowRight';
import LinkTextButton from '../../../components/LinkTextButton';
import {useCountDownToNow} from '../../../components/TimerCountDownToNowText';
import {isValueNull} from '../../../utils/DataProcessUtil';
import {getPriceForConfirm, isDepositStatus} from '../../../utils/getPropertyPrice';
import {useLogin} from '../../Auth/useLogin';
import {LIST_FIELDS, TITLE_FIELDS, TransactionContextType} from './ConfirmPropertyConstants';

const styles = StyleSheet.create({
  viewSmallContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 12,
  },
  smallTitleText: {
    ...FONTS.regular,
    fontSize: 13,
  },
  normalTitleText: {
    ...FONTS.regular,
    fontSize: 15,
    color: COLORS.TEXT_DARK_40,
  },
  valueText: {
    ...FONTS.semiBold,
  },
});

const pricesComponentStyle = StyleSheet.create({
  container: {
    height: 60,
    alignSelf: 'stretch',
    marginBottom: tiny,
    borderRadius: tiny,
    justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: COLORS.NEUTRAL_BACKGROUND,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.NEUTRAL_DIVIDER,
  },
});

const secondInfoMainRowStyle = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    marginBottom: 10,
    borderRadius: 4,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.NEUTRAL_DIVIDER,
    overflow: 'hidden',
  },
  tipRate: {
    color: COLORS.PRIMARY_A100,
    marginTop: 2,
  },
  numberBooking: {
    color: COLORS.PRIMARY_B100,
    marginTop: 2,
  },
  boxTipRate: {
    backgroundColor: COLORS.NEUTRAL_BACKGROUND,
    flex: 1,
  },
  boxNumberBooking: {
    backgroundColor: COLORS.NEUTRAL_BACKGROUND,
    marginRight: 0,
    flex: 1,
  },
});

const rowItemStyle = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    paddingVertical: tiny,
    marginTop: 4,
    flexDirection: 'row',
  },
  title: {
    marginRight: small,
    color: COLORS.TEXT_DARK_40,
  },
  value: {
    flexShrink: 1,
    ...FONTS.regular,
  },
  textProject: {color: COLORS.PRIMARY_A100, textDecorationLine: 'none'},
});

const viewBottomStyle = StyleSheet.create({
  container: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    padding: normal,
  },
  titleInfo: {...FONTS.bold, fontSize: 20, color: COLORS.TEXT_DARK_10, marginBottom: 10},
  titleButton: {
    ...FONTS.bold,
    fontSize: 16,
    color: COLORS.NEUTRAL_WHITE,
  },
  titlePrice: {...FONTS.regular, fontSize: 12, color: COLORS.TEXT_DARK_10},
  price: {...FONTS.bold, fontSize: 12, color: COLORS.RED_5B},
});

const PricesComponent = ({data}) => {
  const isDespositTransaction = isDepositStatus(data.currentMode);
  const {lablePrice, price} = getPriceForConfirm({isDespositTransaction, data, translate});
  return (
    <View style={pricesComponentStyle.container}>
      <View style={HELPERS.rowSpaceBetween}>
        <Text style={[styles.smallTitleText, HELPERS.fill]}>{lablePrice}</Text>
        {isDespositTransaction && (
          <Text style={[styles.smallTitleText, HELPERS.fill]}>{translate('common.unitPrice')}</Text>
        )}
      </View>
      <View style={HELPERS.row}>
        <Text style={[styles.valueText, {color: COLORS.STATE_ERROR, ...HELPERS.fill}]}>
          {price}
        </Text>
        {isDespositTransaction && (
          <>
            <Text
              style={[
                styles.valueText,
                {color: COLORS.TEXT_DARK_10, ...HELPERS.fill},
              ]}>{`${data?.price}/m2`}</Text>
          </>
        )}
      </View>
    </View>
  );
};

const BoxInfo = ({title, value, valueStyle, style}) => {
  return (
    <View style={[styles.viewSmallContainer, style]}>
      <Text style={styles.smallTitleText}>{title}</Text>
      <Text style={[styles.valueText, valueStyle]}>{value}</Text>
    </View>
  );
};

const SecondInfoMainRow = ({data}) => {
  if (!data) {
    return null;
  }
  const {isAgentUser, numberOfBooking, buyCommission} = data ?? {};
  const agentCommission = buyCommission;

  return (
    <>
      <PricesComponent data={data} />
      <View style={secondInfoMainRowStyle.container}>
        {isAgentUser && (
          <BoxInfo
            style={secondInfoMainRowStyle.boxTipRate}
            title={translate('common.commission')}
            value={agentCommission}
            valueStyle={secondInfoMainRowStyle.tipRate}
          />
        )}
        <BoxInfo
          style={secondInfoMainRowStyle.boxNumberBooking}
          title={translate('common.bookedTurn')}
          value={`${numberOfBooking ?? 0}`}
          valueStyle={secondInfoMainRowStyle.numberBooking}
        />
      </View>
    </>
  );
};

const RowItem = ({title, value, key, valueColor}) => {
  return (
    <View style={rowItemStyle.container} key={key}>
      <Text style={[styles.normalTitleText, rowItemStyle.title]}>{`${title}:`}</Text>
      <Text style={[styles.valueText, rowItemStyle.value, valueColor]}>{value}</Text>
    </View>
  );
};

const ListInfoContent = ({data, onPressToProjectDetail}) => {
  if (!data || !data.propertyType) {
    return null;
  }
  const propertyType = data.propertyType;
  const listFields = LIST_FIELDS[propertyType];
  const listItems = [];
  for (const index in listFields) {
    const item = listFields[index];
    if (!isValueNull(data[item])) {
      listItems.push(
        RowItem({
          title: TITLE_FIELDS[item],
          value: data[item],
          key: index.toString(),
          valueColor: item === 'bookingFee' ? {color: COLORS.RED_57} : {},
        }),
      );
    }
  }
  return (
    <View style={{padding: normal, backgroundColor: COLORS.NEUTRAL_WHITE}}>
      <Text style={viewBottomStyle.titleInfo}>{translate('DETAIL_INFORMATION')}</Text>
      <View style={rowItemStyle.container}>
        <Text style={[styles.normalTitleText, rowItemStyle.title]}>{`${translate(
          STRINGS.PROJECT_NAME,
        )}:`}</Text>
        <View style={HELPERS.fill} />
        <LinkTextButton
          style={rowItemStyle.value}
          onPress={onPressToProjectDetail}
          title={data?.projectName}
          textStyle={[styles.valueText, rowItemStyle.textProject]}
        />
        <IconButton
          style={METRICS.resetMargin}
          icon="chevron-right"
          color={COLORS.PRIMARY_A100}
          size={14}
        />
      </View>
      {listItems}
    </View>
  );
};
const countDownStyles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BLUE_56,
    paddingVertical: 6,
  },
  time: {
    color: COLORS.NEUTRAL_WHITE,
    ...FONTS.fontSize14,
    textAlign: 'center',
  },
});

const CountDown = ({dateEnd}) => {
  const time = useCountDownToNow({dateEnd});

  return (
    <View style={countDownStyles.container}>
      <Text style={countDownStyles.time}>
        {translate('project.confirmProperty.countDownBooking', {time})}
      </Text>
    </View>
  );
};

export const Price = ({type, price}) => {
  const text = [TransactionContextType.Booking].includes(type)
    ? translate('common.bookingPrice')
    : translate('common.depositPrice');
  return (
    <View style={[HELPERS.row, HELPERS.selfCenter]}>
      <Text style={viewBottomStyle.titlePrice}>{`${translate(STRINGS.PRICE)} ${text}: `}</Text>
      <Text style={viewBottomStyle.price}>{price}</Text>
    </View>
  );
};

const ViewBottom = ({
  data,
  isAgentUser,
  isSaleAgent,
  onRefresh,
  haveContactTrading = false,
  onPressUpgradeToAgent,
  onPressChooseAnother,
  onPress,
}) => {
  const contextType = data.contextType;
  const endDepositeTimeInSecond = data?.depositeDuration?.endDepositeTimeInSecond;
  const {notLoggedIn, showLogin} = useLogin();
  const titleButton = translate('common.next');
  const renderButton = () => {
    if (notLoggedIn) {
      return (
        <CustomButton
          onPress={() => {
            showLogin(() => {
              onRefresh();
            });
          }}
          style={[commonStyles.buttonNext, {marginTop: small}]}
          title={translate(STRINGS.LOGIN)}
          titleStyle={viewBottomStyle.titleButton}
        />
      );
    }
    if (!isAgentUser) {
      return (
        <CustomButton
          onPress={() => onPressUpgradeToAgent()}
          style={[commonStyles.buttonNext, {marginTop: small}]}
          title={translate(STRINGS.CONFIRM)}
          titleStyle={viewBottomStyle.titleButton}
        />
      );
    }
    if (isSaleAgent) {
      return <CustomButtonWithArrowRight title={titleButton} onPress={onPress} />;
    }

    if (haveContactTrading) {
      return (
        <CustomButton
          style={[commonStyles.disabledButtonNext, {marginTop: small}]}
          title={translate('project.confirmProperty.haveContactToBuy')}
          titleStyle={[viewBottomStyle.titleButton, {color: COLORS.TEXT_DARK_10}]}
          disabled
        />
      );
    }

    return (
      <CustomButton
        style={[commonStyles.buttonNext, {marginTop: small}]}
        title={translate('project.confirmProperty.contactToBuy')}
        titleStyle={viewBottomStyle.titleButton}
        onPress={onPress}
      />
    );
  };

  switch (contextType) {
    case TransactionContextType.Booking:
    case TransactionContextType.NewDeposit:
    case TransactionContextType.MoveDeposit:
      return (
        <View style={viewBottomStyle.container}>
          <Price type={contextType} price={data.bookingFee} />
          {renderButton()}
        </View>
      );
    case TransactionContextType.CannotDeposit:
      return (
        <View style={viewBottomStyle.container}>
          <CustomButton
            style={[commonStyles.buttonNext]}
            title={translate('project.confirmProperty.chooseAnother')}
            titleStyle={viewBottomStyle.titleButton}
            onPress={onPressChooseAnother}
          />
        </View>
      );
    case TransactionContextType.BookedDeposit:
      return (
        <>
          {endDepositeTimeInSecond && <CountDown dateEnd={endDepositeTimeInSecond} />}
          <View style={viewBottomStyle.container}>
            <Price type={contextType} price={data.bookingFee} />
            <CustomButtonWithArrowRight title={titleButton} onPress={onPress} />
          </View>
        </>
      );
  }

  return null;
};

export {ListInfoContent, SecondInfoMainRow, ViewBottom};
