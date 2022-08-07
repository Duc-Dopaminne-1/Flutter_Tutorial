import RowSpace from '../../../../components/row_space';
import { SPACING } from '../../../../constants/size';
import __, { isEmpty } from 'lodash';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import FileUploader from './file_uploader';
import GroupInput from './group_input';

const DynamicInputForm = ({ listComponent, onChange, style }) => {
  const onChangeInput = useCallback(
    (groupId, attributeId, value) => {
      let newData = [...listComponent];
      let groupIdx = newData.findIndex(t => t.groupId === groupId);
      // In case eavAttribute List
      if (!isEmpty(newData[groupIdx].eavAttribute)) {
        let attributeIdx = newData[groupIdx].eavAttribute.findIndex(
          t => t.attributeId === attributeId
        );
        if (newData[groupIdx].eavAttribute[attributeIdx].type === 'address') {
          newData[groupIdx].eavAttribute[attributeIdx]?.addressData?.addressDetail?.map(t => {
            t.value = value[__.camelCase(t.code)];
          });
        } else {
          newData[groupIdx].eavAttribute[attributeIdx].value = value;
        }
        onChange(newData);
      }
      // In case listComponent List
      else if (!isEmpty(newData[groupIdx].listComponent)) {
        let attributeIdx = newData[groupIdx].listComponent.findIndex(
          t => t.attributeId === attributeId
        );
        if (newData[groupIdx].listComponent[attributeIdx].type === 'address') {
          newData[groupIdx].listComponent[attributeIdx]?.addressData?.addressDetail?.map(t => {
            t.value = value[__.camelCase(t.code)];
          });
        } else {
          newData[groupIdx].listComponent[attributeIdx].value = value;
        }
        onChange(newData);
      }
      // In case listAttribute List
      else if (!isEmpty(newData[groupIdx].listAttribute)) {
        let attributeIdx = newData[groupIdx].listAttribute.findIndex(
          t => t.attributeId === attributeId
        );
        if (newData[groupIdx].listAttribute[attributeIdx].type === 'address') {
          newData[groupIdx].listAttribute[attributeIdx]?.addressData?.addressDetail?.map(t => {
            t.value = value[__.camelCase(t.code)];
          });
        } else {
          newData[groupIdx].listAttribute[attributeIdx].value = value;
        }
        onChange(newData);
      }
    },
    [listComponent, onChange]
  );

  const addNewFile = useCallback(
    groupId => {
      let newData = [...listComponent];
      let groupIdx = newData.findIndex(t => t.groupId === groupId);
      newData[groupIdx].eavAttribute = [
        ...newData[groupIdx].eavAttribute,
        {
          entityDetailId: null,
          attributeId: `${groupId}${newData[groupIdx].eavAttribute?.length}`,
          name: `Hồ sơ yêu cầu ${newData[groupIdx].eavAttribute?.length + 1}`,
          type: 'file',
          value: null,
          isRequired: false,
          optionData: null,
          addressData: null,
          description: null,
          key: `file${newData[groupIdx].eavAttribute?.length + 1}`,
          validation: null
        }
      ];
      newData[groupIdx].listComponent = [
        ...newData[groupIdx].listComponent,
        {
          entityDetailId: null,
          attributeId: `${groupId}${newData[groupIdx].listComponent?.length}`,
          name: `Hồ sơ yêu cầu ${newData[groupIdx].listComponent?.length + 1}`,
          type: 'file',
          value: null,
          isRequired: false,
          optionData: null,
          addressData: null,
          description: null,
          key: `file${newData[groupIdx].listComponent?.length + 1}`,
          validation: null
        }
      ];
      onChange(newData);
    },
    [listComponent, onChange]
  );

  const renderGroup = useCallback(
    ({ item }) => {
      if (item?.type === 'files') {
        return <FileUploader item={item} onChange={onChangeInput} addNewFile={addNewFile} />;
      }

      return <GroupInput key={'' + item.groupId} group={item} onChange={onChangeInput} />;
    },
    [addNewFile, onChangeInput]
  );

  return listComponent?.length > 0 ? (
    <View style={[styles.container, style]}>
      {listComponent.map((item, index) => (
        <>
          {renderGroup({ item })}
          <RowSpace height={SPACING.Medium} />
        </>
      ))}
    </View>
  ) : null;
};

export default React.memo(DynamicInputForm);

const styles = StyleSheet.create({
  container: {},
  wrapper: {
    paddingTop: SPACING.Medium,
    paddingHorizontal: SPACING.Medium
  }
});
