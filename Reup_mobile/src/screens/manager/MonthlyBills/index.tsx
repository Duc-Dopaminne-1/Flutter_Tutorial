import Container from "@src/components/Container"
import React, { useRef, useState, useEffect } from "react"
import translate from "@src/localize"
import CustomSectionHeader from "@src/components/CustomSection"
import { IC_MONTHLY_BILL_LIST, ADD_PLUS } from "@src/constants/icons"
import styles from "./styles"
import { View, Image, Alert } from "react-native"
import { CustomButton } from "@src/components/CustomButton"
import { CustomText } from "@src/components/CustomText"
import { CustomFlatList } from "@src/components/FlatList"
import LINE from '@res/icons/ForLeaseForSale/image-line-dot.png';
import MonthlyBillHeader from "@src/components/MonthlyBill/MontlyBillHeader"
import MonthlyBillContent from "@src/components/MonthlyBill/MonthBillContent"
import { IExpense } from "@reup/reup-api-sdk/libs/api/bulletin/expense/model"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@src/types/types"
import { IPagination } from "@reup/reup-api-sdk/libs/type"
import { QueryExpenseRequest, ExpenseStateData } from "@reup/reup-api-sdk/libs/api/bulletin/expense"
import { getListMonthlyBill, approveMonthlyBill, checkoutMonthlyBill, deleteMonthlyBill } from "@src/modules/bulletin/actions"
import { LimitGetAll } from "@src/constants/vars"
import NavigationActionsService from "@src/navigation/navigation"
import { NEW_MONTHLY_BILL, FILTER, EDIT_MONTHLY_BILL } from "@src/constants/screenKeys"
import { IUserProfile } from "@reup/reup-api-sdk/libs/api/user/models"
import { ExpenseState } from "@reup/reup-api-sdk/libs/api/enum"
import ExpandView, { ItemModal } from "@src/components/ExpandView"

interface Props {

}

const MonthlyBill = (props: Props) => {
  const dispatch = useDispatch()
  const flatListRef = useRef<any>(null)
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!)
  const defaultCompanyId = me.default_company.id ?? ''
  const [activeItem, setActiveItem] = useState<ItemModal>()
  const dataMonthlyBills = useSelector<RootState, IPagination<IExpense>>((state: RootState) => state.bulletin.listMonthlyBill)
  const [isLoadedData, setLoadedData] = useState<boolean>(false)
  const [params, setParams] = useState<QueryExpenseRequest>({
    company_id: defaultCompanyId,
    country_id: '',
    property_id: '',
    month: '',
    unit_id: '',
  })

  useEffect(() => {
    if (isLoadedData && me && me.default_company && me.default_company.id) {
      onReloadDataWithParams({
        company_id: me.default_company.id,
        country_id: '',
        property_id: '',
        month: '',
        unit_id: '',
      })
    }
  }, [me.default_company])

  const onReloadDataWithParams = (p: QueryExpenseRequest) => {
    setParams(p)
    if (flatListRef && flatListRef.current) {
      flatListRef.current.resetInitPage(1);
      flatListRef.current.scrollToTop();
    }
    setTimeout(() => {
      fetchData(1, p);
    }, 200)
  }

  const fetchData = (page?: number, params?: QueryExpenseRequest, onLoadSuccess?: () => void, onLoadFailure?: () => void) => {
    NavigationActionsService.showLoading()
    dispatch(
      getListMonthlyBill({
        page,
        limit: LimitGetAll,
        params,
        onSuccess: () => {
          NavigationActionsService.hideLoading()
          onLoadSuccess && onLoadSuccess()
          setLoadedData(true)
        },
        onFail: () => {
          NavigationActionsService.hideLoading()
          onLoadFailure && onLoadFailure()
          setLoadedData(true)
        }
      })
    )
  }

  const checkoutBill = (item: IExpense) => {
    if (!item || item.state != ExpenseState.Pending || !item.id) {
      return
    }
    NavigationActionsService.showLoading()
    const p: ExpenseStateData = {
      state: ExpenseState.Paid
    }
    dispatch(
      checkoutMonthlyBill({
        id: item.id ?? '',
        params: p,
        onSuccess: () => {
          onReloadDataWithParams(params)
          setLoadedData(true)
        },
        onFail: error => {
          NavigationActionsService.hideLoading()
          setLoadedData(true)
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        }
      })
    )
  }

  const approveBill = (item: IExpense) => {
    if (!item || item.state != ExpenseState.Draft || !item.id) {
      return
    }
    NavigationActionsService.showLoading()
    const p: ExpenseStateData = {
      state: ExpenseState.Pending
    }
    dispatch(
      approveMonthlyBill({
        id: item.id ?? '',
        params: p,
        onSuccess: () => {
          onReloadDataWithParams(params)
          setLoadedData(true)
        },
        onFail: error => {
          NavigationActionsService.hideLoading()
          setLoadedData(true)
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        }
      })
    )
  }

  const deleteBill = (item: IExpense) => {
    if (!item || item.state != ExpenseState.Draft || !item.id) {
      return
    }
    NavigationActionsService.showLoading()
    dispatch(
      deleteMonthlyBill({
        id: item.id ?? '',
        onSuccess: () => {
          onReloadDataWithParams(params)
          setLoadedData(true)
        },
        onFail: error => {
          NavigationActionsService.hideLoading()
          setLoadedData(true)
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        }
      })
    )
  }

  const onPressEdit = (item: IExpense) => {
    setActiveItem(undefined)
    NavigationActionsService.push(EDIT_MONTHLY_BILL, { item, flatListRef })
  }

  const onPressDelete = (item: IExpense) => {
    Alert.alert(translate('alert.message_delete'), translate('monthly_bill.alert_delete'),
      [{
        text: translate('monthly_bill.ok'),
        onPress: () => deleteBill(item)
      },
      {
        text: translate('monthly_bill.cancel'),
        onPress: () => { }
      }]
    )
  }

  const onPressApprove = (item: IExpense) => {
    approveBill(item)
  }

  const onPressCheckout = (item: IExpense) => {
    checkoutBill(item)
  }

  const onLoad = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {
    fetchData(page, params, onLoadSuccess, onLoadFailure)
  }

  const onPressCreate = () => {
    NavigationActionsService.push(NEW_MONTHLY_BILL, { flatListRef })
  }

  const onApplyFilter = (value: any) => {
    setActiveItem(undefined)
    onReloadDataWithParams({
      company_id: value.companyId ?? '',
      country_id: value.country ?? '',
      property_id: value.building ?? '',
      unit_id: value.apartment ?? '',
      month: value.month ?? '',
    })
  }

  const onPressFilter = () => {
    NavigationActionsService.push(FILTER, {
      onFilter: onApplyFilter,
      isApartment: true,
      isFilterMonth: true,
    })
  }

  const renderSectionHeader = () => {
    return (
      <CustomSectionHeader
        title={translate('monthly_bill.title_section_header')}
        icon={IC_MONTHLY_BILL_LIST}
        styleIcon={styles.iconSectionHeader}
        styleTitle={styles.titleSectionHeader}
        style={styles.sectionHeader}
        isShowFilter={true}
        onPressFilter={onPressFilter}
      />
    )
  }

  const renderStickyBar = () => {
    return (
      <View style={styles.stickyBar}>
        <CustomText
          text={translate('monthly_bill.apartment_code')}
          style={styles.apartmentCode}
          styleContainer={styles.containerApartmentCode} />
        <CustomText
          text={translate('monthly_bill.month_year')}
          style={styles.monthYear}
          styleContainer={styles.containerMonthYear} />
        <CustomText
          text={translate('monthly_bill.status')}
          style={styles.status}
          styleContainer={styles.containerStatus} />
      </View>
    )
  }

  const itemSeparator = () => {
    return (
      <View style={styles.lineContainer}>
        <Image resizeMode={'contain'} source={LINE} style={styles.line} />
      </View>
    )
  }

  const renderHeaderItem = (item: any) => (
    <MonthlyBillHeader item={item} />
  )

  const renderContentItem = (item: IExpense) => (
    <MonthlyBillContent
      item={item}
      onPressApprove={onPressApprove}
      onPressCheckout={onPressCheckout}
      onPressDelete={onPressDelete}
      onPressEdit={onPressEdit}
    />
  )

  const onPressItem = (item: ItemModal) => {
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
        onPressItem={onPressItem}
        expanded={expanded}
        componentContent={renderContentItem(item)}
        componentHeader={renderHeaderItem(item)}
      />
    );
  };

  const renderList = () => {
    return (
      <CustomFlatList
        ref={flatListRef}
        onLoad={onLoad}
        ItemSeparatorComponent={itemSeparator}
        data={dataMonthlyBills.results}
        renderItem={renderItem}
        hasNext={dataMonthlyBills.next}
        pullToRefresh={true}
        loadMore={true}
        contentContainerStyle={styles.contentContainerList}
      />
    )
  }

  const renderBillList = () => {
    return (
      <View style={styles.container}>
        {dataMonthlyBills.results.length != 0 ? renderStickyBar() : null}
        {renderList()}
      </View>
    )
  }

  const renderCreateBtn = () => {
    return (
      <View style={styles.buttonContainer}>
        <CustomButton
          onPress={onPressCreate}
          text={translate('monthly_bill.create_new_bill')}
          iconLeft={ADD_PLUS}
          style={styles.button} />
      </View>
    );
  };

  return (
    <Container
      spaceBottom={true}
      isShowHeader={true}
      title={translate('monthly_bill.title')}>
      {renderSectionHeader()}
      {renderBillList()}
      {renderCreateBtn()}
    </Container>
  )
}

export default MonthlyBill
