import React from 'react';
import { View, FlatList } from 'react-native';
import { styles } from './styles';
import Modal from 'react-native-modal';
import { PickerData } from 'react-native-phone-input';
import { CustomText } from '../../CustomText';
import { CustomTouchable } from '../../CustomTouchable';

export interface Props {
  visible: boolean;
  data?: PickerData[];
  onItemPress: (data: PickerData) => void;
  onBackdropPress: () => void;
}

export const CountryCodePopup = (props: Props) => {
  const { visible, data, onItemPress, onBackdropPress } = props;

  const renderItem = ({ item }: { item: PickerData }) => {
    return (
      <CustomTouchable style={styles.itemContainer} onPress={onItemPress.bind(undefined, item)}>
        <CustomText numberOfLines={2} style={styles.country} text={item.label.split('(')[0].trim()} />
        <CustomText numberOfLines={1} style={styles.countryCode} text={item.dialCode} />
      </CustomTouchable>
    );
  };

  return (
    <Modal onBackdropPress={onBackdropPress} onBackButtonPress={onBackdropPress} isVisible={visible}>
      <View style={styles.container}>
        <FlatList data={data ?? []} renderItem={renderItem} keyExtractor={(_, index) => index.toString()} />
      </View>
    </Modal>
  );
};
