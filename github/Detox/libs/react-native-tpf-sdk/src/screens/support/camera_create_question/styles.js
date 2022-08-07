import { BACKGROUND_COLOR } from '../../../constants/colors';
import { HEADER_HEIGHT, SPACING } from '../../../constants/size';
import { Platform, StyleSheet } from 'react-native';
import { scale } from '../../../utils/responsive';

const styles = StyleSheet.create({
  cameraCreateQuestionWrapper: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: BACKGROUND_COLOR.Black
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    marginBottom: SPACING.XSmall
  },
  itemHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.XSmall
  },
  headerCamera: {
    flexDirection: 'row',
    alignItems: 'center',
    height: HEADER_HEIGHT,
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.Large,
    marginTop: Platform.OS === 'ios' ? scale(30, false) : 0
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    height: scale(80, false),
    justifyContent: 'space-around'
  }
});

export default styles;
