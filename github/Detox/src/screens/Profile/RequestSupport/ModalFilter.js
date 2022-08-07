import moment from 'moment';
import React, {forwardRef, useState} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

import {
  useGetsupportServiceTicketStatusesLazyQuery,
  useGetSupportServiceTypesForFrontOfficeLazyQuery,
} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {TIME_OFFSET_IN_MINUTE} from '../../../assets/constants';
import {SIZES} from '../../../assets/constants/sizes';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {normal, small} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import CustomButton from '../../../components/Button/CustomButton';
import DatePickerSection from '../../../components/Button/DatePickerSection';
import DropdownWithTitle from '../../../components/DropdownWithTitle';
import ModalWithModalize from '../../../components/Modal/ModalWithModalize';
import ArrayUtils from '../../../utils/ArrayUtils';
import {getDateAfterByDate, stringToDate} from '../../../utils/TimerCommon';
import {useMount} from '../../commonHooks';

const styles = StyleSheet.create({
  title: {fontSize: 24, ...FONTS.bold},
  headerRadio: {marginBottom: small, marginTop: 32, color: COLORS.TEXT_DARK_10},
  btnApply: {
    height: 50,
    borderRadius: small,
    flex: 1,
    marginLeft: normal,
    backgroundColor: COLORS.PRIMARY_A100,
  },
  btnReset: {height: 50, borderRadius: small, flex: 1, backgroundColor: COLORS.GRAY_BD},
  viewBottom: {flexDirection: 'row', marginVertical: normal},
  inputDropdown: {borderWidth: SIZES.BORDER_WIDTH_1, borderColor: COLORS.GRAY_ED},
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

const mapDropdownOptions = (options, selectedItems) => {
  if (ArrayUtils.hasArrayData(selectedItems)) {
    return options?.map(e => ({...e, checked: selectedItems?.includes(e?.id)}));
  }
  if (selectedItems) {
    const selectedId = selectedItems;
    return options?.map(e => ({...e, checked: e?.id === selectedId}));
  }
  return options?.map(e => ({...e, checked: false}));
};

const ModalFilterListSupportRequest = forwardRef(
  ({applyFilterList, isRequest, initState, filterData}, ref) => {
    const [filterState, setFilterState] = useState(filterData);
    const [statuses, setStatuses] = useState([]);
    const [types, setTypes] = useState([]);

    const {startApi: getStatuses} = useGraphqlApiLazy({
      graphqlApiLazy: useGetsupportServiceTicketStatusesLazyQuery,
      queryOptions: {},
      dataField: 'supportServiceTicketStatuses',
      onSuccess: data => {
        const items = data.edges.map(item => ({
          id: item.supportServiceTicketStatusId,
          key: item.supportServiceTicketStatusName,
          name: item.supportServiceTicketStatusDescription,
        }));
        setStatuses(items);
      },
    });

    const {startApi: getTypes} = useGraphqlApiLazy({
      graphqlApiLazy: useGetSupportServiceTypesForFrontOfficeLazyQuery,
      queryOptions: {},
      dataField: 'getSupportServiceTypesForFrontOffice',
      onSuccess: data => {
        const items = data.requestTypes.map(item => ({
          id: item.requestTypeId,
          key: item.requestTypeName,
          name: item.requestTypeDescription,
        }));
        setTypes(items);
      },
    });

    const onChangeFilter = (key, value) => {
      setFilterState({...filterState, [key]: value});
    };
    const applyFilter = () => {
      applyFilterList(filterState);
      ref.current.close();
    };

    const onReset = () => {
      setFilterState(initState);
    };

    useMount(() => {
      getStatuses();
      getTypes();
    });

    const onChooseStatus = value => {
      const statusChoose = value?.map(e => e.id);
      onChangeFilter('ticketStatusId', statusChoose);
    };

    const onRemoveStatus = values => {
      const statusChoose = values?.map(e => e.id);
      onChangeFilter('ticketStatusId', statusChoose);
    };

    const onChooseType = value => {
      onChangeFilter('supportServiceId', value?.id);
    };

    const onChangeFromDate = date => {
      if (moment(date).isSameOrBefore(filterState.appointmentDatetime_lte, 'day')) {
        onChangeFilter('appointmentDatetime_gte', date.toISOString());
      }
    };

    const onChangeToDate = date => {
      if (moment(date).isSameOrAfter(filterState.appointmentDatetime_gte, 'day')) {
        onChangeFilter('appointmentDatetime_lte', date.toISOString());
      }
    };

    return (
      <ModalWithModalize withReactModal={Platform.OS === 'ios'} getModalRef={ref}>
        <View style={{padding: normal}}>
          <Text style={styles.title}>{translate('social.modalSort.filter')}</Text>
          <Text style={styles.label}>{translate(STRINGS.STATUS)}</Text>
          <DropdownWithTitle
            inputStyle={styles.dropdown}
            popupTitle={translate(STRINGS.STATUS)}
            dropdownTitle={translate(STRINGS.ALL)}
            items={mapDropdownOptions(statuses, filterState?.ticketStatusId)}
            isSelectSingle={false}
            isHavingAll={false}
            onRemoveItem={onRemoveStatus}
            onChosen={e => onChooseStatus(e)}
          />
          <Text style={styles.label}>{translate('supportRequest.modalFilter.type')}</Text>
          <DropdownWithTitle
            inputStyle={styles.dropdown}
            dropdownTitle={translate('supportRequest.modalFilter.placeHolder')}
            isSelectSingle={true}
            isRequiredAtLeastOne={false}
            items={mapDropdownOptions(types, filterState?.supportServiceId)}
            onChosen={e => onChooseType(e)}
          />
          <Text style={styles.label}>
            {isRequest
              ? translate('supportRequest.sendDate')
              : translate('supportRequest.receivedDate')}
          </Text>
          <View style={styles.dateContainer}>
            <DatePickerSection
              customStyle={styles.datePicker}
              isShowLabel={false}
              placeHolder={translate(STRINGS.DATE_HOLDER)}
              isShowIcon
              maximumDate={stringToDate(filterState.appointmentDatetime_lte)}
              timeZoneOffsetInMinutes={TIME_OFFSET_IN_MINUTE.VN}
              value={filterState.appointmentDatetime_gte}
              onChosen={onChangeFromDate}
            />
            <Text style={[styles.label, styles.toLabel]}>-</Text>
            <DatePickerSection
              customStyle={styles.datePicker}
              isShowLabel={false}
              placeHolder={translate(STRINGS.DATE_HOLDER)}
              isShowIcon
              minimumDate={stringToDate(filterState.appointmentDatetime_gte)}
              maximumDate={getDateAfterByDate(filterState.appointmentDatetime_gte, 365)}
              timeZoneOffsetInMinutes={TIME_OFFSET_IN_MINUTE.VN}
              value={filterState.appointmentDatetime_lte}
              onChosen={onChangeToDate}
            />
          </View>
          <View style={styles.viewBottom}>
            <CustomButton
              style={styles.btnReset}
              title={translate('social.modalSort.reset')}
              onPress={onReset}
            />
            <CustomButton
              style={styles.btnApply}
              onPress={applyFilter}
              title={translate('social.modalSort.apply')}
            />
          </View>
        </View>
      </ModalWithModalize>
    );
  },
);

export default ModalFilterListSupportRequest;
