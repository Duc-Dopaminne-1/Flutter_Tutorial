import { colors, fonts } from '../../../vars';
import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { language } from '../../../i18n';

type ProductSwipeableRightProp = {
  onPressDelete: () => void;
};

type ProductSwipeableRightState = Readonly<any>;

export class SwipeableRight extends React.PureComponent<ProductSwipeableRightProp, ProductSwipeableRightState> {
  widthSwipeRight = 99;

  static readonly defaultProps = {};

  readonly state: ProductSwipeableRightState = {};

  render() {
    const { onPressDelete } = this.props;

    return (
      <RectButton style={[styles.rightAction, { width: this.widthSwipeRight }]} onPress={() => onPressDelete()}>
        <Text style={styles.swipeRightText}>{language('actionSheet.delete')}</Text>
      </RectButton>
    );
  }
}

const styles = StyleSheet.create<any>({
  swipeRightText: {
    fontSize: fonts.size.s14,
    fontFamily: fonts.family.PoppinsRegular,
    color: colors.white,
  },
  rightAction: {
    backgroundColor: colors.red_700,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
});
