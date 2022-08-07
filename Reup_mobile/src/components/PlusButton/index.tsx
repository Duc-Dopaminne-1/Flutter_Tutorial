
import React from 'react';
import { Image } from 'react-native';
import styles from './styles';
import { CustomTouchable } from '../CustomTouchable';
import { TABBAR_ICON_CENTER_BUTTON } from '@src/constants/icons';
import NavigationActionsService from '@src/navigation/navigation';

export type Props = {
  onPress: () => void
};

const PlusButton = (props: Props) => {
  const { onPress } = props;

  return (
    <CustomTouchable onPress={onPress} style={styles.container}>
      <Image style={styles.logo} source={TABBAR_ICON_CENTER_BUTTON} />
    </CustomTouchable>
  );
};

export default PlusButton;
