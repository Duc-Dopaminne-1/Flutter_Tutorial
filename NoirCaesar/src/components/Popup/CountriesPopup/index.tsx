import React from 'react';
import { View, FlatList } from 'react-native';
import { styles } from './styles';
import Modal from 'react-native-modal';
import { CustomText } from '../../CustomText';
import { CustomTouchable } from '../../CustomTouchable';
import { ICountry } from '@goldfishcode/noir-caesar-api-sdk/libs/api/shop/models';

export interface Props {
  visible: boolean;
  data?: ICountry[];
  onItemPress: (data: ICountry) => void;
  onBackdropPress: () => void;
}

export const CountriesPopup = (props: Props) => {
  const { visible, data, onItemPress, onBackdropPress } = props;

  const renderItem = ({ item }: { item: ICountry }) => {
    return (
      <CustomTouchable style={styles.itemContainer} onPress={onItemPress.bind(undefined, item)}>
        <CustomText numberOfLines={2} style={styles.country} text={item.printable_name} />
        <CustomText numberOfLines={1} style={styles.countryCode} text={item.iso_3166_1_a3} />
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
