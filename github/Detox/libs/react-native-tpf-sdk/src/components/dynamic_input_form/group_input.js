import React from 'react';
import { StyleSheet } from 'react-native';
import CustomInput from '../../components/custom_input';
import ExpandView from '../../components/expand_view';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../constants/appFonts';
import { CUSTOM_COLOR } from '../../constants/colors';
import { ATTRIBUTE_TYPE } from '../../global/entity_type';
import { parseToLocationForm, parseToSelectOptions } from '../../helpers/entityData';
import { scale } from '../../utils/responsive';

const GroupInput = ({
  group,
  onChange,
  canExpand,
  onEndEditing,
  formData,
  onCopy,
  isAddedField,
  toggleCopy
}) => {
  const listComponent = group?.eavAttribute || group?.listComponent || group?.listAttribute;
  const groupId = group?.groupId;
  return listComponent?.length > 0 ? (
    <ExpandView style={styles.container} title={group?.name} canExpand={canExpand}>
      {listComponent.map(item => {
        let location = null;
        let options = null;
        if (item.type === ATTRIBUTE_TYPE.address) {
          location = parseToLocationForm(item.addressData?.addressDetail);
        } else if (item.type === ATTRIBUTE_TYPE.select) {
          options = parseToSelectOptions(item.optionData);
        }

        if (item.hidden) {
          return null;
        }
        return !item.showOnBU ? (
          <CustomInput
            translateTitle
            item={item}
            key={'' + item.attributeId}
            title={item.type !== 'address' ? item.name : null}
            type={item.type}
            placeholder={item?.description || item?.name}
            value={item?.value}
            onChangeText={(value, error) => {
              onChange(group?.groupId, item?.attributeId, value, error);
            }}
            onEndEditing={error => {
              onEndEditing(group?.groupId, item?.attributeId, error);
            }}
            location={location}
            selectOptions={options}
            parseRadio
            hasExtend={item.type === ATTRIBUTE_TYPE.textarea}
            multiline={item.type === ATTRIBUTE_TYPE.textarea}
            formData={formData}
            onCopy={() => onCopy(item, listComponent)}
            isAddedField={isAddedField}
            toggleCopy={toggleCopy}
            modeSelectDate={'input'}
            groupId={groupId}
          />
        ) : null;
      })}
    </ExpandView>
  ) : null;
};

export default GroupInput;

const styles = StyleSheet.create({
  container: {},
  errMsg: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    color: CUSTOM_COLOR.Flamingo,
    marginTop: scale(4)
  }
});
