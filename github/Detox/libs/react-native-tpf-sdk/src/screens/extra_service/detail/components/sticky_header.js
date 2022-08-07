import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import AppText from '../../../../components/app_text';
import { scale } from '../../../../utils/responsive';
import themeContext from '../../../../constants/theme/themeContext';
import { FONT_SIZE, LINE_HEIGHT } from '../../../../constants/appFonts';
import { Shadow } from '../../../../constants/stylesCSS';
import { DEVICE_WIDTH } from '../../../../constants/size';
const ComponentStickyHeight = 50;
const StickyHeader = props => {
  const { translationY, offsetYToBottom, currentStep, handleScrollToComponent } = props;
  const title = currentStep === 1 ? 'Sản phẩm - Dịch vụ' : 'Đối tác cung cấp';
  const titleButton = currentStep === 1 ? 'Chọn sản phẩm - Dịch vụ' : 'Chọn đối tác cung cấp';

  const [opacity, setOpacity] = useState(new Animated.Value(0));
  const [translateY, setTranslateY] = useState(new Animated.Value(0));

  useEffect(() => {
    if (offsetYToBottom > 0) {
      setOpacity(
        translationY.interpolate({
          inputRange: [0, offsetYToBottom, offsetYToBottom + ComponentStickyHeight],
          outputRange: [0, 0, 1],
          extrapolate: 'clamp'
        })
      );
      setTranslateY(
        translationY.interpolate({
          inputRange: [0, offsetYToBottom, offsetYToBottom + ComponentStickyHeight],
          outputRange: [-scale(80), -scale(ComponentStickyHeight), 0],
          extrapolate: 'clamp'
        })
      );
    }
  }, [offsetYToBottom]);
  const theme = useContext(themeContext);
  return (
    <Animated.View style={[styles.container, { opacity, transform: [{ translateY }] }]}>
      <AppText style={styles.text} numberOfLines={2}>
        {title}
      </AppText>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.button.primary.background }]}
        onPress={handleScrollToComponent}>
        <AppText numberOfLines={2} style={[{ color: theme.button.primary.textColor }]}>
          {titleButton}
        </AppText>
      </TouchableOpacity>
    </Animated.View>
  );
};
export default StickyHeader;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: scale(8),
    paddingHorizontal: scale(12),
    paddingVertical: scale(10),
    top: scale(10),
    backgroundColor: '#FFF',
    width: DEVICE_WIDTH - scale(20),
    alignSelf: 'center',
    ...Shadow,
    position: 'absolute',
    zIndex: 9
  },
  button: {
    paddingHorizontal: scale(11),
    borderRadius: scale(4),
    marginLeft: scale(5),
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    minHeight: scale(32)
  },
  text: {
    flex: 1,
    minWidth: scale(50),
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead
  }
});
