import React, { ReactElement, memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { language } from '@/i18n';
import { isIOS, isIphoneX } from '@/shared/devices';
import { colors, fonts } from '@/vars';
import NavigationActionsService from '@/navigation/navigation';
import { SETTING_SCREEN } from '@/navigation/screenKeys';
import HomeEmptySVG from '@/components/SVG/HomeEmptySVG';

function HomeEmpty(): ReactElement {
  const onPressLink = () => {
    NavigationActionsService.push(SETTING_SCREEN);
  };

  return (
    <View style={styles.wrapEmpty}>
      <HomeEmptySVG />
      <View style={styles.wrapNote}>
        <Text style={styles.textNote}>
          {`${language('moreProfile')} \n ${language('letUpdate')} `}
          <Text onPress={onPressLink} style={styles.textLink}>{`${language('discoverySettings')}`}</Text>
          {` ${language('moreProfileNote')}`}
        </Text>
      </View>
    </View>
  );
}

export default memo(HomeEmpty);

const styles = StyleSheet.create({
  wrapNote: {
    paddingHorizontal: isIphoneX() ? 45 : 35,
    marginTop: 20,
  },
  textLink: {
    textDecorationLine: 'underline',
    fontFamily: fonts.family.PoppinsRegular,
    fontWeight: isIOS ? '600' : 'bold',
    color: colors.red_700,
    fontSize: fonts.size.s14,
  },
  textNote: {
    textAlign: 'center',
    color: colors.gray_600,
    fontSize: fonts.size.s14,
    fontFamily: fonts.family.PoppinsRegular,
  },
  wrapEmpty: {
    alignItems: 'center',
    marginTop: 10,
  },
});
