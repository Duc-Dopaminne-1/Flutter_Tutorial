import { StyleSheet } from 'react-native';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../../constants/appFonts';
import { scale } from '../../../../utils/responsive';
import { CUSTOM_COLOR, TEXT_COLOR } from '../../../../constants/colors';

export const styles = StyleSheet.create({
  // Header
  utilitiesWrapper: {
    width: '100%'
  },
  head: {
    marginTop: scale(24),
    marginBottom: scale(8),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  titlePartner: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText
  },
  container: {
    flexDirection: 'row',
    marginBottom: scale(8)
  },
  wrapText: { flex: 1, justifyContent: 'center' },
  item: {
    shadowColor: CUSTOM_COLOR.Black,
    shadowOffset: {
      width: 0,
      height: scale(2, false)
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.62,
    elevation: 4
  },
  itemContainerLeft: {
    alignItems: 'center',
    borderRadius: scale(8),
    padding: scale(8),
    marginEnd: scale(4),
    backgroundColor: CUSTOM_COLOR.White,
    flexDirection: 'row',
    flex: 1
  },
  itemContainerMiddle: {
    alignItems: 'center',
    borderRadius: scale(8),
    padding: scale(8),
    marginHorizontal: scale(4),
    backgroundColor: CUSTOM_COLOR.White,
    flexDirection: 'row',
    flex: 1
  },
  itemContainerRight: {
    flex: 1,
    padding: scale(8),
    alignItems: 'center',
    flexDirection: 'row',
    marginStart: scale(4),
    borderRadius: scale(8),
    backgroundColor: CUSTOM_COLOR.White
  },
  textItemActive: {
    color: TEXT_COLOR.Orange,
    marginStart: scale(8)
  },
  textItem: {
    color: TEXT_COLOR.Gray,
    marginStart: scale(8)
  }
});
