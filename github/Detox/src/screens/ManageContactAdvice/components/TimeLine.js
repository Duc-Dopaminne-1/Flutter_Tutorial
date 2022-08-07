import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import {SupportRequestInfoDto} from '../../../api/graphql/generated/graphql';
import {IMAGES} from '../../../assets/images';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {normal} from '../../../assets/theme/metric';
import {getTransactionDateTimeString} from '../../../utils/TimerCommon';
import {getDataByStatusName, REQUEST_STATUS} from '../utils/getDataByStatusName';

const TimeLine = ({data}: {data: SupportRequestInfoDto}) => {
  const {step: currentStep} = getDataByStatusName(data?.supportRequestStatusName);
  return (
    <View>
      <Item
        active={currentStep >= 0}
        title={getDataByStatusName(REQUEST_STATUS.RequestNew).description}
        date={getTransactionDateTimeString(data?.createdDatetime)}
      />
      <Item
        active={currentStep >= 1}
        title={getDataByStatusName(REQUEST_STATUS.RequestPending).description}
        date={getTransactionDateTimeString(data?.assignedDatetime)}
      />
      {data?.supportRequestStatusName === REQUEST_STATUS.RequestCancelled ? (
        <Item
          active={currentStep >= 2}
          failed={true}
          title={getDataByStatusName(REQUEST_STATUS.RequestCancelled).description}
          date={getTransactionDateTimeString(data?.cancelledDatetime)}
        />
      ) : (
        <Item
          active={currentStep >= 2}
          title={getDataByStatusName(REQUEST_STATUS.RequestProcessing).description}
          date={getTransactionDateTimeString(data?.processingDatetime)}
        />
      )}
      <Item
        active={currentStep >= 3}
        title={getDataByStatusName(REQUEST_STATUS.RequestProcessed).description}
        date={getTransactionDateTimeString(data?.completeDatetime)}
      />
      <Item
        hideLine
        active={currentStep >= 4}
        title={getDataByStatusName(REQUEST_STATUS.RequestClosed).description}
        date={getTransactionDateTimeString(data?.closeDatetime)}
      />
    </View>
  );
};

const Item = ({title, date, reason, active = false, failed = false, hideLine = false}) => {
  return (
    <View style={itemStyles.container}>
      <View style={itemStyles.left}>
        {active ? (
          <Image
            style={itemStyles.icon}
            source={failed ? IMAGES.IC_TL_FAIL : IMAGES.IC_SUCCESS_FILL}
          />
        ) : (
          <Image style={itemStyles.icon} source={IMAGES.IC_TL_INACTIVE} />
        )}
        {!hideLine && <View style={itemStyles.line} />}
      </View>
      <View style={itemStyles.right}>
        <Text style={itemStyles.title}>{title}</Text>
        <View>
          {!!reason && <Text style={itemStyles.body}>{reason}</Text>}
          <Text style={itemStyles.body}>{date}</Text>
        </View>
      </View>
    </View>
  );
};

const itemStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginLeft: 4,
  },
  left: {
    alignItems: 'center',
  },
  icon: {
    width: 16,
    height: 16,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: COLORS.GRAY_EO,
  },
  right: {
    marginLeft: normal,
    marginBottom: normal,
  },
  title: {
    ...FONTS.bold,
    fontSize: 14,
    color: COLORS.TEXT_DARK_10,
  },
  body: {
    ...FONTS.regular,
    fontSize: 12,
    color: COLORS.BLACK_31,
    marginTop: 2,
  },
});

export default TimeLine;
