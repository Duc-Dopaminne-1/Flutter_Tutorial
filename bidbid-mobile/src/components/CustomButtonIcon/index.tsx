import * as React from 'react';
import { ImageStyle, Pressable, StyleProp, StyleSheet, ViewStyle, Image } from 'react-native';
import { colors } from '@/vars';
import { throttle } from 'lodash';
import { ms } from '@/vars/scaling';

type Props = {
  onPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  icon?: any;
  iconColor?: any;
  imagesPng?: any;
  iconStyle?: ImageStyle;
  disabled?: boolean;
};

function CustomButtonIcon(Props: Props) {
  const { disabled, onPress, containerStyle, icon, iconStyle, imagesPng } = Props;

  const onPressButton = React.useMemo(() => (onPress ? throttle(onPress, 500, { leading: true, trailing: false }) : undefined), [onPress]);

  return (
    <Pressable disabled={disabled} style={[styles.container, containerStyle]} onPress={onPressButton}>
      {imagesPng ? <Image source={imagesPng} style={StyleSheet.flatten([styles.icon, iconStyle])} /> : icon}
    </Pressable>
  );
}

export default React.memo(CustomButtonIcon);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 25,
    height: ms(50),
    width: ms(50),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: colors.blue_700,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 3,
  },
  icon: {
    width: ms(28),
    height: ms(28),
  },
});
