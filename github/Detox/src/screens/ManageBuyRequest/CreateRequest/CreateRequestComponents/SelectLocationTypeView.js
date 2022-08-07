import React from 'react';
import {StyleSheet, View} from 'react-native';

import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {commonStyles} from '../../../../assets/theme/styles';
import RadioSelectionView from '../../../../components/RadioSelectionsView';
import TextView from '../../../../components/TextView';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  textHeader: {
    color: COLORS.BRAND_GREY,
    ...commonStyles.txtFontSize14,
  },
});

export const locationTypes = [
  {
    id: 0,
    title: translate(STRINGS.TOWN_HOUSE),
    checked: true,
  },
  {
    id: 1,
    title: translate(STRINGS.ALLEY),
    checked: false,
  },
];

const SelectLocationTypeView = ({onSelected = () => {}, locationType = locationTypes[0].title}) => {
  const onChosenLocationType = data => {
    if (!data) {
      return;
    }
    onSelected(data);
  };
  const chosenItemId = locationType
    ? locationTypes.filter(e => e.title === locationType)[0]?.id
    : locationTypes[0].id;
  return (
    <View style={styles.container}>
      <TextView title={translate(STRINGS.LOCATION)} titleStyle={styles.textHeader} />
      <View style={commonStyles.separatorRow12} />
      <RadioSelectionView
        chosenItemId={chosenItemId}
        data={locationTypes.map(e => ({...e}))}
        onChosen={onChosenLocationType}
      />
    </View>
  );
};

export default SelectLocationTypeView;
