import styles from './styles';
import Container from '@src/components/Container';
import React, { useState, useRef, useEffect } from 'react';
import { View, Image, Alert } from 'react-native';
import translate from '@src/localize';
import { DELIVERIES_ICON } from '@src/constants/icons';
import LINE from '@res/icons/ForLeaseForSale/image-line-dot.png';
import { CustomFlatList } from '@src/components/FlatList';
import DeliveryItem from '@src/components/FlatListItem/DeliveryItem';
import NavigationActionsService from '@src/navigation/navigation';
import { FILTER, FILTER_TENANT } from '@src/constants/screenKeys';
import CustomSectionHeader from '@src/components/CustomSection';
import { useDispatch, useSelector } from 'react-redux';
import { getListDelivery, checkShippedDelivery } from '@src/modules/FrontDesk/actions';
import { RootState } from '@src/types/types';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { IDelivery } from '@reup/reup-api-sdk/libs/api/frontdesk/delivery/model';
import { DeliveryState } from '@reup/reup-api-sdk/libs/api/enum';
import { upperCaseFirstChar } from '@src/utils';
import { ResidentQueryDeliveryParams } from '@reup/reup-api-sdk/libs/api/resident/frontdesk';

const DeliveriesTenant = () => {

  const dispatch = useDispatch();
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const defaultPropertyId = me && me.default_property ? me.default_property : ''

  const listDelivery = useSelector<RootState, IPagination<IDelivery>>((state: RootState) => state.frontDesk.listDelivery);

  const [isLoadedData, setLoadedData] = useState(false);
  const flatList = useRef<any>(null);

  const [params, setParams] = useState<ResidentQueryDeliveryParams>({
    unit_id: '',
    state: '',
    search: '',
  })

  const dataStatus = [
    { _key: '', _value: translate('filter.please_choose') },
    { _key: DeliveryState.Draft, _value: upperCaseFirstChar(DeliveryState.Draft.valueOf()) },
    { _key: DeliveryState.Shipped, _value: upperCaseFirstChar(DeliveryState.Shipped.valueOf()) },

  ];

  useEffect(() => {
    if (isLoadedData && me && me.default_company && me.default_company.id) {
      const p: ResidentQueryDeliveryParams = {
        unit_id: '',
        state: '',
        search: ''
      }
      onReloadDataWithParams(p);
    }
  }, [me.default_company])

  const onReloadDataWithParams = (p: ResidentQueryDeliveryParams) => {
    setParams(p)
    if (flatList && flatList.current) {
      flatList.current.resetInitPage(1);
      flatList.current.scrollToTop();
    }
    setTimeout(() => {
      fetchData(1, p);
    }, 200)
  }

  const fetchData = (page: number, params?: ResidentQueryDeliveryParams, onLoadSuccess?: () => void, onLoadFailure?: () => void) => {
    if (!defaultPropertyId) {
      return
    }
    dispatch(getListDelivery({
      id: defaultPropertyId,
      page: page,
      params,
      onSuccess: (data) => {
        onLoadSuccess && onLoadSuccess();
        setLoadedData(true)
      },
      onFail: error => {
        onLoadFailure && onLoadFailure();
        setLoadedData(true)
        setTimeout(() => {
          error && Alert.alert(translate('alert.title_error'), error.message);
        }, 700);
      }
    }))
  }

  const onLoad = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {
    fetchData(page, params, onLoadSuccess, onLoadFailure)
  };

  const onPressChangeStatus = (item: IDelivery) => {
    if (!defaultPropertyId) {
      return
    }
    NavigationActionsService.showLoading();
    dispatch(checkShippedDelivery({
      to: defaultPropertyId,
      from: item.id,
      onSuccess: (data) => {
        fetchData(1, params);
        NavigationActionsService.hideLoading();
      },
      onFail: error => {
        NavigationActionsService.hideLoading();
        setTimeout(() => {
          error && Alert.alert(translate('alert.title_error'), error.message);
        }, 700);
      }
    }))
  };

  const onApplyFilter = (filter: any) => {
    if (filter) {
      let p: ResidentQueryDeliveryParams = {
        state: filter.status ?? '',
      }
      onReloadDataWithParams(p);
    }
  };

  const onPressFilter = () => {
    NavigationActionsService.push(FILTER_TENANT, {
      numberOfInput: 1,
      isBuilding: false,
      isCountry: false,
      isStatus: true,
      indexStatus: 0,
      dataStatus: dataStatus,
      onFilter: onApplyFilter
    });
  };

  const _itemSeparator = () => {
    return (
      <View style={styles.lineContainer}>
        <Image source={LINE} style={styles.line} />
      </View>
    );
  };

  const _renderItem = (item: IDelivery) => {
    return <DeliveryItem item={item} onPress={onPressChangeStatus} />;
  };

  return (
    <Container
      spaceBottom={true}
      isShowHeader={true}
      title={translate('deliveries.my_delivery_navigation_title')}
      isDisplayBackButton={true}>
      <CustomSectionHeader
        style={styles.sectionHeader}
        title={translate('deliveries.my_delivery_title')}
        icon={DELIVERIES_ICON}
        isShowFilter={true}
        onPressFilter={onPressFilter}
      />
      <View style={styles.listContainer}>
        <CustomFlatList
          ref={flatList}
          onLoad={onLoad}
          ItemSeparatorComponent={_itemSeparator}
          data={listDelivery.results}
          renderItem={_renderItem}
          hasNext={listDelivery.next}
          loadMore
          pullToRefresh
          contentContainerStyle={{ flexGrow: 1 }}
        />
      </View>
    </Container>
  );
};

export default DeliveriesTenant;
