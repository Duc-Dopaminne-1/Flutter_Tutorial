import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';

import {IMAGES} from '../../assets/images';
import {translate} from '../../assets/localize';
import {COLORS} from '../../assets/theme/colors';
import BaseScreen from '../../components/BaseScreen';
import CustomListItem from '../../components/CustomListItem';
import ScreenIds from '../ScreenIds';

const getData = () => [
  {
    title: translate('utilities360.map360'),
    image: IMAGES.IC_MAP_FILL,
    screen: ScreenIds.Map360,
  },
  {
    title: translate('utilities360.valuatation'),
    image: IMAGES.IC_VALUATION_FILL,
    screen: ScreenIds.Valuatation,
  },
];

const keyExtractor = item => item.screen;

const UtilitiesScreen = ({navigation}) => {
  const DATA = getData();
  const onPressItem = screen => {
    if (screen) {
      navigation.navigate(screen);
    }
  };

  const renderItem = ({item}) => {
    return (
      <CustomListItem
        title={item.title}
        imageStyle={{tintColor: COLORS.PRIMARY_A100}}
        imageSource={item.image}
        onPress={() => onPressItem(item.screen)}
      />
    );
  };

  return (
    <BaseScreen testID={ScreenIds.Utilities360} title={translate('utilities360.headerTitle')}>
      <View style={styles.viewContainer}>
        <FlatList
          data={DATA}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          alwaysBounceVertical={false}
        />
      </View>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    marginBottom: 70,
  },
});

export default UtilitiesScreen;
