import React, { ReactElement } from 'react';
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import DefaultText from '@/components/CustomText/DefaultText';
import CustomButton from '@/components/CustomButton';
import LocationIconSVG from '@/components/SVG/LocationIconSVG';

interface Prop {
  onPress?: (value: boolean) => void;
}

export function EnableLocationView(props: Prop): ReactElement {
  const { onPress } = props;

  const onPressLocation = () => {
    onPress && onPress(true);
  };
  return (
    <View style={styles.container}>
      <LocationIconSVG />
      <DefaultText {...{ style: styles.description }}>{language('enableLocationScreen.description')}</DefaultText>
      <CustomButton
        onPress={onPressLocation}
        containerStyle={styles.enableLocationView}
        text={language('enableLocationScreen.enableLocation')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 55,
    paddingHorizontal: 35,
    paddingBottom: 45,
    alignItems: 'center',
  } as ViewStyle,
  description: {
    marginVertical: 20,
    paddingHorizontal: 35,
    textAlign: 'center',
    fontSize: fonts.size.s12,
    color: colors.gray_600,
  } as TextStyle,

  enableLocationView: {
    marginVertical: 20,
  } as ViewStyle,
});
