import React from 'react';
import styles from './styles';
import { colors } from '@src/constants/vars';
//@ts-ignore
import { Switch } from 'react-native-switch';

export interface Props {
  switchValue: boolean;
  onValueChange: (value: boolean) => void;
}

const CustomSwitch = (props: Props) => {
  const { switchValue, onValueChange } = props;

  return (
    <Switch
      barHeight={22}
      changeValueImmediately={false}
      circleSize={20}
      backgroundActive={colors.TEXT_SMALL_RED}
      backgroundInactive={'#9A9BAD'}
      onValueChange={onValueChange}
      value={switchValue}
      style={styles.container}
      switchWidthMultiplier={2}
      circleBorderWidth={0}
      switchLeftPx={2.5}
      switchRightPx={2.5}
    />
  );
};

export { CustomSwitch };
