import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { language } from '@/i18n';
import CustomHeader from '@/components/CustomHeader';
import { colors, fonts } from '@/vars';
import { SafeArea } from '@/components/SafeArea';
import { ChatListChanelHistory } from '@/screens/Message/ListChanelHistory/component/ChatListChanelHistory';
import IconBack from '@/components/SVG/BackSvg';

export function ChatHistoryScreen(): ReactElement {
  return (
    <View style={styles.container}>
      <SafeArea />
      <CustomHeader
        leftIcon={<IconBack />}
        containerStyle={styles.wrapHeader}
        title={language('chatHistory')}
        titleStyle={styles.textTitle}
      />
      <ChatListChanelHistory />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  wrapHeader: {
    marginTop: 0,
    paddingBottom: 10,
  },
  textTitle: {
    fontSize: fonts.size.s16,
    fontFamily: fonts.family.PoppinsBold,
    color: colors.gray_900,
  },
});
