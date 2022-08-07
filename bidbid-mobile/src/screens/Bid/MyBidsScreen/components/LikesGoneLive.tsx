import React, { ReactElement, useCallback } from 'react';
import { StyleSheet, View, ViewStyle, FlatList } from 'react-native';
import { language } from '@/i18n';
import HeaderView from './HeaderView';
import LikesGoneLiveItem from './LikesGoneLiveItem';
import { AUCTIONS_LIKE_GONE_LIVE_SCREEN, HOME_DETAIL_SCREEN } from '@/navigation/screenKeys';
import { useNavigation } from '@react-navigation/native';
import { Auction } from '@/models';

interface Prop {
  data: Auction[];
}

export default function LikesGoneLive(props: Prop): ReactElement {
  const { data } = props;
  const navigation = useNavigation();
  const viewAllOnPressed = () => {
    // alert('Coming soon');
    navigation.navigate(AUCTIONS_LIKE_GONE_LIVE_SCREEN);
  };

  const onPressItem = useCallback((item, _index) => {
    navigation.navigate(HOME_DETAIL_SCREEN, {
      profileId: item.creatorId,
      isFromLivesGoneLive: true,
    });
  }, []);

  const renderItem = ({ item, index }) => {
    return <LikesGoneLiveItem item={item} index={index} onPressed={onPressItem} />;
  };

  return (
    <View style={styles.container}>
      <HeaderView title={language('myBidsScreen.likesGoneLive')} viewAllOnPressed={viewAllOnPressed} />
      {data && data.length > 0 ? (
        <FlatList
          style={styles.flatList}
          showsHorizontalScrollIndicator={false}
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          extraData={data}
          horizontal={true}
        />
      ) : (
        <View style={styles.emptyView} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  } as ViewStyle,

  flatList: {
    paddingLeft: 24,
  } as ViewStyle,

  emptyView: {
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
});
