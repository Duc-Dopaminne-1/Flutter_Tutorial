import { StyleSheet } from 'react-native';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../constants/appFonts';
import { TEXT_COLOR } from '../../constants/colors';

export const styles = StyleSheet.create({
  boldTitle: {
    fontSize: FONT_SIZE.BoldTitle,
    lineHeight: LINE_HEIGHT.BoldTitle
  },
  title1: {
    fontSize: FONT_SIZE.Title1,
    lineHeight: LINE_HEIGHT.Title1
  },
  title2: {
    fontSize: FONT_SIZE.Title2,
    lineHeight: LINE_HEIGHT.Title2
  },
  title3: {
    fontSize: FONT_SIZE.Title3,
    lineHeight: LINE_HEIGHT.Title3
  },
  heading: {
    fontSize: FONT_SIZE.Heading,
    lineHeight: LINE_HEIGHT.Heading
  },
  bodyText: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText
  },
  subHead: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead
  },
  small: {
    fontSize: FONT_SIZE.Small,
    lineHeight: LINE_HEIGHT.Small
  },
  tiny: {
    fontSize: FONT_SIZE.Tiny,
    lineHeight: LINE_HEIGHT.Tiny
  }
});
