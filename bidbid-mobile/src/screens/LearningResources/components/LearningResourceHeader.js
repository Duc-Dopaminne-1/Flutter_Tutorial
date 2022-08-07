import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';

import {IMAGES} from '../../../assets/images';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {METRICS} from '../../../assets/theme/metric';
import SearchBox from '../../Home/SearchBox';
import ScreenIds from '../../ScreenIds';

export function LearningResourceHeader(): React.ReactElement {
  const {navigate} = useNavigation();

  const onPressSearch = () => {
    navigate(ScreenIds.LearningResourceSearchScreen, {
      isSearchAll: true,
    });
  };
  return (
    <ImageBackground source={IMAGES.LANDING_PAGE} style={styles.imgHeader}>
      <View>
        <SearchBox
          onSearch={onPressSearch}
          visibleRight={false}
          style={styles.searchBox}
          keyword={'keyword'}
          searchPlaceHolder={translate(STRINGS.SEARCH_TOPIC_PLACEHOLDER)}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imgHeader: {
    height: 220,
    width: METRICS.screenWidth,
    justifyContent: 'flex-end',
  },
});
