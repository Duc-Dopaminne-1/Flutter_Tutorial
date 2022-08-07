import RowSpace from '../../../../components/row_space';
import { SPACING } from '../../../../constants/size';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import GroupView from './group_view';

const DynamicViewForm = ({ listComponent, style }) => {
  const renderGroup = ({ item }) => {
    return <GroupView key={'' + item.groupId} group={item} />;
  };
  return listComponent?.length > 0 ? (
    <View style={[styles.container, style]}>
      {listComponent?.map(item => (
        <>
          {renderGroup({ item })}
          <RowSpace height={SPACING.Medium} />
        </>
      ))}
    </View>
  ) : null;
};

export default DynamicViewForm;

const styles = StyleSheet.create({
  container: {}
});
