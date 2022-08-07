import moment from 'moment';
import React, {useReducer} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {GLOBAL_ACTIONS, TIME_OFFSET_IN_MINUTE} from '../../../assets/constants';
import {SIZES} from '../../../assets/constants/sizes';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {METRICS, normal, small} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import DatePickerSection from '../../../components/Button/DatePickerSection';
import DropdownWithTitle from '../../../components/DropdownWithTitle';
import Places from '../../../components/Place';
import RadioSelectionsView from '../../../components/RadioSelectionsView';
import RequiredLabel from '../../../components/RequiredLabel';
import {getDateBefore, stringToDate} from '../../../utils/TimerCommon';
import FooterButtons from '../../ManagePost/NewPost/NewPostComponents/FooterButtons';
import {NewPostStyles} from '../../ManagePost/NewPost/NewPostComponents/NewPostConstant';
import {REQUEST_FOR_SALE_TYPES} from '../constants';

const LIMIT_RANGE_DATE = 30;

const GENERAL_REQUEST_FILTER = {
  CHANGE_SERVICE_POST_TYPE: 'CHANGE_SERVICE_POST_TYPE',
};

function reducer(state, action) {
  switch (action.type) {
    case GLOBAL_ACTIONS.FIELD:
      return {...state, [action.fieldName]: action.payload};
    case GLOBAL_ACTIONS.CREATE_WORKING_AREA:
      return {
        ...state,
        placeJson: action.payload,
      };
    case GENERAL_REQUEST_FILTER.CHANGE_SERVICE_POST_TYPE:
      return {
        ...state,
        forSale: action?.payload?.forSale,
        servicePostTypes: action?.payload?.servicePostTypes,
      };
    case GLOBAL_ACTIONS.RESET:
      return {
        ...state,
        ...action.payload,
      };
  }
}

export const getInitialFilterState = () => {
  return {
    forSale: null,
    placeJson: null,
    propertyTypeJson: null,
    fromDate: getDateBefore(LIMIT_RANGE_DATE).toISOString(),
    toDate: new Date().toISOString(),
    servicePostTypes: REQUEST_FOR_SALE_TYPES,
    listPropertyType: null,
  };
};

const mapPropertyTypes = (json, propertyTypeJson = []) => {
  const listTypes = json?.edges;
  if (!listTypes || !Array.isArray(listTypes)) {
    return [];
  }

  return listTypes.map(item => {
    const hasProperty =
      propertyTypeJson &&
      propertyTypeJson?.length &&
      propertyTypeJson?.includes(item.propertyTypeId);
    return {
      id: item.propertyTypeId,
      name: item.propertyTypeDescription,
      checked: hasProperty,
      type: item.propertyTypeName,
    };
  });
};

const mapState = (searchCriteria, masterData) => {
  const listPropertyType = mapPropertyTypes(
    masterData?.propertyTypes,
    searchCriteria?.propertyTypeJson,
  );
  return {...getInitialFilterState(), ...searchCriteria, listPropertyType};
};

const Filter = ({
  searchCriteria = getInitialFilterState(),
  onPressApply = () => {},
  masterData,
}) => {
  const [filterState, dispatch] = useReducer(reducer, mapState(searchCriteria, masterData));

  const onPressReset = () => {
    const initialState = mapState({}, masterData);
    dispatch({type: GLOBAL_ACTIONS.RESET, payload: initialState});
  };

  const onChangeForSale = type => {
    const servicePostTypes = REQUEST_FOR_SALE_TYPES.map(e => {
      return {...e, checked: e?.id === type?.id ? true : false};
    });
    dispatch({
      type: GENERAL_REQUEST_FILTER.CHANGE_SERVICE_POST_TYPE,
      payload: {
        forSale: type?.value,
        servicePostTypes,
      },
    });
  };

  const onSelectTypeItem = selectedItems => {
    const typeIds = selectedItems?.map(item => item?.id);
    dispatch({type: GLOBAL_ACTIONS.FIELD, fieldName: 'propertyTypeJson', payload: typeIds});
  };

  const onRemoveTypeItem = selectedIds => {
    dispatch({type: GLOBAL_ACTIONS.FIELD, fieldName: 'propertyTypeJson', payload: selectedIds});
  };

  const onChangeFromDate = date => {
    if (moment(date).isSameOrBefore(filterState.toDate, 'day')) {
      dispatch({type: GLOBAL_ACTIONS.FIELD, fieldName: 'fromDate', payload: date.toISOString()});
    }
  };

  const onChangeToDate = date => {
    if (moment(date).isSameOrAfter(filterState.fromDate, 'day')) {
      dispatch({type: GLOBAL_ACTIONS.FIELD, fieldName: 'toDate', payload: date.toISOString()});
    }
  };

  const applyFilter = () => {
    onPressApply(filterState);
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.titleText}>{translate(STRINGS.FILTER)}</Text>
        <RadioSelectionsView
          onChosen={onChangeForSale}
          headerTitle={translate(STRINGS.TRANSACTION_TYPE)}
          headerStyle={styles.label}
          data={filterState?.servicePostTypes}
          allowUpdateData
        />
        <Text style={styles.label}>{translate('c2CGeneralRequest.form.propertyTypeTitle')}</Text>
        <DropdownWithTitle
          inputStyle={styles.dropdown}
          dropdownTitle={translate(STRINGS.ALL)}
          isSelectSingle={false}
          isRequiredAtLeastOne={true}
          items={filterState?.listPropertyType ?? []}
          onChosen={onSelectTypeItem}
          onRemoveItem={onRemoveTypeItem}
        />
        <Text style={styles.label}>{translate('c2CGeneralRequest.filter.createdTime')}</Text>
        <View style={styles.dateContainer}>
          <DatePickerSection
            customStyle={styles.datePicker}
            isShowLabel={false}
            placeHolder={translate(STRINGS.DATE_HOLDER)}
            isShowIcon
            maximumDate={stringToDate(filterState.toDate)}
            timeZoneOffsetInMinutes={TIME_OFFSET_IN_MINUTE.VN}
            value={filterState.fromDate}
            onChosen={onChangeFromDate}
          />
          <Text style={[styles.label, styles.toLabel]}>{translate(STRINGS.TO)}</Text>
          <DatePickerSection
            customStyle={styles.datePicker}
            isShowLabel={false}
            placeHolder={translate(STRINGS.DATE_HOLDER)}
            isShowIcon
            minimumDate={stringToDate(filterState.fromDate)}
            timeZoneOffsetInMinutes={TIME_OFFSET_IN_MINUTE.VN}
            value={filterState.toDate}
            onChosen={onChangeToDate}
          />
        </View>
        <RequiredLabel
          style={[METRICS.marginTop]}
          title={translate(STRINGS.AREA)}
          titleStyle={{...FONTS.bold, color: COLORS.TEXT_BLACK}}
          isRequired={false}
        />
        <Places
          place={filterState?.placeJson}
          dispatch={dispatch}
          onDuplicateCity={() => {}}
          inputStyle={commonStyles.dropdownInput}
        />
      </View>
      <View
        style={[commonStyles.footerContainer, NewPostStyles.borderTopWidth, METRICS.marginBottom]}>
        <FooterButtons
          nextButtonTitle={translate(STRINGS.APPLY)}
          onPressNext={applyFilter}
          onPressCancel={onPressReset}
          cancelButtonTitle={translate('common.reselect')}
          cancelTextStyle={commonStyles.blackTextBold14}
          cancelButtonStyle={NewPostStyles.backGrayNonBorder}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: SIZES.BORDER_RADIUS_16,
    ...METRICS.padding,
  },
  titleText: {
    ...FONTS.bold,
    fontSize: SIZES.FONT_24,
    flex: 1,
  },
  closeButton: {
    ...FONTS.bold,
    fontSize: SIZES.FONT_14,
    color: COLORS.PRIMARY_A100,
    textDecorationLine: 'none',
  },
  label: {
    ...FONTS.bold,
    fontSize: SIZES.FONT_14,
    color: COLORS.TEXT_BLACK,
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
  headerRadio: {marginBottom: small, marginTop: SIZES.MARGIN_32, color: COLORS.TEXT_BLACK},
});

export default Filter;
