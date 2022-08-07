import {StyleSheet} from 'react-native';

import {COLORS} from '../../../../assets/theme/colors';
import {METRICS} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';

export const styles = StyleSheet.create({
  inputCustomContainer: {
    width: '100%',
    flexDirection: 'row',
  },
  inputFromContainer: {
    flex: 3 / 7,
  },
  inputCustomMiddleSectionText: {
    flex: 1 / 7,
    textAlign: 'center',
    justifyContent: 'center',
    ...METRICS.mediumMarginTop,
  },
  inputCustomRightComponentContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  txtInput: {
    ...commonStyles.txtFontSize14,
    color: COLORS.BLACK_33,
  },
  input: {
    width: '75%',
    height: '100%',
  },
});
