import React, { memo } from 'react';
import { Platform, StatusBar, View, Pressable, ImageStyle, ViewStyle } from 'react-native';
import DeviceInfos from 'react-native-device-info';
import { isIphoneX } from '@/shared/devices';
import { useNavigation } from '@react-navigation/native';
import { colors } from '@/vars';
import SearchComponent from './SearchComponent';
import SpaceView from './SpaceView';
import { resetValueCharity } from '@/screens/ChooseCharity';
import IconBack from '@/components/SVG/BackSvg';

const STATUSBAR_HEIGHT = Platform.select({
  ios: DeviceInfos.hasNotch() ? 45 : 20,
  android: StatusBar.currentHeight,
});

const CONTAINER: ViewStyle = {
  height: isIphoneX() ? STATUSBAR_HEIGHT + 40 : 70,
  paddingHorizontal: 15,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
};

const ICON_BACK: ImageStyle = {
  height: 22,
  width: 22,
  tintColor: colors.text_tab,
};

interface SearchBarProps {
  style?: ViewStyle;
  inputData?: any[];
  searchField: string;
  searchFieldSecond?: string;
  searchPlaceholderText: string;
  apiSearch?: any;
  onChangeSuggestResult?: (result: any[], keyWord: string) => void;
  value?: string;
  isFromCharity?: boolean;
  isFromContact?: boolean;
}

function SearchBar(props: SearchBarProps) {
  const {
    style = CONTAINER,
    inputData = [],
    searchField = '',
    searchFieldSecond = '',
    onChangeSuggestResult = () => undefined,
    apiSearch,
    searchPlaceholderText = '',
    isFromContact = false,
    isFromCharity = false,
  } = props;
  const navigation = useNavigation();

  const onBack = () => {
    if (isFromCharity) {
      resetValueCharity();
    }
    navigation.goBack();
  };

  return (
    <View style={style}>
      {!isFromContact && (
        <>
          <Pressable onPress={onBack} style={ICON_BACK}>
            <IconBack />
          </Pressable>
          <SpaceView />
        </>
      )}
      <SearchComponent
        isFromContact={isFromContact}
        inputData={inputData}
        onChangeSuggestResult={onChangeSuggestResult}
        searchField={searchField}
        searchFieldSecond={searchFieldSecond}
        apiSearch={apiSearch}
        searchPlaceholderText={searchPlaceholderText}
      />
    </View>
  );
}
export default memo(SearchBar);
