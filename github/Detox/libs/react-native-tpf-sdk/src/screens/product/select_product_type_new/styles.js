import { BACKGROUND_COLOR } from '../../../constants/colors';
import { SPACING } from '../../../constants/size';
import { StyleSheet } from 'react-native';
import { scale } from '../../../utils/responsive';

const styles = StyleSheet.create({
  createContactProfileWrapper: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR.White
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: SPACING.Medium
  },

  content: {
    marginVertical: SPACING.XXLarge
  },
  banner: {
    minHeight: scale(500)
  }
});

export default styles;
