import React, { ReactElement } from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors, fonts } from '@/vars';

interface Prop {
  name: string;
}

function MapName(props: Prop): ReactElement {
  const { name } = props;

  return <Text style={styles.textName}>{name}</Text>;
}

export default React.memo(MapName);

const styles = StyleSheet.create({
  textName: {
    color: colors.gray_500,
    fontFamily: fonts.family.PoppinsRegular,
    fontSize: fonts.size.s13,
  },
});
