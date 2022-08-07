import React from 'react';
import { StyleSheet, View } from 'react-native';
import RowSpace from '../../components/row_space';
import { SPACING } from '../../constants/size';
import GroupView from './group_view';

const DynamicViewForm = ({
  listComponent,
  style,
  cannotExpand = false,
  translateTitle = false,
  appendContent = null
}) => {
  const renderGroup = ({ item, index }) => {
    return (
      <View key={'' + index}>
        <GroupView
          canExpand={!cannotExpand}
          group={item}
          translateTitle={translateTitle}
          appendContent={index === 0 ? appendContent : null}
        />
        <RowSpace height={SPACING.Medium} />
      </View>
    );
  };

  return listComponent?.length > 0 ? (
    <View style={[styles.container, style]}>
      {listComponent?.map((item, index) => renderGroup({ item, index }))}
    </View>
  ) : null;
};

export default DynamicViewForm;

const styles = StyleSheet.create({
  container: {}
});
