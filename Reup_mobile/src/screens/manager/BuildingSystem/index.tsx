import Container from "@src/components/Container"
import React, { useRef, useState, useCallback, useEffect } from "react"
import translate from "@src/localize"
import CustomSectionHeader from "@src/components/CustomSection"
import { ICON_BUILDING, ADD_PLUS } from "@src/constants/icons"
import { CustomFlatList } from "@src/components/FlatList"
import BuildingSystemItem from "@src/components/FlatListItem/BuildingSystemItem"
import { styles } from "@src/screens/manager/BuildingSystem/styles"
import { CustomButton } from "@src/components/CustomButton"
import { View, KeyboardAvoidingView, Alert } from "react-native"
import NavigationActionsService from "@src/navigation/navigation"
import { BUILDING_DETAIL, NEW_BUILDING, FILTER } from "@src/constants/screenKeys"
import getStyles from "@src/utils/getStyles"
import { getKeyboardAdvoidStyle } from "@src/utils"
import SearchBar from "@src/components/SearchBar"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@src/types/types"
import { IPagination } from "@reup/reup-api-sdk/libs/type"
import { IUserProfile } from "@reup/reup-api-sdk/libs/api/user/models"
import { getListProperty } from "@src/modules/Company/actions"
import { ICompanyProperty } from "@reup/reup-api-sdk/libs/api/company/property/model"
import { Theme } from "@src/components/Theme"
import { debounce } from "lodash"
import { QueryCompanyPropertyParams } from "@reup/reup-api-sdk/libs/api/company/property"

interface Props {
}

const BuildingSystem = (props: Props) => {

  const dispatch = useDispatch();
  const buildingList = useSelector<RootState, IPagination<ICompanyProperty>>((state: RootState) => state.company.listProperty);
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const flatListRef = useRef<any>(null)
  const [searchText, setSearchText] = useState<string>('');
  const debounceLoadData = debounce((p: QueryCompanyPropertyParams) => {
    onGetListProperty(p, 1)
  }, 500);
  const [isLoadedData, setLoadedData] = useState(false);

  const [params, setParams] = useState<QueryCompanyPropertyParams>({
    country_id: '',
    search: ''
  })

  useEffect(() => {
    if (isLoadedData && me && me.default_company && me.default_company.id) {
      const p = {
        country_id: '',
        search: searchText,
      }
      onReloadDataWithParams(p)
    }
  }, [me.default_company.id])

  useEffect(() => {
    if (isLoadedData) {
      const p = {
        ...params,
        search: searchText,
      }
      if (flatListRef && flatListRef.current) {
        flatListRef.current.resetInitPage(1);
        flatListRef.current.scrollToTop();
      }
      debounceLoadData(p);
    }
  }, [searchText])

  const onPressAddNewBuilding = () => {
    NavigationActionsService.push(NEW_BUILDING, { flatListRef })
  }

  const onLoad = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {
    onGetListProperty({ ...params, search: searchText }, page, onLoadSuccess, onLoadFailure)
  }

  const onReloadDataWithParams = (p: QueryCompanyPropertyParams) => {
    setParams(p)
    if (flatListRef && flatListRef.current) {
      flatListRef.current.resetInitPage(1);
      flatListRef.current.scrollToTop();
    }
    setTimeout(() => {
      onGetListProperty(p, 1);
    }, 200)
  }

  const onGetListProperty = (params: QueryCompanyPropertyParams, page: number, onLoadSuccess?: () => void, onLoadFailure?: () => void) => {
    if (me && me.default_company) {
      const companyId = me.default_company.id ?? ''
      dispatch(getListProperty({
        companyId,
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
  }

  const onApplyFilter = (filter: any) => {
    const p = {
      country_id: filter.country ?? '',
      search: searchText,
    }
    onReloadDataWithParams(p)
  }

  const onPressFilter = () => {
    NavigationActionsService.push(FILTER, {
      isBuilding: false,
      onFilter: onApplyFilter,
    })
  }

  const onChangeText = (text: string) => {
    setSearchText(text)
  }

  const renderItem = (item: ICompanyProperty) => {
    return (
      <BuildingSystemItem
        name={item.name ?? ''}
        image={item.image_urls[0]}
        iconNation={item.country.emoji ?? '🇻🇳'}
        nation={`${item.address ?? ''}${(item && item.state && item.state.name)
          ? `, ${item.state.name}` : ''
          }${item.country.name ? `, ${item.country.name}` : ''}`}
        onPress={() => { NavigationActionsService.push(BUILDING_DETAIL, { item, flatListRef }) }}
      />
    )
  }

  const _itemSeparator = () => {
    return (
      <View style={styles.lineContainer}>
      </View>
    );
  }

  return (
    <Container isShowHeader={true} spaceBottom={true} title={translate("building_system.title_header")}>
      <KeyboardAvoidingView style={getStyles('flex-1')} keyboardVerticalOffset={getKeyboardAdvoidStyle()} behavior={'padding'}>
        <View style={styles.container}>
          <CustomSectionHeader
            style={styles.sectionHeader}
            title={translate("building_system.title_section")}
            icon={ICON_BUILDING}
            isShowFilter={true}
            onPressFilter={onPressFilter}
          />
          <View style={styles.containerSearchFilterBar}>
            <SearchBar
              value={searchText}
              placeholder={translate("building_system.placeholder_search")}
              onChangeText={onChangeText}
            />
          </View>
          <View style={styles.body}>
            <CustomFlatList
              ref={flatListRef}
              onLoad={onLoad}
              contentContainerStyle={styles.contentContainerFlatlist}
              data={buildingList.results}
              hasNext={buildingList.next !== null}
              loadMore
              pullToRefresh
              ItemSeparatorComponent={_itemSeparator}
              indicatorColor={Theme.building_system.indicator}
              renderItem={renderItem}
            />
          </View>
          <View style={styles.containerAddBuildingBtn}>
            <CustomButton
              style={styles.addBuildingBtn}
              text={translate("building_system.text_add_building")}
              iconLeft={ADD_PLUS}
              textStyle={styles.textAddBuildingBtn}
              iconLeftStyle={styles.leftIcon}
              onPress={onPressAddNewBuilding}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Container>
  )
}

export default BuildingSystem
