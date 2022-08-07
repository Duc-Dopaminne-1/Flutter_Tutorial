import React from 'react';
import {Image, StyleSheet, View, ViewStyle} from 'react-native';
import {List} from 'react-native-paper';

import {SIZES} from '../assets/constants/sizes';
import {IMAGES} from '../assets/images';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {HELPERS} from '../assets/theme/helpers';
import {METRICS} from '../assets/theme/metric';

const styles = StyleSheet.create({
  itemIcon: {
    borderRadius: SIZES.BORDER_RADIUS_20,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemBackground: {
    ...METRICS.horizontalMargin,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    marginVertical: 8,
    borderRadius: SIZES.BORDER_RADIUS_8,
    paddingVertical: 16,
    paddingLeft: 12,
    paddingRight: 15,
  },
  listTitle: {
    ...FONTS.regular,
    fontSize: 15,
  },

  listDescription: {
    fontSize: 13,
    ...FONTS.regular,
  },
  iconArrow: {
    ...HELPERS.selfCenter,
    width: 20,
    height: 20,
  },
});

const IconMenu = ({imageSource, imageStyle, backgroundIcon = COLORS.GREEN_80, size = 32}) => {
  return (
    <View style={[styles.itemIcon, {backgroundColor: backgroundIcon, width: size, height: size}]}>
      <Image style={imageStyle} resizeMode="contain" source={imageSource} />
    </View>
  );
};

const CustomListItem = ({
  title,
  description,
  imageSource,
  imageStyle,
  onPress,
  backgroundIcon,
  customStyle,
  showArrow = true,
  arrowStyle,
  colorIconArrow = 'rgba(0, 0, 0, 0.54)',
  sizeIconLeft,
  ...otherProps
}: {
  title: string,
  description: string,
  imageSource: string,
  arrowStyle: ViewStyle,
}) => {
  return (
    <List.Item
      title={title}
      description={description}
      titleStyle={styles.listTitle}
      {...otherProps}
      descriptionStyle={styles.listDescription}
      style={[styles.itemBackground, customStyle]}
      left={() => (
        <IconMenu
          size={sizeIconLeft}
          backgroundIcon={backgroundIcon}
          imageStyle={imageStyle}
          imageSource={imageSource}
        />
      )}
      right={() => {
        return (
          showArrow && (
            <Image
              style={[
                styles.iconArrow,
                {
                  tintColor: colorIconArrow,
                  ...arrowStyle,
                },
              ]}
              resizeMode="contain"
              source={IMAGES.ARROW_RIGHT_LINEAR}
            />
          )
        );
      }}
      onPress={onPress}
    />
  );
};

export default CustomListItem;
