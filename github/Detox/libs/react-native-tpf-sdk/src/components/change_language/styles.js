import { scale } from '../../utils/responsive';
import { StyleSheet } from 'react-native';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../constants/colors';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../constants/appFonts';
import { SPACING } from '../../constants/size';

const styles = StyleSheet.create({
  modalWrapper: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContainer: {
    width: '100%',
    alignItems: 'center',
    borderRadius: scale(12),
    height: '28%',
    backgroundColor: BACKGROUND_COLOR.White
  },
  backDrop: {
    width: '100%',
    height: '72%'
  },
  closeContainer: {
    top: scale(16),
    left: scale(16),
    position: 'absolute'
  },
  selectContainer: {
    top: scale(16),
    right: scale(16),
    position: 'absolute'
  },
  selectText: {
    fontSize: FONT_SIZE.Heading,
    lineHeight: LINE_HEIGHT.Heading
  },

  textTitle: {
    marginTop: scale(16),
    fontSize: FONT_SIZE.Heading,
    lineHeight: LINE_HEIGHT.Heading,
    textAlign: 'center',
    marginHorizontal: scale(24)
  },
  contentWrapper: {
    width: '100%',
    borderTopWidth: 1,
    marginTop: SPACING.XXNormal,
    borderTopColor: CUSTOM_COLOR.GreyDivider
  },
  idContainerBoxes: {
    flexDirection: 'column',
    paddingHorizontal: SPACING.Medium
  },
  idBoxes: {
    width: '100%',
    height: scale(52, false),
    borderBottomWidth: scale(1),
    borderBottomColor: CUSTOM_COLOR.GreyDivider
  }
});

export default styles;
