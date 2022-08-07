import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { language } from '@/i18n';
import CustomHeader from '@/components/CustomHeader';
import { colors, fonts } from '@/vars';
import { SafeArea } from '@/components/SafeArea';
import { ChatListChanel } from '@/screens/Message/ListChanel/component/ChatListChanel';
import NavigationActionsService from '@/navigation/navigation';
import { CHAT_HISTORY_SCREEN } from '@/navigation/screenKeys';
import ChatHistorySVG from '@/components/SVG/ChatHistorySVG';

export function ChatScreen(): ReactElement {
  const onPressSubIcon = () => {
    NavigationActionsService.push(CHAT_HISTORY_SCREEN);
  };

  return (
    <View style={styles.container}>
      <SafeArea />
      <CustomHeader
        isShadow={false}
        containerStyle={styles.wrapHeader}
        titleStyle={styles.textHeader}
        title={language('messages')}
        rightIcon={<ChatHistorySVG />}
        onPressSubIcon={onPressSubIcon}
      />
      <ChatListChanel />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  wrapHeader: {
    paddingHorizontal: 24,
  },
  textHeader: {
    fontSize: fonts.size.s22,
    fontFamily: fonts.family.PoppinsBold,
    color: colors.gray_900,
  },
});
