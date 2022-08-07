import isEmpty from 'lodash/isEmpty';
import React, {useState} from 'react';
import {View} from 'react-native';

import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {HELPERS} from '../../../assets/theme/helpers';
import {METRICS} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import DropdownWithTitle from '../../../components/DropdownWithTitle';
import InputSection from '../../../components/InputSection';
import {NewPostStyles} from '../NewPost/NewPostComponents/NewPostConstant';
import PropertyPostUtils from '../PropertyPostUtils';
import CustomNumericView from './CustomNumericView';
import styles from './styles';

const ApartmentInfo = ({state, houseDirections, balconyDirections = [], onComponentChange}) => {
  const [focusedViews, setFocusedViews] = useState({});
  const {FLOOR = 1, NUMBER_OF_BATHROOM = 1, NUMBER_OF_BEDROOM = 1, TOWER = ''} = state;

  const onSelectDirection = item => {
    if (!isEmpty(item) && !isEmpty(item.id)) {
      onComponentChange({[STRINGS.DIRECTION]: item.id});
    }
  };

  // Change balcony direction
  const onSelectBalconyDirection = item => {
    if (!isEmpty(item) && !isEmpty(item.id)) {
      onComponentChange({[STRINGS.BALCONY_DIRECTION]: item.id});
    }
  };

  return (
    <View>
      <View style={HELPERS.fillRow}>
        <DropdownWithTitle
          colorTheme={COLORS.PRIMARY_A100}
          dropdownPlaceHolderStyle={
            isEmpty(state?.DIRECTION) ? NewPostStyles.dropdownPlaceholder : commonStyles.blackText16
          }
          selectedStyle={commonStyles.blackText16}
          style={styles.containerSelection}
          inputStyle={commonStyles.inputBorderWithIcon}
          headerStyles={[commonStyles.blackTextBold16, METRICS.resetPadding]}
          title={translate(STRINGS.HOUSE_DIRECTION)}
          dropdownTitle={translate('newPost.input.placeholder.houseDirection')}
          popupTitle={translate(STRINGS.HOUSE_DIRECTION)}
          items={houseDirections}
          showSearchBox={false}
          error={state?.errors?.[STRINGS.DIRECTION] ? state.errors?.[STRINGS.DIRECTION] : ''}
          itemSelected={item => onSelectDirection(item)}
          isRequired={true}
        />
        <View style={commonStyles.separatorColumn16} />
        {/* Balcony direction dropdown */}
        <DropdownWithTitle
          colorTheme={COLORS.PRIMARY_A100}
          dropdownPlaceHolderStyle={
            isEmpty(state?.BALCONY_DIRECTION)
              ? NewPostStyles.dropdownPlaceholder
              : commonStyles.blackText16
          }
          selectedStyle={commonStyles.blackText16}
          style={styles.containerSelection}
          inputStyle={commonStyles.inputBorderWithIcon}
          headerStyles={[commonStyles.blackTextBold16, METRICS.resetPadding]}
          title={translate(STRINGS.BALCONY_DIRECTION)}
          dropdownTitle={translate('newPost.input.placeholder.balconyDirection')}
          popupTitle={translate(STRINGS.BALCONY_DIRECTION)}
          items={balconyDirections}
          showSearchBox={false}
          error={''}
          itemSelected={item => onSelectBalconyDirection(item)}
          isRequired={false}
        />
      </View>

      <View style={[HELPERS.rowSpaceBetween, METRICS.smallMarginTop]}>
        <CustomNumericView
          onChangeText={text =>
            PropertyPostUtils.onNumberChange(text, STRINGS.NUMBER_OF_BEDROOM, onComponentChange)
          }
          headerTitle={translate(STRINGS.NUMBER_OF_BEDROOM)}
          headerStyles={commonStyles.blackTextBold16}
          value={`${NUMBER_OF_BEDROOM}`}
          error={state?.errors?.[STRINGS.NUMBER_OF_BEDROOM]}
          onPlusPress={() =>
            PropertyPostUtils.onNumberChangeMinor(
              NUMBER_OF_BEDROOM,
              STRINGS.NUMBER_OF_BEDROOM,
              onComponentChange,
            )
          }
          onMinorPress={() =>
            PropertyPostUtils.onNumberChangeMinor(
              NUMBER_OF_BEDROOM,
              STRINGS.NUMBER_OF_BEDROOM,
              onComponentChange,
              false,
            )
          }
        />
        <View style={commonStyles.separatorColumn16} />
        <CustomNumericView
          onChangeText={text =>
            PropertyPostUtils.onNumberChange(text, STRINGS.NUMBER_OF_BATHROOM, onComponentChange)
          }
          headerTitle={translate(STRINGS.NUMBER_OF_BATHROOM)}
          headerStyles={commonStyles.blackTextBold16}
          value={`${NUMBER_OF_BATHROOM}`}
          error={state?.errors?.[STRINGS.NUMBER_OF_BATHROOM]}
          onPlusPress={() =>
            PropertyPostUtils.onNumberChangeMinor(
              NUMBER_OF_BATHROOM,
              STRINGS.NUMBER_OF_BATHROOM,
              onComponentChange,
            )
          }
          onMinorPress={() =>
            PropertyPostUtils.onNumberChangeMinor(
              NUMBER_OF_BATHROOM,
              STRINGS.NUMBER_OF_BATHROOM,
              onComponentChange,
              false,
            )
          }
        />
      </View>
      <View style={{...HELPERS.rowSpaceBetween}}>
        <InputSection
          isRequired={false}
          customStyle={styles.container}
          inputStyle={styles.input(focusedViews?.TOWER)}
          headerStyles={commonStyles.blackTextBold16}
          headerTitle={translate(STRINGS.TOWER)}
          placeholder={translate('newPost.input.placeholder.tower')}
          placeHolderColor={COLORS.TEXT_DARK_40}
          onChangeText={text => onComponentChange({[STRINGS.TOWER]: text})}
          value={`${TOWER}`}
          error={state?.errors?.[STRINGS.TOWER]}
          editable={true}
          onFocus={() => setFocusedViews({...focusedViews, TOWER: true})}
          onBlur={() => setFocusedViews({...focusedViews, TOWER: false})}
        />
        <View style={commonStyles.separatorColumn16} />
        <InputSection
          isRequired={false}
          customStyle={styles.container}
          inputStyle={styles.input(focusedViews?.FLOOR)}
          onChangeText={text => onComponentChange({[STRINGS.FLOOR]: text})}
          headerStyles={commonStyles.blackTextBold16}
          headerTitle={translate(STRINGS.FLOOR)}
          placeholder={translate('newPost.input.placeholder.floor')}
          placeHolderColor={COLORS.TEXT_DARK_40}
          value={`${FLOOR}`}
          error={state?.errors?.[STRINGS.FLOOR]}
          editable={true}
          onFocus={() => setFocusedViews({...focusedViews, FLOOR: true})}
          onBlur={() => setFocusedViews({...focusedViews, FLOOR: false})}
        />
      </View>
    </View>
  );
};

export default ApartmentInfo;
