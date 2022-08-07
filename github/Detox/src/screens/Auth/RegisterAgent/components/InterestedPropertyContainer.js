import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {GLOBAL_ACTIONS} from '../../../../assets/constants';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {HELPERS} from '../../../../assets/theme/helpers';
import ErrorText from '../../../../components/ErrorText';
import RequiredLabel from '../../../../components/RequiredLabel';
import CheckboxWithText from './CheckboxWithText';

const styles = StyleSheet.create({
  container: {
    // paddingTop: normal,
  },
  interestedButtonContainer: {
    ...HELPERS.row,
    ...HELPERS.mainSpaceBetween,
  },
});

const mapItems = (listItems, onCheckItem) => {
  const mappedItems =
    listItems?.map(item => (
      <CheckboxWithText
        key={item.id}
        title={translate(item.name)}
        item={item}
        onCheckItem={onCheckItem}
        checkedValue={item.checked}
      />
    )) ?? [];
  return mappedItems;
};

const InterestedPropertyContainer = ({headerStyle, state, dispatch, errorText}) => {
  const onCheckItem = () => {
    dispatch({type: GLOBAL_ACTIONS.SET_PREFER_PROPERTY_TYPES, payload: state.preferPropertyTypes});
  };

  const [items, setItems] = useState(mapItems(state?.preferPropertyTypes ?? [], onCheckItem));
  useEffect(() => {
    const newItems = mapItems(state?.preferPropertyTypes ?? [], onCheckItem);
    setItems(newItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.preferPropertyTypes]);

  return (
    <View style={styles.container}>
      <RequiredLabel
        isRequired={false}
        title={translate(STRINGS.INTERESTED_PROPERTY)}
        titleStyle={headerStyle}
      />
      <View style={styles.interestedButtonContainer}>{items}</View>
      <ErrorText errorText={errorText} />
    </View>
  );
};

export default InterestedPropertyContainer;
