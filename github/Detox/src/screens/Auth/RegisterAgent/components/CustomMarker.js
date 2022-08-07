import React from 'react';
import {StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {CONSTANTS} from 'react-native-callkeep';

import {SIZES} from '../../../../assets/constants/sizes';
import {COLORS} from '../../../../assets/theme/colors';
import {SizeBox} from '../../../../components/SizeBox';

const styles = StyleSheet.create({
  marker: {
    borderRadius: SIZES.BORDER_RADIUS_100,
    borderWidth: SIZES.BORDER_WIDTH_2,
    borderColor: COLORS.NEUTRAL_BORDER,
    marginTop: 4,
  },
});
class CustomMarker extends React.Component {
  render() {
    return (
      <TouchableWithoutFeedback hitSlop={CONSTANTS.HIT_SLOP}>
        <SizeBox
          height={24}
          width={24}
          backgroundColor={COLORS.NEUTRAL_WHITE}
          style={styles.marker}
        />
      </TouchableWithoutFeedback>
    );
  }
}

export default CustomMarker;
