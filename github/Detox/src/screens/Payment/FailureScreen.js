import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {SIZES} from '../../assets/constants/sizes';
import {IMAGES} from '../../assets/images';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {normal} from '../../assets/theme/metric';
import {commonStyles} from '../../assets/theme/styles';
import ScreenIds from '../ScreenIds';

const styles = StyleSheet.create({
  viewInside: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: SIZES.BORDER_RADIUS_10,
    padding: 16,
  },
  viewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  buttonText: {
    ...FONTS.semiBold,
    fontSize: 14,
    color: COLORS.TEXT_DARK_10,
  },
  title: {
    ...FONTS.semiBold,
    fontSize: 24,
    alignSelf: 'center',
  },
  descriptionContainer: {
    alignSelf: 'center',
    width: '80%',
  },
  descriptionText: {
    ...FONTS.regular,
    fontSize: 15,
    alignSelf: 'center',
    color: COLORS.TEXT_DARK_10,
    paddingVertical: 4,
    textAlign: 'center',
  },
  imageContainer: {
    width: '100%',
    marginVertical: normal,
  },

  image: {
    alignSelf: 'center',
  },
});

const FailureScreen = ({title, description}) => {
  const navigation = useNavigation();
  const onReturn = () => {
    navigation.canGoBack() && navigation.goBack();
  };

  return (
    <View style={styles.viewInside} testID={ScreenIds.FailureScreen}>
      <View style={styles.viewContainer}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.imageContainer}>
          <Image style={styles.image} source={IMAGES.FAIL_CRYING} />
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>{description}</Text>
        </View>

        <TouchableOpacity onPress={onReturn}>
          <View style={commonStyles.greyBorderContainer}>
            <Text style={styles.buttonText}>{translate(STRINGS.RETURN)}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FailureScreen;
