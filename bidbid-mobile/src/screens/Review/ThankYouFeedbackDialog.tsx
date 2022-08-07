import React, { ReactElement } from 'react';
import { StyleSheet, TextStyle, ViewStyle, View, Text, Pressable } from 'react-native';
import { language } from '@/i18n';
import { colors, fonts } from '@/vars';
import Modal from 'react-native-modal';
import IconCloseSVG from '@/components/SVG/IconCloseSVG';
import IconThanksFeedbackSVG from '@/components/SVG/IconThanksFeedbackSVG';

interface Props {
  isVisible: boolean;
  onBackdropPress?: () => void;
}

export default function ThankYouFeedbackDialog(props: Props): ReactElement {
  const { isVisible, onBackdropPress = () => {} } = props;

  return (
    <Modal onBackdropPress={onBackdropPress} onBackButtonPress={onBackdropPress} isVisible={isVisible} style={styles.wrapModal}>
      <View style={styles.container}>
        {/* Top View */}
        <View style={styles.topView}>
          <Pressable style={styles.wrapperCloseIcon} onPress={onBackdropPress}>
            <IconCloseSVG />
          </Pressable>
        </View>

        <View style={styles.iconFeedbackWrapper}>
          <IconThanksFeedbackSVG />
        </View>

        {/* Content View */}
        <View style={styles.contentView}>
          <Text style={styles.description}>{language('auctionReview.thanksFeedbackModal')}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrapModal: {
    margin: 0,
    justifyContent: 'center',
    backgroundColor: colors.transparent,
  } as ViewStyle,

  container: {
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 12,
    backgroundColor: colors.white,
  } as ViewStyle,

  topView: {
    alignItems: 'flex-end',
    backgroundColor: colors.white,
  } as ViewStyle,

  wrapperCloseIcon: {
    padding: 5,
  } as ViewStyle,

  contentView: {
    padding: 2,
    marginVertical: 20,
  } as ViewStyle,

  description: {
    textAlign: 'center',
    marginHorizontal: 20,
    fontSize: fonts.size.s19,
    fontWeight: '500',
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsMedium,
  } as TextStyle,

  iconFeedbackWrapper: {
    alignItems: 'center',
  } as ViewStyle,
});
