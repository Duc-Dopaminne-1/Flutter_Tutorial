import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {COLORS} from '../../../../assets/theme/colors';
import {commonStyles} from '../../../../assets/theme/styles';
import RadioSelectionView, {ITEM_TYPE} from '../../../../components/RadioSelectionsView';
import TextView from '../../../../components/TextView';
import {useMount} from '../../../commonHooks';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  textHeader: {
    color: COLORS.BRAND_GREY,
    ...commonStyles.txtFontSize14,
  },
  containerTextStyle: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
});

const SelectionsView = ({
  onSelected = () => {},
  data = [],
  title,
  selectedItemId,
  type = ITEM_TYPE.DEFAULT,
}) => {
  const [options, setOptions] = useState([]);
  const onChosenType = selectedItem => {
    if (!selectedItem) {
      return;
    }
    onSelected(selectedItem);
  };
  const setInitialData = () => {
    const initialData = data.map(e => {
      return {...e, isChecked: selectedItemId === e.id};
    });
    if (initialData && initialData.length > 0) {
      const selected = initialData.find(e => e.id === selectedItemId);
      onSelected(selected);
    }
    setOptions(initialData);
  };

  useMount(setInitialData);

  useEffect(() => {
    setInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItemId]);

  return (
    <View style={styles.container}>
      <TextView
        title={title}
        titleStyle={styles.textHeader}
        containerStyle={styles.containerTextStyle}
      />
      <View style={commonStyles.separatorRow12} />
      <RadioSelectionView data={options} onChosen={onChosenType} type={type} />
    </View>
  );
};

export default SelectionsView;
