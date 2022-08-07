import React from 'react';
import {StyleSheet, View} from 'react-native';

import {normal} from '../../../assets/theme/metric';
import ReviewAgentInfo from './ReviewAgentInfo';
import SupportRequestInfo from './SupportRequestInfo';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: normal,
  },
});

const ReviewAgentSupportRequestComponents = ({
  transactionDetail,
  rating,
  readonly = false,
  onFinishRating,
}) => {
  return (
    <View style={styles.container}>
      <SupportRequestInfo name={transactionDetail.postTitle} />
      <ReviewAgentInfo
        agentInfo={transactionDetail?.saleAgentInfo}
        rating={rating}
        readonly={readonly}
        onFinishRating={onFinishRating}
      />
    </View>
  );
};

export default ReviewAgentSupportRequestComponents;
