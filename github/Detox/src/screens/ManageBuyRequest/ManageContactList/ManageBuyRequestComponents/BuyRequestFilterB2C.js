import findIndex from 'lodash/findIndex';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {
  useContactTradingB2CStatusesLazyQuery,
  useGetProjectAssigneeForContactTradingB2CLazyQuery,
} from '../../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../../api/graphql/useGraphqlApiLazy';
import {BUY_REQUEST_TYPE, TIME_OFFSET_IN_MINUTE} from '../../../../assets/constants';
import {SIZES} from '../../../../assets/constants/sizes';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {HELPERS} from '../../../../assets/theme/helpers';
import {medium, METRICS} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import BaseFilterScreen from '../../../../components/BaseFilterScreen';
import DatePickerSection from '../../../../components/Button/DatePickerSection';
import CheckboxList from '../../../../components/Checkbox/CheckboxList';
import DropdownWithTitle from '../../../../components/DropdownWithTitle';
import {SCREEN_SIZE} from '../../../../utils/ImageUtil';
import {stringToDate} from '../../../../utils/TimerCommon';
import {useMount} from '../../../commonHooks';
import BuyRequestUtil from '../../BuyRequestUtil';

const styles = StyleSheet.create({
  sectionText: {
    ...METRICS.marginTop,
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.BRAND_GREY,
  },
  titleText: {
    ...METRICS.mediumPlusMarginTop,
    fontSize: 14,
    flex: 1,
    marginEnd: medium,
  },
  contextStyle: {
    borderRadius: SIZES.BORDER_RADIUS_10,
  },
  textClearFilter: {
    ...METRICS.mediumPlusMarginTop,
    color: COLORS.PRIMARY_A100,
    fontSize: 14,
    textDecorationLine: 'none',
  },
  textToStyle: {
    ...FONTS.fontSize14,
    textAlign: 'center',
  },
  containerTo: {
    flex: 1 / 7,
    justifyContent: 'center',
    ...METRICS.tinyMarginTop,
  },
  footerButton: {
    marginBottom: 0,
  },
  sectionCheckBox: {flexWrap: 'wrap', flexDirection: 'row'},
  itemStyle: {width: SCREEN_SIZE.WIDTH / 2 - 32, marginVertical: 4},
  timeContainer: {
    ...HELPERS.row,
    ...METRICS.smallMarginBottom,
    width: '100%',
  },
  timeItem: {
    flex: 3 / 7,
  },
});

export const commonCheckBoxStyle = {
  style: HELPERS.fill,
  textStyle: {
    ...FONTS.fontSize14,
  },
};

const SearchProjectDropdown = ({filterData, state, onChosen}) => {
  const [listProjectAssignee, setProjectAssignee] = useState([]);
  const onSuccessGetProjectAssignee = response => {
    const projectTemp = response?.edges.map(item => ({
      id: item.projectId,
      name: item.projectName,
      description: item.projectName,
      checked: item?.projectId === filterData?.projectSelect?.id ? true : false,
    }));
    setProjectAssignee(projectTemp);
  };

  const {startApi: getProjectFilter} = useGraphqlApiLazy({
    graphqlApiLazy: useGetProjectAssigneeForContactTradingB2CLazyQuery,
    dataField: 'getProjectAssigneeForContactTradingB2C',
    onSuccess: onSuccessGetProjectAssignee,
  });

  const [textSearch, setTextSearch] = useState('');

  const onChangeText = e => {
    setTextSearch(e);
  };

  useEffect(() => {
    getProjectFilter({
      variables: {
        keyWords: textSearch,
        pageSize: 10,
        page: 1,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textSearch]);

  return (
    <DropdownWithTitle
      inputStyle={{...commonStyles.inputBorderStyle}}
      title={translate(STRINGS.PROJECT)}
      dropdownTitle={translate(STRINGS.SELECT_PROJECT)}
      popupTitle={translate(STRINGS.PROJECT)}
      items={listProjectAssignee}
      onChosen={onChosen}
      isSelectSingle={true}
      isHaveAll={true}
      emptyText={translate(STRINGS.DO_NOT_HAVE_DATA)}
      value={state?.projectSelect?.name || false}
      showSearchBox={false}
      canSearchServer={true}
      onChangeText={onChangeText}
    />
  );
};

const BuyRequestFilterB2C = ({filterData, onClose, onConfirmed, type = BUY_REQUEST_TYPE.SENT}) => {
  const [state, setState] = useState(filterData);
  const [listStatusContactTrading, setListStatusContactTrading] = useState([]);

  const {startApi: getContactTradingB2CStatuses} = useGraphqlApiLazy({
    graphqlApiLazy: useContactTradingB2CStatusesLazyQuery,
    dataField: 'contactTradingB2CStatuses',
    onSuccess: e => {
      setListStatusContactTrading(e?.edges);
    },
  });

  useMount(() => {
    getContactTradingB2CStatuses();
  });

  const onChangeFromDate = date => {
    if (moment(date).isSameOrBefore(state.toDate, 'day')) {
      setState({...state, fromDate: date.toISOString()});
    }
  };

  const onChangeToDate = date => {
    if (moment(date).isSameOrAfter(state.fromDate, 'day')) {
      setState({...state, toDate: date.toISOString()});
    }
  };

  const onSelectStatusFilterB2C = (item, isSelect) => {
    let changedItems = [...state?.propertyTypeJson];
    if (isSelect) {
      changedItems = [...changedItems, item];
    } else {
      const index = findIndex(changedItems, {id: item.id});
      changedItems.splice(index, 1);
    }
    setState({...state, propertyTypeJson: changedItems});
  };

  const onClearFilter = () => {
    const resetFilterData = BuyRequestUtil.getInitialFilterUIB2C();
    setState(resetFilterData);
  };

  const RenderFilterBox = () => {
    const propertyTypes = listStatusContactTrading.map(item => ({
      id: item.contactTradingB2CStatusId,
      name: item.contactTradingB2CStatusName,
      description: item.contactTradingB2CStatusDescription,
    }));
    return (
      <>
        <CheckboxList
          title={translate(STRINGS.STATUS)}
          titleStyle={{...FONTS.regular, color: COLORS.BRAND_GREY}}
          selectedItems={state.propertyTypeJson}
          items={propertyTypes}
          onSelect={onSelectStatusFilterB2C}
          listStyle={styles.sectionCheckBox}
          itemStyle={styles.itemStyle}
        />
        <SearchProjectDropdown
          state={state}
          onChosen={e => setState({...state, projectSelect: e})}
          filterData={filterData}
        />
      </>
    );
  };
  return (
    <BaseFilterScreen
      contextStyle={styles.contextStyle}
      closeStyle={styles.textClearFilter}
      isLeftButtonVisible={false}
      closeVisible={false}
      onClose={onClose}
      titleStyle={styles.titleText}
      onConfirmed={() => onConfirmed({...state})}
      rightButtonText={translate(STRINGS.APPLY)}
      bottomButtonsStyle={styles.footerButton}
      onClearFilter={onClearFilter}>
      <RenderFilterBox />
      <Text style={styles.sectionText}>
        {translate(
          type === BUY_REQUEST_TYPE.SENT ? STRINGS.CREATE_REQUEST_DATE : STRINGS.UPDATED_DATE,
        )}
      </Text>
      <View style={styles.timeContainer}>
        <View style={styles.timeItem}>
          <DatePickerSection
            isShowLabel={false}
            isShowIcon={true}
            value={state.fromDate}
            onChosen={onChangeFromDate}
            maximumDate={stringToDate(state.toDate)}
            placeholder={translate(STRINGS.DATE_HOLDER)}
            timeZoneOffsetInMinutes={TIME_OFFSET_IN_MINUTE.VN}
          />
        </View>
        <View style={styles.containerTo}>
          <Text style={styles.textToStyle}>{translate(STRINGS.TO)}</Text>
        </View>
        <View style={styles.timeItem}>
          <DatePickerSection
            isShowLabel={false}
            isShowIcon={true}
            value={state.toDate}
            minimumDate={stringToDate(state.fromDate)}
            onChosen={onChangeToDate}
            placeholder={translate(STRINGS.DATE_HOLDER)}
            timeZoneOffsetInMinutes={TIME_OFFSET_IN_MINUTE.VN}
          />
        </View>
      </View>
    </BaseFilterScreen>
  );
};

export default React.memo(BuyRequestFilterB2C);
