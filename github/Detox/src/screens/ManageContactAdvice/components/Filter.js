import moment from 'moment';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {
  OffsetPagingOfRequestTypeDto,
  OffsetPagingOfSupportRequestStatusDto,
  useGetRequestTypesLazyQuery,
  useGetSupportRequestStatusesLazyQuery,
} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {TIME_OFFSET_IN_MINUTE} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {normal, small} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import BaseFilterScreen from '../../../components/BaseFilterScreen';
import DatePickerSection from '../../../components/Button/DatePickerSection';
import DropdownWithTitle from '../../../components/DropdownWithTitle';
import ArrayUtils from '../../../utils/ArrayUtils';
import {getDateBefore, stringToDate} from '../../../utils/TimerCommon';
import {useMount} from '../../commonHooks';
import {getDataByStatusName} from '../utils/getDataByStatusName';

const LIMIT_RANGE_DATE = 30;

export const getInitialFilterState = () => {
  return {
    statusIds: [],
    typeIds: [],
    fromDate: getDateBefore(LIMIT_RANGE_DATE).toISOString(),
    toDate: new Date().toISOString(),
  };
};

const Filter = ({state = getInitialFilterState(), setState, onPressApply}) => {
  const [statuses, setStatuses] = useState([]);
  const [types, setTypes] = useState([]);

  const {startApi: getStatuses} = useGraphqlApiLazy({
    graphqlApiLazy: useGetSupportRequestStatusesLazyQuery,
    queryOptions: {},
    dataField: 'supportRequestStatuses',
    onSuccess: (data: OffsetPagingOfSupportRequestStatusDto) => {
      const items = data.edges
        .map(item => ({
          id: item.supportRequestStatusId,
          key: item.supportRequestStatusName,
          name: getDataByStatusName(item.supportRequestStatusName).description,
          checked: state.statusIds.filter(id => id === item.supportRequestStatusId).length > 0,
        }))
        .filter(item => !!item.name);
      setStatuses(items);
    },
  });

  const {startApi: getTypes} = useGraphqlApiLazy({
    graphqlApiLazy: useGetRequestTypesLazyQuery,
    queryOptions: {},
    dataField: 'requestTypes',
    onSuccess: (data: OffsetPagingOfRequestTypeDto) => {
      const sortData = ArrayUtils.sortArrayAlphabet(data?.edges, 'requestTypeDescription');
      const items = sortData.map(item => ({
        id: item.requestTypeId,
        key: item.requestTypeName,
        name: item.requestTypeDescription,
        checked: state.typeIds.filter(id => id === item.requestTypeId).length > 0,
      }));
      setTypes(items);
    },
  });

  useMount(() => {
    getStatuses();
    getTypes({
      variables: {
        where: {
          requestTypeName_not_in: [
            'KeyKeeperAndHouseViewing',
            'VerificationPost',
            'AdvancedVerificationPost',
            'PostImprovementAndBasicVerification',
            'Certification',
            'ConsultingSupply',
            'ContactTrading',
          ],
        },
        orderBy: {
          sortOrder: 'DESC',
        },
      },
    });
  });

  const onPressReset = () => {
    const initialState = getInitialFilterState();
    setState(initialState);
    setStatuses(statuses.map(item => ({...item, checked: false})));
    setTypes(types.map(item => ({...item, checked: false})));
  };

  const onSelectStatusItem = selectedItems => {
    setState({...state, statusIds: selectedItems.map(item => item.id)});
  };

  const onRemoveStatusItem = selectedIds => {
    setState({...state, statusIds: selectedIds});
  };

  const onSelectTypeItem = selectedItems => {
    setState({...state, typeIds: selectedItems.map(item => item.id)});
  };

  const onRemoveTypeItem = selectedIds => {
    setState({...state, typeIds: selectedIds});
  };

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

  return (
    <BaseFilterScreen
      closeVisible={false}
      isLeftButtonVisible={false}
      closeStyle={styles.closeButton}
      customRightButtonStyle={styles.applyButton}
      onClearFilter={onPressReset}
      onConfirmed={onPressApply}>
      <Text style={styles.label}>{translate('contactAdvice.filter.type')}</Text>
      <DropdownWithTitle
        inputStyle={styles.dropdown}
        dropdownTitle={translate('contactAdvice.filter.typeSelect')}
        isSelectSingle={false}
        isRequiredAtLeastOne={false}
        items={types}
        onChosen={onSelectTypeItem}
        onRemoveItem={onRemoveTypeItem}
        showSearchBox={true}
      />
      <Text style={styles.label}>{translate('contactAdvice.filter.status')}</Text>
      <DropdownWithTitle
        inputStyle={styles.dropdown}
        dropdownTitle={translate('contactAdvice.filter.statusSelect')}
        isSelectSingle={false}
        isRequiredAtLeastOne={false}
        items={statuses}
        onChosen={onSelectStatusItem}
        onRemoveItem={onRemoveStatusItem}
      />
      <Text style={styles.label}>{translate('contactAdvice.filter.date')}</Text>
      <View style={styles.dateContainer}>
        <DatePickerSection
          customStyle={styles.datePicker}
          isShowLabel={false}
          placeHolder={translate(STRINGS.DATE_HOLDER)}
          isShowIcon
          maximumDate={stringToDate(state.toDate)}
          timeZoneOffsetInMinutes={TIME_OFFSET_IN_MINUTE.VN}
          value={state.fromDate}
          onChosen={onChangeFromDate}
        />
        <Text style={[styles.label, styles.toLabel]}>{translate(STRINGS.TO)}</Text>
        <DatePickerSection
          customStyle={styles.datePicker}
          isShowLabel={false}
          placeHolder={translate(STRINGS.DATE_HOLDER)}
          isShowIcon
          minimumDate={stringToDate(state.fromDate)}
          timeZoneOffsetInMinutes={TIME_OFFSET_IN_MINUTE.VN}
          value={state.toDate}
          onChosen={onChangeToDate}
        />
      </View>
      <View style={commonStyles.separatorRow16} />
    </BaseFilterScreen>
  );
};

export default Filter;

const styles = StyleSheet.create({
  closeButton: {
    ...FONTS.bold,
    fontSize: 14,
    color: COLORS.PRIMARY_A100,
    textDecorationLine: 'none',
  },
  label: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.TEXT_DARK_10,
    marginTop: normal,
  },
  toLabel: {
    margin: small,
  },
  dropdown: {
    ...commonStyles.dropdownInput,
  },
  dateContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  datePicker: {
    flex: 1,
  },
  applyButton: {
    backgroundColor: COLORS.PRIMARY_A100,
  },
});
