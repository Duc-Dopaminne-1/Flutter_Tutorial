import React, { useState } from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import CustomSectionHeader from '@components/CustomSection';
import translate from '@src/localize';
import { SETTING } from '@constants/icons';
import { CustomButton } from '@components/CustomButton';
import Modal from 'react-native-modal';
import MaintenanceReportModal from '@screens/tenant/MaintenanceReportsTenant/ModalTenant';
import styles from '@screens/tenant/MaintenanceReportsTenant/styles';
import BarChart from '@screens/tenant/MaintenanceReportsTenant/ChartTenant/BarChart';
import NavigationActionsService from '@src/navigation/navigation';
import { FILTER } from '@src/constants/screenKeys';

const MaintenanceByTimeTenant = () => {
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
    <View style={styles.wrapAReport}>
      <CustomSectionHeader
        title={translate('report.maintenance_time')}
        icon={SETTING}
        styleTitle={styles.titleHeader}
        style={styles.wrapHeader}
        isShowFilter={true}
        onPressFilter={onPressFilter}
      />

      <View style={styles.wrapChart}>
        <BarChart />
        <CustomButton onPress={openModal} text={translate('report.view_data')}
          style={styles.buttonView} />
      </View>

      <Modal
        key={'time'}
        isVisible={isModalVisible}
        hideModalContentWhileAnimating
        useNativeDriver
        customBackdrop={
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.backgroundModal} />
          </TouchableWithoutFeedback>
        }
      >
        <MaintenanceReportModal id={'time'} onCloseModal={closeModal} />
      </Modal>
    </View>
  );
};

export default MaintenanceByTimeTenant;
