import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../../constants/colors';
import { SPACING } from '../../../constants/size';
import { StyleSheet } from 'react-native';
import { Shadow } from '../../../constants/stylesCSS';

const styles = StyleSheet.create({
  confirmRefundRequestWrapper: {
    flex: 1,
    paddingTop: SPACING.Large,
    paddingHorizontal: SPACING.Medium,
    backgroundColor: BACKGROUND_COLOR.Whisper
  },
  content02: {
    marginTop: SPACING.Medium
  },
  footer: {
    ...Shadow,

    padding: SPACING.Medium,
    backgroundColor: BACKGROUND_COLOR.White,
    flexDirection: 'row'
  },
  backTitle: {
    color: CUSTOM_COLOR.Orange
  },
  disabledText: {
    color: CUSTOM_COLOR.White
  },
  flex: {
    flex: 1
  }
});

export default styles;
