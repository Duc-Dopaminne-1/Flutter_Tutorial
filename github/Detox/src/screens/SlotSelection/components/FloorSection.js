import isEmpty from 'lodash/isEmpty';
import React, {useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {CONSTANTS} from '../../../assets/constants';
import {IMAGES} from '../../../assets/images';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {normal} from '../../../assets/theme/metric';
import ImageViewer from '../../../components/Image/ImageViewer';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: normal,
    marginVertical: normal,
  },
  floor: {
    ...FONTS.bold,
    color: COLORS.BLACK_33,
    fontSize: 14,
  },
  titleButton: {
    ...FONTS.regular,
    fontSize: 10,
    color: COLORS.BLACK_33,
    marginLeft: 4,
  },
});

export const FloorSection = ({
  floor = '1',
  total = 100,
  images = [
    'https://danhkhoireal.vn/wp-content/uploads/2020/11/mat-bang-tang-3-4-5-block-a1-a2-Bien-Hoa-Universe-Complex.jpg',
  ],
}) => {
  const [isVisiblePhoto, setVisiblePhoto] = useState(false);
  const floorName = floor;
  const propertiesCount = total;
  const floorText = translate(STRINGS.FLOOR_TEXT, {floorName, propertiesCount});
  const photoData = images.map(item => ({url: item}));

  const renderRightButton = () => {
    return (
      <TouchableOpacity
        style={HELPERS.rowCenter}
        onPress={() => setVisiblePhoto(true)}
        hitSlop={CONSTANTS.HIT_SLOP}>
        <Image source={IMAGES.IC_FLOOR_PLAN} />
        <Text style={styles.titleButton}>{translate('project.slot.viewFloorPlan')}</Text>
      </TouchableOpacity>
    );
  };

  if (isEmpty(floorName) && photoData?.length <= 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {!isEmpty(floorName) && <Text style={styles.floor}>{floorText}</Text>}
      <View style={HELPERS.fill} />
      {photoData?.length > 0 && renderRightButton()}
      <ImageViewer
        visible={isVisiblePhoto}
        images={photoData}
        hideStatusBar={false}
        initialIndex={0}
        onDismiss={() => setVisiblePhoto(false)}
        hideShareButton={false}
      />
    </View>
  );
};
