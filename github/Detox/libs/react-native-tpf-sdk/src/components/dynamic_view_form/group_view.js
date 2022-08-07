import React from 'react';
import { StyleSheet } from 'react-native';
import ExpandView from '../../components/expand_view';
import TextView from '../../components/text_view';
import { SPACING } from '../../constants/size';
import { ATTRIBUTE_TYPE } from '../../global/entity_type';
import { parseToLocationForm, parseToSelectOptions } from '../../helpers/entityData';

const GroupView = ({ group, style, canExpand, translateTitle = false, appendContent = null }) => {
  let listComponent = group?.eavAttribute || group?.listAttribute;
  return listComponent?.length > 0 ? (
    <ExpandView
      translateTitle
      canExpand={canExpand}
      style={[styles.container, style]}
      contentStyle={styles.contentWrapper}
      title={group?.name}>
      {listComponent?.map((item, index) => {
        let location = null;
        let options = null;
        if (item.type === ATTRIBUTE_TYPE.address) {
          location = parseToLocationForm(item.addressData?.addressDetail);
        } else if (item.type === ATTRIBUTE_TYPE.select) {
          options = parseToSelectOptions(item.optionData);
        }

        return !item.showOnBU || (item.showOnBU === true && item.value) ? (
          <TextView
            translate={translateTitle}
            key={'' + index}
            title={item.type !== 'address' ? item.name : null}
            type={item.type}
            placeholder={item.name}
            value={item.value}
            selectOptions={options}
            location={location}
            item={item}
          />
        ) : null;
      })}
      {appendContent ? appendContent : null}
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
