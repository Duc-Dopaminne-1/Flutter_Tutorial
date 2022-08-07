import React from 'react';
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';

import {FONTS} from '../../assets/theme/fonts';
import {medium, METRICS} from '../../assets/theme/metric';

const styles = StyleSheet.create({
  item: {
    marginEnd: medium,
    alignItems: 'center',
  },
  image: {
    width: 38,
    height: 38,
  },
  text: {
    fontSize: 13,
    marginTop: 5,
    ...FONTS.regular,
  },
});

const PropertyItem = ({property}) => {
  return (
    <View style={styles.item}>
      <Image style={styles.image} source={property.icon} />
      <Text style={styles.text}>{property.name}</Text>
    </View>
  );
};

const PropertyTypeList = ({propertiesList}) => {
  return (
    <FlatList
      contentContainerStyle={METRICS.horizontalMargin}
      horizontal={true}
      data={propertiesList}
      renderItem={({item}) => <PropertyItem property={item} />}
      keyExtractor={item => `${item.id}`}
    />
  );
};

export default PropertyTypeList;
