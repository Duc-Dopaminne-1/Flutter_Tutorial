import styles from './styles';
import Container from '@src/components/Container';
import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView, Image, RefreshControl, Alert } from 'react-native';
import translate from '@src/localize';
import CustomSectionHeader from '@src/components/CustomSection';
import { IC_MONTHLY_BILL_LIST, IC_NOTIFICATION_HEADER } from '@src/constants/icons';
import TenantTotalPayment from '@src/components/TenantTotalPayment';
import { CustomText } from '@src/components/CustomText';
import FastImage from 'react-native-fast-image';
import { of, combineLatest, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import ICON_ELECTRICITY from '@res/icons/ic_electric.png'
import ICON_WATER from '@res/icons/ic_water.png'
import ICON_TELECOM from '@res/icons/ic_telecom.png'
import ICON_SERVICE from '@res/icons/ic_service.png'
import { formatCurrency } from '@src/utils';
import { CustomFlatList } from '@src/components/FlatList';
import LINE from '@res/icons/ForLeaseForSale/image-line-dot.png';
import { IExpense } from '@reup/reup-api-sdk/libs/api/bulletin/expense/model';
import MonthlyBillHeader from '@src/components/MonthlyBill/MontlyBillHeader';
import MonthlyBillContent from '@src/components/MonthlyBill/MonthBillContent';
import ExpandView, { ItemModal } from '@src/components/ExpandView';
import { useDispatch, useSelector } from 'react-redux';
import { QueryResidentExpenseRequest } from '@reup/reup-api-sdk/libs/api/resident/bulletin/expense';
import { RootState } from '@src/types/types';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { checkoutMonthlyBill, getListMonthlyBill } from '@src/modules/bulletin/actions';
import { colors, LimitLoadMore } from '@src/constants/vars';
import NavigationActionsService from '@src/navigation/navigation';
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { ExpenseStateData } from '@reup/reup-api-sdk/libs/api/bulletin/expense';
import { ExpenseState } from '@reup/reup-api-sdk/src/api/enum';
import { FILTER_TENANT } from '@src/constants/screenKeys';
import { ObjDropdown } from '@src/components/Dropdown/DropdownNative';
import { ITotalMonthlyBill } from '@src/modules/bulletin/reducer';
import CustomTextTicker from '@src/components/CustomTextTicker';
import { find } from 'lodash';

const MonthlyBillTenant = (props: any) => {
  const dispatch = useDispatch()
  const flatListRef = useRef<any>(null)
  const scrollViewRef = useRef<any>(null)
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!)
  const defaultPropertyId = me && me.default_property ? me.default_property : ''
  let monthlyBillTenantObservable: any = null;
  const [activeItem, setActiveItem] = useState<ItemModal>()
  const totalMonthlyBill = useSelector<RootState, ITotalMonthlyBill>((state: RootState) => state.bulletin.totalMonthlyBill)
  const listMonthlyBill = useSelector<RootState, IPagination<IExpense>>((state: RootState) => state.bulletin.listMonthlyBill)
  const [params, setParams] = useState<QueryResidentExpenseRequest>({})
  const [isLoadedData, setLoadedData] = useState<boolean>(false)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [enableScroll, setEnableScroll] = useState<boolean>(true)

  const dataStatus: ObjDropdown[] = [
    { _key: '', _value: translate('filter.please_choose') },
    { _key: ExpenseState.Pending, _value: translate('monthly_bill.pending') },
    { _key: ExpenseState.Paid, _value: translate('monthly_bill.paid') },
  ]

  useEffect(() => {
    if (!isRefreshing && isLoadedData && me && me.default_property) {
      onReloadDataWithParams({})
    }
  }, [me.default_property])

  useEffect(() => {
    return () => {
      monthlyBillTenantObservable && monthlyBillTenantObservable.unsubscribe();
    }
  }, [])

  const fetchData = (params?: QueryResidentExpenseRequest, page?: number, onLoadFailure?: () => void, onLoadSuccess?: () => void) => {
    if (!defaultPropertyId) {
      return
    }
    dispatch(
      getListMonthlyBill({
        id: defaultPropertyId,
        params,
        limit: LimitLoadMore,
        page,
        onFail: error => {
          setLoadedData(true)
          setIsRefreshing(false)
          onLoadFailure && onLoadFailure()
          NavigationActionsService.hideLoading();
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        },
        onSuccess: data => {
          setLoadedData(true)
          setIsRefreshing(false)
          NavigationActionsService.hideLoading();
          onLoadSuccess && onLoadSuccess()
        }
      }))
  }

  const checkoutBill = (billId: string) => {
    if (!defaultPropertyId || !billId) {
      return
    }
    const p: ExpenseStateData = {
      state: ExpenseState.Paid
    }
    NavigationActionsService.showLoading();
    dispatch(
      checkoutMonthlyBill({
        id: billId,
        params: p,
        propertyId: defaultPropertyId,
        onFail: error => {
          setLoadedData(true)
          NavigationActionsService.hideLoading();
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        },
        onSuccess: data => {
          NavigationActionsService.hideLoading();
          setLoadedData(true)
          onReloadDataWithParams(params)
        }
      }))
  }

  const checkoutBillAll = (billId: string) => {
    return new Promise<any>((resolve, reject) => {
      if (!defaultPropertyId || !billId) {
        return
      }
      const p: ExpenseStateData = {
        state: ExpenseState.Paid
      }
      dispatch(
        checkoutMonthlyBill({
          id: billId,
          params: p,
          propertyId: defaultPropertyId,
          onSuccess: data => {
            resolve({ data, completed: true });
          },
          onFail: error => {
            resolve({ completed: false });
          }
        }))
    })
  }

  const onApplyFilter = (values: any) => {
    onReloadDataWithParams({
      month: values.month ?? '',
      unit_id: values.apartment ?? '',
      state: values.status ?? '',
    })
  }

  const onPressFilter = () => {
    NavigationActionsService.push(FILTER_TENANT, {
      numberOfInput: 1,
      isApartment: true,
      isFilterMonth: true,
      isStatus: true,
      indexStatus: 0,
      dataStatus: dataStatus,
      onFilter: onApplyFilter
    })
  }

  const onReloadDataWithParams = (params: QueryResidentExpenseRequest) => {
    setParams(params)
    if (flatListRef && flatListRef.current) {
      flatListRef.current.resetInitPage(1)
      flatListRef.current.scrollToTop()
    }
    setTimeout(() => {
      fetchData(params)
    }, 200);
  }

  const onRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      onReloadDataWithParams(params)
    }, 700);
  }

  const onFocusCustomFlatList = () => {
    if (scrollViewRef && scrollViewRef.current && scrollViewRef.current.contentOffset === 0 && !enableScroll) {
      setEnableScroll(true)
    } else {
      setEnableScroll(false)
    }
  }

  const onPressCheckout = (item: IExpense) => {
    checkoutBill(item.id)
  }

  const onPressCheckoutAll = () => {
    const mapList: IExpense[] = listMonthlyBill.results.filter(item => item.state === ExpenseState.Pending)
    if (mapList.length === 0) {
      Alert.alert(translate('alert.title_error'), translate('alert.message_checkout'))
      return
    }
    const source$ = mapList.map((val: IExpense) => {
      return from(checkoutBillAll(val.id))
    })
    monthlyBillTenantObservable = of(source$).pipe(
      switchMap(() => {
        NavigationActionsService.showLoading();
        return combineLatest(source$)
      }),
      map((response) => {
        NavigationActionsService.hideLoading();
        setLoadedData(true)
        if (response && response.filter(item => !item.completed).length > 0) {
          setTimeout(() => {
            Alert.alert(translate('alert.title_error'), translate('alert.message_error_default'));
          }, 700);
          return;
        }
        onReloadDataWithParams(params)
      })
    ).subscribe();
  }

  const onLoad = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {
    fetchData(params, page, onLoadFailure, onLoadSuccess)
  }

  const itemSeparator = () => {
    return (
      <View style={styles.lineContainer}>
        <Image resizeMode={'contain'} source={LINE} style={styles.line} />
      </View>
    )
  }

  const renderSecondHeader = () => {
    return (
      <CustomSectionHeader
        title={translate('monthly_bill.second_section_header')}
        icon={IC_MONTHLY_BILL_LIST}
        style={styles.sectionHeader}
      />
    )
  }

  const renderHeaderItem = (item: IExpense) => (
    <MonthlyBillHeader item={item} />
  )

  const renderContentItem = (section: IExpense) => (
    <MonthlyBillContent item={section} onPressCheckout={onPressCheckout} />
  )

  const onChangeItem = (item: ItemModal) => {
    setActiveItem(item)
  }

  const renderItem = (item: IExpense) => {
    const expanded = item && activeItem && activeItem.item && item.id === activeItem.item.id && !activeItem.isActive
    const itemModal: ItemModal = {
      item: item,
      isActive: expanded
    }
    return (
      <ExpandView
        item={itemModal}
        expanded={expanded}
        componentContent={renderContentItem(item)}
        componentHeader={renderHeaderItem(item)}
        onPressItem={onChangeItem}
      />
    );
  };

  const onStartShouldSetResponderCapture = () => {
    onFocusCustomFlatList()
    return false
  }

  const renderList = () => {
    return (
      <>
        {renderSecondHeader()}
        <View
          style={styles.container}
          onStartShouldSetResponderCapture={onStartShouldSetResponderCapture}>
          <CustomFlatList
            ref={flatListRef}
            onLoad={onLoad}
            ItemSeparatorComponent={itemSeparator}
            data={listMonthlyBill.results}
            renderItem={renderItem}
            hasNext={listMonthlyBill.next}
            pullToRefresh={false}
            loadMore={true}
            contentContainerStyle={styles.contentContainerList}
            style={styles.listBill}
          />
        </View>
      </>
    )
  }

  const renderRefreshControl = () => {
    return (
      < RefreshControl
        tintColor={colors.GRAY500}
        refreshing={isRefreshing}
        onRefresh={onRefresh}
      />
    )
  }

  const renderContent = () => {
    return (
      <View
        style={{ flex: 1 }}
        onStartShouldSetResponderCapture={() => {
          setEnableScroll(true)
          return false
        }}>
        <ScrollView
          ref={scrollViewRef}
          alwaysBounceVertical={false}
          contentContainerStyle={styles.contentContainerScrollView}
          style={styles.scrollContainer}
          refreshControl={renderRefreshControl()}
          scrollEnabled={enableScroll}
        >
          <View style={styles.containerTotal}>
            <TenantTotalPayment
              totalAmount={formatCurrency(totalMonthlyBill.total, undefined, 2)}
              onPressCheckout={onPressCheckoutAll} />
            {renderDetail()}
          </View>
          {renderList()}
        </ScrollView >
      </View>
    )
  }

  const renderDetail = () => {
    return (
      <View style={styles.detailContainer}>
        <CustomText
          text={translate("monthly_bill.description")}
          style={styles.description}
          styleContainer={styles.descriptionContainer}
        />
        <View style={styles.contentItemContainer}>
          <FastImage
            source={ICON_ELECTRICITY}
            style={styles.icons}
            resizeMode='contain'
          />
          <CustomText
            text={translate("monthly_bill.electric")}
            style={styles.textItem}
            styleContainer={styles.textItemContainer}
            numberOfLines={1}
          />
          <CustomTextTicker
            text={formatCurrency(totalMonthlyBill.electric_fee, undefined, 2)}
            styleText={[styles.amount, styles.electricAmount]}
            styleContainer={styles.amountContainer}
            numberOfLines={1}
          />
        </View>
        <View style={styles.contentItemContainer}>
          <FastImage
            source={ICON_WATER}
            style={styles.icons}
            resizeMode='contain'
          />
          <CustomText
            text={translate("monthly_bill.water")}
            style={styles.textItem}
            styleContainer={styles.textItemContainer}
            numberOfLines={1}
          />
          <CustomTextTicker
            text={formatCurrency(totalMonthlyBill.water_fee, undefined, 2)}
            styleText={[styles.amount, styles.waterAmount]}
            styleContainer={styles.amountContainer}
            numberOfLines={1}
          />
        </View>
        <View style={styles.contentItemContainer}>
          <FastImage
            source={ICON_TELECOM}
            style={styles.icons}
            resizeMode='contain' />
          <CustomText
            text={translate("monthly_bill.telecom")}
            style={styles.textItem}
            styleContainer={styles.textItemContainer}
            numberOfLines={1}
          />
          <CustomTextTicker
            text={formatCurrency(totalMonthlyBill.telecom_fee, undefined, 2)}
            styleText={[styles.amount, styles.telecomAmount]}
            styleContainer={styles.amountContainer}
            numberOfLines={1}
          />
        </View>
        <View style={styles.contentItemContainer}>
          <FastImage
            source={ICON_SERVICE}
            style={styles.icons}
            resizeMode='contain'
          />
          <CustomText
            text={translate("monthly_bill.service")}
            style={styles.textItem}
            styleContainer={styles.textItemContainer}
            numberOfLines={1}
          />
          <CustomTextTicker
            text={formatCurrency(totalMonthlyBill.service_fee, undefined, 2)}
            styleText={[styles.amount, styles.serviceAmount]}
            styleContainer={styles.amountContainer}
            numberOfLines={1}
          />
        </View>
      </View>
    )
  }

  const renderHeader = () => {
    return (
      <CustomSectionHeader
        title={translate('monthly_bill.title').toUpperCase()}
        icon={IC_NOTIFICATION_HEADER}
        isShowFilter={true}
        style={styles.sectionHeader}
        onPressFilter={onPressFilter}
      />
    )
  }

  return (
    <Container isShowHeader={true} title={translate('monthly_bill.title')} isDisplayBackButton={false}>
      {renderHeader()}
      {renderContent()}
    </Container>
  );
};

export default MonthlyBillTenant;
