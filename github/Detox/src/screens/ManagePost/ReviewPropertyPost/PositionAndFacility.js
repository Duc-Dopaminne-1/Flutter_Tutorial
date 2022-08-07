import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import {IMAGES} from '../../../assets/images';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {METRICS, small} from '../../../assets/theme/metric';
import MapSection from '../../../components/MapSection';
import ArrayUtils from '../../../utils/ArrayUtils';
import styles from './styles';

const styleItem = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '48%',
    paddingRight: small,
    marginBottom: 6,
    alignItems: 'center',
  },
  text: {
    ...FONTS.regular,
    marginLeft: small,
    fontSize: 16,
  },
  checkIcon: {
    width: 14,
    height: 14,
    tintColor: COLORS.PRIMARY_A100,
  },
});

const renderItem = (item, index) => {
  let title = `${item.name}`;
  const distance = item.distance;
  if (distance) {
    title = title + ` (${item.distance}km)`;
  }
  return (
    <View key={index.toString()} style={styleItem.container}>
      <Image source={IMAGES.IC_SUCCESS_FILL} style={styleItem.checkIcon} resizeMode="contain" />
      <Text style={styleItem.text}>{title}</Text>
    </View>
  );
};

const FacilitySection = ({title, data}) => {
  if (ArrayUtils.hasArrayData(data)) {
    return (
      <View style={styles.viewSection}>
        <Text style={styles.textSection}>{title}</Text>
        <View style={styles.viewNearFacility}>{data.map(renderItem)}</View>
      </View>
    );
  } else return null;
};

const PositionAndFacility = ({coordinate, nearFacility, internalFacility}) => {
  const needShowMap = !!coordinate?.latitude && !!coordinate?.longitude;
  return (
    //need set pointerEvents="none" to allow drag map area in scroll view
    <View pointerEvents="none">
      <Text style={[styles.textSectionTitle, METRICS.horizontalPadding]}>
        {translate('propertyPost.location')}
      </Text>
      {needShowMap && (
        <MapSection
          style={styles.viewMap}
          regionState={coordinate}
          scrollEnabled={false}
          zoomEnabled={false}
          rotateEnabled={false}
        />
      )}
      <View style={METRICS.horizontalPadding}>
        <FacilitySection title={translate(STRINGS.NEARBY_FACILITY)} data={nearFacility} />
        <FacilitySection title={translate(STRINGS.INTERNAL_FACILITY)} data={internalFacility} />
      </View>
    </View>
  );
};

export default PositionAndFacility;
