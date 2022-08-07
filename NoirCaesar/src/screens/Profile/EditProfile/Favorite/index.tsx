import { View, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import Container from '@components/Container';
import styles from './styles';
import translate from '@src/localize';
import { CustomHeader } from '@src/components/CustomHeader';
import { BACK } from '@src/constants/icons';
import NavigationActionsService from '@src/navigation/navigation';
import { CustomText } from '@src/components/CustomText';
import { FavoriteItem, FavoriteItemModel } from '@src/components/FlatListItem/FavoriteItem';
import { clone } from 'lodash';
import { CustomTouchable } from '@src/components/CustomTouchable';
import { useSelector } from 'react-redux';
import { RootState } from '@src/types/types';
import { IGenres } from '@goldfishcode/noir-caesar-api-sdk/libs/api/book/models';

interface Props {
  listItem: FavoriteItemModel[];
  onPressActive: (data: FavoriteItemModel[]) => void;
  favoriteid: string;
}

const Favorite = (props: Props) => {
  const listGenres = useSelector<RootState, any[]>((state: RootState) => state.book.listGenres);

  const [data, setData] = useState<FavoriteItemModel[]>(listGenres);

  useEffect(() => {
    setDataFlatlist();
  }, [listGenres]);

  const setDataFlatlist = () => {
    const cloneData: IGenres[] = clone(listGenres);

    const parseData: FavoriteItemModel[] = cloneData.map(item => ({
      name: item.name,
      selected: findFavId(item),
      id: item.id,
    }));
    setData(parseData);
  };

  const findFavId = (item: IGenres) => {
    const { favoriteid } = props;
    const arrayFav = favoriteid.split(', ');
    const inList = arrayFav && arrayFav.find(itemFav => itemFav === item.id);
    return inList ? true : false;
  };

  const onBack = () => {
    NavigationActionsService.pop();
  };

  const onPressSave = () => {
    props.onPressActive(data);
    NavigationActionsService.pop();
  };

  const renderRightHeader = () => {
    return <CustomText style={styles.textHeaderRight} text={translate('favorite.save')} />;
  };

  const renderHeader = () => {
    return (
      <CustomHeader
        containerStyle={styles.headerContainer}
        leftImage={BACK}
        leftAction={onBack}
        title={translate('favorite.favorite')}
        rightComponent={renderRightHeader()}
        rightAction={onPressSave}
      />
    );
  };

  const onPressFavoriteItem = (item: FavoriteItemModel) => {
    const cloneData: FavoriteItemModel[] = clone(data);

    const findData = cloneData.find((it: FavoriteItemModel) => it.id === item.id);
    if (findData) {
      findData.selected = findData.selected ? false : true;
      setData(cloneData);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    return <FavoriteItem item={item} onPressItem={onPressFavoriteItem.bind(undefined, item)} />;
  };

  const keyExtractor = (item: any) => {
    return item.id;
  };

  const renderFlatlist = () => {
    return (
      <FlatList
        contentContainerStyle={styles.contentContainerStyle}
        style={styles.flatlist}
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    );
  };

  return (
    <Container>
      <View style={styles.container}>
        {renderHeader()}
        {renderFlatlist()}
      </View>
    </Container>
  );
};

export default Favorite;
