import styles from './styles';
import Container from '@src/components/Container';
import React, { useState, useRef, useEffect } from 'react';
import { View, Image, Alert } from 'react-native';
import translate from '@src/localize';
import { DELIVERIES_ICON, ADD_PLUS } from '@src/constants/icons';
import LINE from '@res/icons/ForLeaseForSale/image-line-dot.png';
import { CustomFlatList } from '@src/components/FlatList';
import { ObjDropdown } from '@src/components/Dropdown/DropdownNative';
import DeliveryItem from '@src/components/FlatListItem/DeliveryItem';
import { CustomButton } from '@src/components/CustomButton';
import NavigationActionsService from '@src/navigation/navigation';
import { NEW_DELIVERY, FILTER } from '@src/constants/screenKeys';
import CustomSectionHeader from '@src/components/CustomSection';
import { QueryDeliveryRequest } from '@reup/reup-api-sdk/libs/api/frontdesk/delivery';
import { useDispatch, useSelector } from 'react-redux';
import { getListDelivery, checkShippedDelivery } from '@src/modules/FrontDesk/actions';
import { RootState } from '@src/types/types';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { IDelivery } from '@reup/reup-api-sdk/libs/api/frontdesk/delivery/model';
import { debounce } from 'lodash';
import { DeliveryState } from '@reup/reup-api-sdk/libs/api/enum';
import { upperCaseFirstChar } from '@src/utils';
import { formatDateWith } from '@src/utils/date';
import { Config } from '@src/configs/appConfig';

const Deliveries = () => {

  const dispatch = useDispatch();
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const listDelivery = useSelector<RootState, IPagination<IDelivery>>((state: RootState) => state.frontDesk.listDelivery);

  const [isLoadedData, setLoadedData] = useState(false);
  const flatList = useRef<any>(null);

  const [params, setParams] = useState<QueryDeliveryRequest>({
    country_id: '',
    property_id: '',
    state: '',
    from_date: '',
    to_date: '',
  })

  const dataShowBy = [
    { _key: '', _value: translate('filter.please_choose') },
    { _key: "0", _value: translate('filter.all_time') },
    { _key: "1", _value: translate('filter.specific_time') }
  ];

  const dataStatus = [
    { _key: '', _value: 'Please Choose' },
    { _key: DeliveryState.Draft, _value: upperCaseFirstChar(DeliveryState.Draft.valueOf()) },
    { _key: DeliveryState.Shipped, _value: upperCaseFirstChar(DeliveryState.Shipped.valueOf()) },

  ];

  useEffect(() => {
    if (isLoadedData && me && me.default_company && me.default_company.id) {
      const p: QueryDeliveryRequest = {
        country_id: '',
        property_id: '',
        state: '',
        from_date: '',
        to_date: '',
      }
      onReloadDataWithParams(p);
    }
  }, [me.default_company.id])

  const onReloadDataWithParams = (p: QueryDeliveryRequest) => {
    setParams(p)
    if (flatList && flatList.current) {
      flatList.current.resetInitPage(1);
      flatList.current.scrollToTop();
    }
    setTimeout(() => {
      fetchData(1, p);
    }, 200)
  }

  const fetchData = (page: number, params?: QueryDeliveryRequest, onLoadSuccess?: () => void, onLoadFailure?: () => void) => {
    const companyId = me.default_company.id ?? ''
    dispatch(getListDelivery({
      id: companyId,
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
    fetchData(page, {
      ...params
    }, onLoadSuccess, onLoadFailure)
  };

  const onPressChangeStatus = (item: IDelivery) => {
    const companyId = me.default_company.id ?? ''
    NavigationActionsService.showLoading();
    dispatch(checkShippedDelivery({
      from: companyId,
      to: item.id,
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

  const onPressNewDelivery = () => {
    NavigationActionsService.push(NEW_DELIVERY, { flatList });
  };

  const onApplyFilter = (filter: any) => {
    if (filter) {
      let p: QueryDeliveryRequest = {
        country_id: filter.country ?? '',
        property_id: filter.building ?? '',
        state: filter.status ?? ''
      }

      const filterShowBy = filter.showBy && dataShowBy.find(item => item._key === filter.showBy);
      if (filterShowBy && filterShowBy._key == '1') {
        p = {
          ...p,
          from_date: formatDateWith(filter.from, Config.Manager.formatDate, Config.Manager.formatDateDisplay),
          to_date: formatDateWith(filter.to, Config.Manager.formatDate, Config.Manager.formatDateDisplay),
        }
      } else {
        p = {
          ...p,
          from_date: '',
          to_date: '',
        }
      }

      console.log('1111', p)
      onReloadDataWithParams(p);
    }
  };

  const onPressFilter = () => {
    NavigationActionsService.push(FILTER, {
      numberOfInput: 1,
      isShowBy: true,
      dataShowBy: dataShowBy,
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
      title={translate('deliveries.navigation_title')}
      isDisplayBackButton={true}>
      <CustomSectionHeader
        style={styles.sectionHeader}
        title={translate('deliveries.deliveries_title')}
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
      <View style={styles.buttonBottom}>
        <CustomButton iconLeft={ADD_PLUS} text={translate('deliveries.create_delivery')} onPress={onPressNewDelivery} />
      </View>
    </Container>
  );
};

export default Deliveries;
