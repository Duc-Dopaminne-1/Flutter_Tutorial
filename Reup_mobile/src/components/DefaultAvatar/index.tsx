import React from 'react';
import { View, StyleProp, ViewStyle, TextStyle } from 'react-native';
import styles from './styles';
import { Avatar } from 'react-native-elements';
import DEFAULT_AVATAR from '@res/icons/icon-avatar.png';

type Props = {
  size?: number;
  name: string;
  avatar?: string;
  isCircle?: number;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPressAvatar?: () => void;
};

const DefaultAvatar = (props: Props) => {
  const { size = 45, isCircle = true, containerStyle = {}, textStyle = {}, avatar, onPressAvatar } = props;
  const circleStyle = { width: size, height: size, borderRadius: isCircle ? size / 2 : 0 };

  // const getName = () => {
  //   const { name } = props;
  //   return getInitialName(name);
  // };

  return (
    <View style={[circleStyle, styles.container, containerStyle]}>
      <Avatar
        containerStyle={styles.avatar}
        source={avatar ? { uri: avatar } : DEFAULT_AVATAR}
        onPress={onPressAvatar}
      />
      {/* <CustomText style={textStyle} text={getName()} /> */}
    </View>
  );
};
export { DefaultAvatar };
