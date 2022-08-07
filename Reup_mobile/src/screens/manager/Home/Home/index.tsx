import styles from './styles';
import Container from '@src/components/Container';
import React, { useEffect, useState, useRef } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import HomeHeader from '@src/components/HomeHeader';
import { LineChart } from '@src/components/Charts/LineChart';
import MonthlyReport from '@src/components/MonthlyReport';
import ProductList from '@src/components/ProductList';
import ForLeaseForSale, { PostType } from '@src/components/ForLeaseForSale';
import RequestView from '@src/components/RequestView';
import NavigationActionsService from '@src/navigation/navigation';
import {
  STAFF,
  TENANT,
  STATUS_REQUESTS,
  SHOPPING_STORE,
  POST_DETAIL,
  FILTER,
} from '@src/constants/screenKeys';
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
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { ICompanyBulletinBoardForLease } from '@reup/reup-api-sdk/libs/api/company/bulletin-board/for-lease/models';
import { ICompanyBulletinBoardForSale } from '@reup/reup-api-sdk/libs/api/company/bulletin-board/for-sale/models';
import { BulletinPostStatus } from '@reup/reup-api-sdk/libs/api/enum';
import { LimitItemForLeaseForSaleAtHome, LimitLoadMore } from '@src/constants/vars';
import { getListForSale, getListForLease } from '@src/modules/bulletin/actions';
import NotificationsService from "@src/modules/notifications/service";
import store from '@src/redux/store'
import { registerToken, getBadge } from '@src/modules/notifications/notification/actions';
import NavigateLinkHandler from "@src/utils/NavigateLinkHandler";
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { StatusMaintenanceRequest } from '@reup/reup-api-sdk/src/api/enum';
import { INotificationInfo } from '@src/modules/notifications/notification/reducerInfo';
import ProductListHome from '@src/components/ProductListHome';
import { IProductGetResponse } from '@reup/reup-api-sdk/libs/api/shopping_store/models';
import { QueryShoppingProductParams } from '@reup/reup-api-sdk/libs/api/shopping_store/product';
import { getListShoppingProduct } from '@src/modules/shopping_store/action';
import { Config } from '@src/configs/appConfig';

const Home = () => {
  const countStaff = useSelector<RootState, ICount>((state: RootState) => state.company.countStaff);
  const countResident = useSelector<RootState, ICount>((state: RootState) => state.company.countResident);
  const forLeaseList = useSelector<RootState, IPagination<ICompanyBulletinBoardForLease>>((state: RootState) => state.bulletin.listForLease);
  const forSaleList = useSelector<RootState, IPagination<ICompanyBulletinBoardForSale>>((state: RootState) => state.bulletin.listForSale);
  const shoppingProductList = useSelector<RootState, IPagination<IProductGetResponse>>((state: RootState) => state.shoppingStore.listShoppingProduct!);
  const [displayFLFS, setDisplayFLFS] = useState<PostItemModal[]>([])
  const forLeaseSaleFlatList = useRef<any>(null)
  const dispatch = useDispatch();
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const defaultCompanyId = me.default_company.id ?? '';
  let notificationService: NotificationsService;
  const badgeNumber = useSelector<RootState, number>((state: RootState) => state.notifications.notificationInfo.badge);


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
    NavigationActionsService.push(STATUS_REQUESTS, { title: title, icon: icon, status: status });
  };

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
      const sortedFLFS = listForleaseForSale.sort((a, b) => (new Date(b.modified ? b.modified : '') as any) - (new Date(b.modified ? b.modified : '') as any))
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

  const onPressTenants = () => {
    NavigationActionsService.push(TENANT);
  };

  const onPressStaffs = () => {
    NavigationActionsService.push(STAFF);
  };

  const onPressViewMoreProduct = () => {
    NavigationActionsService.push(SHOPPING_STORE);
  };

  const onPressItemFLFS = (item: PostItemModal) => {
    NavigationActionsService.push(POST_DETAIL, { forLeaseSaleFlatList, data: item });
  };

  const onApplyFilter = (filter: any) => {
    console.log('filter:', filter);
  };

  const onPressFilter = () => {
    NavigationActionsService.push(FILTER, {
      numberOfInput: 1,
      isSortByLatest: true,
      indexSortByLatest: 0,
      onFilter: onApplyFilter
    });
  };

  const fetchListForLease = (companyId: string, page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {
    dispatch(
      getListForLease({
        id: companyId,
        page: page,
        limit: LimitLoadMore,
        onSuccess: (data) => {
          console.log("===== Success For Lease data: ", data);
          onLoadSuccess && onLoadSuccess();
        },
        onFail: error => {
          console.log('Error', error && error.message);
          onLoadFailure && onLoadFailure();
        }
      })
    )
  }

  const fetchListForSale = (companyId: string, page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {
    dispatch(
      getListForSale({
        id: companyId,
        page: page,
        limit: LimitLoadMore,
        onSuccess: (data) => {
          console.log("===== Success For Sale data: ", data);
          onLoadSuccess && onLoadSuccess();
        },
        onFail: error => {
          console.log('Error', error && error.message);
          onLoadFailure && onLoadFailure();
        }
      })
    )
  }

  const onGetListShoppingStore = () => {
    if (me && me.default_company) {
      const companyId = me.default_company.id ?? ''
      dispatch(
        getListShoppingProduct({
          id: companyId,
          page: 1,
          params: {},
          limit: 10,
          onSuccess: data => { },
          onFail: error => { }
        })
      )
    }
  }

  const onLoadForLeaseForSale = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {
    fetchListForLease(defaultCompanyId, page, onLoadSuccess, onLoadFailure)
    fetchListForSale(defaultCompanyId, page, onLoadSuccess, onLoadFailure)
  };



  //====================== Notification ======================//
  useEffect(() => {
    initNotification()
    onGetListShoppingStore()
  }, [])

  const initNotification = () => {
    notificationService = NotificationsService.initInstance(store, {
      updateNotificationBadge: () => { },
      onUpdateBadge: () => {
        getBadgeNumber()
      },
      getBadge: () => {
        getBadgeNumber()
      },
      registerToken: (deviceName: any, registrationID: any, deviceID: any, type: any) => {
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
      callBack: (data: any) => {
      }
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

  return (
    <Container>
      <HomeHeader
        numberTenants={countResident ? `${countResident.count}` : '0'}
        numberStaffs={countStaff ? `${countStaff.count}` : '0'}
        onPressTenants={onPressTenants}
        onPressStaffs={onPressStaffs}
        onPressMenu={onPressMenu}
        notificationBadge={badgeNumber}
      />
      <ScrollView
        style={styles.scrollContainer}>
        <View style={styles.lineChartContainer}>
          <LineChart />
        </View>

        <View style={styles.monthlyReportContainer}>
          <MonthlyReport />
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
          <ProductListHome
            isShowViewMore={true}
            shoppingProductList={shoppingProductList}
            headerTitle={translate('home.new_products')}
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
            isShowStatus={true}
            flatList={forLeaseSaleFlatList}
          />
        </View>

      </ScrollView>
    </Container>
  );
};

export default Home;
