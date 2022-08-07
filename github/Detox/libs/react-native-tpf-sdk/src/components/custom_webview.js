import React from 'react';
import { StyleSheet, View } from 'react-native';
import { DEVICE_WIDTH, SPACING } from '../constants/size';
import HTMLView from './html_view';

const CustomWebview = ({
  content,
  style,
  padding = SPACING.Medium,
  parentPadding = 0,
  width,
  ...rest
}) => {
  return (
    <View style={[styles.container, style]}>
      <HTMLView
        content={content}
        width={width}
        widthImage={padding ? DEVICE_WIDTH - (padding + parentPadding) : DEVICE_WIDTH}
      />
    </View>
  );
};

export default CustomWebview;

const styles = StyleSheet.create({
  container: {
    paddingTop: SPACING.Large,
    paddingBottom: SPACING.HasBottomButton
  }
});
