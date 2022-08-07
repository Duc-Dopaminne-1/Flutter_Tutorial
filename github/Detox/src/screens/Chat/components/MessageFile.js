import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {MessageProps} from 'react-native-gifted-chat';

import {IMAGES} from '../../../assets/images';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {small} from '../../../assets/theme/metric';

export type MessageFileProps = {
  onPress: (url: String) => {},
} & MessageProps;

export const MessageFile = ({...props}: MessageFileProps) => {
  const {text, fileUrl} = props.currentMessage;
  const onPress = () => {
    props.onPress(fileUrl, text);
  };

  const color = props.position === 'left' ? COLORS.PRIMARY_A100 : COLORS.NEUTRAL_WHITE;

  return (
    <View style={styles.container}>
      <Image style={[styles.icon, {tintColor: color}]} source={IMAGES.IC_DOCUMENT} />
      <TouchableOpacity onPress={onPress}>
        <Text style={[styles.text, {color}]}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    paddingVertical: small,
    maxWidth: '90%',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 6,
  },
  text: {
    ...FONTS.regular,
    fontSize: 14,
    textDecorationLine: 'underline',
    flex: 1,
    marginRight: 5,
  },
});
