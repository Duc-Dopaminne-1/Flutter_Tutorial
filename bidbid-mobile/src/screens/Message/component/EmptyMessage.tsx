import { StyleSheet, Text, View } from 'react-native';
import { language } from '@/i18n';
import React, { ReactElement } from 'react';
import { colors, fonts } from '@/vars';
import { isIOS } from '@/shared/devices';
import ChatEmptySVG from '@/components/SVG/ChatEmptySVG';

export const EmptyMessage = (): ReactElement => {
  return (
    <View style={styles.container}>
      <ChatEmptySVG />
      <Text style={styles.textNote}>{language('noMessagesYet')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 10,
  },
  textNote: {
    fontSize: fonts.size.s16,
    color: colors.gray_900,
    fontWeight: isIOS ? '600' : 'bold',
    fontFamily: fonts.family.PoppinsRegular,
  },
});
