import React, { ReactElement } from 'react';
import { StyleSheet, View, FlatList, ViewStyle } from 'react-native';
import { Auction } from '@/models/auction';

import MyAuctionsOnProcessingItem from './MyAuctionsOnProcessingItem';

interface Props {
  dataList?: Auction[];
}

export default function MyAuctionsOnProcessingList(props: Props): ReactElement {
  const { dataList } = props;
  if (!dataList || dataList.length < 1) return null;

  const renderItem = ({ item, index }) => {
    return <MyAuctionsOnProcessingItem item={item} index={index} />;
  };

  const keyExtractor = (item, _) => {
    return item.id;
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.flatList}
        showsVerticalScrollIndicator={false}
        data={dataList}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        // ItemSeparatorComponent={SeparatorView}
        extraData={dataList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  } as ViewStyle,

  flatList: {
    flex: 1,
  } as ViewStyle,
});
