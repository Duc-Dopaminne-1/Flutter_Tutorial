import React, { ReactElement, memo } from 'react';
import { StyleSheet, View, ViewStyle, Text, TextStyle, Pressable, ScrollView } from 'react-native';
import { colors, fonts } from '@/vars';
import Modal from 'react-native-modal';
import { language } from '@/i18n';
import { CustomLine } from '@/components/CustomeLine';
import IconCloseSVG from '@/components/SVG/IconCloseSVG';

interface MyAuctionDetailRuleModalProps {
  isVisible: boolean;
  onBackdropPress?: () => void;
  onPressOke?: () => void;
  isMeetOffline?: boolean;
}

function MyAuctionDetailRuleModal(props: MyAuctionDetailRuleModalProps): ReactElement {
  const { isVisible, onBackdropPress, onPressOke, isMeetOffline } = props;
  const doContent = isMeetOffline ? language('myAuctionRule.doInPersonContent') : language('myAuctionRule.doVirtualContent');
  const doNotContent = isMeetOffline ? language('myAuctionRule.doNotInPersonContent') : language('myAuctionRule.doNotVirtualContent');

  const renderIconClose = () => {
    return (
      <View style={styles.topView}>
        <Pressable style={styles.wrapperCloseIcon} onPress={onBackdropPress}>
          <IconCloseSVG />
        </Pressable>
      </View>
    );
  };

  const renderButton = () => {
    return (
      <Pressable style={styles.wrapBtn} onPress={onPressOke}>
        <Text style={styles.submitText}>{language('ok')}</Text>
      </Pressable>
    );
  };

  const renderRule = (title: string, content: string, index: number) => {
    return (
      <View style={index === 1 && styles.wrapContent}>
        <Text style={styles.textTitle}>{title}</Text>
        <CustomLine lineStyle={styles.wrapLine} />
        <Text style={styles.textNote}>{content}</Text>
      </View>
    );
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={onBackdropPress} onBackButtonPress={onBackdropPress} style={styles.wrapModal}>
      <View style={styles.container}>
        {/* Top View */}
        {renderIconClose()}
        <Text style={styles.textHeader}>{language('meetGreet')}</Text>
        <CustomLine lineStyle={styles.titleLine} />
        <Text style={styles.textHeader}>{language('myAuctionRule.title')}</Text>
        <ScrollView contentContainerStyle={styles.wrapBody}>
          {renderRule(language('myAuctionRule.do'), doContent, 1)}
          {renderRule(language('myAuctionRule.doNot'), doNotContent, 2)}
        </ScrollView>
        {renderButton()}
      </View>
    </Modal>
  );
}

export default memo(MyAuctionDetailRuleModal);

const styles = StyleSheet.create({
  wrapModal: {
    margin: 0,
    justifyContent: 'center',
  } as ViewStyle,

  container: {
    maxHeight: '80%',
    paddingVertical: 15,
    paddingHorizontal: 21,
    marginHorizontal: 20,
    borderRadius: 12,
    backgroundColor: colors.white,
  } as ViewStyle,

  wrapBtn: {
    width: '85%',
    height: 50,
    borderRadius: 36,
    alignItems: 'center',
    backgroundColor: colors.red_700,
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 10,
  } as ViewStyle,

  topView: {
    alignItems: 'flex-end',
    backgroundColor: colors.white,
  } as ViewStyle,

  wrapperCloseIcon: {
    padding: 5,
    paddingRight: 0,
  } as ViewStyle,

  submitText: {
    textAlign: 'center',
    fontSize: fonts.size.s16,
    color: colors.white,
    fontWeight: fonts.fontWeight.bold,
    fontFamily: fonts.family.PoppinsRegular,
  } as TextStyle,
  wrapContent: {
    marginBottom: 20,
    marginTop: 10,
  },
  textHeader: {
    fontWeight: fonts.fontWeight.bold,
    fontFamily: fonts.family.PoppinsRegular,
    fontSize: fonts.size.s16,
    color: colors.gray_900,
    textAlign: 'center',
  },
  textTitle: {
    fontWeight: '500',
    fontFamily: fonts.family.PoppinsRegular,
    fontSize: fonts.size.s14,
    color: colors.black,
  },
  wrapLine: {
    marginTop: 4,
    marginBottom: 10,
  },
  titleLine: {
    marginVertical: 10,
  },
  textNote: {
    fontFamily: fonts.family.RobotoRegular,
    fontSize: fonts.size.s14,
    color: colors.gray_600,
  },
  wrapBody: {
    paddingBottom: 20,
  },
});
