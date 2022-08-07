import React, {useContext} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import {AppContext} from '../appData/appContext/useAppContext';
import {CONSTANTS} from '../assets/constants';
import {SIZES} from '../assets/constants/sizes';
import {IMAGES} from '../assets/images';
import {translate} from '../assets/localize';
import {STRINGS} from '../assets/localize/string';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {HELPERS} from '../assets/theme/helpers';
import {useLogin} from '../screens/Auth/useLogin';
import {StringeeContext} from '../screens/Call/StringeeContext';

const Badge = () => {
  const {state, getIsLoggedIn} = useContext(AppContext);
  const count = state.unReadNotification ?? 0;
  const countText = count > CONSTANTS.MAX_BADGE_COUNT ? `${CONSTANTS.MAX_BADGE_COUNT}⁺` : count;
  if (!getIsLoggedIn() || count <= 0) {
    return null;
  }
  return (
    <View style={styles.badgeContainer}>
      <Text style={styles.badgeText}>{countText}</Text>
    </View>
  );
};

export const Group = ({style, isAgent = true}) => {
  return (
    <View style={[groupStyles.container, style]}>
      {isAgent && <Image style={groupStyles.logo} source={IMAGES.LOGO_CIRCLE2} />}
      <Text style={groupStyles.text}>
        {isAgent ? translate(STRINGS.TOPENER) : translate(STRINGS.MEMBER)}
      </Text>
    </View>
  );
};

export const DotMessage = () => {
  const {
    chat: {unreadCount: unreadMessage},
  } = useContext(StringeeContext);
  const {
    state: {unReadNotification},
  } = useContext(AppContext);
  const {notLoggedIn} = useLogin();

  const count = unreadMessage || unReadNotification;
  if (notLoggedIn || count <= 0) {
    return null;
  }
  return <View style={dotStyles.dot} />;
};

const styles = StyleSheet.create({
  badgeContainer: {
    ...HELPERS.center,
    position: 'absolute',
    top: 4,
    minWidth: 18,
    right: -4,
    borderRadius: 40,
    backgroundColor: COLORS.PRIMARY_A100,
    padding: 4,
  },
  badgeText: {
    fontSize: 8,
    color: COLORS.NEUTRAL_WHITE,
  },
});

const groupStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 20,
    height: 20,
    marginRight: 4,
  },
  text: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.BLACK_31,
  },
});

const dotStyles = StyleSheet.create({
  dot: {
    width: 10,
    height: 10,
    backgroundColor: COLORS.PRIMARY_B100,
    borderRadius: SIZES.BORDER_RADIUS_10,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.NEUTRAL_WHITE,
    position: 'absolute',
    top: 5,
    right: 5,
  },
});

export default Badge;
