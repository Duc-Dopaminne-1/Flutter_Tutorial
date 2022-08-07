import React, { ReactElement } from 'react';
import { Image, StyleProp, StyleSheet, View, ViewStyle, Pressable } from 'react-native';
import { colors, fonts, images } from '@/vars';
import { SettingItemSliderMulti } from '@/screens/Setting/component/SettingItemSliderMulti';
import DefaultText from '@/components/CustomText/DefaultText';

interface Prop {
  title: string;
  content?: number[];
  containerStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
  distanceUnit?: string;
  onValuesChangeFinishCallback?: (value: number[]) => void;
  onValuesChangeCallback?: (value: number[]) => void;
  image?: any;
}

export function SettingItemSlider(props: Prop): ReactElement {
  const {
    title = '',
    content = [],
    containerStyle = {},
    onPress,
    distanceUnit,
    onValuesChangeFinishCallback,
    onValuesChangeCallback,
    image,
  } = props;
  return (
    <Pressable onPress={onPress} style={[styles.container, containerStyle]}>
      {image ? image : <Image source={images.missing} style={styles.iconType} />}

      <View style={styles.wrapItem}>
        <DefaultText {...{ style: styles.textType }}>{title}</DefaultText>
        <SettingItemSliderMulti
          content={content}
          distanceUnit={distanceUnit}
          onValuesChangeFinishCallback={onValuesChangeFinishCallback}
          onValuesChangeCallback={onValuesChangeCallback}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginTop: 16,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 10,
    shadowColor: colors.blue_700,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.12,
    shadowRadius: 7,

    elevation: 7,
  },
  textType: {
    fontSize: fonts.size.s17,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsRegular,
  },
  iconType: {
    height: 40,
    width: 40,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  wrapItem: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'flex-start',
  },
});
