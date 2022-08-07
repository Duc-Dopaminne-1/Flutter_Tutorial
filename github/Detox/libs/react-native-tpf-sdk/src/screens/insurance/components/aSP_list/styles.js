import { scale } from '../../../../utils/responsive';
import { StyleSheet } from 'react-native';
import { CUSTOM_COLOR } from '../../../../constants/colors';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../../constants/appFonts';
import { DEVICE_WIDTH, MULTIE_BORDER_RADIUS, SPACING } from '../../../../constants/size';

const styles = StyleSheet.create({
  contentWrapper: {
    flexDirection: 'row'
  },
  content: {
    width: DEVICE_WIDTH,
    paddingHorizontal: SPACING.Medium
  },
  profileWrapper: {
    width: '100%',
    borderWidth: 1,
    flexDirection: 'row',
    height: scale(84, false),
    marginBottom: SPACING.XSmall,
    borderColor: CUSTOM_COLOR.Whisper,
    borderRadius: MULTIE_BORDER_RADIUS.NORMAL
  },
  avatarWrapper: {
    width: '30%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatar: {
    width: '70%',
    height: '60%',
    borderRadius: MULTIE_BORDER_RADIUS.NORMAL
  },
  dot: {
    right: scale(6),
    width: scale(9),
    height: scale(9),
    bottom: scale(32),
    position: 'absolute',
    backgroundColor: 'red',
    borderRadius: scale(9 / 2)
  },
  profileContentWrapper: {
    width: '70%',
    height: '100%',
    paddingTop: scale(18, false),
    paddingBottom: scale(13, false),
    justifyContent: 'space-between'
  },
  profileConten01: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  profileConten02: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  customerName: {
    fontSize: FONT_SIZE.Heading,
    lineHeight: LINE_HEIGHT.HEADER
  },
  nomalText: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SMALL
  },
  listFooterComponent: {
    height: scale(150, false)
  }
});

export default styles;
