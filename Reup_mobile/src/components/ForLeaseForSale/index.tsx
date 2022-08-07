import React, { useEffect, useState } from 'react';
import { View, Image, Text } from 'react-native';
import { CustomButton } from '../CustomButton';
import ItemForLeaseForSale, { PostItemModal } from './ItemForLeaseForSale';
import styles from './styles';
import ICON_HOME_SALE from '@res/icons/ForLeaseForSale/icon-home-sale.png';
import ICON_ARROW_DOWN from '@res/icons/ForLeaseForSale/icon-double-arrow-down.png';
import { FilterButton } from '../CustomFilterButton';
import LINE from '@res/icons/ForLeaseForSale/image-line-dot.png';
import { CustomFlatList } from '../FlatList';
import translate from '@src/localize';
import NavigationActionsService from '@src/navigation/navigation';
import { POST, POST_TENANT } from '@src/constants/screenKeys';
import { Theme } from '../Theme';
import { isTenantApp, isManagerApp } from '@src/utils';

export enum PostType {
  BOTH,
  LEASESALESHOW
}

interface Props {
  headerTitle: string;
  data?: PostItemModal[];
  showFilter: boolean;
  showViewMore: boolean;
  isShowHeader: boolean;
  isShowType?: PostType;
  hasNext?: string | undefined;
  loadMore?: boolean;
  pullToRefresh?: boolean;
  onPress?: (data: PostItemModal) => void;
  flatList?: any
  onLoad: (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => void;
  isShowStatus: boolean;
}

const ForLeaseForSale = (props: Props) => {
  const { headerTitle = 'FOR LEASE - FOR SALE',
    data,
    showFilter = true,
    showViewMore = true,
    isShowHeader = true,
    isShowType = PostType.LEASESALESHOW,
    loadMore = true,
    pullToRefresh = true,
    hasNext,
    onLoad,
    isShowStatus
  } = props;


  const _itemSeparator = () => {
    return (
      <View style={styles.lineContainer}>
        <Image source={LINE} style={styles.line} />
      </View>
    );
  };

  // const onLoad = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {

  // };

  const onPressViewMore = () => {
    if (isManagerApp()) {
      NavigationActionsService.push(POST);
    } else {
      NavigationActionsService.push(POST_TENANT);
    }
  };

  const renderViewMore = () => {
    if (showViewMore) {
      return (
        <CustomButton
          style={styles.viewMore}
          text={translate("global.view_more")}
          textStyle={styles.textViewMore}
          iconRight={ICON_ARROW_DOWN}
          iconRightStyle={styles.iconViewMore}
          onPress={onPressViewMore}
        />
      );
    } else {
      return null;
    }
  };

  return (
    <View style={styles.containers}>
      {isShowHeader ? (<View style={styles.headers}>
        <View style={styles.headersLeft}>
          <Image source={ICON_HOME_SALE} />
          <Text style={styles.title}>{headerTitle}</Text>
        </View>
        {showFilter ?
          <FilterButton
            arrData={[
              { _key: "lastest", _value: "Lastest" },
              { _key: "all", _value: "All" },
            ]}
            textTitle={"Choose"}
            isHideTitle={true}
            lineBottom={false}
            iconRightStyle={{}}
            selected={0}
            containerStyle={styles.filter}
            textStyle={styles.textFilter}
            onChangeDropDown={(object, ) => { }}
          />
          : null}
      </View>) : null}
      <View style={styles.line} />
      <CustomFlatList
        ref={props.flatList}
        onLoad={props.onLoad}
        data={data}
        renderItem={(item: any, index: number) => {
          return (
            <ItemForLeaseForSale
              key={index}
              item={item}
              isShowType={isShowType}
              onPress={(item: PostItemModal) => {
                props.onPress && props.onPress(item);
              }}
              isShowStatus={isShowStatus}
            />
          );
        }}
        ItemSeparatorComponent={_itemSeparator}
        keyExtractor={(item: any, index: number) => String(index)}
        listFooterComponent={renderViewMore}
        loadMore={true}
        pullToRefresh={true}
        hasNext={hasNext}
        style={{ backgroundColor: 'white' }}
        indicatorColor={Theme.building_system.indicator}
        contentContainerStyle={{ flexGrow: 1, }}
      />
    </View>
  );
};

export default React.memo(ForLeaseForSale);
