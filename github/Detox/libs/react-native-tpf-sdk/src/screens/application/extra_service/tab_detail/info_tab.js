import DynamicViewForm from '../../../../components/dynamic_view_form';
import TextView from '../../../../components/text_view';
import { BACKGROUND_COLOR } from '../../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../../constants/size';
import { formatDate } from '../../../../helpers/formatTime';
import React from 'react';
import { StyleSheet } from 'react-native';

const AppendContent = ({ orderDetail }) => {
  return (
    <>
      <TextView
        translate
        title={'info_tab.create_time'}
        value={orderDetail?.creationTime ? formatDate(orderDetail?.creationTime) : ''}
      />
      <TextView
        translate
        title={'info_tab.last_modification_time'}
        value={
          orderDetail?.lastModificationTime ? formatDate(orderDetail?.lastModificationTime) : ''
        }
      />
    </>
  );
};

const InfoTab = ({ orderDetail, cannotExpand = 'false' }) => {
  return (
    <>
      <DynamicViewForm
        cannotExpand={cannotExpand}
        style={styles.infoContainer}
        listComponent={orderDetail?.contact?.listComponent || []}
        appendContent={<AppendContent orderDetail={orderDetail} />}
      />
      <DynamicViewForm
        cannotExpand={cannotExpand}
        style={styles.infoContainer}
        listComponent={orderDetail?.productForm?.listComponent || []}
      />
    </>
  );
};

export default InfoTab;

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row'
  },
  itemTab: {
    alignItems: 'center'
  },
  infoContainer: {
    backgroundColor: BACKGROUND_COLOR.Primary,
    borderRadius: BORDER_RADIUS
  },

  title: {
    marginBottom: SPACING.Fit
  },
  switchArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});
