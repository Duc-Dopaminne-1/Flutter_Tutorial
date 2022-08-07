import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../constants/appFonts';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { CUSTOM_COLOR, TEXT_COLOR } from '../constants/colors';
import { BORDER_RADIUS, SPACING } from '../constants/size';
import { scale } from '../utils/responsive';
import AppText from './app_text';

const CustomBadge = ({ status, value, style, ...props }) => {
  const [color, setColor] = useState(CUSTOM_COLOR.Transparent);

  useEffect(() => {
    switch (status) {
      case 'draft':
        setColor('#8694A3');
        break;
      case 'canceled':
        setColor('#939598');
        break;
      case 'processing':
        setColor('#EF413D');
        break;
      case 'wait':
        setColor('#F99D33');
        break;
      case 'primary':
        setColor(CUSTOM_COLOR.PersianGreen);
        break;
      case 'success':
        setColor(CUSTOM_COLOR.PersianGreen);
        break;
      case 'warning':
        setColor(CUSTOM_COLOR.Orange);
        break;
      case 'dangerous':
        setColor(CUSTOM_COLOR.Persimmon);
        break;
      default:
        break;
    }
  }, [status]);

  return (
    <View style={[styles.container, value && { backgroundColor: color }, style]}>
      {value ? (
        <AppText translate style={styles.value} bold={true}>
          {value}
        </AppText>
      ) : null}
    </View>
  );
};

CustomBadge.defaultProps = {
  status: 'primary',
  value: ''
};

export default React.memo(CustomBadge);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS,
    padding: scale(6),
    zIndex: 10000,
    height: scale(28)
  },
  value: {
    fontSize: FONT_SIZE.Small,
    lineHeight: LINE_HEIGHT.Small,
    color: TEXT_COLOR.White,
    marginHorizontal: SPACING.Normal
  }
});
