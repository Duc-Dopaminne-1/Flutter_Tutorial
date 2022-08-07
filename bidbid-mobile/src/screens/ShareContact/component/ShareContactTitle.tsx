import React, { ReactElement, memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '@/vars';

interface ShareContactTitleProps {
  title: string;
}
function ShareContactTitle(props: ShareContactTitleProps): ReactElement {
  const { title } = props;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray_100,
    paddingVertical: 8,
    paddingLeft: 15,
  },
  title: {
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsRegular,
    fontSize: fonts.size.s16,
  },
});

export default memo(ShareContactTitle);
