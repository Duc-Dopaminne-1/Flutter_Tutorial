import PropTypes from 'prop-types';
import React, {forwardRef, useState} from 'react';
import {Dimensions, Platform, StyleSheet, Text, View} from 'react-native';

import {
  GetStaffGroupsQueryVariables,
  useGetStaffGroupsLazyQuery,
} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../../assets/constants';
import {SIZES} from '../../../assets/constants/sizes';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {medium, normal} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import CustomButton from '../../../components/Button/CustomButton';
import DropdownCities from '../../../components/DropdownCities';
import DropdownDistricts from '../../../components/DropdownDistricts';
import DropdownWithTitle from '../../../components/DropdownWithTitle';
import ModalWithModalize from '../../../components/Modal/ModalWithModalize';
import {mapStaffGroups} from '../../../utils/DataProcessUtil';
import {SCREEN_SIZE} from '../../../utils/ImageUtil';
import {useMount} from '../../commonHooks';

const NUMBER_COLUMNS = 4;
const ITEM_FLOOR_WIDTH = (SCREEN_SIZE.WIDTH - medium * 2 - normal) / NUMBER_COLUMNS;
const ITEM_FLOOR_HEIGHT = 100;
const MODAL_MAX_HEIGHT = Dimensions.get('screen').height * 0.2;

const styles = StyleSheet.create({
  itemTextFloor: {fontSize: 16},
  itemNumberFloor: {...FONTS.bold, fontSize: 25},
  itemFloor: {
    width: ITEM_FLOOR_WIDTH,
    height: ITEM_FLOOR_HEIGHT,
    borderRadius: 5,
    ...HELPERS.center,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.SEPARATOR_LINE,
    margin: 6,
  },
  titleStyle: {justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row'},
  textSelectFloor: {...FONTS.bold, fontSize: 25},
  textViewAll: {fontSize: 14, ...FONTS.regular, color: COLORS.PRIMARY_A100},
  textLimitSelect: {marginBottom: 16, marginTop: 24, ...FONTS.regular, fontSize: 16},
  borderBtn: {borderWidth: SIZES.BORDER_WIDTH_1, borderColor: COLORS.GRAY_ED},
  btnApplyButton: {
    ...commonStyles.buttonNext,
    paddingHorizontal: 50,
    minWidth: '43%',
    backgroundColor: COLORS.PRIMARY_A100,
  },
  btnClearFilter: {
    ...commonStyles.buttonNext,
    paddingHorizontal: 50,
    minWidth: '43%',
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.PRIMARY_A100,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: SCREEN_SIZE.WIDTH,
    height: 100,
    borderTopWidth: 1,
    borderColor: COLORS.GREY_F0,
    paddingTop: 16,
  },
  btnApplyText: {
    ...FONTS.bold,
  },
});

export const ModalFilterConsultant = forwardRef(
  ({applyFilterConsultant, hideFilterGroups = false}, ref) => {
    const [staffGroups, setStaffGroup] = useState([]);
    const [staffGroupsSelect, setStaffGroupSelect] = useState([]);
    const [selectedCity, setCitySelect] = useState([]);
    const [selectedDistricts, setSeletedDistricts] = useState([]);

    const onSuccessGetStaffGroup = staffGroup => {
      const groups = staffGroup?.edges;
      if (Array.isArray(groups)) {
        const list = groups.map((item, index) => mapStaffGroups(item, index));
        setStaffGroup(list);
      }
    };

    const {startApi: getStaffGroup} = useGraphqlApiLazy({
      graphqlApiLazy: useGetStaffGroupsLazyQuery,
      queryOptions: {...FETCH_POLICY.CACHE_AND_NETWORK},
      dataField: 'staffGroups',
      onSuccess: onSuccessGetStaffGroup,
    });

    const onChangeCity = city => {
      setSeletedDistricts([]);
      setCitySelect(city);
    };

    const onChangeDistrict = districts => {
      setSeletedDistricts(districts?.map(e => e?.id));
    };

    const fetchStaffGroup = () => {
      const variables: GetStaffGroupsQueryVariables = {
        page: 1,
        pageSize: 9999,
        where: {
          staffTypeId: '7e9692a6-959e-4ed3-8945-88dbf69a7006',
        },
      };
      getStaffGroup({variables});
    };

    useMount(() => {
      fetchStaffGroup();
    });

    const applyFilter = () => {
      const data = {
        staffGroupIds: staffGroupsSelect,
      };
      if (selectedCity.id) {
        if (selectedDistricts.length > 0) {
          data.places = [
            {
              CityId: selectedCity.id,
              DistrictIds: selectedDistricts,
            },
          ];
        } else {
          data.places = [
            {
              CityId: selectedCity.id,
            },
          ];
        }
      }
      applyFilterConsultant(data);
      ref.current.close();
    };

    const onChosenGroup = group => {
      if (group) {
        const groupIds = group.map(item => item.id);
        setStaffGroupSelect(groupIds);
      }
    };

    const resetFilter = () => {
      const data = {
        staffGroupIds: null,
        places: null,
      };
      ref.current.close();
      setCitySelect([]);
      applyFilterConsultant(data);
      setStaffGroupSelect([]);
      fetchStaffGroup();
    };

    return (
      <ModalWithModalize
        modalTopOffset={MODAL_MAX_HEIGHT}
        modalStyle={{backgroundColor: COLORS.BACKGROUND}}
        handlePosition="inside"
        HeaderComponent={
          <View style={{padding: normal}}>
            <View style={styles.titleStyle}>
              <Text style={styles.textSelectFloor}>{translate(STRINGS.FILTER)}</Text>
            </View>
          </View>
        }
        FooterComponent={
          <View style={styles.footerContainer}>
            <CustomButton
              style={styles.btnClearFilter}
              titleColor={COLORS.PRIMARY_A100}
              title={translate('project.filterConsultant.reselect')}
              onPress={resetFilter}
            />
            <View style={commonStyles.separatorColumn16} />
            <CustomButton
              style={styles.btnApplyButton}
              title={translate(STRINGS.APPLY)}
              titleStyle={styles.btnApplyText}
              onPress={applyFilter}
            />
          </View>
        }
        withReactModal={Platform.OS === 'ios'}
        getModalRef={ref}>
        <View style={{paddingHorizontal: normal}}>
          {hideFilterGroups ? null : (
            <>
              <DropdownWithTitle
                title={translate('project.filterConsultant.groupConsultant')}
                headerStyles={commonStyles.blackTextBold14}
                inputStyle={styles.borderBtn}
                style={HELPERS.fill}
                showSearchBox
                isRequiredAtLeastOne={false}
                isSelectSingle={false}
                onChosen={onChosenGroup}
                items={staffGroups}
                dropdownTitle={translate('project.filterConsultant.groupConsultant')}
              />
              <View style={commonStyles.separatorRow16} />
            </>
          )}
          <DropdownCities
            onChangeCity={onChangeCity}
            titleStyle={commonStyles.blackTextBold14}
            inputStyle={styles.borderBtn}
            title={translate('project.filterConsultant.workingArea')}
            selectedId={selectedCity?.id}
            style={HELPERS.fill}
          />
          <DropdownDistricts
            cityId={selectedCity?.id}
            inputStyle={{
              ...styles.borderBtn,
              ...(selectedCity?.id ? null : commonStyles.disableBackground),
            }}
            onChangeDistrict={onChangeDistrict}
            selectedIds={selectedDistricts.map(e => ({id: e}))}
            placeholder={translate(STRINGS.PLACEHOLDER_DISTRICT)}
            disabled={!selectedCity?.id}
            isSelectSingle={false}
          />
          <View style={commonStyles.separatorRow16} />
        </View>
      </ModalWithModalize>
    );
  },
);

ModalFilterConsultant.defaultProps = {
  applyFilterConsultant: () => {},
};

ModalFilterConsultant.propTypes = {
  applyFilterConsultant: PropTypes.func,
};
