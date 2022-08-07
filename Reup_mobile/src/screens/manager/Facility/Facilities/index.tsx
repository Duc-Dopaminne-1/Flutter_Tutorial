import Container from "@src/components/Container"
import React, { useRef, useState, useCallback, useEffect } from "react"
import translate from "@src/localize"
import CustomSectionHeader from "@src/components/CustomSection"
import { ICON_FACILITY, ADD_PLUS } from "@src/constants/icons"
import { CustomFlatList } from "@src/components/FlatList"
import { styles } from "@src/screens/manager/Facility/Facilities/styles"
import { CustomButton } from "@src/components/CustomButton"
import { View, KeyboardAvoidingView, Alert } from "react-native"
import NavigationActionsService from "@src/navigation/navigation"
import { FILTER, NEW_FACILITY, FACILITY_DETAIL } from "@src/constants/screenKeys"
import getStyles from "@src/utils/getStyles"
import { getKeyboardAdvoidStyle } from "@src/utils"
import SearchBar from "@src/components/SearchBar"
import { Theme } from "@src/components/Theme"
import { CustomTouchable } from "@src/components/CustomTouchable"
import RectangleAvatar from "@src/components/RectangleAvatar"
import { CustomText } from "@src/components/CustomText"
import { debounce } from "lodash"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@src/types/types"
import { IUserProfile } from "@reup/reup-api-sdk/libs/api/user/models"
import { QueryFacilityParams } from "@reup/reup-api-sdk/libs/api/company/facility"
import { IPagination } from "@reup/reup-api-sdk/libs/type"
import { IFacility } from "@reup/reup-api-sdk/libs/api/company/facility/models"
import { getListFacilities } from "@src/modules/FrontDesk/actions"

interface Props {
}

const Facilites = (props: Props) => {
  const dispatch = useDispatch();
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const listFacilities = useSelector<RootState, IPagination<IFacility>>((state: RootState) => state.frontDesk.listFacilities);

  const debounceLoadData = debounce((p: QueryFacilityParams) => {
    fetchData(1, p);
  }, 500);
  const [isLoadedData, setLoadedData] = useState(false);
  const [searchText, setSearchText] = useState<string>('');
  const flatList = useRef<any>(null);

  const [params, setParams] = useState<QueryFacilityParams>({
    search: '',
    country_id: '',
    property_id: '',
  })

  useEffect(() => {
    if (isLoadedData && me && me.default_company && me.default_company.id) {
      const p = {
        country_id: '',
        property_id: '',
        search: searchText
      }
      onReloadDataWithParams(p)
    }
  }, [me.default_company.id])

  useEffect(() => {
    if (isLoadedData) {
      const p = {
        ...params,
        search: searchText
      }
      if (flatList && flatList.current) {
        flatList.current.resetInitPage(1);
        flatList.current.scrollToTop();
      }
      debounceLoadData(p);
    }
  }, [searchText]);

  const onReloadDataWithParams = (p: QueryFacilityParams) => {
    setParams(p)
    if (flatList && flatList.current) {
      flatList.current.resetInitPage(1);
      flatList.current.scrollToTop();
    }
    setTimeout(() => {
      fetchData(1, p);
    }, 200)
  }

  const onPressAddNewFacility = () => {
    NavigationActionsService.push(NEW_FACILITY, { flatList });
  }

  const onLoad = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {
    fetchData(page, {
      ...params,
      search: searchText,
    }, onLoadSuccess, onLoadFailure)
  }

  const fetchData = (page: number, params: QueryFacilityParams, onLoadSuccess?: () => void, onLoadFailure?: () => void) => {
    const companyId = me.default_company.id ?? ''
    dispatch(getListFacilities({
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

  const onApplyFilter = (filter: any) => {
    if (filter) {
      const p: QueryFacilityParams = {
        search: searchText,
        country_id: filter.country ?? '',
        property_id: filter.building ?? ''
      }
      onReloadDataWithParams(p);
    }
  };

  const onPressFilter = () => {
    NavigationActionsService.push(FILTER, {
      onFilter: onApplyFilter,
    })
  }

  const onChangeText = (text: string) => {
    setSearchText(text)
  }

  const onPressDetailItem = (item: IFacility) => {
    NavigationActionsService.push(FACILITY_DETAIL, { facilityItem: item, flatList })
  }

  const renderItem = (item: IFacility) => {
    return (
      <CustomTouchable style={styles.facilityItem} onPress={() => onPressDetailItem(item)}>
        <RectangleAvatar
          height={34}
          width={52}
          avatar={item.thumbnail_url ? item.thumbnail_url : item.image_urls[0] ?? ''}
          styleImage={styles.image}
        />
        <CustomText
          style={styles.nameBuilding}
          text={item.name}
          numberOfLines={1}
          styleContainer={styles.containerNameBuilding} />
      </CustomTouchable>
    )
  }

  const _itemSeparator = () => {
    return (
      <View style={styles.lineContainer} />
    );
  }

  return (
    <Container isShowHeader={true} title={translate("facility.title_navigation")} spaceBottom>
      <KeyboardAvoidingView style={getStyles('flex-1')} keyboardVerticalOffset={getKeyboardAdvoidStyle()} behavior={'padding'}>
        <View style={styles.container}>
          <CustomSectionHeader
            style={styles.sectionHeader}
            title={translate("facility.title_section_header")}
            icon={ICON_FACILITY}
            isShowFilter={true}
            onPressFilter={onPressFilter}
          />
          <View style={styles.containerSearchFilterBar}>
            <SearchBar
              value={searchText}
              placeholder={translate("facility.search_placeholder")}
              onChangeText={onChangeText}
            />
          </View>
          <View style={styles.body}>
            <CustomFlatList
              ref={flatList}
              onLoad={onLoad}
              contentContainerStyle={styles.contentContainerFlatlist}
              data={listFacilities.results}
              hasNext={listFacilities.next !== null}
              loadMore
              pullToRefresh
              ItemSeparatorComponent={_itemSeparator}
              showViewEmpty={true}
              indicatorColor={Theme.building_system.indicator}
              renderItem={renderItem}
            />
          </View>
          <View style={styles.containerAddFaciliyBtn}>
            <CustomButton
              style={styles.addFacilityBtn}
              text={translate("facility.add_new_facility")}
              iconLeft={ADD_PLUS}
              onPress={onPressAddNewFacility}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Container>
  )
}

export default Facilites
