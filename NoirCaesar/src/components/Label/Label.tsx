import { FONT_COLOR, FONT_SIZE_H4, SPACING_SM, sidePadding } from '@src/constants/vars';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import React from 'react';
import _ from 'lodash';

interface Props {
  text: string;
}

type Options = {
  prefix?: string;
  surfix?: string;
};

interface Style {
  container: ViewStyle;
  text: TextStyle;
}

const defaultProps: Props = {
  text: '',
};

const createTextComponent = (stylesConfig: Style, options?: Options) => (props: Props = defaultProps) => {
  const styles = StyleSheet.create(stylesConfig);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {_.get(options, 'prefix')}
        {props.text}
        {_.get(options, 'surfix')}
      </Text>
    </View>
  );
};

export const Title = createTextComponent({
  container: {
    paddingVertical: SPACING_SM,
    paddingHorizontal: sidePadding,
  },
  text: {
    fontSize: FONT_SIZE_H4,
    fontWeight: '500',
    color: FONT_COLOR,
  },
});
