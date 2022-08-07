import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, TextStyle, ViewStyle, View, Dimensions, Text } from 'react-native';
import { SafeArea } from '@/components/SafeArea';
import CustomHeader from '@/components/CustomHeader';
import { language } from '@/i18n';
import { useDispatch } from 'react-redux';
import { colors, fonts } from '@/vars';
import LikesGoneLiveItem from '@/screens/Bid/MyBidsScreen/components//LikesGoneLiveItem';
import { getLikesGoneLive } from '@/redux/myBids/actions';
import { HOME_DETAIL_SCREEN } from '@/navigation/screenKeys';
import { useNavigation } from '@react-navigation/native';
import { isIOS } from '@/shared/devices';
import IconBack from '@/components/SVG/BackSvg';
import IconMyBidEmptySVG from '@/components/SVG/IconMyBidEmptySVG';

export function AuctionsLikeGoneLiveScreen(): ReactElement {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [dataList, setDataList] = useState([]);
  const getLikesGoneLiveHanlder = () => {
    dispatch(
      getLikesGoneLive({
        onSuccess: (data: any[]) => {
          setDataList(data);
        },
        onFail: _ => {
          setDataList([]);
        },
      }),
    );
  };

  useEffect(() => {
    getLikesGoneLiveHanlder();
  }, []);

  const onPressItem = useCallback((item, _index) => {
    navigation.navigate(HOME_DETAIL_SCREEN, {
      profileId: item.creatorId,
      isFromLivesGoneLive: true,
    });
  }, []);

  const renderItem = ({ item, index }) => {
    return <LikesGoneLiveItem item={item} index={index} onPressed={onPressItem} containerStyle={styles.containerStyle} />;
  };

  const separatorView = () => {
    return <View style={styles.seperatorStyle} />;
  };

  return (
    <View style={styles.container}>
      <SafeArea />
      <CustomHeader title={language('myBidsScreen.likesGoneLiveTitle')} titleStyle={styles.textTitle} leftIcon={<IconBack />} />
      {dataList && dataList.length > 0 ? (
        <FlatList
          style={styles.flatList}
          showsVerticalScrollIndicator={false}
          data={dataList}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={separatorView}
          extraData={dataList}
          numColumns={2}
        />
      ) : (
        <View style={styles.emptyView}>
          <IconMyBidEmptySVG />
          <Text style={styles.textNoteTitle}>{language('myBidsScreen.likesGoneLiveEmpty')}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  } as ViewStyle,

  textTitle: {
    color: colors.title_grey,
    fontWeight: isIOS ? '600' : 'bold',
  } as TextStyle,

  flatList: {
    marginVertical: 20,
    paddingHorizontal: 16,
    marginLeft: 10,
  } as ViewStyle,

  emptyView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  } as ViewStyle,

  textNoteTitle: {
    marginTop: 25,
    fontSize: fonts.size.s16,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsRegular,
    fontWeight: fonts.fontWeight.bold,
  } as TextStyle,

  containerStyle: {
    width: (Dimensions.get('window').width - 16 - 50) / 2,
    height: (Dimensions.get('window').width - 16 - 50) / 2,
    alignSelf: 'center',
  } as ViewStyle,

  seperatorStyle: {
    flex: 1,
    height: 20,
  } as ViewStyle,
});
