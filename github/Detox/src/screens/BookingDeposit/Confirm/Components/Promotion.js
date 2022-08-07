import React from 'react';
import {StyleSheet, View} from 'react-native';

import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {normal} from '../../../../assets/theme/metric';
import RequiredLabel from '../../../../components/RequiredLabel';

const styles = StyleSheet.create({
  container: {marginTop: normal},
});
const Promotion = () => {
  return (
    <View style={styles.container}>
      <RequiredLabel title={translate(STRINGS.PROMOTION_HEADER)} isRequired={false} />
      <RequiredLabel title={translate(STRINGS.PROMOTION_PRICE)} isRequired={false} />
      <RequiredLabel title={translate(STRINGS.PROMOTION_FEE)} isRequired={false} />
    </View>
  );
};

export default Promotion;
