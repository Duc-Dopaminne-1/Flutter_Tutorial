import styles from './styles';
import Container from '@src/components/Container';
import React, { useState, useEffect, useRef } from 'react';
import { View, Image, Alert, KeyboardAvoidingView } from 'react-native';
import translate from '@src/localize';
import { VISITOR, ADD_PLUS } from '@src/constants/icons';
import LINE from '@res/icons/ForLeaseForSale/image-line-dot.png';
import { CustomFlatList } from '@src/components/FlatList';
import CustomSectionHeader from '@src/components/CustomSection';
import NavigationActionsService from '@src/navigation/navigation';
import { FILTER, NEW_VISITOR_TENANT, FILTER_TENANT } from '@src/constants/screenKeys';
import { CustomButton } from '@src/components/CustomButton';
import { QueryVisitorRequest } from '@reup/reup-api-sdk/libs/api/frontdesk/visitor';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@src/types/types';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { getListVisitors } from '@src/modules/FrontDesk/actions';
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { IVisitor } from '@reup/reup-api-sdk/libs/api/frontdesk/visitor/model';
import getStyles from '@src/utils/getStyles';
import { getKeyboardAdvoidStyle, upperCaseFirstChar } from '@src/utils';
import MyVisitorTenantItem from '@src/components/FlatListItem/MyVisitorTenantItem';
import { ResidentQueryVisitorParams } from '@reup/reup-api-sdk/libs/api/resident/frontdesk';
import { VisitorState } from '@reup/reup-api-sdk/libs/api/enum';
import { debounce } from "lodash"
import { SearchParam } from "@reup/reup-api-sdk/libs/api/resident/frontdesk"
import SearchBar from "@src/components/SearchBar"

const VisitorsTenant = () => {

  const dispatch = useDispatch();
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const listVisitor = useSelector<RootState, IPagination<IVisitor>>((state: RootState) => state.frontDesk.listVisitor);

  const flatList = useRef<any>(null);

  const [isLoadedData, setLoadedData] = useState(false);
  const [searchText, setSearchText] = useState<string>('');
  const [params, setParams] = useState<ResidentQueryVisitorParams>({
    state: '',
    unit_id: '',
  })
  const debounceLoadData = debounce((p: SearchParam) => {
    fetchData(1, p);
  }, 500);


  useEffect(() => {
    if (isLoadedData && me && me.default_property) {
      const p = {
        unit_id: '',
        state: ''
      }
      onReloadDataWithParams(p);
    }
  }, [me.default_property])

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

  const dataState = [
    { _key: '', _value: 'Please Choose' },
    { _key: VisitorState.Draft, _value: upperCaseFirstChar(VisitorState.Draft.valueOf()) },
    { _key: VisitorState.Arrived, _value: upperCaseFirstChar(VisitorState.Arrived.valueOf()) },
    { _key: VisitorState.Left, _value: upperCaseFirstChar(VisitorState.Left.valueOf()) },

  ];


  const fetchData = (page: number, params?: ResidentQueryVisitorParams, onLoadSuccess?: () => void, onLoadFailure?: () => void) => {
    const propertyId = me.default_property ?? ''
    dispatch(getListVisitors({
      id: propertyId,
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

  const onReloadDataWithParams = (p: ResidentQueryVisitorParams) => {
    setParams(p)
    if (flatList && flatList.current) {
      flatList.current.resetInitPage(1);
      flatList.current.scrollToTop();
    }
    setTimeout(() => {
      fetchData(1, p);
    }, 200)
  }

  const onLoad = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {
    fetchData(page, {
      ...params
    }, onLoadSuccess, onLoadFailure)
  };

  const onChangeText = (text: string) => {
    setSearchText(text)
  }

  const onApplyFilter = (filter: any) => {
    if (filter) {
      const p: ResidentQueryVisitorParams = {
        state: filter.status ?? ''
      }
      onReloadDataWithParams(p);
    }
  };

  const onPressFilter = () => {
    NavigationActionsService.push(FILTER_TENANT, {
      numberOfInput: 1,
      isStatus: true,
      indexStatus: 0,
      isBuilding: false,
      isCountry: false,
      dataStatus: dataState,
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

  const onPressInformVisitor = () => {
    NavigationActionsService.push(NEW_VISITOR_TENANT, { flatList });
  }

  const _renderItem = (item: IVisitor) => {
    return <MyVisitorTenantItem item={item} />;
  };

  const renderHeaderView = () => {
    return (
      <>
        <CustomSectionHeader
          style={styles.sectionHeader}
          title={translate('visitor_list.my_visitor_section_title')}
          icon={VISITOR}
          isShowFilter={true}
          onPressFilter={onPressFilter}
        />
      </>
    )
  }

  const renderSearchView = () => (
    <View style={styles.containerSearchFilterBar}>
      <SearchBar
        value={searchText}
        placeholder={translate("visitor_list.search")}
        onChangeText={onChangeText}
      />
    </View>
  )

  const renderContentView = () => (
    <View style={styles.listContainer}>
      <CustomFlatList
        ref={flatList}
        onLoad={onLoad}
        ItemSeparatorComponent={_itemSeparator}
        data={listVisitor.results}
        renderItem={_renderItem}
        hasNext={listVisitor.next}
        loadMore
        pullToRefresh
        contentContainerStyle={styles.contentContainerStyle}
      />
    </View>
  )

  const renderBottomView = () => (
    <View style={styles.containerInformBtn}>
      <CustomButton
        style={styles.informVisitorBtn}
        text={translate("visitor_list.inform_button")}
        iconLeft={ADD_PLUS}
        onPress={onPressInformVisitor}
      />
    </View>
  )

  return (
    <Container
      isShowHeader={true}
      title={translate('visitor_list.my_visitor_navigation_title')}
      spaceBottom={true}
    >
      <KeyboardAvoidingView style={getStyles('flex-1')} keyboardVerticalOffset={getKeyboardAdvoidStyle()} behavior={'padding'}>
        {renderHeaderView()}

        {renderSearchView()}

        {renderContentView()}

        {renderBottomView()}

      </KeyboardAvoidingView>
    </Container>
  );
};

export default VisitorsTenant;
