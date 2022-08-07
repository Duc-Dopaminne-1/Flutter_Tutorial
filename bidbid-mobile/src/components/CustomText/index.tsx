import { StyleProp, TextStyle, ViewStyle, Text, View, Pressable } from 'react-native';
import React, { ReactElement } from 'react';
import styles from './styles';

interface Props {
  title?: string;
  titleStyle?: StyleProp<TextStyle>;
  numberOfLines?: number;
  containerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<TextStyle>;
  content?: string;
  prefixStyle?: TextStyle;
  prefix?: string;
  imageSecond?: ReactElement;
  imageStyle?: ViewStyle;
  icon?: any;
  onPress?: () => void;
}

const CustomText = (props: Props) => {
  const {
    title,
    titleStyle,
    numberOfLines = 10,
    containerStyle,
    contentStyle,
    content,
    imageSecond,
    prefixStyle,
    prefix,
    icon,
    onPress,
    imageStyle,
  } = props;

  return (
    <Pressable onPress={onPress} style={[styles.container, containerStyle]}>
      {icon ? <View style={imageStyle}>{icon}</View> : null}
      {title ? (
        <Text style={[styles.text, titleStyle]} allowFontScaling={false} numberOfLines={numberOfLines}>
          {prefix ? (
            <Text style={[styles.text, prefixStyle]} allowFontScaling={false} numberOfLines={numberOfLines}>
              {prefix}
            </Text>
          ) : null}
          {title}
        </Text>
      ) : null}

      <Text style={[styles.text, contentStyle]} allowFontScaling={false} numberOfLines={numberOfLines}>
        {content}
      </Text>
      {imageSecond ? imageSecond : null}
    </Pressable>
  );
};

export { CustomText };
