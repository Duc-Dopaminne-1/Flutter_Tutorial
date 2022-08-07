import { StyleSheet } from 'react-native';
import { FONT_WEIGHT_REGULAR, WIDTH, fonts } from '@src/constants/vars';

const styles = StyleSheet.create({
  comonComponentStyle: {
    width: '100%',
    justifyContent: 'center',
    height: 55,
    borderRadius: 6,
    backgroundColor: '#22222B',
  },

  textStyle: {
    paddingLeft: 14,
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.5)',
    fontFamily: fonts.AvenirLTStdRoman,
  },

  dropdownTextStyle: {
    paddingLeft: 14,
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.5)',
    fontFamily: fonts.AvenirLTStdRoman,
  },

  dropDownItemStyle: {
    width: WIDTH - 4 * 10,
  },
  dropdownIconStyle: { position: 'absolute', right: 15, top: 20 },
});

export default styles;
