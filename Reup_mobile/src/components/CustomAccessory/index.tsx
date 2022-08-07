import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import styles from './styles';
import ARROW_UP from '@res/icons/icon-arrow-up.png';
import ARROW_DOWN from '@res/icons/icon-arrow-down.png';
import { Theme } from '../Theme';

interface Props {
  numberOfInput: number;
  currentInputIndex: number;
  title?: string;
  onPressUp: () => void;
  onPressDown: () => void;
  onPressDone: () => void;
}

const CustomAccessory = (props: Props) => {
  const { numberOfInput, currentInputIndex, title, onPressDone, onPressUp, onPressDown } = props;

  const renderUpDownArrow = () => {
    const isUpDisabled = currentInputIndex === 0;
    const isDownDisabled = currentInputIndex === numberOfInput - 1;

    const iconUp = isUpDisabled ? ARROW_UP : ARROW_UP;
    const iconDown = isDownDisabled ? ARROW_DOWN : ARROW_DOWN;

    return (
      <View style={{ flexDirection: 'row' }}>
        {!isUpDisabled ? (
          <TouchableOpacity onPress={() => onPressUp()}>
            <Image resizeMode={'contain'} source={iconUp} style={[styles.iconArrowStyles, { tintColor: Theme.keyboard.arrowActive }]} />
          </TouchableOpacity>
        ) : (
            <Image resizeMode={'contain'} source={iconUp} style={styles.iconArrowStyles} />
          )}

        {!isDownDisabled ? (
          <TouchableOpacity onPress={() => onPressDown()}>
            <Image source={iconDown} style={[styles.iconArrowStyles, { tintColor: Theme.keyboard.arrowActive }]} />
          </TouchableOpacity>
        ) : (
            <Image source={iconDown} style={styles.iconArrowStyles} />
          )}
      </View>
    );
  };

  const renderTitleText = () => {
    return (
      <View style={styles.titleTextContainer}>
        <Text numberOfLines={1} style={styles.titleTextStyle}>
          {title}
        </Text>
      </View>
    );
  };

  return (
    <View style={[{ justifyContent: 'space-between', height: 45, paddingLeft: 20, flexDirection: 'row', alignItems: 'center' }]}>
      {renderUpDownArrow()}
      {renderTitleText()}
      <TouchableOpacity
        onPress={() => {
          onPressDone();
        }}
        hitSlop={styles.hitSlop}
        style={{ right: 10 }}
      >
        <View testID="needed_for_touchable">
          <Text style={styles.done}>Done</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(CustomAccessory);
