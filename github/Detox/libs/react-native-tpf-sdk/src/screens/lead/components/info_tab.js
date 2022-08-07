import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { DynamicViewForm } from '../../../components/';
import { SPACING } from '../../../constants/size';
import { DynamicInputForm } from '../../../components/';

const InfoTab = ({ item, isEdit = false, onChangeValue }) => {
  return (
    <ScrollView contentContainerStyle={styles.wrapper} showsVerticalScrollIndicator={false}>
      {isEdit ? (
        <DynamicInputForm listComponent={item?.listComponent || []} onChange={onChangeValue} />
      ) : (
        <DynamicViewForm listComponent={item?.listComponent || []} />
      )}
    </ScrollView>
  );
};

export default InfoTab;

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: SPACING.Medium,
    paddingHorizontal: SPACING.Medium,
    paddingBottom: SPACING.HasBottomButton
  }
});
