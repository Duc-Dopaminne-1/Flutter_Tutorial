import React, { useState } from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import CustomSectionHeader from '@components/CustomSection';
import translate from '@src/localize';
import { SETTING } from '@constants/icons';
import BarChartHorizontal from '@screens/manager/MaintenanceReports/Chart/BarChartHorizontal';
import { CustomButton } from '@components/CustomButton';
import styles from '@screens/manager/MaintenanceReports/styles';
import Modal from 'react-native-modal';
import MaintenanceReportModal from '@screens/manager/MaintenanceReports/Modal';
import NavigationActionsService from '@src/navigation/navigation';
import { FILTER } from '@src/constants/screenKeys';

const MaintenanceByCategory = () => {
  const [isModalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const onApplyFilter = (filter: any) => {
    console.log('filter:', filter);
  };

  const onPressFilter = () => {
    NavigationActionsService.push(FILTER, {
      numberOfInput: 0,
      isFromTo: true,
      onFilter: onApplyFilter
    });
  };

  return (
    <View>
      <CustomSectionHeader
        title={translate('report.maintenance_category')}
        icon={SETTING}
        styleTitle={styles.titleHeader}
        style={styles.wrapHeader}
        isShowFilter={true}
        onPressFilter={onPressFilter}
      />

      <View style={styles.wrapChart}>
        <BarChartHorizontal />
        <CustomButton onPress={openModal} text={translate('report.view_data')} style={styles.buttonView} />
      </View>

      <Modal
        key={'category'}
        hideModalContentWhileAnimating
        isVisible={isModalVisible}
        useNativeDriver
        customBackdrop={
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.backgroundModal} />
          </TouchableWithoutFeedback>
        }
      >
        <MaintenanceReportModal key={'category'} onCloseModal={closeModal} />
      </Modal>
    </View>
  );
};

export default React.memo(MaintenanceByCategory);
