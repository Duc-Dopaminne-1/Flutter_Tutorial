import { CUSTOM_COLOR, TEXT_COLOR } from '../../../../constants/colors';
import { scale } from '../../../../utils/responsive';
import { StyleSheet } from 'react-native';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../../constants/appFonts';
import { DEVICE_WIDTH, SPACING, MULTIE_BORDER_RADIUS } from '../../../../constants/size';

const styles = StyleSheet.create({
  showAllBtn: {
    width: scale(120),
    backgroundColor: CUSTOM_COLOR.White,
    justifyContent: 'flex-start'
  },
  showAllText: {
    fontSize: FONT_SIZE.Heading,
    marginRight: SPACING.XSmall
  },
  titleWrapper: {
    flexDirection: 'row',
    width: DEVICE_WIDTH,
    paddingRight: scale(16),
    height: scale(32, false),
    justifyContent: 'space-between'
  },
  logoWrapper: {
    zIndex: 10,
    position: 'absolute',
    marginLeft: scale(8),
    width: scale(42, false),
    height: scale(42, false),
    marginTop: scale(10, false),
    backgroundColor: CUSTOM_COLOR.Silver,
    borderRadius: scale(42 / 2, false)
  },
  otherList: {
    height: scale(340, false),
    width: DEVICE_WIDTH
  },
  otherProductsWrapper: {
    width: '100%',
    alignSelf: 'center',
    marginTop: scale(18, false),
    marginHorizontal: scale(20),
    marginBottom: scale(80, false)
  },
  otherProductsTitle: {
    color: TEXT_COLOR.ShuttleGray,
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.HEADER,
    marginBottom: scale(10, false)
  },
  otherProductsCardWrapper: {
    borderRadius: 8,
    width: scale(252),
    height: scale(240, false),
    backgroundColor: CUSTOM_COLOR.White,
    marginBottom: scale(12, false),
    marginRight: 10,
    shadowColor: CUSTOM_COLOR.Black,
    shadowOffset: {
      width: 0,
      height: scale(2, false)
    },
    shadowOpacity: 0.7,
    shadowRadius: 2,
    elevation: 5
  },
  otherProductsImg: {
    width: '100%',
    height: '50%',
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8
  },
  labelWrapper: {
    right: scale(10),
    width: scale(48),
    position: 'absolute',
    alignItems: 'center',
    top: scale(12, false),
    height: scale(25, false),
    justifyContent: 'center',
    backgroundColor: CUSTOM_COLOR.Orange,
    borderRadius: MULTIE_BORDER_RADIUS.XX_LARGE
  },
  label: {
    color: CUSTOM_COLOR.White,
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.HEADER
  },
  contentWrapper: {
    width: '100%',
    height: '50%',
    flexDirection: 'row',
    paddingHorizontal: scale(15),
    paddingTop: scale(9, false)
  },
  content: {
    height: '100%',
    width: '100%'
  },
  title: {
    color: TEXT_COLOR.Goblin,
    fontSize: FONT_SIZE.BodyText,
    marginBottom: scale(7, false),
    lineHeight: LINE_HEIGHT.HEADER
  },
  price: {
    color: TEXT_COLOR.Orange,
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead
  },

  button: {
    right: scale(17),
    position: 'absolute',
    bottom: scale(20, false),
    backgroundColor: CUSTOM_COLOR.White
  }
});

export default styles;
