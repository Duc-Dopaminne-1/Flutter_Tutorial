import React, { FC, memo } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Typography } from '@/shared/typography';
import { colors, fonts } from '../../vars';

export type DefaultTextProps = Partial<any> & {
  header?: boolean;
};

const DefaultText: FC<DefaultTextProps> = props => {
  const { header } = props;
  const textStyle = StyleSheet.flatten([
    { fontFamily: fonts.family.PoppinsRegular },
    header && Typography.headerBold,
    { color: colors.gray_700 },
    props.style && props.style,
  ]);

  return (
    <Text {...props} style={textStyle}>
      {props.children && props.children}
    </Text>
  );
};

export default memo(DefaultText);
