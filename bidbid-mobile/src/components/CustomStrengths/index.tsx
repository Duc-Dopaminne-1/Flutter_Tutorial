import React, { ReactElement } from 'react';
import { TextStyle, View, ViewStyle, FlatList } from 'react-native';
import { colors } from '@/vars';
import { language } from '@/i18n';
import CustomButton from '@/components/CustomButton';
import useEnableHardwareBackButton from '@/shared/useEnableHardwareBackButton';
import StrengthItem from '@/components/CustomStrengths/components/StrengthItem';
import { isIphoneX } from '@/shared/devices';

const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: colors.white,
};

const WRAP_LIST: ViewStyle = {
  flex: 1,
  marginTop: 7,
};

const BUTTON_TITLE: TextStyle = {
  fontWeight: '400',
};

const BUTTON_SAVE: ViewStyle = {
  width: null,
  marginBottom: isIphoneX() ? 50 : 30,
  marginTop: 20,
  marginHorizontal: 15,
};

interface CustomStrengthsProps {
  onPressedItem: (item: any) => void;
  dataSelectedList: any[];
  dataList: any[];
  saveOnPressed: () => void;
  maxSelected: number;
}

export function CustomStrengths(props: CustomStrengthsProps): ReactElement {
  const { onPressedItem, dataSelectedList, dataList, saveOnPressed, maxSelected } = props;

  useEnableHardwareBackButton();

  const keyExtractor = item => item.id.toString();

  const renderItem = ({ item }) => {
    return <StrengthItem item={item} onPress={onPressedItem} listSelected={dataSelectedList} maxSelected={maxSelected} />;
  };

  return (
    <View style={CONTAINER}>
      <FlatList
        style={WRAP_LIST}
        scrollToOverflowEnabled={false}
        data={dataList}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        extraData={dataList}
      />
      <CustomButton onPress={saveOnPressed} containerStyle={BUTTON_SAVE} text={language('save')} textStyle={BUTTON_TITLE} />
    </View>
  );
}
