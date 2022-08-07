import isEmpty from 'lodash/isEmpty';
import React from 'react';
import {View} from 'react-native';

import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {HELPERS} from '../../../assets/theme/helpers';
import {METRICS} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import DropdownWithTitle from '../../../components/DropdownWithTitle';
import {NewPostStyles} from '../NewPost/NewPostComponents/NewPostConstant';
import PropertyPostUtils from '../PropertyPostUtils';
import PropertyType from '../PropertyType';
import CustomNumericView from './CustomNumericView';
import styles from './styles';

const BasePropertyInfo = ({state, onComponentChange, propertyType, houseDirections = []}) => {
  const onSelectDirection = item => {
    if (!isEmpty(item) && !isEmpty(item.id)) {
      onComponentChange({[STRINGS.DIRECTION]: item.id});
    }
  };

  return (
    <View>
      <View style={{...HELPERS.rowSpaceBetween}}>
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
          dropdownTitle={translate('newPost.placeholderDirection')}
          popupTitle={translate(STRINGS.HOUSE_DIRECTION)}
          items={houseDirections}
          showSearchBox={false}
          error={state?.errors?.DIRECTION ? state?.errors.DIRECTION : ''}
          itemSelected={item => onSelectDirection(item)}
          isRequired={true}
        />
        {propertyType !== PropertyType.land && (
          <>
            <View style={commonStyles.separatorColumn16} />
            <CustomNumericView
              onChangeText={text =>
                PropertyPostUtils.onNumberChange(text, STRINGS.NUMBER_OF_FLOOR, onComponentChange)
              }
              headerTitle={translate(STRINGS.NUMBER_OF_FLOOR)}
              style={METRICS.smallMarginTop}
              headerStyles={commonStyles.blackTextBold16}
              value={`${state?.NUMBER_OF_FLOOR}`}
              error={state?.errors?.[STRINGS.NUMBER_OF_FLOOR]}
              onPlusPress={() =>
                PropertyPostUtils.onNumberChangeMinor(
                  state?.NUMBER_OF_FLOOR,
                  STRINGS.NUMBER_OF_FLOOR,
                  onComponentChange,
                )
              }
              onMinorPress={() =>
                PropertyPostUtils.onNumberChangeMinor(
                  state?.NUMBER_OF_FLOOR,
                  STRINGS.NUMBER_OF_FLOOR,
                  onComponentChange,
                  false,
                )
              }
            />
          </>
        )}
      </View>

      {propertyType !== PropertyType.land && (
        <>
          <View style={HELPERS.rowSpaceBetween}>
            <CustomNumericView
              onChangeText={text =>
                PropertyPostUtils.onNumberChange(text, STRINGS.NUMBER_OF_BEDROOM, onComponentChange)
              }
              headerTitle={translate(STRINGS.NUMBER_OF_BEDROOM)}
              headerStyles={commonStyles.blackTextBold16}
              value={`${state?.NUMBER_OF_BEDROOM}`}
              error={state?.errors?.[STRINGS.NUMBER_OF_BEDROOM]}
              onPlusPress={() =>
                PropertyPostUtils.onNumberChangeMinor(
                  state?.NUMBER_OF_BEDROOM,
                  STRINGS.NUMBER_OF_BEDROOM,
                  onComponentChange,
                )
              }
              onMinorPress={() =>
                PropertyPostUtils.onNumberChangeMinor(
                  state?.NUMBER_OF_BEDROOM,
                  STRINGS.NUMBER_OF_BEDROOM,
                  onComponentChange,
                  false,
                )
              }
            />
            <View style={commonStyles.separatorColumn16} />
            <CustomNumericView
              onChangeText={text =>
                PropertyPostUtils.onNumberChange(
                  text,
                  STRINGS.NUMBER_OF_BATHROOM,
                  onComponentChange,
                )
              }
              headerTitle={translate(STRINGS.NUMBER_OF_BATHROOM)}
              headerStyles={commonStyles.blackTextBold16}
              value={`${state?.NUMBER_OF_BATHROOM}`}
              error={state?.errors?.[STRINGS.NUMBER_OF_BATHROOM]}
              onPlusPress={() =>
                PropertyPostUtils.onNumberChangeMinor(
                  state?.NUMBER_OF_BATHROOM,
                  STRINGS.NUMBER_OF_BATHROOM,
                  onComponentChange,
                )
              }
              onMinorPress={() =>
                PropertyPostUtils.onNumberChangeMinor(
                  state?.NUMBER_OF_BATHROOM,
                  STRINGS.NUMBER_OF_BATHROOM,
                  onComponentChange,
                  false,
                )
              }
            />
          </View>
        </>
      )}
    </View>
  );
};

export default BasePropertyInfo;
