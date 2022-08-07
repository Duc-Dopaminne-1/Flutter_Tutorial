import { ICEmpty } from '../../../assets/icons';
import { BodyText } from '../../../components/';
import { CUSTOM_COLOR } from '../../../constants/colors';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { scale } from '../../../utils/responsive';

const ProductTab = props => {
  return (
    <View style={styles.container}>
      <ICEmpty />
      <BodyText translate color={CUSTOM_COLOR.ShuttleGray}>
        {'product_tab.no_products'}
      </BodyText>
    </View>
  );
};

export default React.memo(ProductTab);

export const styles = StyleSheet.create({
  container: {
    height: scale(300),
    justifyContent: 'center',
    alignItems: 'center'
  }
});
