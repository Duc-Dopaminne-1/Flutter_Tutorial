import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';

import {AppContext} from '../../../../appData/appContext/useAppContext';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {commonStyles} from '../../../../assets/theme/styles';
import RadioSelectionView from '../../../../components/RadioSelectionsView';
import TextView from '../../../../components/TextView';
import {getPropertyTypeChoices} from '../../ManageBuyRequestUtils';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  textHeader: {
    color: COLORS.BRAND_GREY,
    ...commonStyles.txtFontSize14,
  },
});

const SelectPropertyTypeView = ({onSelected = () => {}, defaultPropertyTypeId}) => {
  const {getMasterData} = useContext(AppContext);
  const masterData = getMasterData();
  const choices = getPropertyTypeChoices(masterData);

  const onChosenPropertyType = data => {
    if (!data) {
      return;
    }
    onSelected(data);
  };
  const chosenItemId = defaultPropertyTypeId ? defaultPropertyTypeId : choices[0].id;
  return (
    <View style={styles.container}>
      <TextView title={translate(STRINGS.BDS_PROPERTY_TYPE)} titleStyle={styles.textHeader} />
      <View style={commonStyles.separatorRow12} />
      <RadioSelectionView
        data={choices}
        onChosen={onChosenPropertyType}
        chosenItemId={chosenItemId}
      />
    </View>
  );
};

export default SelectPropertyTypeView;
