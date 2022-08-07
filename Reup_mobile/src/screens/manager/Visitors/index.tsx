import styles from './styles';
import Container from '@src/components/Container';
import React, { useState, useEffect, useRef } from 'react';
import { View, Image, Alert, KeyboardAvoidingView } from 'react-native';
import translate from '@src/localize';
import { VISITOR, ADD_PLUS } from '@src/constants/icons';
import LINE from '@res/icons/ForLeaseForSale/image-line-dot.png';
import { CustomFlatList } from '@src/components/FlatList';
import VisitorItem from '@src/components/FlatListItem/VisitorItem';
import CustomSectionHeader from '@src/components/CustomSection';
import NavigationActionsService from '@src/navigation/navigation';
import { FILTER, NEW_VISITOR } from '@src/constants/screenKeys';
import SearchBar from '@src/components/SearchBar';
import { CustomButton } from '@src/components/CustomButton';
import { debounce, lte } from 'lodash';
import { QueryVisitorRequest, CheckInOutData } from '@reup/reup-api-sdk/libs/api/frontdesk/visitor';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@src/types/types';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { getListVisitors, checkInOutVisitor } from '@src/modules/FrontDesk/actions';
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { IVisitor } from '@reup/reup-api-sdk/libs/api/frontdesk/visitor/model';
import { VisitorState } from '@reup/reup-api-sdk/libs/api/enum';
import getStyles from '@src/utils/getStyles';
import { getKeyboardAdvoidStyle } from '@src/utils';

const Visitors = () => {

  const dispatch = useDispatch();
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const listVisitor = useSelector<RootState, IPagination<IVisitor>>((state: RootState) => state.frontDesk.listVisitor);

  const [searchText, setSearchText] = useState<string>('');
  const [isLoadedData, setLoadedData] = useState(false);
  const flatList = useRef<any>(null);
  const debounceLoadData = debounce((p: QueryVisitorRequest) => { fetchData(1, p) }, 500);

  const [params, setParams] = useState<QueryVisitorRequest>({
    country_id: '',
    property_id: '',
    unit_id: '',
    search: '',
  })

  useEffect(() => {
    if (isLoadedData && me && me.default_company && me.default_company.id) {
      const p = {
        country_id: '',
        property_id: '',
        unit_id: '',
        search: searchText
      }
      onReloadDataWithParams(p);
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
  }, [searchText])

  const onReloadDataWithParams = (p: QueryVisitorRequest) => {
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
      ...params,
      search: searchText
    }, onLoadSuccess, onLoadFailure)
  };

  const fetchData = (page: number, params?: QueryVisitorRequest, onLoadSuccess?: () => void, onLoadFailure?: () => void) => {
    const companyId = me.default_company.id ?? ''
    dispatch(getListVisitors({
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

  const _itemSeparator = () => {
    return (
      <View style={styles.lineContainer}>
        <Image source={LINE} style={styles.line} />
      </View>
    );
  };

  const onChangeSearchText = (text: string) => {
    setSearchText(text)
  }

  const onApplyFilter = (filter: any) => {
    if (filter) {
      const p: QueryVisitorRequest = {
        search: searchText,
        country_id: filter.country ?? '',
        property_id: filter.building ?? ''
      }
      onReloadDataWithParams(p);
    }
  };

  const onPressFilter = () => {
    NavigationActionsService.push(FILTER, {
      numberOfInput: 0,
      onFilter: onApplyFilter
    });
  };

  const onPressChangeStatus = (item: IVisitor) => {
    NavigationActionsService.showLoading();
    const companyId = me.default_company.id ?? ''
    let state = '';
    switch (item.state) {
      case VisitorState.Draft:
        state = VisitorState.Arrived;
        break;
      case VisitorState.Arrived:
        state = VisitorState.Left
        break;
    }
    const checkInOutParams: CheckInOutData = {
      state: state,
      note: item.note
    }
    dispatch(checkInOutVisitor({
      companyId,
      id: item && item.id,
      params: checkInOutParams,
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
  }

  const onPressInformVisitor = () => {
    NavigationActionsService.push(NEW_VISITOR, { flatList });
  }

  const _renderItem = (item: IVisitor) => {
    return <VisitorItem item={item} onPress={onPressChangeStatus} />;
  };

  const renderHeaderView = () => {
    return (
      <>
        <CustomSectionHeader
          style={styles.sectionHeader}
          title={translate('visitor_list.visitor_title')}
          icon={VISITOR}
          isShowFilter={true}
          onPressFilter={onPressFilter}
        />
        <View style={styles.searchSection}>
          <SearchBar
            value={searchText}
            placeholder={translate('visitor_list.search')}
            onChangeText={onChangeSearchText}
          />
        </View>
      </>
    )
  }

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
        contentContainerStyle={{ flexGrow: 1 }}
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
      title={translate('visitor_list.navigation_title')}
      spaceBottom
    >
      <KeyboardAvoidingView style={getStyles('flex-1')} keyboardVerticalOffset={getKeyboardAdvoidStyle()} behavior={'padding'}>
        {renderHeaderView()}

        {renderContentView()}

        {renderBottomView()}

      </KeyboardAvoidingView>
    </Container>
  );
};

export default Visitors;
