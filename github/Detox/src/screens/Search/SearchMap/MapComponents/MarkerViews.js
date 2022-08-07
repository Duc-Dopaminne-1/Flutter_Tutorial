import React, {useEffect, useState} from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';

import {SIZES} from '../../../../assets/constants/sizes';
import {IMAGES} from '../../../../assets/images';
import {COLORS} from '../../../../assets/theme/colors';
import {HELPERS} from '../../../../assets/theme/helpers';
import {small} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import ImageProgress from '../../../../components/ImageProgress';

const styles = StyleSheet.create({
  pinForAva: {
    width: 45.84,
    height: 59.54,
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: SIZES.BORDER_RADIUS_20,
  },
  containerAvatar: {
    marginTop: 2,
  },
  markerView: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderRadius: small,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    ...commonStyles.shadowApp,
  },
  markerText: {
    fontWeight: 'bold',
    color: COLORS.TEXT_DARK_40,
    fontSize: 12,
  },
  markerArrow: {
    width: 0,
    height: 0,
    backgroundColor: COLORS.TRANSPARENT,
    borderStyle: 'solid',
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 4,
    borderLeftColor: COLORS.TRANSPARENT,
    borderRightColor: COLORS.TRANSPARENT,
    borderBottomColor: COLORS.NEUTRAL_WHITE,
    transform: [{rotate: '180deg'}],
  },
  markerPoint: {
    width: 25,
    height: 25,
    borderRadius: 25 / 2,
    borderWidth: 3,
    borderColor: COLORS.NEUTRAL_WHITE,
    backgroundColor: COLORS.PRIMARY_A100,
  },
});

const ViewBackground = ({style, iconSource, onLoadEnd, isSelected, children}) => {
  const imageStyle = {
    tintColor: isSelected ? COLORS.BLUE_56 : COLORS.PRIMARY_A100,
  };
  return (
    <ImageBackground
      style={style}
      source={iconSource}
      onLoadEnd={onLoadEnd}
      imageStyle={imageStyle}>
      {children}
    </ImageBackground>
  );
};

const MarkerViewWithText = ({text, isSelected}) => {
  const backgroundView = isSelected ? COLORS.PRIMARY_A100 : COLORS.NEUTRAL_WHITE;
  const colorText = isSelected ? COLORS.NEUTRAL_WHITE : COLORS.TEXT_DARK_40;
  return (
    <View style={HELPERS.crossCenter}>
      {text.length > 0 && (
        <View style={[styles.markerView, {backgroundColor: backgroundView}]}>
          <Text style={[styles.markerText, {color: colorText}]}>{`${text}`}</Text>
        </View>
      )}
      <View style={[styles.markerArrow, {borderBottomColor: backgroundView}]} />
      <View style={styles.markerPoint} />
    </View>
  );
};

const MarkerViewWithAvatar = ({url, onLoaded, isSelected}) => {
  const [loadedBackground, setLoadedBackground] = useState(false);
  const [loadedAvatar, setLoadedAvatar] = useState(false);

  useEffect(() => {
    if (loadedBackground && loadedAvatar) {
      onLoaded();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedBackground, loadedAvatar]);

  return (
    <ViewBackground
      style={styles.pinForAva}
      iconSource={IMAGES.IC_PIN_ORIGIN_AVA}
      onLoadEnd={() => setLoadedBackground(true)}
      isSelected={isSelected}>
      <ImageProgress
        url={url}
        defaultImage={IMAGES.IC_DEFAULT_AVATAR}
        imageStyle={styles.avatar}
        containerStyle={[styles.avatar, styles.containerAvatar]}
        imageContainerStyle={[styles.avatar, styles.containerAvatar]}
        onLoadEnd={() => setLoadedAvatar(true)}
      />
    </ViewBackground>
  );
};

export {MarkerViewWithAvatar, MarkerViewWithText};
