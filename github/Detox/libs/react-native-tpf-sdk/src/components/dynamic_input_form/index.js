import __, { isEmpty } from 'lodash';
import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { translate } from '../../i18n';
import RowSpace from '../../components/row_space';
import { SPACING } from '../../constants/size';
import { ATTRIBUTE_TYPE } from '../../global/entity_type';
import PrimaryButton from '../primary_button';
import GroupInput from './group_input';
import { ICCloseGrey } from '../../assets/icons';
import { IDS_DEPENDENT_PAY } from '../../screens/credit/create_or_edit/constants';

const DynamicInputForm = ({
  listComponent,
  onChange,
  style,
  formData,
  onAddGroup,
  isHideDependentPay,
  onCopy,
  onRemoveGroup,
  toggleCopy
}) => {
  const onChangeInput = useCallback(
    (groupId, attributeId, value, error) => {
      let newData = [...listComponent];
      let groupIdx = newData.findIndex(t => t.groupId === groupId);

      if (!isEmpty(newData[groupIdx].eavAttribute)) {
        let attributeIdx = newData[groupIdx].eavAttribute.findIndex(
          t => t.attributeId === attributeId
        );
        if (newData[groupIdx].eavAttribute[attributeIdx].type === ATTRIBUTE_TYPE.address) {
          newData[groupIdx].eavAttribute[attributeIdx]?.addressData?.addressDetail?.map(t => {
            t.value = value[__.camelCase(t.code)];
          });
          if (newData[groupIdx].eavAttribute[attributeIdx]?.addressData) {
            newData[groupIdx].eavAttribute[attributeIdx].addressData.isChecked = value?.isChecked;
          }
        } else if (newData[groupIdx].eavAttribute[attributeIdx].type === ATTRIBUTE_TYPE.media) {
          newData[groupIdx].eavAttribute[attributeIdx].mediaUploadValue = value;
        } else {
          newData[groupIdx].eavAttribute[attributeIdx].value = value;
        }

        onChange(newData, groupId, attributeId);
      } else if (!isEmpty(newData[groupIdx].listComponent)) {
        let attributeIdx = newData[groupIdx].listComponent.findIndex(
          t => t.attributeId === attributeId
        );
        if (newData[groupIdx].listComponent[attributeIdx].type === ATTRIBUTE_TYPE.address) {
          newData[groupIdx].listComponent[attributeIdx]?.addressData?.addressDetail?.map(t => {
            t.value = value[__.camelCase(t.code)];
          });
          if (newData[groupIdx].listComponent[attributeIdx]?.addressData) {
            newData[groupIdx].listComponent[attributeIdx].addressData.isChecked = value?.isChecked;
          }
        } else if (newData[groupIdx].listComponent[attributeIdx].type === ATTRIBUTE_TYPE.media) {
          newData[groupIdx].listComponent[attributeIdx].mediaUploadValue = value;
        } else {
          newData[groupIdx].listComponent[attributeIdx].value = value;
        }

        onChange(newData, groupId, attributeId);
      } else if (!isEmpty(newData[groupIdx].listAttribute)) {
        let attributeIdx = newData[groupIdx].listAttribute.findIndex(
          t => t.attributeId === attributeId
        );
        if (newData[groupIdx].listAttribute[attributeIdx].type === ATTRIBUTE_TYPE.address) {
          newData[groupIdx].listAttribute[attributeIdx]?.addressData?.addressDetail?.map(t => {
            t.value = value[__.camelCase(t.code)];
          });
          if (newData[groupIdx].listAttribute[attributeIdx]?.addressData) {
            newData[groupIdx].listAttribute[attributeIdx].addressData.isChecked = value?.isChecked;
          }
        } else if (newData[groupIdx].listAttribute[attributeIdx].type === ATTRIBUTE_TYPE.media) {
          newData[groupIdx].listAttribute[attributeIdx].mediaUploadValue = value;
        } else {
          newData[groupIdx].listAttribute[attributeIdx].value = value;
        }

        onChange(newData, groupId, attributeId);
      }
    },
    [listComponent, onChange]
  );

  const onEndEditing = useCallback(
    (groupId, attributeId, error) => {
      let newData = [...listComponent];
      let groupIdx = newData.findIndex(t => t.groupId === groupId);
      if (!isEmpty(newData[groupIdx].eavAttribute)) {
        let attributeIdx = newData[groupIdx].eavAttribute.findIndex(
          t => t.attributeId === attributeId
        );
        if (newData[groupIdx].eavAttribute[attributeIdx].type === ATTRIBUTE_TYPE.address) {
          newData[groupIdx].eavAttribute[attributeIdx]?.addressData?.addressDetail?.map(t => {
            t.error = error;
          });
        } else {
          newData[groupIdx].eavAttribute[attributeIdx].error = error;
        }
        onChange(newData);
      } else if (!isEmpty(newData[groupIdx].listComponent)) {
        let attributeIdx = newData[groupIdx].listComponent.findIndex(
          t => t.attributeId === attributeId
        );
        if (newData[groupIdx].listComponent[attributeIdx].type === ATTRIBUTE_TYPE.address) {
          newData[groupIdx].listComponent[attributeIdx]?.addressData?.addressDetail?.map(t => {
            t.error = error;
          });
        } else {
          newData[groupIdx].listComponent[attributeIdx].error = error;
        }
        onChange(newData);
      } else if (!isEmpty(newData[groupIdx].listAttribute)) {
        let attributeIdx = newData[groupIdx].listAttribute.findIndex(
          t => t.attributeId === attributeId
        );
        if (newData[groupIdx].listAttribute[attributeIdx].type === ATTRIBUTE_TYPE.address) {
          newData[groupIdx].listAttribute[attributeIdx]?.addressData?.addressDetail?.map(t => {
            t.error = error;
          });
        } else {
          newData[groupIdx].listAttribute[attributeIdx].error = error;
        }
        onChange(newData);
      }
    },
    [listComponent, onChange]
  );

  const renderGroup = useCallback(
    ({ item, index, canExpand, error }) => {
      if (isHideDependentPay && IDS_DEPENDENT_PAY.includes(item.code)) {
        return null;
      }
      const isAddedField = item?.addedByField;
      return (
        <View key={'' + index}>
          {isAddedField && (
            <TouchableOpacity
              style={styles.iconCloseWrapper}
              onPress={() => onRemoveGroup?.(item.groupId)}>
              <ICCloseGrey />
              <RowSpace height={SPACING.Medium} />
            </TouchableOpacity>
          )}
          <GroupInput
            error={error}
            group={item}
            onChange={onChangeInput}
            canExpand={canExpand}
            onEndEditing={onEndEditing}
            formData={formData}
            onCopy={onCopy}
            isAddedField={isAddedField}
            isHideDependentPay={isHideDependentPay}
            toggleCopy={toggleCopy}
          />
          <RowSpace height={SPACING.Medium} />
          {item?.isListInputForm && (
            <>
              <View style={[styles.buttonAddMore]}>
                <PrimaryButton
                  title={translate('credit.add')}
                  onPress={() => onAddGroup?.(item, index)}
                />
              </View>
              <RowSpace height={SPACING.Medium} />
            </>
          )}
        </View>
      );
    },
    [
      formData,
      isHideDependentPay,
      onAddGroup,
      onChangeInput,
      onCopy,
      onEndEditing,
      onRemoveGroup,
      toggleCopy
    ]
  );

  return listComponent?.length > 0 ? (
    <View style={[styles.container, style]}>
      {listComponent.map((item, index) =>
        renderGroup({
          item,
          index,
          canExpand: listComponent?.length > 1
        })
      )}
    </View>
  ) : null;
};

export default React.memo(DynamicInputForm);

const styles = StyleSheet.create({
  container: {},
  wrapper: {
    paddingTop: SPACING.Medium,
    paddingHorizontal: SPACING.Medium
  },
  iconCloseWrapper: {
    alignItems: 'flex-end'
  }
});
