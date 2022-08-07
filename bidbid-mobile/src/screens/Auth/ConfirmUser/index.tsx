import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeArea } from '@/components/SafeArea';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import { CustomWrapHeader } from '@/components/CustomWrapHeader';
import ConfirmUserItem from '@/screens/Auth/ConfirmUser/component/ConfirmUserItem';

export function ConfirmUserScreen(): ReactElement {
  return (
    <View style={styles.container}>
      <SafeArea />
      <CustomWrapHeader
        note={language('noteConfirm')}
        title={language('confirmInformation')}
        titleStyle={styles.txtTitle}
        noteStyle={styles.txtNote}
      />
      <ConfirmUserItem />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  txtTitle: {
    fontSize: fonts.size.s22,
  },
  txtNote: {
    fontSize: fonts.size.s16,
    color: colors.gray_500,
  },
});
