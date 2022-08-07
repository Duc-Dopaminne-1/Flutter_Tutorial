import { BACKGROUND_COLOR } from '../../../constants/colors';
import { StyleSheet } from 'react-native';
import { scale } from '../../../utils/responsive';
import { SPACING } from '../../../constants/size';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    paddingTop: scale(16, false),
    backgroundColor: BACKGROUND_COLOR.Primary
  },
  wrapper: {
    backgroundColor: BACKGROUND_COLOR.Primary,
    paddingBottom: SPACING.HtmlBottom
  },
  action: {
    padding: SPACING.Medium
  },
  line: {
    marginLeft: SPACING.Medium + scale(34),
    marginRight: SPACING.Medium
  }
});
