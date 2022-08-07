import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import {IMAGES} from '../../../../assets/images';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';

const styles = StyleSheet.create({
  sectionIdea: {
    marginTop: 8,
    flexDirection: 'row',
  },
  sectionDescription: {
    ...FONTS.regular,
    paddingLeft: 8,
    paddingRight: 64,
    fontSize: 11,
    color: COLORS.TEXT_DARK_10,
    alignSelf: 'center',
  },
  ideaIcon: {width: 60, height: 60},

  container: {
    paddingHorizontal: 16,
  },
});
const HeaderContainer = ({sectionDescription}: {sectionDescription: String}) => {
  return (
    <View style={styles.container}>
      <View style={styles.sectionIdea}>
        <Image source={IMAGES.IC_REGISTER_INFO} resizeMode={'contain'} style={styles.ideaIcon} />
        <Text style={styles.sectionDescription}>{sectionDescription}</Text>
      </View>
    </View>
  );
};

export default HeaderContainer;
