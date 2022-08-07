import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import CustomHeader from '@/components/CustomHeader';
import { colors, fonts } from '@/vars';
import { SafeArea } from '@/components/SafeArea';
import { Chat } from '@/screens/Message/ChatDetail/component/Chat';
import { GlobalProps } from '@/shared/Interface';
import { upPerCaseFirst } from '@/shared/processing';
import IconBack from '@/components/SVG/BackSvg';

export function ChatDetailScreen(props: GlobalProps): ReactElement {
  const roomId = props.route.params ? props.route.params?.roomId : '';
  const name = props.route.params ? props.route.params?.name : '';
  const isFromHistory = props.route.params ? props.route.params?.isFromHistory : false;

  return (
    <View style={styles.container}>
      <SafeArea />
      <CustomHeader leftIcon={<IconBack />} containerStyle={styles.wrapHeader} title={upPerCaseFirst(name)} titleStyle={styles.textTitle} />
      <Chat roomId={roomId} isFromHistory={isFromHistory} />
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
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsBold,
  },
});
