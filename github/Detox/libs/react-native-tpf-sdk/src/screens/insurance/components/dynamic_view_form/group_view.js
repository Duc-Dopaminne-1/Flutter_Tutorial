import ExpandView from '../../../../components/expand_view';
import TextView from '../../../../components/text_view';
import { parseToLocationForm, parseToSelectOptions } from '../../../../helpers/entityData';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SPACING } from '../../../../constants/size';

const GroupView = ({ group, style, canExpand }) => {
  return group?.eavAttribute?.length > 0 ? (
    <ExpandView
      canExpand={canExpand}
      style={[styles.container, style]}
      contentStyle={styles.contentWrapper}
      title={group?.name}>
      {group?.eavAttribute.map(item => {
        let location = null;
        let options = null;
        if (item.type === 'address') {
          location = parseToLocationForm(item.addressData?.addressDetail);
        } else if (item.type === 'select') {
          options = parseToSelectOptions(item.optionData);
        }

        return (
          <TextView
            key={'' + item.attributeId}
            title={item.name}
            type={item.type}
            placeholder={item.name}
            value={item.value}
            selectOptions={options}
            location={location}
          />
        );
      })}
    </ExpandView>
  ) : group?.listComponent?.length > 0 ? (
    <ExpandView
      canExpand={canExpand}
      style={[styles.container, style]}
      contentStyle={styles.contentWrapper}
      title={group?.name}>
      {group?.listComponent.map(item => {
        let location = null;
        let options = null;
        if (item.type === 'address') {
          location = parseToLocationForm(item.addressData?.addressDetail);
        } else if (item.type === 'select') {
          options = parseToSelectOptions(item.optionData);
        }

        return (
          <TextView
            key={'' + item.attributeId}
            title={item.name}
            type={item.type}
            placeholder={item.name}
            value={item.value}
            selectOptions={options}
            location={location}
          />
        );
      })}
    </ExpandView>
  ) : group?.listAttribute?.length > 0 ? (
    <ExpandView
      canExpand={canExpand}
      style={[styles.container, style]}
      contentStyle={styles.contentWrapper}
      title={group?.name}>
      {group?.listAttribute.map(item => {
        let location = null;
        let options = null;
        if (item.type === 'address') {
          location = parseToLocationForm(item.addressData?.addressDetail);
        } else if (item.type === 'select') {
          options = parseToSelectOptions(item.optionData);
        }

        return (
          <TextView
            key={'' + item.attributeId}
            title={item.name}
            type={item.type}
            placeholder={item.name}
            value={item.value}
            selectOptions={options}
            location={location}
          />
        );
      })}
    </ExpandView>
  ) : null;
};

export default GroupView;

const styles = StyleSheet.create({
  container: {},
  contentWrapper: {
    paddingTop: SPACING.Small
  }
});
