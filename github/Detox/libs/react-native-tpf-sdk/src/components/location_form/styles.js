import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../constants/appFonts';
import { CUSTOM_COLOR, TEXT_COLOR } from '../../constants/colors';
import { MULTIE_BORDER_RADIUS, SPACING } from '../../constants/size';
import { StyleSheet } from 'react-native';
import { scale } from '../../utils/responsive';

const styles = StyleSheet.create({
  locationFormWrapper: {
    width: '100%',
    alignItems: 'center'
  },
  titleWrapper: {
    width: '100%',
    marginTop: SPACING.Medium
  },
  formTitle: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText
  },
  input: {
    width: '100%'
  },
  modalWrapper: {
    width: '100%',
    height: scale(400, false),
    backgroundColor: CUSTOM_COLOR.White,
    borderRadius: MULTIE_BORDER_RADIUS.MEDIUM,
    paddingBottom: SPACING.BottomButton
  },
  modalTitle: {
    height: '10%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: CUSTOM_COLOR.ShuttleGray
  },
  modalContent: {
    height: '75%',
    width: '100%',
    alignItems: 'center'
  },
  modalControl: {
    height: '15%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  cancelBtn: {
    width: scale(121),
    height: scale(52, false),
    backgroundColor: 'rgba(240, 140, 49, 0.25)',
    borderRadius: MULTIE_BORDER_RADIUS.SMALL
  },
  submitBtn: {
    width: scale(121),
    height: scale(52, false),
    borderRadius: MULTIE_BORDER_RADIUS.SMALL,
    backgroundColor: CUSTOM_COLOR.Orange
  },
  modalText: {
    textAlign: 'center'
  },
  title: {
    textAlign: 'center',
    // color: TEXT_COLOR.Primary,
    fontSize: FONT_SIZE.Heading,
    lineHeight: LINE_HEIGHT.Heading
  },
  list: {
    width: '100%',
    height: '100%',
    paddingHorizontal: SPACING.Medium
  },
  item: {
    paddingVertical: SPACING.Normal,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  checkIcon: {},
  displayName: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText,
    textAlign: 'center',
    color: CUSTOM_COLOR.GreenPea
  },
  noData: {
    textAlign: 'center',
    alignSelf: 'center',
    color: TEXT_COLOR.Gray,
    fontSize: FONT_SIZE.BodyText,
    marginTop: SPACING.Normal,
    lineHeight: LINE_HEIGHT.BodyText
  },
  switchRow: {
    width: '100%',
    flexDirection: 'row',
    paddingTop: SPACING.Normal,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  containerStyle: {
    width: scale(40),
    height: scale(24),
    borderRadius: scale(25),
    padding: scale(5)
  },
  circleStyle: {
    width: scale(18),
    height: scale(18),
    borderRadius: 20
  }
});

export default styles;
