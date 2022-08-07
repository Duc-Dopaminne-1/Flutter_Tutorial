import { useNavigation } from '@react-navigation/native';
import {
  deleteLeadClear,
  deleteLeadHandle,
  getLeadListClear,
  getLeadListHandle,
  getLeadStatusSummaryHandle
} from '../../../redux/actions/lead';
import { getShowAlertError } from '../../../redux/actions/system';
import { ICEmpty } from '../../../assets/icons';
import {
  BodyText,
  CheckBox,
  Divider,
  ExpandView,
  FloatFooter,
  PrimaryButton,
  SubHead
} from '../../../components/';
import CommonTabHeader from '../../../components/common_tab_header';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR, TEXT_COLOR } from '../../../constants/colors';
import {
  CONFIRM_DELETE_LEAD,
  DELETE_LEAD_ERROR,
  DELETE_LEAD_SUCCESS
} from '../../../constants/errors';
import SCREENS_NAME from '../../../constants/screens';
import { SPACING } from '../../../constants/size';
import __ from 'lodash';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  useContext
} from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import { useDispatch, useSelector } from 'react-redux';
import { LIMIT_PAGE } from '../../../global/app';
import { LEAD_STATUS } from '../../../global/lead_status';
import { scale } from '../../../utils/responsive';
import LeadItem from '../components/lead_item';
import themeContext from '../../../constants/theme/themeContext';
import { emitEvent } from '../../../utils/eventEmit';
import { SDK_EVENT_NAME } from '../../../global/app';

const ListHeaderComponent = ({
  data,
  status,
  setChecked,
  title1,
  title2,
  title3,
  title4,
  processed
}) => {
  const checked01 = [...data].includes(status[0]);
  const checked02 = [...data].includes(status[1]);
  const checked03 = [...data].includes(status[2]);
  const checked04 = [...data].includes(status[3]);

  const onPress = (checked, value) => () => {
    if (checked && [...data].length === 1) {
      return;
    }

    const newdata = [...data];

    __.remove(newdata, o => o === value);

    setChecked(checked ? newdata : [...data, value]);
  };

  return (
    <View style={styles.listHeaderComponent}>
      <View style={styles.listContainer}>
        <View style={styles.listStatus}>
          <CheckBox
            translate
            label={title1}
            checked={checked01}
            style={styles.checkbox}
            onChange={onPress(checked01, status[0])}
          />
          <CheckBox
            translate
            label={title2}
            checked={checked02}
            style={{ flex: 1 }}
            onChange={onPress(checked02, status[1])}
          />
        </View>
        {processed ? (
          <View style={styles.listStatusProcessed}>
            <CheckBox
              translate
              label={title3}
              checked={checked03}
              style={styles.checkbox}
              onChange={onPress(checked03, status[2])}
            />
            <CheckBox
              translate
              label={title4}
              checked={checked04}
              style={{ flex: 1 }}
              onChange={onPress(checked04, status[3])}
            />
          </View>
        ) : null}
      </View>
    </View>
  );
};

const LeadList = props => {
  const { disableShadow } = props;
  const theme = useContext(themeContext);
  const { leadList } = useSelector(state => state.lead);
  const loading = useSelector(state => state.lead.loading);
  const memberId = useSelector(state => state.auth.memberId);
  const deleteLeadResult = useSelector(state => state.lead.deleteLeadResult);
  const totalCountLeadStatus = useSelector(state => state.lead.totalCountLeadStatus);
  const endList = useSelector(state => state.lead.endLeadList);
  const StatusTab = useMemo(
    () => [
      {
        id: 0,
        title: 'lead_status.new',
        count: `${totalCountLeadStatus?.new || 0}`,
        status: [LEAD_STATUS.ASSIGNED]
      },
      {
        id: 1,
        title: 'lead_status.in_progress',
        count: `${totalCountLeadStatus?.inprogress || 0}`,
        status: [LEAD_STATUS.INPROGRESS, LEAD_STATUS.ONHOLD]
      },
      {
        id: 2,
        title: 'lead_status.processed',
        count: `${totalCountLeadStatus?.processed || 0}`,
        status: [
          LEAD_STATUS.COMPLETED,
          LEAD_STATUS.CONVERTED,
          LEAD_STATUS.CANNOTCONTACT,
          LEAD_STATUS.NOTQUALIFIED
        ]
      }
    ],
    [totalCountLeadStatus]
  );

  const [isRefreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('');
  const [deleteMode, setDeleteMode] = useState(false);
  const [deleteList, setDeleteList] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [status, setStatus] = useState(StatusTab[0]?.status || []);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    onRefresh();
    dispatch(getLeadStatusSummaryHandle({ MemberId: memberId }));
    return () => {
      dispatch(getLeadListClear());
    };
  }, [dispatch, memberId, onRefresh]);

  useEffect(() => {
    const focusListener = navigation.addListener('focus', () => {
      dispatch(
        getLeadListHandle({
          memberId,
          skipCount: 0,
          filter,
          status: status?.join(';') || '',
          tabIndex
        })
      );
      dispatch(getLeadStatusSummaryHandle({ MemberId: memberId }));
    });

    return () => {
      focusListener();
    };
  }, [dispatch, memberId, navigation, filter, status, tabIndex]);

  useLayoutEffect(() => {
    navigation.setOptions({
      RightComponent: () => (
        <TouchableOpacity
          style={styles.rightHeader}
          onPress={() => {
            setDeleteMode(pre => !pre);
            setDeleteList([]);
          }}>
          <SubHead translate color={theme.app.primaryColor1}>
            {deleteMode ? 'common.cancel' : 'common.select'}
          </SubHead>
        </TouchableOpacity>
      ),
      disableShadow: typeof disableShadow != 'undefined' ? disableShadow : true
    });
  }, [dispatch, navigation, deleteMode]);

  // useEffect(() => {
  //   dispatch(
  //     getLeadListHandle({
  //       filter,
  //       memberId,
  //       skipCount: 0,
  //       status: status?.join(';') || ''
  //     })
  //   );
  //   dispatch(getLeadStatusSummaryHandle({ MemberId: memberId }));
  // }, [filter, memberId, dispatch, status]);

  useEffect(() => {
    setDeleteList(pre => pre.filter(t => leadList[tabIndex]?.find(i => i.id === t)));
  }, [leadList, tabIndex]);

  useEffect(() => {
    if (deleteLeadResult?.success) {
      dispatch(getShowAlertError(DELETE_LEAD_SUCCESS));
      deleteList?.forEach(lead => {
        emitEvent({ event_name: SDK_EVENT_NAME.LEAD_DELETE, data: { id: lead } });
      });
      onRefresh();
    } else if (deleteLeadResult?.error) {
      dispatch(getShowAlertError(DELETE_LEAD_ERROR));
    }
    dispatch(deleteLeadClear());
  }, [dispatch, deleteLeadResult, deleteList, onRefresh]);

  useEffect(() => {
    if (!loading && isRefreshing) {
      setRefreshing(false);
    }
  }, [loading, isRefreshing]);

  useEffect(() => {
    onRefresh();
  }, [tabIndex, onRefresh, status]);

  const loadMore = useCallback(() => {
    if (!loading && !endList) {
      dispatch(
        getLeadListHandle({
          memberId,
          skipCount: leadList[tabIndex]?.length,
          filter,
          status: status?.join(';') || '',
          tabIndex
        })
      );
    }
  }, [loading, endList, dispatch, memberId, leadList, tabIndex, filter, status]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(
      getLeadListHandle({
        memberId,
        skipCount: 0,
        filter,
        status: status?.join(';') || '',
        tabIndex: tabIndex
      })
    );
    dispatch(getLeadStatusSummaryHandle({ MemberId: memberId }));
  }, [dispatch, memberId, filter, status, tabIndex]);

  const onSearch = value => {
    setFilter(value);
  };

  const _check = value => {
    setStatus(value);
  };

  const changeTab = index => {
    setTabIndex(index);
    setStatus(StatusTab[index]?.status || []);
  };

  const onSelectAll = useCallback(
    checked => {
      checked ? setDeleteList(leadList?.[tabIndex]?.map(t => t.id)) : setDeleteList([]);
    },
    [leadList, tabIndex]
  );

  const onCheckItem = useCallback((checked, item) => {
    checked
      ? setDeleteList(pre => [...pre, item.id])
      : setDeleteList(pre => pre.filter(t => t !== item.id));
  }, []);

  const onCreate = () => {
    navigation.navigate(SCREENS_NAME.CREATE_OR_EDIT_LEAD_SCREEN);
  };

  const deleteLead = useCallback(() => {
    dispatch(deleteLeadHandle({ ids: deleteList }));
  }, [deleteList, dispatch]);

  const onDelete = useCallback(() => {
    dispatch(getShowAlertError({ ...CONFIRM_DELETE_LEAD, confirmAction: deleteLead }));
  }, [deleteLead, dispatch]);

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <LeadItem
          item={item}
          deleteMode={deleteMode}
          checked={deleteList.indexOf(item.id) > -1}
          onCheckItem={onCheckItem}
          route={props.route}
        />
      );
    },
    [deleteMode, onCheckItem, deleteList, props.route]
  );
  const renderItemSeparator = () => <Divider style={{ marginRight: -SPACING.Medium }} />;

  const keyExtractor = (item, index) => index + '';
  const ListFooterComponent = () =>
    loading && leadList[tabIndex]?.length > LIMIT_PAGE ? <ActivityIndicator /> : null;
  return (
    <SafeAreaView forceInset={{ bottom: 'never', top: 'never' }} style={styles.container}>
      <View style={styles.searchContainer}>
        {deleteMode ? (
          <View style={styles.deleteContainer}>
            <BodyText translate>{'common.select_all'}</BodyText>
            <CheckBox
              checked={deleteList?.length === leadList[tabIndex]?.length}
              style={{ marginLeft: 12 }}
              onChange={onSelectAll}
            />
          </View>
        ) : (
          // <SearchInput onSearch={onSearch} placeholder={'lead.enter_customer_name'} />
          <CommonTabHeader translate tabs={StatusTab} tabIndex={tabIndex} onPress={changeTab} />
        )}
      </View>
      <FlatList
        contentContainerStyle={styles.wrapper}
        data={leadList[tabIndex] || []}
        renderItem={renderItem}
        onEndReached={loadMore}
        refreshing={isRefreshing}
        onRefresh={onRefresh}
        keyExtractor={keyExtractor}
        onEndReachedThreshold={0.2}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={ListFooterComponent}
        ItemSeparatorComponent={renderItemSeparator}
        ListHeaderComponent={
          [1].includes(tabIndex) ? (
            <ListHeaderComponent
              data={status}
              setChecked={_check}
              tabIndex={tabIndex}
              title1="lead_status.in_progress"
              title2="lead_status.on_hold"
              status={StatusTab[tabIndex]?.status || []}
            />
          ) : [2].includes(tabIndex) ? (
            <ListHeaderComponent
              data={status}
              setChecked={_check}
              tabIndex={tabIndex}
              title1="lead_status.complete2"
              title2="lead_status.converted"
              title3="lead_status.not_contact"
              title4="lead_status.not_qualified"
              status={StatusTab[tabIndex]?.status || []}
              processed
            />
          ) : null
        }
        ListEmptyComponent={
          <View style={{ paddingTop: scale(50), alignItems: 'center' }}>
            <ICEmpty />
            <SubHead translate bold={false} color={CUSTOM_COLOR.ShuttleGray}>
              {'lead.no_potential_customers'}
            </SubHead>
          </View>
        }
      />
      <FloatFooter style={styles.floatAction}>
        {deleteMode ? (
          <PrimaryButton
            translate
            title={'lead.delete_lead'}
            onPress={onDelete}
            disabled={!(deleteList?.length > 0)}
          />
        ) : (
          <PrimaryButton translate title={'lead.create_lead'} onPress={onCreate} />
        )}
      </FloatFooter>
    </SafeAreaView>
  );
};

export default LeadList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: BACKGROUND_COLOR.Primary
  },
  wrapper: {
    backgroundColor: BACKGROUND_COLOR.Primary,
    paddingBottom: SPACING.HasBottomButton,
    paddingHorizontal: SPACING.Medium
  },
  floatAction: {
    backgroundColor: BACKGROUND_COLOR.Primary
  },
  searchContainer: {
    // paddingHorizontal: SPACING.Medium,
    // marginTop: SPACING.Medium,
    // height: scale(36)
  },
  deleteContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: SPACING.Medium,
    marginTop: SPACING.Medium
  },
  rightHeader: {},
  empty: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    marginTop: SPACING.Medium
  },
  listHeaderComponent: {
    marginBottom: SPACING.Normal
  },
  listStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.Normal
  },
  checkbox: {
    flex: 1,
    marginRight: SPACING.XXNormal
  },
  listStatusProcessed: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.Medium
  }
});
