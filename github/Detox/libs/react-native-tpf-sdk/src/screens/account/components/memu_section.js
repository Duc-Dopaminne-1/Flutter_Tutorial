import { SPACING } from '../../../constants/size';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider } from '../../../components/';

const MenuSection = props => {
  const { hideDivider } = props;
  return (
    <View style={styles.container}>
      {hideDivider ? null : <Divider />}
      {props.children}
      {hideDivider ? null : <Divider />}
    </View>
  );
};
export default MenuSection;

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.Medium
  }
});
