import {useNavigation} from '@react-navigation/native';
import React, {useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {useSafeArea} from 'react-native-safe-area-context';

import {SEARCH_TYPE_INDEX} from '../../../assets/constants';
import {IMAGES} from '../../../assets/images';
import {COLORS} from '../../../assets/theme/colors';
import {HELPERS} from '../../../assets/theme/helpers';
import {normal} from '../../../assets/theme/metric';
import BaseScreen from '../../../components/BaseScreen';
import CustomButton from '../../../components/Button/CustomButton';
import SearchFilterAgentScreen from '../SearchFilterAgentScreen';
import SearchFilterScreen from '../SearchFilterScreen';
import {SEARCH_TYPE} from './MapComponents/MapHelpers';
import SearchMapBaseComponent from './SearchMapBaseComponent';

const styles = StyleSheet.create({
  searchHeader: {
    ...HELPERS.center,
    position: 'absolute',
    right: normal,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.PRIMARY_A20,
  },
});

const FILTER_PROJECT = 0;
const FILTER_PROPERTY_POST = 1;

const SearchMapBaseScreen = ({
  searchType,
  searchCriteria,
  renderPopupItem,
  searchFilterAgentHook,
  isOnRentalTab,
  onGetNewFilter = () => {},
  items = [],
}) => {
  const navigation = useNavigation();
  const modalizeRef = useRef(null);
  const safeInsets = useSafeArea();

  const onBackPress = () => {
    navigation.goBack();
  };

  const onDissmissFilter = () => {
    modalizeRef.current?.close();
  };

  const onPressConfirmFilter = criteria => {
    modalizeRef.current?.close();
    onGetNewFilter(criteria);
  };

  const searchFilterType = (function () {
    const searchTypeOutPut =
      searchType === SEARCH_TYPE.PROJECTS ? FILTER_PROJECT : FILTER_PROPERTY_POST;
    if (isOnRentalTab) {
      return SEARCH_TYPE_INDEX.RENTAL;
    }
    return searchTypeOutPut;
  })();

  return (
    <BaseScreen isFullScreen={true} showHeader={false}>
      <SearchMapBaseComponent
        data={items}
        searchType={searchType}
        renderPopupItem={renderPopupItem}
        isOnRentalTab={isOnRentalTab}
      />
      <View style={[styles.searchHeader, {top: safeInsets.top + normal}]}>
        <CustomButton onPress={onBackPress} iconName={IMAGES.IC_LAUNCH_FILL} iconSize={24} />
      </View>
      <Modalize
        threshold={300}
        velocity={1000}
        modalStyle={{backgroundColor: COLORS.BACKGROUND}}
        modalTopOffset={20}
        adjustToContentHeight={true}
        ref={modalizeRef}>
        {searchType === SEARCH_TYPE.AGENTS ? (
          <SearchFilterAgentScreen
            onPressDismiss={onDissmissFilter}
            onPressConfirm={onPressConfirmFilter}
            searchFilterAgentHook={searchFilterAgentHook}
          />
        ) : (
          <SearchFilterScreen
            onPressDismiss={onDissmissFilter}
            onPressConfirm={onPressConfirmFilter}
            searchCriteria={searchCriteria}
            searchType={searchFilterType}
          />
        )}
      </Modalize>
    </BaseScreen>
  );
};

export default SearchMapBaseScreen;
