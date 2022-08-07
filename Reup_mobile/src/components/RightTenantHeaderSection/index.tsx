import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { CustomButton } from '../CustomButton';
import translate from '@src/localize';
import { DELETE_ITEM } from '@src/constants/icons';
import styles from './styles';

interface TenantHeaderProps {
  selectedIds: string[];
  onDeleteItem: (items: string[]) => void;
  onAddItem: () => void;
}

const RightTenantHeaderSection = (props: TenantHeaderProps) => {
  const { selectedIds, onDeleteItem, onAddItem } = props;
  return (
    <View style={styles.headerRightView}>
      <TouchableOpacity
        onPress={() => onDeleteItem(selectedIds)}
        style={[styles.deleteItemSectionView, { opacity: selectedIds.length > 0 ? 1 : 0.5 }]}
        disabled={selectedIds.length > 0 ? false : true}
      >
        <Image source={DELETE_ITEM} style={styles.deleteItemSection} />
      </TouchableOpacity>
      <CustomButton onPress={onAddItem} text={translate('tenant_detail.add_item')} style={styles.addItem} textStyle={styles.addItemText} />
    </View>
  );
};

export default RightTenantHeaderSection;
