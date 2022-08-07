import React, { ReactElement } from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import { useNavigation } from '@react-navigation/native';
import { SETTING_SCREEN } from '@/navigation/screenKeys';
import IconMyBidEmptySVG from '@/components/SVG/IconMyBidEmptySVG';

export default function NoBodyGoLive(): ReactElement {
  const navigation = useNavigation();

  const onPressDiscovery = () => {
    navigation.navigate(SETTING_SCREEN);
  };

  return (
    <View style={styles.container}>
      <IconMyBidEmptySVG />
      <Text style={styles.textNoteTitle}>{language('nobodyGoLive')}</Text>
      <Text style={styles.textNoteDescription}>{language('nobodyGoLiveDesc')}</Text>
      <Text style={styles.underLine} onPress={onPressDiscovery}>
        {language('discoverySettings')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    alignItems: 'center',
  } as ViewStyle,

  textNoteTitle: {
    marginTop: 25,
    fontSize: fonts.size.s16,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsSemiBold,
  },

  textNoteDescription: {
    marginTop: 8,
    fontSize: fonts.size.s14,
    color: colors.gray_700,
    fontFamily: fonts.family.RobotoRegular,
  },

  underLine: {
    color: colors.red_700,
    fontSize: fonts.size.s14,
    fontFamily: fonts.family.RobotoRegular,
    textAlign: 'center',
    marginTop: 8,
    textDecorationLine: 'underline',
  } as TextStyle,
});
