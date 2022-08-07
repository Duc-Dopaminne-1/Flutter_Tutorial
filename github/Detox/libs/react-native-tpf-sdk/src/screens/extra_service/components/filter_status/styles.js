import { scale } from '../../../../utils/responsive';
import { StyleSheet } from 'react-native';
import { TEXT_COLOR } from '../../../../constants/colors';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../../constants/appFonts';

const styles = StyleSheet.create({
  filterstatuswrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: scale(70, false),
    paddingHorizontal: scale(39),
    justifyContent: 'space-between'
  },
  labelStyle: {
    color: TEXT_COLOR.Black,
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SMALL
  }
});

export default styles;
