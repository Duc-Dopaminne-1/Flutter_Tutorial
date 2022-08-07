import { ICCamera02, NextIconGrey } from '../../../../assets/icons';
import { ICON_SIZE } from '../../../../constants/size';
import { BACKGROUND_COLOR, TEXT_COLOR } from '../../../../constants/colors';
import { SPACING } from '../../../../constants/size';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { scale } from '../../../../utils/responsive';
import { BodyText } from '../../../../components/';
import FastImage from 'react-native-fast-image';
import AppText from '../../../../components/app_text';

const MenuCard = props => {
  const { title, imageUrl, onPress, rightComponent, content, titleStyle, style } = props;
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <View style={styles.titleContainer}>
        <View style={styles.icon}>
          {imageUrl ? (
            <FastImage style={styles.iconImageUrl} source={{ uri: imageUrl }} />
          ) : (
            <ICCamera02 width={20} height={20} />
          )}
        </View>
        <BodyText translate style={[titleStyle]}>
          {title}
        </BodyText>
      </View>
      {rightComponent ? (
        rightComponent
      ) : content ? (
        <AppText translate style={[titleStyle]}>
          {content}
        </AppText>
      ) : (
        <NextIconGrey height={ICON_SIZE.NORMAL} width={ICON_SIZE.NORMAL} />
      )}
    </TouchableOpacity>
  );
};
export default MenuCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: BACKGROUND_COLOR.White,
    paddingHorizontal: SPACING.Medium,
    paddingVertical: SPACING.Medium,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  icon: {
    width: scale(36)
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  title: {
    color: TEXT_COLOR.Primary
  },
  iconImageUrl: {
    width: scale(20),
    height: scale(20)
  }
});
