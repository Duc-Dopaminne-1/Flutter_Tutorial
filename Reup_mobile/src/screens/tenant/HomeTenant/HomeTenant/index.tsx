import styles from './styles';
import Container from '@src/components/Container';
import React, { useEffect, useState, useRef } from 'react';
import { View, ScrollView } from 'react-native';
import ForLeaseForSale, { PostType } from '@src/components/ForLeaseForSale';
import RequestView from '@src/components/RequestView';
import NavigationActionsService from '@src/navigation/navigation';
import { STATUS_REQUESTS_TENANT, SHOPPING_STORE_TENANT, POST_DETAIL_TENANT, FILTER_TENANT, WHOLE_STORE_DETAILS_TENANT, MY_SHOP_DETAILS_TENANT, MONTHLY_BILL_TENANT } from '@src/constants/screenKeys';
import TypeRequest from '@src/components/RequestView/enum';
import NewIcon from '@src/res/icons/new-request-icon/new-request-icon.png';
import PendingIcon from '@src/res/icons/pending-request-icon/pending-request-icon.png';
import InProgressIcon from '@src/res/icons/inprogress-request-icon/inprogress-request-icon.png';
import DoneIcon from '@src/res/icons/done-request-icon/done-request-icon.png';
import translate from '@src/localize';
import { PostItemModal, PostTypeFor } from '@src/components/ForLeaseForSale/ItemForLeaseForSale';
import CustomSectionHeader from '@src/components/CustomSection';
import ICON_HOME_SALE from '@res/icons/ForLeaseForSale/icon-home-sale.png';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@src/types/types';
import { ICount } from '@reup/reup-api-sdk/libs/api/company/models';
import { ICON_MAINTENANCE } from '@src/constants/icons';
import { IPagination, PlatForm } from '@reup/reup-api-sdk/libs/type';
import { ICompanyBulletinBoardForLease } from '@reup/reup-api-sdk/libs/api/company/bulletin-board/for-lease/models';
import { ICompanyBulletinBoardForSale } from '@reup/reup-api-sdk/libs/api/company/bulletin-board/for-sale/models';
import { BulletinPostStatus, SortDir } from '@reup/reup-api-sdk/libs/api/enum';
import { LimitItemForLeaseForSaleAtHome, LimitLoadMore } from '@src/constants/vars';
import { getListForSale, getListForLease, getListMonthlyBill } from '@src/modules/bulletin/actions';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import HomeHeaderTenant from '@src/components/HomeHeaderTenant';
import TenantTotalPayment from '@src/components/TenantTotalPayment';
import NewDeal from '@src/components/NewDeal';
import { formatCurrency, getFullName, getUserName } from '@src/utils';
import { IProperty } from '@reup/reup-api-sdk/src/api/company/property/model';
import { find, findIndex } from 'lodash';
import { StatusMaintenanceRequest } from '@reup/reup-api-sdk/src/api/enum';
import NotificationsService from '@src/modules/notifications/service';
import { registerToken, getBadge } from '@src/modules/notifications/notification/actions';
import store from '@src/redux/store';
import NavigateLinkHandler from '@src/utils/NavigateLinkHandler';
import { getGeneral, getResidentRequestGeneral } from '@src/modules/Maintenance/actions';
import { ITotalMonthlyBill } from '@src/modules/bulletin/reducer';
import { getListShoppingProduct } from '@src/modules/shopping_store/action';
import { QueryShoppingProductParams } from '@reup/reup-api-sdk/libs/api/resident/shopping_store/product';
import { IProductGetResponse } from '@reup/reup-api-sdk/libs/api/resident/shopping_store/models';
import { ShoppingStoreItemModal, ShoppingStoreType } from '@src/components/FlatListItem/ShoppingStoreItem';
const HomeTenant = () => {

  const forLeaseList = useSelector<RootState, IPagination<ICompanyBulletinBoardForLease>>((state: RootState) => state.bulletin.listForLease);
  const forSaleList = useSelector<RootState, IPagination<ICompanyBulletinBoardForSale>>((state: RootState) => state.bulletin.listForSale);
  const [displayFLFS, setDisplayFLFS] = useState<PostItemModal[]>([])
  const forLeaseSaleFlatList = useRef<any>(null)
  const [isLoadedDataForLease, setLoadedDataForLease] = useState<boolean>(false)
  const [isLoadedDataForSale, setLoadedDataForSale] = useState<boolean>(false)

  const dispatch = useDispatch();

  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const defaultPropertyId = me && me.default_property
  const listMyProperty = useSelector<RootState, IProperty[]>((state: RootState) => state.company.listMyProperty.results);
  const defaultProperty: IProperty = listMyProperty && listMyProperty.length
    ? listMyProperty[findIndex(listMyProperty, { id: defaultPropertyId }) ?? 0]
    : { id: defaultPropertyId, name: '' }
  let notificationService: NotificationsService;
  const badgeNumber = useSelector<RootState, number>((state: RootState) => state.notifications.notificationInfo.badge);
  const totalMonthlyBill = useSelector<RootState, ITotalMonthlyBill>((state: RootState) => state.bulletin.totalMonthlyBill)
  const wholeStoreList = useSelector<RootState, IPagination<IProductGetResponse>>((state: RootState) => state.shoppingStore.listShoppingProduct);
  const [wholeStoreData, setWholeStoreData] = useState<ShoppingStoreItemModal[]>([])


  const onSelect = (typeRequest: TypeRequest) => {
    let title = translate('maintenance.waiting');
    let icon = NewIcon;
    let status = StatusMaintenanceRequest.Waiting;
    if (typeRequest == TypeRequest.Waiting) {
      title = translate('maintenance.waiting');
      icon = NewIcon;
      status = StatusMaintenanceRequest.Waiting;
    } else if (typeRequest == TypeRequest.Pending) {
      title = translate('maintenance.pending');
      icon = PendingIcon;
      status = StatusMaintenanceRequest.Pending;
    } else if (typeRequest == TypeRequest.In_Progress) {
      title = translate('maintenance.in_progress');
      icon = InProgressIcon;
      status = StatusMaintenanceRequest.InProgress;
    } else {
      title = translate('maintenance.done');
      icon = DoneIcon;
      status = StatusMaintenanceRequest.Done;
    }
    NavigationActionsService.push(STATUS_REQUESTS_TENANT, { title: title, icon: icon, status: status });
  };

  useEffect(() => {
    if (isLoadedDataForLease && isLoadedDataForSale) {
      forLeaseSaleFlatList && forLeaseSaleFlatList.current && forLeaseSaleFlatList.current.scrollToTop()
      forLeaseSaleFlatList && forLeaseSaleFlatList.current && forLeaseSaleFlatList.current.resetInitPage(1);
      setTimeout(() => {
        fetchGeneralMaintenanceRequest();
        fetchDataMonthlyBill();
        fetchListForLease(1)
        fetchListForSale(1)
        fetchListWholeStore(1)
      }, 200);
    }
  }, [me.default_property])

  const fetchListWholeStore = (page: number) => {
    const params: QueryShoppingProductParams = {
      category_id: '',
      search: '',
      sort_dir: SortDir.ASC,
    }
    dispatch(getListShoppingProduct({
      id: me.default_property,
      page: page,
      limit: LimitLoadMore,
      params,
      isSave: true,
      onSuccess: (data) => {
        console.log("===== get store success:", data)
      },
      onFail: error => {
        console.log("===== get store fail:", error)
      }
    }))
  }

  useEffect(() => {
    let listWholeStore: ShoppingStoreItemModal[] = []
    wholeStoreList.results.forEach((item: IProductGetResponse) => {
      const wholeStoreItem: ShoppingStoreItemModal = {
        product: item,
        type: ShoppingStoreType.WHOLE_STORE,
        isSelected: false
      }
      listWholeStore.push(wholeStoreItem);
    })
    setWholeStoreData(listWholeStore);
  }, [wholeStoreList])

  useEffect(() => {
    let listForleaseForSale: PostItemModal[] = []
    forLeaseList.results.forEach((item: ICompanyBulletinBoardForLease) => {
      const displayItem: PostItemModal = {
        thumbnail: item.thumbnail ? item.thumbnail : '',
        title: item.title ? item.title : '',
        description: item.description ? item.description : '',
        price: item.price ? item.price : 0,
        type: PostTypeFor.FOR_LEASE,
        companyId: item.company_id ? item.company_id : '',
        created: item.created ? item.created : '',
        creator: item.creator ? item.creator : undefined,
        currency: item.currency ? item.currency : '',
        id: item.id ? item.id : '',
        imageURLs: item.image_urls ? item.image_urls : [],
        isRemove: item.is_removed ? item.is_removed : false,
        modified: item.modified ? item.modified : "",
        propertyId: item.property_id ? item.property_id : "",
        status: item.status ? item.status : BulletinPostStatus.Pending,
        per: item.per ? item.per : "",
        unit: item.unit ? item.unit : "",
      }
      listForleaseForSale.push(displayItem)
    })
    forSaleList.results.forEach((item: ICompanyBulletinBoardForSale) => {
      const displayItem: PostItemModal = {
        thumbnail: item.thumbnail ? item.thumbnail : '',
        title: item.title ? item.title : '',
        description: item.description ? item.description : '',
        price: item.price ? item.price : 0,
        type: PostTypeFor.FOR_SALE,
        companyId: item.company_id ? item.company_id : '',
        created: item.created ? item.created : '',
        creator: item.creator ? item.creator : undefined,
        currency: item.currency ? item.currency : '',
        id: item.id ? item.id : '',
        imageURLs: item.image_urls ? item.image_urls : [],
        isRemove: item.is_removed ? item.is_removed : false,
        modified: item.modified ? item.modified : "",
        propertyId: item.property_id ? item.property_id : "",
        status: item.status ? item.status : BulletinPostStatus.Pending,
        unit: item.unit ? item.unit : "",
      }
      listForleaseForSale.push(displayItem)
    })
    if (listForleaseForSale) {
      //@ts-ignore
      const sortedFLFS = listForleaseForSale.sort((a, b) => new Date(b.modified) - new Date(a.modified))
      if (sortedFLFS.length > LimitItemForLeaseForSaleAtHome) {
        const limitItemList = sortedFLFS.slice(0, LimitItemForLeaseForSaleAtHome)
        setDisplayFLFS(limitItemList)
      } else {
        setDisplayFLFS(sortedFLFS)
      }

    }
  }, [forLeaseList, forSaleList]);

  const onPressMenu = () => {
    NavigationActionsService.openDrawer();
  };

  const onPressItemFLFS = (item: PostItemModal) => {
    NavigationActionsService.push(POST_DETAIL_TENANT, { forLeaseSaleFlatList, data: item });
  };

  const onApplyFilter = (filter: any) => {
    console.log('filter:', filter);
  };

  //====================== Notification ======================//
  useEffect(() => {
    initNotification()
    fetchGeneralMaintenanceRequest();
    fetchDataMonthlyBill();
    fetchListWholeStore(1)
  }, [])

  const initNotification = () => {
    notificationService = NotificationsService.initInstance(store, {
      updateNotificationBadge: () => { },
      getBadge: () => {
        getBadgeNumber()
      },
      onUpdateBadge: () => {
        getBadgeNumber()
      },
      registerToken: (deviceName: string, registrationID: string, deviceID: string, type: PlatForm) => {
        dispatch(registerToken(deviceName,
          registrationID,
          deviceID,
          type))
      },
      onNotificationOpenned: onNotificationOpenned
    });

    // notificationService.clearBadge();
  };

  const getBadgeNumber = () => {
    dispatch(getBadge({
      callBack: (data) => {
      }
    }))
  }

  const fetchDataMonthlyBill = () => {
    if (!defaultPropertyId) {
      return
    }
    dispatch(
      getListMonthlyBill({
        id: defaultPropertyId,
        params: {},
        limit: LimitLoadMore,
        page: 1,
      }))
  }


  //====================== Navigation ======================//

  const onNotificationOpenned = (data: any) => {
    handleNavigateScreen(data);
  };

  const handleNavigateScreen = (data: any) => {
    NavigateLinkHandler.handleScreen(
      data.t,
      data.id,
      data.company_id,
    );
  };

  const onPressFilter = () => {
    NavigationActionsService.push(FILTER_TENANT, {
      numberOfInput: 1,
      isSortByLatest: true,
      indexSortByLatest: 0,
      onFilter: onApplyFilter
    });
  };

  const fetchGeneralMaintenanceRequest = () => {
    dispatch(
      getResidentRequestGeneral({
        property_id: defaultPropertyId,
        onSuccess: async (data) => {
          console.log("===== Success general: ", data);
        },
        onFail: error => {
          console.log('===== Error general', error && error.message);
        }
      })
    )
  }

  const fetchListForLease = (page: number, onLoadSuccess?: () => void, onLoadFailure?: () => void) => {
    if (defaultProperty) {
      dispatch(
        getListForLease({
          id: defaultProperty.id,
          page: page,
          limit: LimitLoadMore,
          onSuccess: (data) => {
            setLoadedDataForLease(true)
            console.log("===== Success For Lease data: ", data);
            onLoadSuccess && onLoadSuccess();
          },
          onFail: error => {
            setLoadedDataForLease(true)
            console.log('Error', error && error.message);
            onLoadFailure && onLoadFailure();
          }
        })
      )
    }
  }

  const fetchListForSale = (page: number, onLoadSuccess?: () => void, onLoadFailure?: () => void) => {
    if (defaultProperty) {
      dispatch(
        getListForSale({
          id: defaultProperty.id,
          page: page,
          limit: LimitLoadMore,
          onSuccess: (data) => {
            setLoadedDataForSale(true)
            console.log("===== Success For Sale data: ", data);
            onLoadSuccess && onLoadSuccess();
          },
          onFail: error => {
            setLoadedDataForSale(true)
            console.log('Error', error && error.message);
            onLoadFailure && onLoadFailure();
          }
        })
      )
    }
  }

  const onLoadForLeaseForSale = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {
    fetchListForLease(page, onLoadSuccess, onLoadFailure)
    fetchListForSale(page, onLoadSuccess, onLoadFailure)
  };

  const onPressCheckout = () => {
    NavigationActionsService.push(MONTHLY_BILL_TENANT)
  }
  const onPressProductItem = (item: ShoppingStoreItemModal) => {
    switch (item.type) {
      case ShoppingStoreType.WHOLE_STORE:
        NavigationActionsService.push(WHOLE_STORE_DETAILS_TENANT, { data: item });
        break;
      case ShoppingStoreType.MY_SHOP:
        NavigationActionsService.push(MY_SHOP_DETAILS_TENANT);
        break;
    }
  }

  return (
    <Container >
      <HomeHeaderTenant
        name={getUserName(me.first_name, me.last_name, me.email)}
        address={defaultProperty && defaultProperty.name ? defaultProperty.name : ''}
        onPressMenu={onPressMenu}
        avatar={me && me.avatar ? me.avatar : ''}
        notificationBadge={badgeNumber}
      />
      <ScrollView
        style={styles.scrollContainer}>
        <View style={styles.totalAmountContainer}>
          <TenantTotalPayment
            totalAmount={formatCurrency(totalMonthlyBill.total, undefined, 2)}
            onPressCheckout={onPressCheckout} />
        </View>

        <View style={styles.maintainenceContainer}>
          <CustomSectionHeader
            title='MAINTENANCE REQUESTS'
            style={styles.headers}
            icon={ICON_MAINTENANCE}
          />
          <RequestView
            onPressItem={onSelect}
          />
        </View>

        <View style={styles.newProductContainer}>
          <NewDeal
            data={wholeStoreData}
            onPressProductItem={onPressProductItem}
          />
        </View>

        <View style={styles.forLeaseContainer}>
          <CustomSectionHeader
            style={styles.sectionHeader}
            title={'FOR LEASE - FOR SALE'}
            icon={ICON_HOME_SALE}
            isShowFilter={false}
            onPressFilter={onPressFilter}
          />
          <ForLeaseForSale
            headerTitle={"FOR LEASE - FOR SALE"}
            showFilter={false}
            showViewMore={displayFLFS.length > 0 ? true : false}
            data={displayFLFS}
            loadMore={false}
            pullToRefresh={false}
            isShowHeader={false}
            onPress={onPressItemFLFS}
            onLoad={onLoadForLeaseForSale}
            isShowType={PostType.BOTH}
            flatList={forLeaseSaleFlatList}
            isShowStatus={false}
          />
        </View>

      </ScrollView>
    </Container>
  );
};

export default HomeTenant;
