import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {SIZES} from '../../assets/constants/sizes';
import {FONT_BOLD} from '../../assets/fonts';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {SCREEN_SIZE} from '../../utils/ImageUtil';
import MeasureUtils from '../../utils/MeasureUtils';
import CustomButton from '../Button/CustomButton';
import {SizeBox} from '../SizeBox';

const height = {
  address: 26,
  info: 26,
  bottom: 56,
};
const separatorView = {
  padding: SIZES.PADDING_12,
  margin: SIZES.MARGIN_16,
};
const fontDefaultText = SIZES.FONT_16;

export const ItemCrawlerHeight = async item => {
  const {postTitle, postAuthor, phone} = item;

  const heightBorder = SIZES.BORDER_WIDTH_1 * 4; // === borderItem + border view center
  const heightSeparator = separatorView.padding * 2; // === padding item * 2
  const widthSeparator = separatorView.padding * 4; // === padding screen * 2 + padding item * 2
  const titleHeight = await MeasureUtils.measureTextSize({
    fontSize: fontDefaultText,
    fontFamily: FONT_BOLD,
    text: postTitle,
    width: SCREEN_SIZE.WIDTH - widthSeparator,
    lineInfoForLine: 2,
  });

  const widthTextContact = 60;
  const contactInfoHeight = await MeasureUtils.measureTextSize({
    fontSize: fontDefaultText,
    fontFamily: FONT_BOLD,
    text: genContactInfo(postAuthor, phone),
    width: SCREEN_SIZE.WIDTH - widthSeparator - widthTextContact,
    lineInfoForLine: 2,
  });

  const topHeight = titleHeight.height + height.address + height.info + heightSeparator;
  const centerHeight = contactInfoHeight.height + heightSeparator;

  const heightItem = topHeight + centerHeight + height.bottom + heightBorder + separatorView.margin;

  return heightItem;
};

const genContactInfo = (fullName, phoneNumber) => {
  let contactInfo = fullName || phoneNumber;
  if (fullName && phoneNumber) {
    contactInfo = `${fullName} - ${phoneNumber}`;
  }
  return contactInfo;
};

const PropertyItemCrawler = ({item}) => {
  const {
    propertyPostId,
    title,
    address,
    price,
    buildingArea,
    direction,
    crawlerProps: {
      contactInfo: {fullname, phoneNumber},
      onRemove,
      onPublic,
    },
  } = item;

  return (
    <View style={styles.container}>
      <View style={styles.wrapperTop}>
        <Text style={styles.txtTitle} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.txtAddress} numberOfLines={1}>
          {address}
        </Text>
        <View style={styles.wrapperInfo}>
          <View style={styles.rowCenter}>
            <Text style={styles.txtPrice}>{price}</Text>
            <Text style={styles.font16}> - {buildingArea} m2</Text>
          </View>
          <Text style={styles.font16}>{direction}</Text>
        </View>
      </View>
      <View style={styles.wrapperCenter}>
        <Text style={styles.font16}>{translate(STRINGS.CONTACT)}: </Text>
        <Text style={styles.txtTitle} numberOfLines={2}>
          {genContactInfo(fullname, phoneNumber)}
        </Text>
      </View>
      <View style={styles.wrapperBottom}>
        <CustomButton
          mode="outline"
          onPress={() => onRemove(propertyPostId)}
          title={translate('common.deleteFromList')}
          style={styles.bottomButton}
          titleStyle={styles.font14}
        />
        <SizeBox width={SIZES.SEPARATOR_8} />
        <CustomButton
          mode="primary"
          onPress={() => onPublic(propertyPostId)}
          title={translate('common.handlePost')}
          style={styles.bottomButton}
          titleStyle={styles.font14}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  font14: {fontSize: SIZES.FONT_14},
  container: {
    marginBottom: separatorView.margin,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderRadius: SIZES.BORDER_RADIUS_8,
    borderColor: COLORS.NEUTRAL_BORDER,
  },
  wrapperTop: {
    padding: separatorView.padding,
  },
  wrapperCenter: {
    flexDirection: 'row',
    borderTopWidth: SIZES.BORDER_WIDTH_1,
    borderBottomWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.NEUTRAL_BORDER,
    padding: separatorView.padding,
  },
  wrapperBottom: {
    height: height.bottom,
    padding: separatorView.padding,
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtTitle: {
    ...FONTS.bold,
    fontSize: fontDefaultText,
    color: COLORS.TEXT_DARK_10,
  },
  wrapperInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    height: height.info,
  },
  txtAddress: {
    ...FONTS.regular,
    fontSize: SIZES.FONT_14,
    color: COLORS.TEXT_DARK_40,
    lineHeight: height.address,
  },
  rowCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtPrice: {
    ...FONTS.bold,
    fontSize: fontDefaultText,
    color: COLORS.PRIMARY_B100,
  },
  font16: {
    ...FONTS.regular,
    fontSize: fontDefaultText,
    color: COLORS.TEXT_DARK_10,
  },
  bottomButton: {
    flex: 1,
    height: 32,
  },
});
export default PropertyItemCrawler;
