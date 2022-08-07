import { StyleSheet, Platform } from 'react-native';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../constants/appFonts';
import { CUSTOM_COLOR, TEXT_COLOR } from '../../constants/colors';
import { DEVICE_HEIGHT, MULTIE_BORDER_RADIUS, SPACING } from '../../constants/size';
import { scale } from '../../utils/responsive';

export const styles = StyleSheet.create({
  modal:
    Platform.OS === 'ios'
      ? {
          flex: 1,
          margin: 0,
          alignItems: 'center',
          justifyContent: 'flex-end',
          height: '80%'
        }
      : {
          flex: 1,
          margin: 0,
          alignItems: 'center',
          justifyContent: 'flex-end',

          maxHeight: DEVICE_HEIGHT / 1.7,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '80%'
        },
  modalWrapper:
    Platform.OS === 'ios'
      ? {
          width: '100%',
          minHeight: scale(250, false),
          backgroundColor: CUSTOM_COLOR.White,
          borderRadius: MULTIE_BORDER_RADIUS.MEDIUM,
          // maxHeight: scale(700, false),
          paddingBottom: SPACING.XXNormal,
          flex: 1,
          maxHeight: DEVICE_HEIGHT * 0.7
        }
      : {
          width: '100%',
          minHeight: scale(250, false),
          backgroundColor: CUSTOM_COLOR.White,
          borderRadius: MULTIE_BORDER_RADIUS.MEDIUM,
          paddingBottom: SPACING.XXNormal,
          maxHeight: DEVICE_HEIGHT / 1.7,
          flex: 1
        },

  modalTitle: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    height: scale(56, false),
    justifyContent: 'space-between',
    borderBottomColor: CUSTOM_COLOR.GreyDivider
  },
  modalContent: {
    flex: 1
  },
  wrapper: {
    paddingHorizontal: SPACING.Medium
  },
  modalControl: {
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
    fontSize: FONT_SIZE.Heading,
    lineHeight: LINE_HEIGHT.Heading,
    flex: 1
  },
  item: {
    width: '95%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    minHeight: scale(53, false),
    paddingVertical: SPACING.Normal,
    justifyContent: 'space-between',
    borderBottomColor: CUSTOM_COLOR.GreyDivider
  },
  checkIcon: {},
  displayName: {
    flex: 1,
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText
  },
  noData: {
    textAlign: 'center',
    alignSelf: 'center',
    color: TEXT_COLOR.Gray,
    fontSize: FONT_SIZE.BodyText,
    marginTop: SPACING.Fit,
    lineHeight: LINE_HEIGHT.BodyText
  },
  left: {
    width: scale(60),
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  right: {
    width: scale(70),
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: scale(16)
  },
  textBtn: {
    fontSize: FONT_SIZE.Heading,
    lineHeight: LINE_HEIGHT.Heading
  },
  searchContainer: {
    alignItems: 'center'
  },
  searchInput: {
    width: '95%',
    paddingHorizontal: SPACING.Medium,
    paddingTop: SPACING.Medium
  }
});

export default styles;
