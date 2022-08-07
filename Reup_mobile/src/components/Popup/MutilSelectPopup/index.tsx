import { FlatList, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import styles from './styles';
import { MutilSelectPopupItem, GenreItem } from './MutilSelectPopupItem';
import translate from '@src/localize';
import { clone } from 'lodash';
import { CustomText } from '../../CustomText';
import Modal from 'react-native-modal';
import { CustomButton } from '../../CustomButton';

interface Props {
  loading: boolean;
  listGenres: GenreItem[];
  onPressActive: (data: GenreItem[]) => void;
  onBackdropPress: () => void;
}

const MutilSelectPopup = (props: Props) => {
  const [data, setData] = useState<GenreItem[]>([]);
  const renderItem = ({ item }: { item: GenreItem }) => {
    return <MutilSelectPopupItem item={item} onPressItem={onPressItemPopup.bind(undefined, item)} />;
  };
  useEffect(() => {
    setData(props.listGenres);
  }, [props.listGenres]);
  const keyExtractor = (item: any) => {
    return item.id;
  };

  const onPressItemPopup = (item: GenreItem) => {
    const cloneData: GenreItem[] = clone(data);

    const findData = cloneData.find((it: GenreItem) => it.id === item.id);
    if (findData) {
      findData.selected = findData.selected ? false : true;
      setData(cloneData);
    }
  };

  return (
    <Modal onBackdropPress={props.onBackdropPress} onBackButtonPress={props.onBackdropPress} isVisible={props.loading}>
      <View style={styles.activityIndicatorWrapper}>
        <CustomText style={styles.title} text={'Genre'}></CustomText>
        <FlatList
          contentContainerStyle={styles.contentContainerStyle}
          style={styles.flatlist}
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />
        <CustomButton
          onPress={() => props.onPressActive(data)}
          style={{ marginTop: 10, marginBottom: 10 }}
          text={translate('upload_collection.submit')}
        />
      </View>
    </Modal>
  );
};
export default MutilSelectPopup;
