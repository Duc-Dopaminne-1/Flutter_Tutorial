import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Image, KeyboardAvoidingView } from 'react-native';
import styles from './styles';

import Container from '@src/components/Container';

import CustomSectionHeader from '@src/components/CustomSection';

import NavigationActionsService from '@src/navigation/navigation';
import translate from '@src/localize';

import getStyles from '@src/utils/getStyles';
import { getKeyboardAdvoidStyle } from '@src/utils';

import { CustomFlatList } from '@src/components/FlatList';
import RecurringItem from '@src/components/FlatListItem/RecurringItem';
import { CustomButton } from '@src/components/CustomButton';

import { RECURRING_TASK_DETAIL, NEW_TASK, FILTER } from '@src/constants/screenKeys';
import LINE from '@res/icons/ForLeaseForSale/image-line-dot.png';
import { ICON_RECURRING_TASK, ADD_PLUS } from '@src/constants/icons';
import { useSelector, useDispatch } from 'react-redux';
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { ICompanyMaintenanceRecurringTask } from '@reup/reup-api-sdk/libs/api/company/maintenance/recurring-task/models';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { RootState } from '@src/types/types';
import { getListRecurringTask } from '@src/modules/Maintenance/actions';
import { QueryCompanyMaintenanceRecurringTaslParams } from '@reup/reup-api-sdk/libs/api/company/maintenance/recurring-task';
import SearchBar from '@src/components/SearchBar';
import { debounce } from 'lodash';
import { LimitLoadMore } from '@src/constants/vars';

enum Status {
  ALL = 'All Status',
  ACTIVE = 'Active',
  INACTIVE = 'Inactive'
}

const RecurringTask = () => {

  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!)
  const defaultCompanyId = me.default_company.id ?? ''
  const listRecurringTask = useSelector<RootState, IPagination<ICompanyMaintenanceRecurringTask>>((state: RootState) => state.maintenance.listRecurringTask)
  const dispatch = useDispatch()
  const flatList = useRef<any>(null)
  const [isLoadedData, setLoadedData] = useState(false);
  const [searchText, setSearchText] = useState<string>('');
  const debounceLoadData = debounce((p: QueryCompanyMaintenanceRecurringTaslParams) => {
    fetchData(1, p);
  }, 500);

  const [params, setParams] = useState<QueryCompanyMaintenanceRecurringTaslParams>({
    search: '',
    active: undefined,
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

  const onReloadDataWithParams = (p: QueryCompanyMaintenanceRecurringTaslParams) => {
    setParams(p)
    if (flatList && flatList.current) {
      flatList.current.resetInitPage(1);
      flatList.current.scrollToTop();
    }
    setTimeout(() => {
      fetchData(1, p);
    }, 200)
  }

  const fetchData = (page: number, params: QueryCompanyMaintenanceRecurringTaslParams, onLoadSuccess?: () => void, onLoadFailure?: () => void) => {
    if (defaultCompanyId) {
      dispatch(
        getListRecurringTask({
          companyId: defaultCompanyId,
          page: page,
          limit: LimitLoadMore,
          params: params,
          onFail: () => {
            setLoadedData(true)
            onLoadFailure && onLoadFailure()
          },
          onSuccess: () => {
            setLoadedData(true)
            onLoadSuccess && onLoadSuccess()
          }
        })
      )
    }
  }

  const onLoad = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {
    fetchData(page, {
      ...params,
      search: searchText,
    }, onLoadSuccess, onLoadFailure)
  };

  const _itemSeparator = () => {
    return (
      <View style={styles.lineContainer}>
        <Image resizeMode={'contain'} source={LINE} style={styles.line} />
      </View>
    );
  };

  const onRecurringItemPress = (item: ICompanyMaintenanceRecurringTask) => {
    NavigationActionsService.push(RECURRING_TASK_DETAIL, { item: item, ref: flatList });
  };

  const _renderItem = (item: ICompanyMaintenanceRecurringTask) => {
    return (
      <RecurringItem item={item} onPress={() => onRecurringItemPress(item)} />
    );
  };

  const onPressAddNewTask = () => {
    NavigationActionsService.push(NEW_TASK, { flatList });
  };

  const onApplyFilter = (filter: any) => {
    if (filter) {
      const p = {
        property_id: filter.building ?? '',
        country_id: filter.country ?? '',
        active: getStatus(filter.status ?? ''),
        search: searchText,
      }
      onReloadDataWithParams(p)
    }
  };

  const getStatus = (status: string) => {
    switch (status) {
      case Status.INACTIVE:
        return false
      case Status.ACTIVE:
        return true
      case Status.ALL:
        return undefined
      default:
        return undefined
    }
  }

  const onPressFilter = () => {
    NavigationActionsService.push(FILTER, {
      indexStatus: 0,
      isStatus: true,
      numberOfInput: 1,
      dataStatus: [
        { _key: Status.ALL, _value: translate('recurring_task.all_status') },
        { _key: Status.ACTIVE, _value: translate('recurring_task.active') },
        { _key: Status.INACTIVE, _value: translate('recurring_task.inactive') }
      ],
      onFilter: onApplyFilter
    });
  };

  const onChangeText = (text: string) => {
    setSearchText(text)
  };

  const renderSearchBar = () => {
    return (
      <View style={styles.containerSearchFilterBar}>
        <SearchBar
          value={searchText}
          placeholder={translate("recurring.placeholder_search")}
          onChangeText={onChangeText}
        />
      </View>
    );
  };

  return (
    <Container isShowHeader={true}
      title={translate('recurring.title_nav_bar')}
      spaceBottom={true}>
      <KeyboardAvoidingView
        style={getStyles('flex-1')}
        keyboardVerticalOffset={getKeyboardAdvoidStyle()}
        behavior={"padding"}>
        <View style={styles.container}>
          <CustomSectionHeader
            style={styles.sectionHeader}
            title={translate('recurring.title_section_list').toUpperCase()}
            icon={ICON_RECURRING_TASK}
            isShowFilter={true}
            onPressFilter={onPressFilter}
          />
          {renderSearchBar()}
          <View style={styles.listContainer}>
            <CustomFlatList
              ref={flatList}
              onLoad={onLoad}
              ItemSeparatorComponent={_itemSeparator}
              data={listRecurringTask.results}
              renderItem={_renderItem}
              hasNext={listRecurringTask.next}
              pullToRefresh={true}
              loadMore={true}
              contentContainerStyle={{ flexGrow: 1, }}
            />
          </View>
          <View style={styles.buttonContainer}>
            <CustomButton
              onPress={onPressAddNewTask}
              iconLeft={ADD_PLUS}
              text={translate('recurring.add_new_task').toUpperCase()}
              style={styles.button} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default React.memo(RecurringTask);
