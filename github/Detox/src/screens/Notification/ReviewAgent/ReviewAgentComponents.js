import React from 'react';
import {StyleSheet, View} from 'react-native';

import {normal} from '../../../assets/theme/metric';
import KeyboardScrollView from '../../../components/KeyboardScrollView';
import ReviewTransactionInfo from '../../../components/ReviewTransactionInfo';
import ReviewAgentInfo from './ReviewAgentInfo';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: normal,
  },
});

const ReviewAgentComponents = ({
  transactionDetail,
  agentInfo,
  transactionCode,
  isSale,
  rating,
  onFinishRating,
}) => {
  return (
    <KeyboardScrollView>
      <View style={styles.container}>
        <ReviewTransactionInfo
          transactionCode={transactionCode}
          projectName={transactionDetail?.projectName}
          code={transactionDetail?.propertyCode}
        />
        <ReviewAgentInfo
          agentInfo={agentInfo}
          rating={rating}
          isSale={isSale}
          onFinishRating={onFinishRating}
        />
      </View>
    </KeyboardScrollView>
  );
};

export default ReviewAgentComponents;
