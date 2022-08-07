import React, { ReactElement } from 'react';
import { Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';

interface Props {
  errorMessage?: string;
  onBackdropPress?: () => void;
}

function SignUpVerifySmsModalError(props: Props): ReactElement {
  const { onBackdropPress, errorMessage } = props;
  return (
    <View style={styles.containerModal}>
      {/* Title View */}
      <View style={styles.titleView}>
        <Text style={styles.textTitle}>{language('titleInvalidCode')}</Text>
      </View>

      {/* Content View */}
      <View style={styles.contentView}>
        <Text style={styles.textContent}>{errorMessage}</Text>
      </View>

      {/* Bottom View */}
      <View style={styles.bottomView}>
        <Pressable style={styles.confirmWrapperView} onPress={onBackdropPress}>
          <Text style={styles.confirmText}>{language('ok')}</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default React.memo(SignUpVerifySmsModalError);

const styles = StyleSheet.create({
  containerModal: {
    padding: 10,
    paddingTop: 30,
    paddingBottom: 35,
    marginHorizontal: 20,
    borderRadius: 12,
    backgroundColor: colors.white,
  } as ViewStyle,

  titleView: {
    marginBottom: 10,
  } as ViewStyle,

  contentView: {
    marginBottom: 30,
  } as ViewStyle,

  confirmWrapperView: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 36,
    backgroundColor: colors.red_700,
    paddingVertical: 14,
  } as ViewStyle,

  textTitle: {
    textAlign: 'center',
    marginHorizontal: 20,
    fontSize: fonts.size.s20,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsBold,
  } as TextStyle,

  textContent: {
    textAlign: 'center',
    marginHorizontal: 10,
    fontSize: fonts.size.s14,
    color: colors.gray_500,
    fontFamily: fonts.family.PoppinsRegular,
  } as TextStyle,

  confirmText: {
    textAlign: 'center',
    fontSize: fonts.size.s16,
    color: colors.white,
    fontFamily: fonts.family.PoppinsBold,
  } as TextStyle,

  bottomView: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  } as ViewStyle,
});
