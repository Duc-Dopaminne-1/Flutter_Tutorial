
import React from 'react';
import { Image, View } from 'react-native';
import styles from './styles';
import { CustomText } from '../CustomText';
import { Theme } from '../Theme';

export type Props = {
  focused: boolean,
  color: any,
  text: string,
  icon: any
};

const ItemBottomBar = (props: Props) => {
  const { focused, icon, text, color } = props;
  return (
    <View style={[{ backgroundColor: focused ? Theme.itemBottomTab.activeColor : Theme.itemBottomTab.inactiveColor }, styles.container]}>
      <Image style={styles.logo} resizeMode='contain' source={icon} />
      <CustomText numberOfLines={1} style={[{ color: color }, styles.text]} text={text} />
    </View >
  );
};

export default React.memo(ItemBottomBar);
