import CustomInput from '../../../../components/custom_input';
import ExpandView from '../../../../components/expand_view';
import { parseToLocationForm, parseToSelectOptions } from '../../../../helpers/entityData';
import React from 'react';
import { StyleSheet } from 'react-native';

const GroupInput = ({ group, onChange }) => {
  return group?.eavAttribute?.length > 0 ? (
    <ExpandView style={styles.container} title={group?.name}>
      {group?.eavAttribute.map(item => {
        let location = null;
        let options = null;
        if (item.type === 'address') {
          location = parseToLocationForm(item.addressData?.addressDetail);
        } else if (item.type === 'select') {
          options = parseToSelectOptions(item.optionData);
        }

        return (
          <CustomInput
            item={item}
            key={'' + item.attributeId + item.name}
            title={item.name}
            type={item.type === 'text' ? 'textinput' : item.type}
            placeholder={item?.description}
            value={item.value}
            onChangeText={value => {
              onChange(group.groupId, item.attributeId, value);
            }}
            location={location}
            selectOptions={options}
          />
        );
      })}
    </ExpandView>
  ) : group?.listComponent?.length > 0 ? (
    <ExpandView style={styles.container} title={group?.name}>
      {group?.listComponent.map(item => {
        let location = null;
        let options = null;
        if (item.type === 'address') {
          location = parseToLocationForm(item.addressData?.addressDetail);
        } else if (item.type === 'select') {
          options = parseToSelectOptions(item.optionData);
        }

        return (
          <CustomInput
            item={item}
            key={'' + item.attributeId + item.name}
            title={item.name}
            type={item.type === 'text' ? 'textinput' : item.type}
            placeholder={item?.description}
            value={item.value}
            onChangeText={value => {
              onChange(group.groupId, item.attributeId, value);
            }}
            location={location}
            selectOptions={options}
          />
        );
      })}
    </ExpandView>
  ) : group?.listAttribute?.length > 0 ? (
    <ExpandView style={styles.container} title={group?.name}>
      {group?.listAttribute.map(item => {
        let location = null;
        let options = null;
        if (item.type === 'address') {
          location = parseToLocationForm(item.addressData?.addressDetail);
        } else if (item.type === 'select') {
          options = parseToSelectOptions(item.optionData);
        }

        return (
          <CustomInput
            item={item}
            key={'' + item.attributeId + item.name}
            title={item.name}
            type={item.type === 'text' ? 'textinput' : item.type}
            placeholder={item?.description}
            value={item.value}
            onChangeText={value => {
              onChange(group.groupId, item.attributeId, value);
            }}
            location={location}
            selectOptions={options}
          />
        );
      })}
    </ExpandView>
  ) : null;
};

export default GroupInput;

const styles = StyleSheet.create({
  container: {}
});
