import React, { ReactElement } from 'react';
import { StyleSheet, TextStyle, ViewStyle, View, Text, Pressable } from 'react-native';
import { colors, fonts } from '@/vars';
import { isIOS } from '@/shared/devices';
import IconCloseSVG from '@/components/SVG/IconCloseSVG';

interface Props {
  title: string;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  closeButtonOnPressed?: () => void;
}

export default function ModalBottomDialogTopView(props: Props): ReactElement {
  const { title, containerStyle, titleStyle, closeButtonOnPressed = () => {} } = props;

  return (
    <View style={[styles.container, containerStyle]}>
      <Pressable style={styles.closeButtonWrapper} onPress={closeButtonOnPressed}>
        <IconCloseSVG />
      </Pressable>
      <Text style={[styles.textStyle, titleStyle]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,

  closeButtonWrapper: {
    position: 'absolute',
    left: 0,
    padding: 5,
  } as ViewStyle,

  textStyle: {
    textAlign: 'center',
    fontSize: fonts.size.s18,
    color: colors.gray_900,
    fontWeight: isIOS ? '600' : 'bold',
    fontFamily: fonts.family.SSPSemiBold,
  } as TextStyle,
});
